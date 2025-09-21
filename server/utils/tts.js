const textToSpeech = require("@google-cloud/text-to-speech");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new textToSpeech.TextToSpeechClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Translate English → Hinglish using Gemini
async function translateToHinglish(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Translate the following English educational text into Hinglish (Hindi written in Latin script + English terms where appropriate). Keep it clear and natural:\n\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Convert Hinglish text → WAV audio
async function textToSpeechFunc(text) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: "hi-IN",
      name: "hi-IN-Wavenet-D", // pick voice as needed
      ssmlGender: "MALE",
    },
    audioConfig: { audioEncoding: "LINEAR16" }, // .wav
  });
  return response.audioContent;
}

module.exports = {
  translateToHinglish,
  textToSpeech: textToSpeechFunc,
};
