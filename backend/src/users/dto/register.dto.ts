import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username: string; // 顯示名稱

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}
