import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string; // 前端欄位名稱是 username，實際上是 email

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
