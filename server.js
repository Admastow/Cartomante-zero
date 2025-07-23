const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

app.post("/gerar", async (req, res) => {
  console.log("✅ Requisição recebida para /gerar");

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Crie um roteiro persuasivo, espiritual e místico de uma cartomante para TikTok.
Use frases curtas, linguagem emocional e mística, e termine com chamadas fortes para curtir, comentar “eu aceito” e compartilhar.

Exemplo:
Atenção! Tem uma mulher que já partiu deste mundo... mas ela quer te entregar uma mensagem agora. 💗

...`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await resposta.json();

if (resposta.ok) {
  console.log("✅ Resposta OK:", JSON.stringify(data, null, 2));

  const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Resposta sem texto.";
  return res.json({ texto });
} else {
  console.error("❌ Erro da API Gemini:", JSON.stringify(data, null, 2));
  return res.json({ texto: `❌ Erro da API: ${data.error?.message || 'Erro desconhecido'}` });
}

    res.json({ texto });
  } catch (erro) {
    console.error("❌ Erro ao acessar a API Gemini:", erro);
    res.json({ texto: "❌ Erro ao acessar a API Gemini." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
