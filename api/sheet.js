// Serverless function (runs on Vercel's server, not in the browser).
// It fetches the Google Sheet data on the server side — where CORS does not apply —
// and hands it back to our own front-end, same-origin.
//
// format=csv (default): plain CSV text, fine for simple integer data (TabVolume, TabLojas).
// format=json: Google's structured gviz format — each cell keeps its exact typed
// value (numbers stay numbers), avoiding any text-parsing ambiguity. Used by the
// DRE report, where currency values need to be exact.

const SHEET_ID = '1USGH8rZHNmuSil0ZugmdW8DkGWOV4W1xvOsVpRC-otE';

module.exports = async (req, res) => {
  const tab = req.query.tab;
  const format = req.query.format === 'json' ? 'json' : 'csv';

  if (!tab) {
    res.status(400).send('Parâmetro "tab" é obrigatório, ex: /api/sheet?tab=TabVolume');
    return;
  }

  // O parâmetro headers=0 só é necessário (e só é aplicado) no formato JSON —
  // evita mexer no comportamento do CSV, que o dashboard de Volume já usa sem problema.
  const headersParam = format === 'json' ? '&headers=0' : '';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:${format}&sheet=${encodeURIComponent(tab)}${headersParam}&_=${Date.now()}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      res.status(response.status).send(`Não consegui ler a aba "${tab}" da planilha (status ${response.status}). Verifique se o nome da aba está correto e se o compartilhamento continua público.`);
      return;
    }
    const text = await response.text();
    res.setHeader('Content-Type', format === 'json' ? 'text/plain; charset=utf-8' : 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).send('Erro ao buscar a planilha: ' + err.message);
  }
};