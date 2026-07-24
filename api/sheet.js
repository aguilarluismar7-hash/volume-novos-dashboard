// Serverless function (runs on Vercel's server, not in the browser).
// It fetches the Google Sheet CSV on the server side — where CORS does not apply —
// and hands the plain CSV back to our own front-end, same-origin.

const SHEET_ID = '1USGH8rZHNmuSil0ZugmdW8DkGWOV4W1xvOsVpRC-otE';

module.exports = async (req, res) => {
  const tab = req.query.tab;

  if (!tab) {
    res.status(400).send('Parâmetro "tab" é obrigatório, ex: /api/sheet?tab=TabVolume');
    return;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).send(`Não consegui ler a aba "${tab}" da planilha (status ${response.status}). Verifique se o nome da aba está correto e se o compartilhamento continua público.`);
      return;
    }
    const text = await response.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).send('Erro ao buscar a planilha: ' + err.message);
  }
};
