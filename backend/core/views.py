from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.mixins import ListModelMixin,RetrieveModelMixin, CreateModelMixin, UpdateModelMixin,DestroyModelMixin
from .models import Product, Category, ShippingAddress,Order, OrderItem, Transactions
from .serializers import ProductSerializer, CategorySerializer, ShippingAddressSerializer, OrderSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
import logging
from .razorpay.main import RazorpayClient
client = RazorpayClient()

# Create your views here.


class CategoriesView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

class CategoryProductsView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        cid = self.kwargs['cid']
        try:
            category = Category.objects.get(cid=cid)
        except Category.DoesNotExist:
            return None

        return Product.objects.filter(category=category)

class ProductsView(GenericAPIView, ListModelMixin, RetrieveModelMixin):
    queryset = Product.objects.all().order_by("-id")
    serializer_class = ProductSerializer
    lookup_field ="pid"

    def get(self, request, *args, **kwargs):
        pid = kwargs.get("pid")
        if pid is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

class ShippingAddressView(GenericAPIView,
                          ListModelMixin,
                          RetrieveModelMixin,
                          CreateModelMixin,
                          UpdateModelMixin,
                          DestroyModelMixin
                        ):
    serializer_class =  ShippingAddressSerializer
    # queryset = ShippingAddress.objects.all().order_by("-id")
    lookup_field ="shid"
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            address= ShippingAddress.objects.filter(user=user)
        except ShippingAddress.DoesNotExist:
            return None
        return address



    def post(self, request, *args, **kwargs):
        request.data['user'] = self.request.user.id
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        shid =  kwargs.get("shid")
        if shid is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class OrderView(APIView):

    def post(self, request):
        user = request.user
        data = request.data

        order_items_data = data.get('orderItems', [])

        if not order_items_data:
            return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address_id = data.get("shippingAddress")
        shipping_address = get_object_or_404(ShippingAddress, shid=shipping_address_id)
        totalPrice = data['totalPrice']
        print(totalPrice)
        ##Razorpay

        order_payment_amt = client.create_order(
            amount= totalPrice,
            currency= 'INR',
        )
        print(order_payment_amt)

        order = Order.objects.create(
            user = user,
            shippingAddress = shipping_address,
            totalPrice = totalPrice,
        )

        order_items = []
        for item_data in order_items_data:
            try:
                product = Product.objects.get(pid=item_data['product']['pid'])
            except Product.DoesNotExist:
                return Response({'detail': f'Invalid product data in orderItems: {item_data}'}, status=status.HTTP_400_BAD_REQUEST)

            order_item = OrderItem.objects.create(
                qty=int(item_data['cartQuantity']),
                price=float(item_data['price']),
                product=product,
                image=product.image.url,
                name=product.name,
                order=order,
            )

            product.stock_count -= order_item.qty
            product.save()

            order_items.append(order_item)

            # Transactions.objects.create(
            #     order=order,
            #     amount=totalPrice,
            #     payment_id = data.get('payment_id'),
            #     signature = data.get("signature")
            # )
            # client.verify_payment_signature(
            #     razorpay_payment_id = data.get("payment_id"),
            #     razorpay_order_id = order,
            #     razorpay_signature = data.get("signature")
            # )
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TransactionView(APIView):
    def post(self, request):
        transaction_data = request.data
        transaction_serializer = TransactionSerializer(data=transaction_data)
        if transaction_serializer.is_valid():
            client.verify_payment_signature(
                razorpay_payment_id = transaction_serializer.validated_data.get("payment_id"),
                razorpay_order_id = transaction_serializer.validated_data.get("razorpay_order_id"),
                razorpay_signature = transaction_serializer.validated_data.get("signature")
            )
            transaction_serializer.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created"
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": transaction_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
