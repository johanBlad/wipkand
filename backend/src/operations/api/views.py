'''API views for operations'''

from django.shortcuts import get_object_or_404

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    # UpdateAPIView,
    # DestroyAPIView,
    CreateAPIView,
    # RetrieveUpdateAPIView,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from operations.models import Product, ProductOrder, Batch, BatchComment
from operations.api.serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    OrderListSerializer,
    OrderDetailSerializer,
    OrderCreateUpdateSerializer,
    BatchListSerializer,
    BatchDetailSerializer,
    BatchCreateUpdateSerializer,
    CommentListSerializer,
    CommentDetailSerializer,
    CommentCreateUpdateSerializer,
)

class ProductListAPIView(ListAPIView):
    '''List of products'''
    serializer_class = ProductListSerializer
    queryset = Product.objects.all()

class ProductDetailAPIView(RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.all()


class OrderListAPIView(ListAPIView):
    serializer_class = OrderListSerializer
    queryset = ProductOrder.objects.all()

class OrderDetailAPIView(RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    queryset = ProductOrder.objects.all()

class OrderCreateAPIView(CreateAPIView):
    serializer_class = OrderCreateUpdateSerializer
    permission_classes = [IsAuthenticated]


class BatchListAPIView(ListAPIView):
    serializer_class = BatchListSerializer
    queryset = Batch.objects.all()

class BatchDetailAPIView(RetrieveAPIView):
    serializer_class = BatchDetailSerializer
    queryset = Batch.objects.all()

class BatchCreateAPIView(CreateAPIView):
    serializer_class = BatchCreateUpdateSerializer
    permission_classes = [IsAuthenticated]


class CommentListAPIView(ListAPIView):
    '''Gets list of comments for a batch, or all comments if no batch is specified'''
    serializer_class = CommentListSerializer
    queryset = BatchComment.objects.all()
    lookup_url_kwarg = 'batch_number'

    def get_queryset(self):
        _batch_number = self.kwargs.get(self.lookup_url_kwarg)
        if _batch_number is not None:
            queryset_list = BatchComment.objects.filter(batch_number=_batch_number)
        else:
            queryset_list = BatchComment.objects.all()
        return queryset_list

class CommentDetailAPIView(RetrieveAPIView):
    '''Gets detail of batch and comment id'''
    serializer_class = CommentDetailSerializer

    def get_object(self):
        return get_object_or_404(BatchComment, **self.kwargs)

#TODO: Not able to create comments with same comment_id as another comment,
#even though the batch is different
class CommentCreateAPIView(CreateAPIView):
    serializer_class = CommentCreateUpdateSerializer
    permission_classes = [IsAuthenticated]