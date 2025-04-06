import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;
const apiKey = process.env.KEY;

if (!apiKey) {
  console.error("API ключ відсутній! Додайте його у файл .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);


app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); 




// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.post('/analyze-budget', async (req, res) => {
  const { incomeCategories, costsCategories } = req.body;

  const incomeDetails = incomeCategories.map(c => `• ${c.category} - ${c.value} грн`).join('\n');
  const costsDetails = costsCategories.map(c => `• ${c.category} - ${c.value} грн`).join('\n');

  const question = `
    Напиши рекомендації та поради, обсягом не більше 2-ох або 3-ох абзаців...
    Користувач загалом витратив: ${costsCategories.reduce((sum, c) => sum + c.value, 0)} грн.
    В категорії витрат входило: ${costsDetails}.
    Загалом користувач заробив: ${incomeCategories.reduce((sum, c) => sum + c.value, 0)} грн.
    В категорії доходів входило: ${incomeDetails}.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(question);
    const recommendations = response.response.text();

    res.json({ recommendations });

  } catch (error) {
    console.error(error);
    res.status(500).json({ recommendations: `Помилка: ${error.message}` }); 
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));