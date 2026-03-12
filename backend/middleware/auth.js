const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Missing API_KEY environment variable");
}

export default function apiKeyAuth(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
}
