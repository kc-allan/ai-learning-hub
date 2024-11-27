from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import stripe
from datetime import datetime
from .models import StripeCustomers, PaymentPlans
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from decouple import config

stripe.api_key = config('STRIPE_SECRET_KEY')

print("stripe api: ", stripe.api_key)

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
            required=['amount', 'email', 'plan_id']
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
            stripe_customer_id = data.get('stripe_customer_id', None)

            if not email or not amount or not plan_id:
                return Response({"error": "Missing required fields: email, amount, or plan_id"}, status=status.HTTP_400_BAD_REQUEST)

            if amount <= 0:
                return Response({"error": "Amount must be greater than 0"}, status=status.HTTP_400_BAD_REQUEST)


            if not stripe_customer_id:
                customer = stripe.Customer.create(email="test@mail.com")
                if not customer or not customer.id:
                    raise ValueError("Failed to create Stripe customer")
                stripe_customer_id = customer.id

            try:
                plan = PaymentPlans.objects.get(id=plan_id)
                StripeCustomers.objects.create(
                    stripe_customer_id=stripe_customer_id,
                    current_plan=plan,
                    status='active'
                )
            except Exception as db_error:
                print("Database error:", db_error)
                raise ValueError("Failed to save customer in the database")

            try:
                payment_intent = stripe.PaymentIntent.create(
                    amount=amount,
                    currency=currency,
                    payment_method_types=["card"],
                    customer=stripe_customer_id
                )
            except Exception as stripe_error:
                print("Stripe Payment Intent error:", stripe_error)
                raise ValueError("Failed to create payment intent")

            return Response({
                "clientSecret": payment_intent['client_secret'],
                "customerId": stripe_customer_id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print("Exception occurred:", e)
            traceback.print_exc()
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