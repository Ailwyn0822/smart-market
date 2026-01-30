// apps/backend/src/storage/storage.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.getOrThrow<string>('MINIO_PORT'), 10),
      useSSL: false,
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;

    // 上傳到 MinIO
    await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);

    // 產生預覽連結 (注意：這只是暫時連結，正式環境通常會配合 Nginx)
    // 這裡我們先簡單回傳檔名，之後前端可以用 http://localhost:9000/products/檔名 讀取
    return fileName;
  }

  // 取得完整網址的方法
  getFileUrl(fileName: string): string {
    return `http://localhost:9000/${this.bucketName}/${fileName}`;
  }
}
