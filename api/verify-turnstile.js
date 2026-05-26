export default async function handler(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false });

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return res.status(500).json({ success: false });

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
  });

  const data = await result.json();
  res.json({ success: data.success });
}
