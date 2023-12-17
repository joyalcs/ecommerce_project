from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.mixins import ListModelMixin,RetrieveModelMixin, CreateModelMixin, UpdateModelMixin,DestroyModelMixin
from .models import Product, Category, ShippingAddress,Order, OrderItem, Transactions, Review
from .serializers import ProductSerializer, CategorySerializer, ShippingAddressSerializer, OrderSerializer, TransactionSerializer, OrderItemSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings
import razorpay
from rest_framework import filters

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
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)

    def get(self, request, *args, **kwargs):
        pid = kwargs.get("pid")
        if pid is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    # def get_queryset(self):
    #     qs = Product.objects.all()
    #     name = self.request.query_params.get('name')
    #     print(name)
    #     if name is not None:
    #         qs = Product.objects.filter(name__icontains=name)
    #     print(qs)
    #     return qs


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

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RazorpayOrderView(APIView):
    """This API will create an order"""

    def post(self, request):

        global client
        data = request.data

        amount = int(float(data['amount']))

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,
                                        settings.RAZORPAY_KEY_SECRET))

        data = {"amount" : amount, "currency" : "INR"}
        payment = client.order.create(data=data)

        return Response({'order_id': payment['id'], 'amount': payment['amount'], 'currency':payment['currency']})

class TransactionView(APIView):
    def post(self, request):

        res = request.data

        if not isinstance(res, dict):
            return Response({'error': 'Invalid response format'}, status=status.HTTP_400_BAD_REQUEST)

        params_dict = {
            'razorpay_payment_id': res.get('razorpay_paymentId'),
            'razorpay_order_id': res.get('razorpay_orderId'),
            'razorpay_signature': res.get('razorpay_signature')
        }

        # verifying the signature
        verification_status = client.utility.verify_payment_signature(params_dict)

        if verification_status:
            order_oid = res.get("order")
            order = get_object_or_404(Order, oid=order_oid)
            amt = res.get("amount")
            amount =int(amt)/100
            trans = Transactions.objects.create(
                order = order,
                amount=amount,
                payment_id=res.get("razorpay_paymentId"),
                razorpay_order_id=res.get("razorpay_orderId"),
                signature=res.get("razorpay_signature")
            )
            order.isPaid = True
            order.save()
            serializer = TransactionSerializer(trans, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({'status': 'Payment Failed'}, status=status.HTTP_400_BAD_REQUEST)

class ViewOrdersView( GenericAPIView,
                      ListModelMixin):

    serializer_class =  OrderItemSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        order = Order.objects.filter(user=user)
        orders = OrderItem.objects.filter(order__in=order)
        return orders

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ReviewView(APIView):
    def post(self , request):
        user = request.user
        productId = request.data['product']
        data = request.data
        product = get_object_or_404(Product, pid=productId)
        alreadyExist = Review.objects.filter(product=product, user=user).first()

        if alreadyExist:
            content =  {'detail': "Product already Reviewed"}

            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        elif data['rating'] == 0:
            content = {'detail': "Please select a rating"}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        else:
            review = Review.objects.create(
                user=user,
                product=product,
                name = user.username,
                rating = data['rating'],
                comment =data['review']
            )
            reviews = []
            reviews = Review.objects.filter(product=product)
            product.numReviews = len(reviews)

            total = 0
            for i in reviews:
                total += i.rating

            product.rating = total / len(reviews)
            product.save()
            serializer = ReviewSerializer(review, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    def get(self, request, pid):
        product = get_object_or_404(Product, pid=pid)
        reviews = Review.objects.filter(product=product)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
