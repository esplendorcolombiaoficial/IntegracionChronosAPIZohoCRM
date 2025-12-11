import requests

# === 1. Generar token ===
auth_url = "https://apisandbox.eonwms.com/token/generate"
auth_payload = {
    "email": "training@chronos.mx",
    "password": "thesecretwordiskadabra:30169ed6edb2e4bd4bbf0c349b5a9d2fa1141b12726f76cd76111e46b92043f1"
}

auth_res = requests.post(auth_url, json=auth_payload)
auth_res.raise_for_status()

token = auth_res.json()["token"]
print("Token obtenido:", token)

# === 2. Consumir endpoint usando Bearer Token ===
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

api_url = "https://apisandbox.eonwms.com/products"

api_res = requests.get(api_url, headers=headers)
print("Código:", api_res.status_code)
print(api_res.json())
