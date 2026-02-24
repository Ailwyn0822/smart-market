import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: '王小明', description: '顯示名稱' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: '頭像圖片 URL' })
    @IsString()
    @IsOptional()
    avatar?: string;
}
