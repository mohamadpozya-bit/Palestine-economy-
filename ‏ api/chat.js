exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const systemPrompt = `أنت خبير اقتصادي فلسطيني. أجب عن الأسئلة بدقة واعتماداً على البيانات الرسمية الصادرة عن الجهاز المركزي للإحصاء الفلسطيني، سلطة النقد الفلسطينية، والبنك الدولي. 
تحدث عن مؤشرات مثل: البطالة (46% إجمالاً، 28% ضفة، 78% غزة)، الناتج المحلي، أموال المقاصة، العجز المالي، الدين العام، والقطاع المصرفي. 
استخدم لغة عربية فصحى واضحة.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'عذرًا، لم أستطع إيجاد رد.';

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'حدث عطل مؤقت، حاول مجددًا.' }) };
  }
};
