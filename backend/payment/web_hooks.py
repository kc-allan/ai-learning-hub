from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from lesson.models import PaymentTransaction, StripeCustomers, PaymentPlans
import stripe
from django.conf import settings
import json
from datetime import datetime

stripe.api_key = settings.STRIPE_SECRET_KEY

@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        endpoint_secret = "your-webhook-signing-secret"

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )

            # Handle specific event types
            if event["type"] == "payment_intent.succeeded":
                payment_intent = event["data"]["object"]
                self.handle_payment_success(payment_intent)

            elif event["type"] == "invoice.payment_failed":
                invoice = event["data"]["object"]
                self.handle_payment_failed(invoice)

            elif event["type"] == "customer.subscription.updated":
                subscription = event["data"]["object"]
                self.handle_subscription_update(subscription)

            elif event["type"] == "customer.subscription.deleted":
                subscription = event["data"]["object"]
                self.handle_subscription_cancellation(subscription)

            return JsonResponse({"success": True})
        except ValueError as e:
            return JsonResponse({"error": "Invalid payload"}, status=400)
        except stripe.error.SignatureVerificationError as e:
            return JsonResponse({"error": "Invalid signature"}, status=400)

    def handle_payment_success(self, payment_intent):
        # Handle successful payments and update the database
        stripe_transaction_id = payment_intent.get("id")
        amount = payment_intent.get("amount_received") / 100  # Convert to dollars
        currency = payment_intent.get("currency")

        # Find the transaction in the database
        transaction = PaymentTransaction.objects.filter(
            stripe_transaction_id=stripe_transaction_id
        ).first()

        if transaction:
            transaction.status = "success"
            transaction.amount = amount
            transaction.currency = currency
            transaction.save()

    def handle_payment_failed(self, invoice):
        # Handle failed payments and update the database
        stripe_transaction_id = invoice.get("id")

        # Find the transaction in the database
        transaction = PaymentTransaction.objects.filter(
            stripe_transaction_id=stripe_transaction_id
        ).first()

        if transaction:
            transaction.status = "failed"
            transaction.save()

    def handle_subscription_update(self, subscription):
        # Update subscription details in the database
        stripe_customer_id = subscription.get("customer")
        current_period_end = subscription.get("current_period_end")

        # Find the StripeCustomer in the database
        stripe_customer = StripeCustomers.objects.filter(
            stripe_customer_id=stripe_customer_id
        ).first()

        if stripe_customer:
            stripe_customer.subscription_end = datetime.fromtimestamp(current_period_end)
            stripe_customer.status = subscription.get("status")
            stripe_customer.save()

    def handle_subscription_cancellation(self, subscription):
        # Handle subscription cancellations
        stripe_customer_id = subscription.get("customer")

        # Find the StripeCustomer in the database
        stripe_customer = StripeCustomers.objects.filter(
            stripe_customer_id=stripe_customer_id
        ).first()

        if stripe_customer:
            stripe_customer.status = "canceled"
            stripe_customer.save()

payment_webhook = StripeWebhookView.as_view()