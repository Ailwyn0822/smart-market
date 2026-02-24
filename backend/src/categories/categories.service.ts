import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// 預設種子資料：常見玩具類別
const SEED_CATEGORIES = [
    { name: '玩具與遊戲', slug: 'toys', icon: '🚂' },
    { name: '書籍', slug: 'books', icon: '📚' },
    { name: '服裝', slug: 'clothing', icon: '👕' },
    { name: '藝術創作', slug: 'art', icon: '🎨' },
    { name: '戶外活動', slug: 'outdoor', icon: '⚽' },
    { name: '益智教育', slug: 'edu', icon: '🧩' },
    { name: '模型公仔', slug: 'figures', icon: '🤖' },
    { name: '樂器', slug: 'music', icon: '🎵' },
    { name: '其它', slug: 'others', icon: '📦' },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }

    /** 模組啟動時自動植入預設資料（若尚未存在） */
    async onModuleInit() {
        for (const seed of SEED_CATEGORIES) {
            const exists = await this.categoryRepo.findOne({
                where: { slug: seed.slug },
            });
            if (!exists) {
                await this.categoryRepo.save(this.categoryRepo.create(seed));
            }
        }
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepo.find({ order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) throw new NotFoundException(`找不到 ID ${id} 的類別`);
        return category;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepo.create(dto);
        return this.categoryRepo.save(category);
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);
        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }

    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);
        await this.categoryRepo.remove(category);
    }
}
