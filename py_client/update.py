import requests


endpoint = "http://localhost:9000/api/products/1/update/"

data = {
    "title": "hello my old fried",
    "price": 129.99
}
get_response = requests.put(endpoint, json=data)


print(get_response.json())

