// Checks the submitted password against DASHBOARD_PASSWORD (set in Vercel's
// Environment Variables — never write the real password into this file).
// On success, sets a cookie whose value matches AUTH_SECRET (also an
// environment variable) so middleware.js can recognize returning visitors.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Método não permitido');
    return;
  }

  const submitted = req.body && req.body.password;
  const expectedPassword = process.env.DASHBOARD_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expectedPassword || !secret) {
    res.status(500).send(
      'Configuração incompleta: defina as variáveis de ambiente DASHBOARD_PASSWORD e AUTH_SECRET no painel da Vercel (Settings → Environment Variables) e faça um novo deploy.'
    );
    return;
  }

  if (submitted === expectedPassword) {
    res.setHeader(
      'Set-Cookie',
      `raviera_auth=${secret}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    );
    res.writeHead(302, { Location: '/' });
    res.end();
  } else {
    res.writeHead(302, { Location: '/login.html?erro=1' });
    res.end();
  }
};
