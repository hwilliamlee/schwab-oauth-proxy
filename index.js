const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Replace with your Schwab developer app credentials
const client_id = 'COgVGpekfWOBdGjHGLZuGbYZ78K9ovBS';
const client_secret = 'jNnttAO5mUBMREtr';
const redirect_uri = 'https://schwab-oauth-proxy.onrender.com/callback';

let access_token = null;

app.get('/', (req, res) => {
  res.send('✅ Schwab OAuth Proxy is running');
});

// ✅ /auth route uses @SCHWAB
app.get('/auth', (req, res) => {
  const client_id_with_suffix = `${client_id}@SCHWAB`;
  const authUrl = `https://api.schwabapi.com/v1/oauth2/authorize?response_type=code&client_id=${client_id_with_suffix}&redirect_uri=${redirect_uri}&scope=read`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  console.log('🔍 Received authorization code:', code);

  try {
    const tokenRes = await axios.post('https://api.schwabapi.com/v1/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,       // ❌ No @SCHWAB here
        client_secret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    access_token = tokenRes.data.access_token;
    console.log('✅ Access token:', access_token);
    res.send('✅ Authorization successful! You may close this tab.');
  } catch (error) {
    console.error('❌ Token exchange failed:', error.response?.data || error.message);
    res.send('❌ Authorization failed. Check logs.');
  }
});

app.listen(port, () => {
  console.log(`OAuth proxy listening at http://localhost:${port}`);
});