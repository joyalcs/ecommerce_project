from rest_framework import serializers
from .models import Product, Category, ShippingAddress
from .models import OrderItem, Order, Transactions, Review
from users.serializers import UserSerializer
from users.utils import Util


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    # reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = "__all__"

    # def get_reviews(self, obj):
    #     reviews = obj.review_set.all()
    #     serializer = ReviewSerializer(reviews, many=True)
    #     return serializer.data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [
            "shid",
            "user",
            "address",
            "city",
            "postalCode",
            "country",
            "phone_number",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    # shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def get_orderItems(self, obj):
        items = obj.order_items.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = [
            "order",
            "amount",
            "payment_id",
            "razorpay_order_id",
            "signature",
            "paidAt",
        ]

    def validate(self, attrs):
        order = attrs.get("order")
        if not order:
            raise serializers.ValidationError("Order is required.")

        order.isPaid = True
        order.save()

        user = order.user
        product_name = order.order_items.first().name
        print(user.email)

        body = f"Hai, Your payment done Successfully for the {product_name}"
        data = {"subject": "Reset Your Password", "body": body, "to_email": user.email}
        # Assuming Util.send_email is properly defined
        Util.send_email(data)

        return attrs
