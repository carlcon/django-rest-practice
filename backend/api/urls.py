from django.urls import path, include

from . import views
#from .views import api_hoome

urlpatterns = [
    path('', views.api_home,), # localhost:9000/api/
    # path('products/', include('products.urls')),
]
