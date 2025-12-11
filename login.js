const response = await fetch('https://apisandbox.eonwms.com/token/generate', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({
  email: 'jeansalazar123@gmail.com',
  password: 'solovendemoscalidad:574b2a563904baea5e7a9d365fba4aa9c36865e129270c5581debaf855271273'
})
});

const data = await response.json();
const token = data.token;