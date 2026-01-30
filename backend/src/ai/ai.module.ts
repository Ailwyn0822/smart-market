import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule],
  providers: [AiService],
  exports: [AiService], // 👈 匯出 AI 能力
})
export class AiModule {}
