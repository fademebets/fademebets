
// generate-lock.js
const fs = require('fs');
const fetch = require('node-fetch');

const ODDS_API_URL = 'https://api.oddstrader.com/v1/playerprops'; // placeholder
const OUTPUT_PATH = './public/lock.json';

async function getLockOfTheDay() {
  try {
    const res = await fetch(ODDS_API_URL);
    const props = await res.json();

    const filtered = props.filter(p =>
      p.ev > 0 &&
      p.cover_prob >= 0.87 &&
      p.status === 'healthy'
    );

    if (filtered.length === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ message: "No valid lock today." }));
      return;
    }

    const best = filtered.sort((a, b) => b.ev - a.ev)[0];

    const lock = {
      player: best.player,
      prop: best.bet,
      cover_prob: best.cover_prob,
      ev: best.ev,
      game: best.matchup,
      line: best.line,
      book: best.book,
      status: best.status
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(lock, null, 2));
    console.log("Lock of the Day saved.");
  } catch (err) {
    console.error("Error generating lock:", err);
  }
}

getLockOfTheDay();
