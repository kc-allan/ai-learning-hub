from django.contrib import admin
from .models import PaymentTransaction, PaymentPlans, StripeCustomers

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'stripe_transaction_id', 'amount', 'currency', 'transaction_date', 'status')
    list_filter = ('status', 'currency', 'transaction_date')
    search_fields = ('stripe_transaction_id', 'user__username')
    ordering = ('-transaction_date',)
    readonly_fields = ('transaction_date',)

@admin.register(PaymentPlans)
class PaymentPlansAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration')
    list_filter = ('duration',)
    search_fields = ('name',)
    ordering = ('price',)

@admin.register(StripeCustomers)
class StripeCustomersAdmin(admin.ModelAdmin):
    list_display = ('id', 'stripe_customer_id', 'current_plan', 'subscription_start', 'subscription_end', 'status')
    list_filter = ('status', 'subscription_start', 'subscription_end')
    search_fields = ('stripe_customer_id', 'current_plan__name')
    ordering = ('-subscription_end',)
