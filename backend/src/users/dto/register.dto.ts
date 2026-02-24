import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: '小明', description: '顯示名稱（2-50 字元）' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username: string; // 顯示名稱

    @ApiProperty({ example: 'user@example.com', description: 'Email 帳號' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: '密碼（至少 6 字元）', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}
