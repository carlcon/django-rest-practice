from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse

from products.models import Product
from products.serializers import ProductSerializer

@api_view(["POST"])
def api_home(request, *args, **kwargs):
    """
    DRF API View
    """
    data = request.data
    serializer = ProductSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        # serializer.save()
        print(serializer.data)
        return Response(serializer.data)

    return Response({"invalid": "not good data"}, status=400)  
    #     print(data)
    #     json_data_str = json.dumps(data)
    # return HttpResponse(json_data_str, headers={"content-type": "application/json"})