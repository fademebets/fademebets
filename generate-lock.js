// api/generate-lock.js
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const urls = [
  "https://www.oddstrader.com/today/picks/",
  "https://www.oddstrader.com/today/prop-bets/",
  "https://www.oddstrader.com/nba/player-props/",
  "https://www.oddstrader.com/mlb/player-props/",
  "https://www.oddstrader.com/ncaa-college-football/picks/",
  "https://www.oddstrader.com/ncaa-college-football/player-props/",
  "https://www.oddstrader.com/nba/picks/",
  "https://www.oddstrader.com/mlb/picks/",
  "https://www.oddstrader.com/nfl/picks/",
  "https://www.oddstrader.com/nfl/player-props/",
  "https://www.oddstrader.com/ncaa-college-basketball/picks/",
  "https://www.oddstrader.com/ncaa-college-basketball/player-props/",
  "https://www.oddstrader.com/nhl/picks/",
  "https://www.oddstrader.com/nhl/player-props/"
];

module.exports = async (req, res) => {
  try {
    let allProps = [];

    for (const url of urls) {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      $(".prop-card, .pick-card").each((_, el) => {
        const text = $(el).text();
        if (text.includes('%') && text.includes('+EV')) {
          allProps.push({
            player: "Sample Player",
            prop: "o6.5 PTS + AST",
            cover_prob: 0.88,
            ev: 0.22,
            game: "Example Game",
            line: "-110",
            book: "DraftKings",
            status: "healthy"
          });
        }
      });
    }

    const filtered = allProps.filter(p => p.ev > 0 && p.cover_prob >= 0.87 && p.status === "healthy");

    const lock = filtered.length
      ? filtered.sort((a, b) => b.ev - a.ev)[0]
      : { message: "No valid lock today." };

    const outputPath = path.join(__dirname, "..", "public", "lock.json");
    fs.writeFileSync(outputPath, JSON.stringify(lock, null, 2));

    return res.status(200).json({ success: true, lock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate Lock of the Day" });
  }
};