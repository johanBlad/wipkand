from django.urls import path

from operations.api.views import (
    ProductListAPIView,
    ProductDetailAPIView,
    OrderListAPIView,
    OrderDetailAPIView,
    OrderCreateAPIView,
    BatchListAPIView,
    BatchDetailAPIView,
    BatchCreateAPIView,
    CommentListAPIView,
    CommentDetailAPIView,
    CommentCreateAPIView,
)

urlpatterns = [
    path('product/', ProductListAPIView.as_view(), name='product-list'),
    path('product/<str:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),

    path('order/', OrderListAPIView.as_view(), name='order-list'),
    path('order/create/', OrderCreateAPIView.as_view(), name='order-create'),
    path('order/<str:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),

    path('batch/', BatchListAPIView.as_view(), name='batch-list'),
    path('batch/create/', BatchCreateAPIView.as_view(), name='batch-create'),
    path('batch/<str:pk>/', BatchDetailAPIView.as_view(), name='batch-detail'),

    path('comment/', CommentListAPIView.as_view(), name='comment-list'),
    path('comment/create/', CommentCreateAPIView.as_view(), name='comment-create'),
    path('comment/<str:batch_number>/', CommentListAPIView.as_view(), name='batch-comment-list'),
    path('comment/<str:batch_number>/<int:pk>/', CommentDetailAPIView.as_view(), name='comment-detail'),
]

    # #API urls
    # path('operations/api/product', ProductListView.as_view(), name='productAPI'),
    # path('operations/api/order', OrderListView.as_view(), name='orderAPI'),
    # path('operations/api/batch', BatchListView.as_view(), name='batchListAPI'),
    # path('operations/api/batch/<int:pk>', BatchDetailView.as_view(), name='batchDetailAPI'),
    # path('operations/api/batchComment', BatchCommentListView.as_view(), name='batchCommentAPI'),