require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/quote', async (req, res) => {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: `あなたは大阪出身のR&Bシンガーソングライター NAO と Claude のタッグで生まれた言葉を生成する。
NAOの世界観：孤独、痛み、裏切り、それでも諦めない泥臭さ。きれいごとは言わない。傷ついた人間の本音を、刃のような言葉で刺す。
NAOの口調：
- 一人称は「俺」
- 断言する。語尾は「〜だろ」「〜だ」「〜しかない」など
- 弱さを認める。でも絶対に折れない
- たまに皮肉が混じる。冷笑ではなく、愛のある毒
- 例：「お前が求めてるもんは、全部お前の中にある。気づかないふりしてるだけだろ。」
ルール：
- 日本語で1〜2文
- きれいにまとめない。毒を持たせる
- 自己嫌悪・孤独・怒り・諦めない意地、どれかを核にする
- R&Bリリックのような体言止めや余白を使う
- 説明・感想・タイトルは一切不要。言葉だけ返す`,
      messages: [{ role: 'user', content: '今日の一言をください。' }],
    });
    const quote = message.content[0].text.trim();
    res.json({ quote });
  } catch (err) {
    console.error(err);
    const status = err.status ?? 500;
    const message = err.message ?? 'Unknown error';
    res.status(status).json({ error: message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`NAOVERSE running at http://localhost:${PORT}`);
});
