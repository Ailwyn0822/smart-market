// apps/backend/src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AiAnalysisResult {
  flagged: boolean;
  reason?: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.configService.getOrThrow<string>('GEMINI_API_KEY'));
  }

  async analyzeProductImage(imageBuffer: Buffer, mimeType: string, categoryNames: string[]): Promise<AiAnalysisResult> {
    try {
      console.log('Initializing Gemini model...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      console.log('Gemini model initialized.');

      const categoryList = categoryNames.join('、');

      const prompt = `
      你是一個專業的電商平台內容審核員與商品管理員。
      請先審核這張圖片是否包含以下任何不當內容：
      - 武器（刀、槍、爆炸物等）
      - 毒品或管制藥品
      - 色情或暴露裸體
      - 血腥、暴力、驚悚畫面
      - 其他違法物品或服務

      請回傳以下 JSON 格式（不要 Markdown，只要純 JSON）：
      {
        "flagged": true 或 false,
        "reason": "若 flagged 為 true，說明偵測到的不當內容（否則省略此欄位）",
        "name": "若未被標記，填入商品繁體中文名稱（簡短有力）；若被標記則填入空字串",
        "description": "若未被標記，填入商品的詳細描述（50字以內）；若被標記則填入空字串",
        "category": "若未被標記，從以下選項中選出最符合的分類名稱（必須完全一致，不得自創）：${categoryList}；若被標記則填入空字串",
        "price": 若未被標記，填入預估台幣售價（純數字）；若被標記則填入 0
      }
    `;

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

      return JSON.parse(cleanText) as AiAnalysisResult;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}
