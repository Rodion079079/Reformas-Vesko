// Endpoint serverless para Vercel: /api/review

const sendToDiscord = async (webhookUrl, payload) => {

  const res = await fetch(webhookUrl, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(payload),
  });

  return res;
};

module.exports = async (req, res) => {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {

    // Solo POST
    if (req.method !== 'POST') {

      res.setHeader('Allow', 'POST');

      return res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

    // Leer body
    const body =
      req.body && Object.keys(req.body).length
        ? req.body
        : {};

    const {
      name,
      stars,
      comment,
      website
    } = body || {};

    // Honeypot anti spam
    if (website && String(website).trim() !== '') {

      return res.status(400).json({
        success: false,
        message: 'Spam detectado'
      });

    }

    // Validar nombre
    if (!name || !String(name).trim()) {

      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio'
      });

    }

    const nameStr = String(name)
      .trim()
      .slice(0, 100);

    // Validar estrellas
    const starsNum = parseInt(stars, 10);

    if (
      Number.isNaN(starsNum) ||
      starsNum < 1 ||
      starsNum > 5
    ) {

      return res.status(400).json({
        success: false,
        message: 'Las estrellas deben ser entre 1 y 5'
      });

    }

    // Validar comentario
    const commentStr = comment
      ? String(comment)
          .trim()
          .slice(0, 1000)
      : '';

    // WEBHOOK DISCORD
    const webhook = "https://discord.com/api/webhooks/1502302077756506303/HpNNJknITexFSo0lh6m8WslQ8FecgrlCQ9Dz9tmV1Ng0BZy4ezIt0xo0uIxbXmoaQzda";

    // Dibujar estrellas
    const starsRender =
      '★'.repeat(starsNum) +
      '☆'.repeat(5 - starsNum);

    // Embed Discord
    const embed = {

      title: 'Nueva reseña desde la web',

      color: 0x00aa88,

      fields: [

        {
          name: 'Nombre',
          value: nameStr || '—',
          inline: true
        },

        {
          name: 'Estrellas',
          value: starsRender,
          inline: true
        },

        {
          name: 'Comentario',
          value: commentStr || '—'
        }

      ],

      timestamp: new Date().toISOString()

    };

    const payload = {

      username: 'Web Reviews',

      embeds: [embed]

    };

    // Enviar a Discord
    const discordRes =
      await sendToDiscord(webhook, payload);

    if (!discordRes || !discordRes.ok) {

      const text =
        await (
          discordRes &&
          discordRes.text
            ? discordRes.text()
            : Promise.resolve('')
        );

      console.error(
        'Error Discord',
        discordRes && discordRes.status,
        text
      );

      return res.status(502).json({
        success: false,
        message: 'Error enviando a Discord'
      });

    }

    // OK
    return res.status(200).json({

      success: true,

      message: 'Reseña enviada'

    });

  } catch (err) {

    console.error(
      'Error en /api/review',
      err
    );

    return res.status(500).json({

      success: false,

      message: 'Error interno del servidor'

    });

  }

};