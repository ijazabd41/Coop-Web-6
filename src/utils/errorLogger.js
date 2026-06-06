/**
 * Utility to push error logs securely to the backend which forwards them to Odoo.
 */
export const pushErrorLog = async (params) => {
  try {
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        source: 'web',
        app_version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
        device_info: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
        ...params,
      }
    };

    const response = await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Odoo-Session': typeof window !== 'undefined' ? (localStorage.getItem('cd_session_id') || '') : '',
      },
      body: JSON.stringify(payload),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to execute pushErrorLog', error);
  }
};
