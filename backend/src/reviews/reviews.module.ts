import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Order } from '../orders/entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Order]),
    AuthModule,
    NotificationsModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
