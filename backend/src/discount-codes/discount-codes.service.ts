import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dto/update-discount-code.dto';
import { DiscountCode } from './entities/discount-code.entity';

@Injectable()
export class DiscountCodesService implements OnModuleInit {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly discountCodeRepo: Repository<DiscountCode>,
  ) { }

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const defaultCode = await this.discountCodeRepo.findOne({ where: { code: 'toys666' } });
    if (!defaultCode) {
      const code = this.discountCodeRepo.create({
        code: 'toys666',
        discountAmount: 100,
        validUntil: new Date('2029-03-06'),
      });
      await this.discountCodeRepo.save(code);
      console.log('🌱 Seeded default discount code: toys666 (100 off)');
    }
  }

  create(createDiscountCodeDto: CreateDiscountCodeDto) {
    const code = this.discountCodeRepo.create(createDiscountCodeDto);
    return this.discountCodeRepo.save(code);
  }

  findAll() {
    return this.discountCodeRepo.find();
  }

  findOne(id: number) {
    return this.discountCodeRepo.findOne({ where: { id } });
  }

  async update(id: number, updateDiscountCodeDto: UpdateDiscountCodeDto) {
    await this.discountCodeRepo.update(id, updateDiscountCodeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.discountCodeRepo.delete(id);
    return { success: true };
  }

  async validateCode(codeString: string) {
    const code = await this.discountCodeRepo.findOne({ where: { code: codeString } });
    if (!code) {
      throw new NotFoundException('找不到此折扣碼');
    }

    if (code.validUntil && new Date() > code.validUntil) {
      throw new BadRequestException('折扣碼已過期');
    }

    if (code.maxUsages > 0 && code.currentUsages >= code.maxUsages) {
      throw new BadRequestException('折扣碼已達使用上限');
    }

    return code;
  }
}
