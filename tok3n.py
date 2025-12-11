import requests

# === 1. Generar token ===
auth_url = "https://api.eonwms.com/token/generate"
auth_payload = {
    "email": "jeansalazar123@gmail.com",
    "password": "solovendemoscalidad:574b2a563904baea5e7a9d365fba4aa9c36865e129270c5581debaf855271273"
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

api_url = "https://api.eonwms.com/products"

api_res = requests.get(api_url, headers=headers)
print("Código:", api_res.status_code)
print(api_res.json())
