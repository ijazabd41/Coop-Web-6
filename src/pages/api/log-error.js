export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const odooBaseUrl = process.env.ODOO_BASE_URL;
  const sessionId = req.headers['x-odoo-session'] || '';

  if (!odooBaseUrl) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Server configuration error: ODOO_BASE_URL is missing' 
    });
  }

  try {
    const response = await fetch(`${odooBaseUrl}/api/v1/error-log/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Odoo-Session': sessionId,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Failed to push error log to Odoo:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to communicate with Odoo logger endpoint',
      detail: error.message
    });
  }
}
