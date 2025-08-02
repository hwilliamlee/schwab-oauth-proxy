const express = require('express');
const axios = require('axios');
const open = require('open');
const app = express();
const port = 5000;

// Replace these with your real Schwab keys
const client_id = 'YOUR_CLIENT_ID';
const client_secret = 'YOUR_CLIENT_SECRET';
const redirect_uri = 'https://schwab-oauth-proxy-williamlee72.replit.app/callback';

let access_token = null;

app.get('/', (req, res) => {
  res.send('✅ Schwab OAuth Proxy is running');
});

app.get('/auth', (req, res) => {
  const authUrl = `https://api.schwabapi.com/v1/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=read`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post('https://api.schwabapi.com/v1/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,
        client_secret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    access_token = tokenRes.data.access_token;
    res.send('✅ Authorization successful! You may close this tab.');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('❌ Authorization failed. Check logs.');
  }
});

app.listen(port, () => {
  console.log(`OAuth proxy listening at http://localhost:${port}`);
  open(`http://localhost:${port}/auth`);
});
