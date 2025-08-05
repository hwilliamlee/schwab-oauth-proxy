const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const client_id = 'COgVGpekfWOBdGjHGLZuGbYZ78K9ovBS'; // Your Schwab client ID
const client_secret = 'jNnttAO5mUBMREtr'; // Your Schwab secret
const redirect_uri = 'https://schwab-oauth-proxy.onrender.com/callback';

let access_token = null;

app.get('/', (req, res) => {
  res.send('✅ Schwab OAuth Proxy is running');
});

// Correct authorize URL and @SCHWAB suffix
app.get('/auth', (req, res) => {
  const authUrl = `https://api.schwabapi.com/v1/oauth/authorize?response_type=code&client_id=${client_id}@SCHWAB&redirect_uri=${redirect_uri}&scope=read`;
  res.redirect(authUrl);
});

// Token exchange
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  console.log('🔑 Received code:', code);

  try {
    const response = await axios.post('https://api.schwabapi.com/v1/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,
        client_secret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    access_token = response.data.access_token;
    console.log('✅ Access token:', access_token);
    res.send('✅ Authorization successful! You may close this tab.');
  } catch (error) {
    console.error('❌ Authorization failed:', error.response?.data || error.message);
    res.send('❌ Authorization failed. Check logs.');
  }
});

app.listen(port, () => {
  console.log(`OAuth proxy listening at http://localhost:${port}`);
});