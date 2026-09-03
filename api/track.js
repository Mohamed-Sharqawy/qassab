export default async function handler(req, res) {
  // Allow CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz12JRnI1q7ld8H_Y6gPPOG-v62NUX5XwbAn-mkbul4Fk01Esg8iXRAIisQK7q0MzLshQ/exec";

  try {
    // 1. Extract Real IP Address from Vercel headers
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
               req.headers['x-real-ip'] ||
               req.socket?.remoteAddress ||
               '127.0.0.1';

    // 2. Extract Location info from Vercel Edge headers
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'الكويت';
    const country = req.headers['x-vercel-ip-country'] || 'KW';
    const region = req.headers['x-vercel-ip-country-region'] || '';

    // 3. Extract request body data sent from frontend tracker
    let body = {};
    if (req.body) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /mobile|iphone|android|ipad/i.test(userAgent);
    const deviceType = isMobile ? '📱 موبايل' : '💻 كمبيوتر';

    // Check if traffic is from Google Ads (gclid, gbraid, wbraid, or utm)
    const gclid = body.gclid || '';
    const isAd = Boolean(gclid || body.is_ad || body.utm_source === 'google' || body.utm_medium === 'cpc');

    // Current Time in Kuwait (Asia/Kuwait)
    const kuwaitTime = new Date().toLocaleString('ar-EG', {
      timeZone: 'Asia/Kuwait',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const payload = {
      ip: ip,
      time: kuwaitTime,
      city: region ? `${city} (${region})` : city,
      country: country,
      is_ad: isAd,
      gclid: gclid || (isAd ? 'Google Ad Click' : '-'),
      page: body.page || '/',
      device: `${deviceType} - ${body.screen || ''}`,
      referrer: body.referrer || req.headers['referer'] || '-'
    };

    // 4. Send to Google Sheets Apps Script Webhook asynchronously
    if (GOOGLE_SCRIPT_URL) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    return res.status(200).json({
      success: true,
      ip: ip,
      city: city,
      country: country,
      is_ad: isAd
    });
  } catch (error) {
    console.error('Tracker Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
