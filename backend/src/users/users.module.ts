import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. 引入 TypeORM
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // 2. 引入剛剛寫的 Entity

@Module({
  // 3. 註冊 User Entity，讓 TypeORM 幫你建表
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 4. 匯出 Service，以後 Auth 模組會用到
})
export class UsersModule {}
