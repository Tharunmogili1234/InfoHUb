import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

console.log("Loaded API key:", process.env.OPENWEATHER_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

/* ---------- WEATHER API (Dynamic City) ---------- */
/* ---------- WEATHER API (Dynamic City with Real Data) ---------- */
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }

    if (!apiKey) {
      return res.json({
        city,
        tempC: 29.5,
        desc: "Partly cloudy (demo data - no API key)",
      });
    }

    // ✅ Correct API endpoint
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const r = await fetch(url);
    const d = await r.json();

    // Log response for debugging
    console.log("Weather API raw response:", d);

    if (d.cod !== 200) {
      return res.status(404).json({
        error: `City '${city}' not found or API returned: ${d.message}`,
      });
    }

    res.json({
      city: d.name,
      tempC: d.main?.temp,
      desc: d.weather?.[0]?.description,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: err.message });
  }
});



/* ---------- CURRENCY CONVERTER ---------- */
/* ---------- CURRENCY CONVERTER ---------- */
app.get("/api/convert", async (req, res) => {
  try {
    const { from = "INR", to = "USD", amount = 100 } = req.query;
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const r = await fetch(url);
    const d = await r.json();

    // check if API returned a valid result
    if (!d.result) {
      return res.json({ result: (amount * 0.012).toFixed(2), rate: 0.012 }); // fallback
    }

    res.json({
      result: d.result,
      rate: d.info?.rate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------- QUOTES ---------- */
const QUOTES = [
  "Dream big and dare to fail.",
  "Keep going — your future self will thank you.",
  "Believe in yourself and all that you are.",
];
app.get("/api/quote", (req, res) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json({ text: quote });
});

/* ---------- ROOT TEST ---------- */
app.get("/", (req, res) => {
  res.send("✅ InfoHub backend working");
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
