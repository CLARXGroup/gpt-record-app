export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!apiKey) {
    return res.status(500).json({ error: 'APIキーが未設定です' });
  }
  const { lineText } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'あなたは福祉施設の専門支援員です。以下のLINEやりとりをもとに、開始連絡・作業中連絡・終了連絡を含む支援記録を自然な日本語で作成してください。指定ルールに厳密に従ってください。'
          },
          {
            role: 'user',
            content: lineText
          }
        ],
        temperature: 0.6,
        max_tokens: 1800
      })
    });
    const data = await response.json();
    res.status(200).json({ result: data.choices?.[0]?.message?.content || '生成失敗' });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI API 呼び出しに失敗' });
  }
}
