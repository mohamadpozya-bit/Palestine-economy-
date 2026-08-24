import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = `أنت خبير اقتصادي فلسطيني. أجب عن الأسئلة بدقة واعتماداً على البيانات الرسمية الصادرة عن الجهاز المركزي للإحصاء الفلسطيني، سلطة النقد الفلسطينية، والبنك الدولي. 
تحدث عن مؤشرات مثل: البطالة (46% إجمالاً، 28% ضفة، 78% غزة)، الناتج المحلي، أموال المقاصة، العجز المالي، الدين العام، والقطاع المصرفي. 
استخدم لغة عربية فصحى واضحة.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'عذرًا، لم أستطع إيجاد رد مناسب.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'حدث عطل مؤقت، حاول مجددًا.' });
  }
}
