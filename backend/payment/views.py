from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import stripe
from datetime import datetime
from .models import StripeCustomers, PaymentPlans
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreatePaymentIntentView(APIView):
    """Pay for a course and create a customer if not already created"""
    @swagger_auto_schema(
        operation_description="Create a Payment Intent and customer (if not exists) for course payment",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'amount': openapi.Schema(type=openapi.TYPE_INTEGER, description="Amount in smallest currency unit (e.g., cents)"),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, description="Currency code (e.g., 'usd')"),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description="Customer email"),
                'plan_id': openapi.Schema(type=openapi.TYPE_STRING, description="The ID of the plan being purchased"),
                'stripe_customer_id': openapi.Schema(type=openapi.TYPE_STRING, description="Existing Stripe customer ID (optional)")
            },
            required=['amount', 'currency', 'email', 'plan_id']
        ),
        responses={
            200: openapi.Response('Payment Intent Created', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'clientSecret': openapi.Schema(type=openapi.TYPE_STRING, description="Client secret for frontend to handle the payment"),
                    'customerId': openapi.Schema(type=openapi.TYPE_STRING, description="Stripe customer ID")
                }
            )),
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message")
                }
            ))
        }
    )
    def post(self, request):
        try:
            data = request.data
            amount = int(data.get("amount", 0))
            currency = data.get("currency", "usd")
            email = data.get("email")
            plan_id = data.get('plan_id')
            
            stripe_customer_id = data.get("stripe_customer_id")
            
            if not stripe_customer_id:
                customer = stripe.Customer.create(
                    email=email
                )
                stripe_customer_id = customer.id  # Save the customer ID for later use

                # save in db
                StripeCustomers.objects.create(
                    stripe_customer_id=stripe_customer_id,
                    current_plan=plan_id,
                    status='active'
                )

            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                payment_method_types=["card"],
                customer=stripe_customer_id
            )

            # Return the client secret for the frontend to handle the payment
            return Response({
                "clientSecret": payment_intent['client_secret'],
                "customerId": stripe_customer_id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateSubscriptionView(APIView):
    """Subscribe to a payment plan"""

    @swagger_auto_schema(
        operation_description="Create a Subscription for a Stripe customer",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'stripe_customer_id': openapi.Schema(type=openapi.TYPE_STRING, description="Stripe customer ID"),
                'plan_id': openapi.Schema(type=openapi.TYPE_STRING, description="The ID of the plan the user subscribes to"),
            },
            required=['stripe_customer_id', 'plan_id']
        ),
        responses={
            200: openapi.Response('Subscription Created', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'subscriptionId': openapi.Schema(type=openapi.TYPE_STRING, description="Stripe subscription ID"),
                    'status': openapi.Schema(type=openapi.TYPE_STRING, description="Subscription status")
                }
            )),
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message")
                }
            ))
        }
    )
    def post(self, request):
        try:
            data = request.data
            customer_id = data.get("stripe_customer_id")
            plan_id = data.get('plan_id')

            plan = PaymentPlans.objects.filter(plan_id=plan_id).first()
            if not plan:
                return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": plan.stripe_price_id}],  # Use the price_id from the plan
            )

            stripe_customer = StripeCustomers.objects.filter(stripe_customer_id=customer_id).first()
            if stripe_customer:
                stripe_customer.current_plan = plan
                stripe_customer.subscription_start = subscription['current_period_start']
                stripe_customer.subscription_end = subscription['current_period_end']
                stripe_customer.status = subscription['status']
                stripe_customer.save()

            return Response({
                "subscriptionId": subscription["id"],
                "status": subscription["status"]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

create_subscription = CreateSubscriptionView.as_view()
initiate_payment = CreatePaymentIntentView.as_view()