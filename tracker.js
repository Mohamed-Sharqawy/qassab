/**
 * Visitor & Google Ads Click Fraud Tracker
 * Automatically tracks IP, location, device, and Google Ads click parameters.
 */
(function () {
  try {
    // Prevent duplicate tracking in same tab session within 3 seconds
    const now = Date.now();
    const lastTrack = sessionStorage.getItem('_last_track_time');
    if (lastTrack && now - parseInt(lastTrack, 10) < 3000) {
      return;
    }
    sessionStorage.setItem('_last_track_time', now.toString());

    // Extract URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get('gclid') || urlParams.get('gbraid') || urlParams.get('wbraid') || '';
    const utmSource = urlParams.get('utm_source') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const isAd = Boolean(gclid || utmSource.toLowerCase().includes('google') || utmMedium.toLowerCase().includes('cpc'));

    const trackData = {
      page: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
      gclid: gclid,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      is_ad: isAd,
      screen: `${window.innerWidth}x${window.innerHeight}`
    };

    // Send tracking request to Vercel Serverless API
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trackData)
    }).catch(function () {
      // Fallback direct webhook call if api route is unavailable
      const directUrl = "https://script.google.com/macros/s/AKfycbz12JRnI1q7ld8H_Y6gPPOG-v62NUX5XwbAn-mkbul4Fk01Esg8iXRAIisQK7q0MzLshQ/exec";
      fetch("https://api.ipify.org?format=json")
        .then(function (res) { return res.json(); })
        .then(function (ipData) {
          fetch(directUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ip: ipData.ip || 'Unknown',
              time: new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Kuwait' }),
              city: 'الكويت',
              country: 'KW',
              is_ad: isAd,
              gclid: gclid || (isAd ? 'Google Ad Click' : '-'),
              page: window.location.pathname,
              device: (window.innerWidth < 768 ? '📱 موبايل' : '💻 كمبيوتر') + ' - ' + trackData.screen,
              referrer: document.referrer || '-'
            })
          });
        }).catch(function () {});
    });
  } catch (e) {
    console.error('Tracker error:', e);
  }
})();
