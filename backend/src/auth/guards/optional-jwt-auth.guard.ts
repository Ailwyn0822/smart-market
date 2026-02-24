import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        //不論有沒有登入都不會報錯，直接將 user 資訊附加或傳遞 null
        return user || null;
    }
}
