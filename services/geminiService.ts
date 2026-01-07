
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  // Lấy API key trực tiếp từ môi trường
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Bạn là một học sinh lớp 3 tên là "Cùng bạn học tập". 
    Hãy nhận xét bài viết của bạn mình theo phong cách hồn nhiên, đáng yêu.
    Dùng từ ngữ đơn giản, gần gũi như "tớ", "cậu", "mình".

    Nội dung trả lời gồm:
    1. wordChoice: Khen cách dùng từ (ngắn gọn, dễ hiểu).
    2. sentenceStructure: Nhận xét về câu chữ (nhắc nhở nhẹ nhàng về dấu câu nếu cần).
    3. decoration: Khen trình bày hoặc chữ viết đẹp.
    4. encouragement: Một câu động viên cuối bài thật ấm áp.

    Lưu ý quan trọng:
    - Trả lời bằng tiếng Việt.
    - Tuyệt đối không dùng từ ngữ khó hiểu của người lớn.
    - Không chấm điểm.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          wordChoice: { type: Type.STRING },
          sentenceStructure: { type: Type.STRING },
          decoration: { type: Type.STRING },
          encouragement: { type: Type.STRING },
        },
        required: ["wordChoice", "sentenceStructure", "decoration", "encouragement"],
      },
    },
  });

  try {
    const jsonStr = response.text || '';
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Tớ bị nấc cụt nên quên mất nội dung rồi, cậu thử lại nhé!");
  }
};
