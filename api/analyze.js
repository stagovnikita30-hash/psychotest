import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { answers } = req.body;

  try {
    const prompt = `Проанализируй личность человека по его ответам на психологический тест.
    Ответы:
    ${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}
    Сделай анализ подробно, но без воды, в стиле психологического профиля.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при анализе данных" });
  }
}
