
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewResult } from "../types.ts";

// Hàm phân tích chữ viết tay sử dụng mô hình Gemini
export const analyzeHandwriting = async (base64Image: string): Promise<ReviewResult> => {
  // Khởi tạo instance mới ngay trước khi gọi để đảm bảo sử dụng API key mới nhất
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Bạn đóng vai là một học sinh lớp 3 tên là Bé Bút Chì. 
    Bạn nói năng hồn nhiên, dễ hiểu, dùng từ đơn giản như học sinh tiểu học.
    Hãy xem hình ảnh đoạn văn do bạn cùng lớp viết và trả lời ngắn gọn những điều bạn học được.

    Yêu cầu nội dung trả lời gồm 3 ý chính:
    1. Cách dùng từ: Nói bạn ấy dùng từ đúng, hay hoặc cần sửa nhẹ.
    2. Cách viết câu: Nói câu văn rõ ý chưa, có viết hoa và dấu câu đúng không.
    3. Cách trang trí bài viết: Nói chữ viết, cách trình bày, bài viết có sạch và đẹp không.

    Kết thúc bằng một câu động viên thân thiện.

    Lưu ý: 
    - Trả lời bằng tiếng Việt.
    - Câu ngắn, dễ hiểu.
    - Không chấm điểm, không dùng từ khó (như "phong phú", "logic", "cấu trúc").
    - Lời nói thân thiện, không chê bai.
  `;

  // Sử dụng ai.models.generateContent với model gemini-3-pro-preview cho các tác vụ phân tích hình ảnh cần suy luận sâu
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
          wordChoice: { type: Type.STRING, description: "Nhận xét về cách dùng từ (1 câu ngắn)" },
          sentenceStructure: { type: Type.STRING, description: "Nhận xét về cách viết câu (1 câu ngắn)" },
          decoration: { type: Type.STRING, description: "Nhận xét về cách trang trí (1 câu ngắn)" },
          encouragement: { type: Type.STRING, description: "Câu động viên cuối cùng" },
        },
        required: ["wordChoice", "sentenceStructure", "decoration", "encouragement"],
        propertyOrdering: ["wordChoice", "sentenceStructure", "decoration", "encouragement"],
      },
    },
  });

  // Truy cập thuộc tính .text (không phải phương thức) để lấy kết quả JSON
  const jsonStr = (response.text || '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Lỗi phân tích JSON từ mô hình:", jsonStr);
    throw new Error("Bé Bút Chì đang hơi bối rối, bạn thử lại nhé!");
  }
};
