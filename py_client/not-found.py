import requests


endpoint = "http://localhost:9000/api/products/12944342/"


get_response = requests.get(endpoint)


print(get_response.json())

