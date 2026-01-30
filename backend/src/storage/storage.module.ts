import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  imports: [ConfigModule], // 因為 Service 用到了 ConfigService
  providers: [StorageService],
  exports: [StorageService], // 👈 重點：匯出 Service 讓其他人用
})
export class StorageModule {}
