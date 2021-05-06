import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';
import { WechatJssdkConfig } from './wx-services/wechat-jssdk/wechat-jssdk-config';

@Injectable()
export class MailService {
  appID: string = '';
  appSecret: string = '';
  loginPosterUrl: string = '';
  providerCardUrl: string = '';
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private wechatJssdkConfig: WechatJssdkConfig,
    public entity: ApiUrl,
    public httpservice: HttpService) {
      const bigScreen = this.storage.get('bigScreen');
      if (bigScreen == 1) {
        this.appID = this.wechatJssdkConfig.appID1;
        this.appSecret = this.wechatJssdkConfig.appSecrete1;
      } else if (bigScreen == 0) {
        this.appID = this.wechatJssdkConfig.appID0;
        this.appSecret = this.wechatJssdkConfig.appSecrete0;
      }
      this.loginPosterUrl = this.wechatJssdkConfig.redirectUri;
      this.providerCardUrl = this.wechatJssdkConfig.redirectUri1;
  }

  getAllMail() {
    console.log('--loadPatientService--getAllMail--start--');
    return this.httpservice.getAuth(this.entity.mails);
  }

  getMail(id: String) {
    console.log('--loadPatientService--getMail--start--');
    return this.httpservice.getAuth(this.entity.mails + id);
  }

  /**
   *  appID,    固定值
   *  appSecret,固定值
   *  openID,   入参
   *  message   入参
   * @param filter 
   */
  sendMessage(filter: any) {
    console.log('--loadPatientService--sendMessage--start--');
    filter.appID = this.appID;
    filter.appSecret = this.appSecret;
    return this.httpservice.postAuthParam(this.entity.mailsMessage, filter);
  }

  /**
   * 发送邮件:
   *  appID,    固定值
   *  appSecret,固定值
   *  openID,   入参
   *  message,  入参
   *  title,    入参
   *  url,      入参后拼接
   *  picUrl    入参
   * @param filter openID, message, title, url, picUrl 此类型JSON格式入参
   * @param type 回调地址类型:
   *  0:      微信登陆授权回调地址
   *  其他:   微信provider-card授权回调地址
   */
  sendMessageLink(filter: any, type: number) {
    console.log('--loadPatientService--sendMessageLink--start--');
    filter.appID = this.appID;
    filter.appSecret = this.appSecret;
    if (type == 0) {// 微信登陆授权回调地址
      filter.url = this.loginPosterUrl;
    }else{// 微信provider-card授权回调地址
      filter.url = this.providerCardUrl;
    }
    return this.httpservice.postAuthParam(this.entity.mailsMessageLink, filter);
  }

  getMailByFilter(filter: any) {
    console.log('--loadPatientService--getMailByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.mailsFilter, filter);
  }

  getPatientMails(filter: any) {
    console.log('--loadPatientService--getPatientMails--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientMails, filter);
  }

  update(request: any) {
    console.log('--loadPatientService--update--start--');
    return this.httpservice.postAuthParam(this.entity.mailsupdate, request);
  }

  create(data: any) {
    console.log('--loadPatientService--create--start--');
    return this.httpservice.postAuthParam(this.entity.mails, data);
  }

  delete(id: String) {
    console.log('--loadPatientService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.mails + id);
  }

}