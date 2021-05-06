import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from '../models/api-url';
import { ShortMessageModel } from '../models/shortMessage'
import { HttpService } from './http.service';

@Injectable()
export class ShortMessageService {

    constructor(
        public router: Router,
        public entity: ApiUrl,
        public shortMesageModel: ShortMessageModel,
        private httpservice: HttpService,
    ) {
    }

    /**
     * 发送登录/注册验证码
     */
    sendShrotMessageForLogin(shortMesageModel: ShortMessageModel) {
        console.log('--shortMessageService--sendShrotMessageForLogin--start--');
        return this.httpservice.postParam(this.entity.sendShortMessageForLogin, shortMesageModel);
    }

    /**
     * 发送找回密码验证码
     */
    sendShortMessageForReset(shortMesageModel: ShortMessageModel) {
        console.log('--shortMessageService--sendShortMessageForReset--start--');
        return this.httpservice.postParam(this.entity.sendShortMessageForReset, shortMesageModel);
    }

    /**
     * 短信通知接口
     * @param filter {phone: '手机号', message: '通知内容'}
     * @returns 
     */
    sendShortMessageNotification(filter: any) {
        console.log('--shortMessageService--sendShortMessageForReset--start--');
        return this.httpservice.postParam(this.entity.sendShortMessageNotification, filter);
    }

    /**
     * 校验验证码准确性
     */
    async checkShortMessage(shortMesageModel: ShortMessageModel) {
        console.log('--shortMessageService--checkShortMessage--start--');
        return await this.httpservice.postParam(this.entity.checkShortMessage, shortMesageModel);
    }

}
