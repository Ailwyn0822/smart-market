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
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.getOrThrow<string>('MINIO_PORT'), 10),
      useSSL: false,
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      pathStyle: true,
    });
    // MinIO standalone 不支援 S3 的 getBucketRegionAsync，
    // 預先填入 regionMap cache 避免 SDK 發出 region 探索請求
    (this.minioClient as any).regionMap = {
      [this.bucketName]: 'us-east-1',
      '': 'us-east-1',
    };
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

    // Set bucket policy to public read
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };
    await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    this.logger.log(`Bucket policy set to public read for '${this.bucketName}'.`);
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;

    // 上傳到 MinIO
    await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);

    // 產生預覽連結 (注意：這只是暫時連結，正式環境通常會配合 Nginx)
    // 這裡我們先簡單回傳檔名，之後前端可以用 http://localhost:9000/products/檔名 讀取
    return fileName;
  }

  // 取得完整網址的方法（生產環境請設 MINIO_PUBLIC_URL）
  getFileUrl(fileName: string): string {
    const publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL')
      || `http://localhost:9000`;
    return `${publicUrl}/${this.bucketName}/${fileName}`;
  }
}
