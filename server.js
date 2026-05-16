require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/quote', async (req, res) => {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: '大阪出身のR&Bシンガーソングライター NAOと Claude のタッグから生まれる、深くてクールな今日の一言を生成してください。日本語で、詩的かつ本質をついた短い一言（1〜2文）を返してください。余計な説明は不要です。',
      messages: [{ role: 'user', content: '今日の一言をください。' }],
    });
    const quote = message.content[0].text.trim();
    res.json({ quote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate quote.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`NAOVERSE running at http://localhost:${PORT}`);
});
