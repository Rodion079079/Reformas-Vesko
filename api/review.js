// Endpoint serverless para Vercel: /api/review
// Recibe { name, stars, comment, website } (website = honeypot)

const sendToDiscord = async (webhookUrl, payload) => {
  const res = await fetch("https://reformas-vesko.vercel.app/", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res;
};

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const body = req.body && Object.keys(req.body).length ? req.body : await (async () => {
      // fallback: parse raw body if necessary
      try {
        const raw = await new Promise((resolve) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
        });
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    })();

    const { name, stars, comment, website } = body || {};

    // Basic anti-spam (honeypot)
    if (website && String(website).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    // Validations
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const nameStr = String(name).trim().slice(0, 100);

    const starsNum = parseInt(stars, 10);
    if (Number.isNaN(starsNum) || starsNum < 1 || starsNum > 5) {
      return res.status(400).json({ success: false, message: 'Stars must be an integer between 1 and 5' });
    }

    const commentStr = comment ? String(comment).trim().slice(0, 1000) : '';

    const webhook = https://discord.com/api/webhooks/1502302077756506303/HpNNJknITexFSo0lh6m8WslQ8FecgrlCQ9Dz9tmV1Ng0BZy4ezIt0xo0uIxbXmoaQzda;
    if (!webhook) {
      console.error('discord_webhook not configured');
      return res.status(500).json({ success: false, message: 'Server not configured' });
    }

    // Prepare embed with stars visualization
    const starsRender = '★'.repeat(starsNum) + '☆'.repeat(5 - starsNum);

    const embed = {
      title: 'Nueva reseña desde la web',
      color: 0x00aa88,
      fields: [
        { name: 'Nombre', value: nameStr || '—', inline: true },
        { name: 'Estrellas', value: starsRender, inline: true },
        { name: 'Comentario', value: commentStr || '—' }
      ],
      timestamp: new Date().toISOString()
    };

    const payload = {
      username: 'Web Reviews',
      embeds: [embed]
    };

    // Send to Discord
    const discordRes = await sendToDiscord(webhook, payload);
    if (!discordRes || !discordRes.ok) {
      const text = await (discordRes && discordRes.text ? discordRes.text() : Promise.resolve(''));
      console.error('Discord webhook error', discordRes && discordRes.status, text);
      return res.status(502).json({ success: false, message: 'Failed to send to Discord' });
    }

    return res.status(200).json({ success: true, message: 'Review sent' });
  } catch (err) {
    console.error('Error in /api/review', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

