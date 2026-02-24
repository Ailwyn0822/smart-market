import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserProvider } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { DiscountCode } from '../discount-codes/entities/discount-code.entity';

const PRODUCT_NAMES = [
    '木製積木組合', '卡通角色玩偶', '益智拼圖(500片)', '遙控越野車', '彩色蠟筆組',
    '故事繪本套裝', '積木城堡組', '毛絨玩具熊', '水彩顏料組', '音樂玩具鋼琴',
    '兒童料理玩具組', '模型火車', '海盜拼圖組', '恐龍玩偶套裝', '兒童帳篷',
    '彩色黏土組', '磁力積木片', '電動玩具槍', '兒童學習平板', '滑板車',
    '跳繩組合', '羽毛球拍套裝', '籃球(兒童款)', '足球(5號)', '棒球手套',
    '游泳圈', '蛙鞋組合', '太陽眼鏡(兒童)', '帆布包(小熊款)', '兒童背包',
    '摺疊雨傘(卡通)', '手錶(兒童款)', '兒童皮帶', '帽子(鴨舌)', '保暖手套',
    '條紋毛衣', '牛仔褲(兒童)', '連帽外套', '格紋裙', 'T恤(卡通圖案)',
    '兒童睡衣套裝', '連身洋裝', '皮鞋(小朋友款)', '運動鞋(兒童)', '布鞋',
    '數學習作本', '英語練習冊', '科學實驗書', '世界地圖拼圖', '歷史故事書',
    '童話故事集', '動物百科全書', '宇宙星際圖鑑', '恐龍探秘百科', '植物觀察圖冊',
    '相機(兒童款)', '望遠鏡(玩具)', '顯微鏡套裝', '科學實驗箱', '電路板學習套裝',
    '樂高積木(城市組)', '芭比娃娃', '特種部隊玩具', '廚房玩具套裝', '醫生玩具組',
    '汽車模型(1:18)', '機器人玩具', '泡泡機', '沙灘玩具套裝', '戲水玩具組',
    '兒童吉他', '鼓組玩具', '直笛', '烏克麗麗(兒童款)', '木魚玩具',
    '水槍(超大款)', '溜冰鞋', '平衡車', '兒童腳踏車', '扭扭車',
    '跳跳馬', '彈跳床', '攀爬架', '滑滑梯套裝', '鞦韆組',
    '電動火車組', '無人機(玩具)', '四驅車', '蒸汽火車模型', '軍事模型車',
    '珠珠編織組', '手工藝黏土', '畫板組合', '水晶泥套裝', '縮小版廚具組',
    '收藏版公仔', '限量模型', '復古玩具車', '仿古錫兵', '老式紙娃娃',
];

const DESCRIPTIONS = [
    '保存良好，幾乎全新，孩子已長大不玩了，送出給有緣人。',
    '只用過幾次，外觀無刮傷，功能完全正常，附原盒。',
    '二手品，有輕微使用痕跡，整體完整無缺件。',
    '全新未拆封，因買重複所以出售，便宜出讓。',
    '孩子最愛的玩具之一，現已升級，物品仍很新。',
    '購入後放置收藏，現清出，品相極佳。',
    '使用過半年，清洗乾淨，適合下一個小寶貝使用。',
    '原售價更高，現低價出讓，歡迎詢問更多細節。',
    '顏色鮮艷，材質安全，適合 3-10 歲兒童玩耍。',
    '品牌正品，附說明書，送禮自用兩相宜。',
];

const SAMPLE_IMAGES = [
    'https://picsum.photos/seed/toy1/400/300',
    'https://picsum.photos/seed/toy2/400/300',
    'https://picsum.photos/seed/toy3/400/300',
    'https://picsum.photos/seed/toy4/400/300',
    'https://picsum.photos/seed/toy5/400/300',
    'https://picsum.photos/seed/book1/400/300',
    'https://picsum.photos/seed/cloth1/400/300',
    'https://picsum.photos/seed/art1/400/300',
    'https://picsum.photos/seed/game1/400/300',
    'https://picsum.photos/seed/sport1/400/300',
];

const EXTRA_DISCOUNT_CODES = [
    { code: 'SAVE50', discountAmount: 50, validUntil: new Date('2027-12-31') },
    { code: 'WELCOME200', discountAmount: 200, validUntil: new Date('2027-12-31') },
    { code: 'SUMMER100', discountAmount: 100, validUntil: new Date('2027-08-31') },
    { code: 'VIP300', discountAmount: 300, validUntil: new Date('2027-12-31'), maxUsages: 50 },
    { code: 'KIDS10', discountAmount: 10, validUntil: new Date('2028-06-30') },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(DiscountCode)
        private discountCodeRepo: Repository<DiscountCode>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedDiscountCodes();
        const admin = await this.seedAdmin();
        await this.seedProducts(admin);
    }

    private async seedDiscountCodes() {
        for (const codeData of EXTRA_DISCOUNT_CODES) {
            const exists = await this.discountCodeRepo.findOne({ where: { code: codeData.code } });
            if (!exists) {
                await this.discountCodeRepo.save(this.discountCodeRepo.create(codeData));
                console.log(`🌱 Seeded discount code: ${codeData.code}`);
            }
        }
    }

    private async seedAdmin(): Promise<User> {
        const adminEmail = 'admin@smartmarket.com';
        let admin = await this.userRepo.findOne({ where: { email: adminEmail } });
        if (!admin) {
            const hashed = await bcrypt.hash('password123', 10);
            admin = await this.userRepo.save(this.userRepo.create({
                email: adminEmail,
                name: '管理員',
                password: hashed,
                provider: UserProvider.LOCAL,
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=admin',
            }));
            console.log('🌱 Seeded admin account: admin@smartmarket.com / password123');
        }
        return admin;
    }

    private async seedProducts(admin: User) {
        const count = await this.productRepo.count({ where: { userId: admin.id } });
        if (count >= 1000) return;

        const categories = await this.categoryRepo.find();
        if (categories.length === 0) return;

        const toCreate: Partial<Product>[] = [];
        const needed = 1000 - count;

        for (let i = 0; i < needed; i++) {
            const name = PRODUCT_NAMES[i % PRODUCT_NAMES.length] + (i >= PRODUCT_NAMES.length ? ` #${Math.floor(i / PRODUCT_NAMES.length) + 1}` : '');
            const category = categories[i % categories.length];
            const price = Math.floor(Math.random() * 500) + 50;
            const stock = Math.floor(Math.random() * 20) + 1;
            const imageUrl = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];
            const description = DESCRIPTIONS[i % DESCRIPTIONS.length];
            const conditions = ['New', 'Like New', 'Good', 'Used'];
            const condition = conditions[i % conditions.length];

            toCreate.push({
                name,
                description,
                price,
                stock,
                imageUrl,
                condition,
                userId: admin.id,
                categoryId: category.id,
                isActive: true,
                views: Math.floor(Math.random() * 200),
            });
        }

        // 批次寫入，每批 100 筆
        const BATCH = 100;
        for (let i = 0; i < toCreate.length; i += BATCH) {
            await this.productRepo.save(toCreate.slice(i, i + BATCH).map(p => this.productRepo.create(p)));
        }

        console.log(`🌱 Seeded ${needed} products under admin account`);
    }
}
