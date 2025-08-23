// Vercel Serverless Function for Health Check
// This function will be accessible at /api/health

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for simplicity
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const data = {
      status: 'OK',
      message: 'Serverless function is running correctly.',
      timestamp: new Date().toISOString(),
      platform: 'Vercel'
    };
    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
