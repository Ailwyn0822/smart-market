// apps/backend/src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.configService.getOrThrow<string>('GEMINI_API_KEY'));
  }

  async analyzeProductImage(imageBuffer: Buffer, mimeType: string) {
    // 使用支援圖片的模型 (gemini-1.5-flash 或 gemini-pro-vision)
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      你是一個專業的電商管理員。請分析這張圖片，並回傳以下 JSON 格式的資訊 (不要 Markdown，只要純 JSON)：
      {
        "name": "商品繁體中文名稱 (簡短有力)",
        "description": "商品的詳細描述 (50字以內)",
        "category": "商品分類 (例如: 3C, 食品, 服飾...)",
        "price": 預估台幣售價 (純數字)
      }
    `;

    // 將圖片轉為 Gemini 看得懂的格式
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // 清理回應 (有時候 AI 會包 ```json ... ```)
    const cleanText = text.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanText);
  }
}
