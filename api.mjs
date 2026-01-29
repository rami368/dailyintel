const API_KEY = 'd5tj7ghr01qt62njmuf0d5tj7ghr01qt62njmufg';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const { action, symbol } = params;

  if (!action || !symbol) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing action or symbol' })
    };
  }

  let url = '';
  const baseUrl = 'https://finnhub.io/api/v1';
  
  switch (action) {
    case 'quote':
      url = `${baseUrl}/quote?symbol=${symbol}&token=${API_KEY}`;
      break;
    case 'profile':
      url = `${baseUrl}/stock/profile2?symbol=${symbol}&token=${API_KEY}`;
      break;
    case 'news':
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      url = `${baseUrl}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`;
      break;
    case 'insider':
      url = `${baseUrl}/stock/insider-transactions?symbol=${symbol}&token=${API_KEY}`;
      break;
    default:
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action: ' + action })
      };
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Finnhub error: ${response.status}` })
      };
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}
