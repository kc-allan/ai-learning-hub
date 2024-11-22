from django.urls import path
from .views import initiate_payment, create_subscription
from .web_hooks import payment_webhook


urlpatterns = [
    path('payment/initiate/', initiate_payment),
    path('payment/subscription/create/', create_subscription),
    path('payment/webhook/', payment_webhook)
]
