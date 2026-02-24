import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email 帳號' })
    @IsString()
    @IsNotEmpty()
    username: string; // 前端欄位名稱是 username，實際上是 email

    @ApiProperty({ example: 'password123', description: '密碼（至少 6 字元）', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
