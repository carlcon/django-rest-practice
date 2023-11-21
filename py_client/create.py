import requests


headers = {'Authorization': 'Bearer 5266eccdba5e6b73c3f888be74c76ca2eec185df'}
endpoint = "http://localhost:9000/api/products/"


data = {
    "title": "This field is done",
    "price": 32.99
}

get_response = requests.post(endpoint, json=data, headers=headers)


print(get_response.json())

