import requests

# endpoint = "https://httpbin.org/status/200/"
# endpoint = "https://httpbin.org/anything"
endpoint = "http://localhost:9000/api/"


get_response = requests.post(endpoint, json={"content": "Hello world!", "title": "Hello world!", "price": "abc" })
# print(get_response.headers)
# print(get_response.text) 
# print(get_response.status_code)

print(get_response.json())

