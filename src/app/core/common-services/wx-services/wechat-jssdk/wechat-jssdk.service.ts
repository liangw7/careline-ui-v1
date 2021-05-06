import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { UsersService } from '../../users.service';
import { WeixinPublicService } from '../weixin-public.service';
const WechatJSSDK = require('wechat-jssdk');

@Injectable({
  providedIn: 'root'
})
export class WechatJssdkService {
  signature: any;
  constructor(
    private userService: UsersService,
    private weixinPublicService: WeixinPublicService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) { }

  /**
   * 分享方法
   * @param link 
   * @param jsApiList 
   */
  shareFriends(link: any, jsApiList: any[]) {
    console.log('--WechatJssdkService--shareFriends--start');
    return new Promise((resolve, reject) => {
      this.userService.getWeChatSignature(link).then((data: any) => {
        this.signature = data;
        console.log('this.signature', this.signature)
        // 拼接微信config参数,只有jsApiList是从方法外传入,每个业务需求不同,jsApiList内的值也就不同
        var config = this.weixinPublicService.getConfig(jsApiList, this.signature);

        const wechatObj = new WechatJSSDK(config);
        console.log('wechatObj', wechatObj)
        try {
          // 调用微信分享方法
          this.wxShare(wechatObj);
          resolve(data);
          console.log('--WechatJssdkService--shareFriends--end');
        } catch (error) {
          resolve(data);
          console.log('--WechatJssdkService--shareFriends--end');
          reject(new Error('error'));
          console.error(error);
        }
      })
    })
  }

  /**
   * 微信验签并分享方法
   * @param desc 
   * @param title 
   * @param title1 
   * @param image 
   * @param link 
   * @param jsApiList 
   * @param type 
   */
  getSignature(desc: any, title: any, title1: any, image: any, link: any, jsApiList: any[], type: any) {
    console.log('--WechatJssdkService--getSignature--start');
    return new Promise((resolve, reject) => {
      this.userService.getWeChatSignature(link).then((data: any) => {
        this.signature = data;
        console.log('this.signature', this.signature)
        // 拼接微信config参数,只有jsApiList是从方法外传入,每个业务需求不同,jsApiList内的值也就不同
        var config = this.weixinPublicService.getConfig(jsApiList, this.signature);

        const wechatObj = new WechatJSSDK(config);
        console.log('wechatObj', wechatObj)
        if (type = 0) {
          try {
            // 调用微信分享方法
            this.wxShareMethod1(wechatObj, desc, title, title1, image, link);
            resolve(data);
            console.log('--WechatJssdkService--getSignature--end');
          } catch (error) {
            resolve(data);
            console.log('--WechatJssdkService--getSignature--end');
            reject(new Error('error'));
            console.error(error);
          }
        } else {
          try {
            // 调用微信分享方法
            this.wxShareMethod2(wechatObj, desc, title, title1, image, link);
            resolve(data);
            console.log('--WechatJssdkService--getSignature--end');
          } catch (error) {
            resolve(data);
            console.log('--WechatJssdkService--getSignature--end');
            reject(new Error('error'));
            console.error(error);
          }
        }
      })
    })
  }

  /**
   * 微信分享方法,此方法主要调用内部的shareOnChat和shareOnMoment
   * @param wechatObj 
   * @param desc 
   * @param title 
   * @param title1 
   * @param image 
   * @param link 
   */
  wxShareMethod1(wechatObj: any, desc: any, title: any, title1: any, image: any, link: any) {
    wechatObj.initialize()
      .then((w: { shareOnChat: (arg0: { type: string; title: any; link: any; imgUrl: any; desc: any; success: () => void; cancel: () => void; }) => void; shareOnMoment: (arg0: { type: string; title: any; link: any; desc: any; imgUrl: any; }) => void; }) => {
        w.shareOnChat({
          type: 'link',
          title: title,
          link: link,
          imgUrl: image,
          desc: desc,
          success: function () { },
          cancel: function () { }
        });
        w.shareOnMoment({
          type: 'link',
          title: title1,
          link: link,
          desc: desc,
          imgUrl: image
        });
      }).catch((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('客户端出错:', err.error.message);
        } else {
          console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
        }
      });

  }

  /**
    * 微信分享方法,此方法主要调用内部的callWechatApi和shareOnMoment
    * @param wechatObj 
    * @param desc 
    * @param title 
    * @param title1 
    * @param image 
    * @param link 
    */
  wxShareMethod2(wechatObj: any, desc: any, title: any, title1: any, image: any, link: any) {
    wechatObj.initialize()
      .then((w: {
        callWechatApi: (arg0: string, arg1: {
          type: string; title: any; link: string; imgUrl: any; desc: any; success: () => void; cancel: () => void;
        }) => void; shareOnMoment: (arg0: { type: string; title: any; link: string; desc: any; imgUrl: any; }) => void;
      }) => {
        w.callWechatApi('onMenuShareAppMessage', {
          type: 'link',
          title: title,
          link: link,
          imgUrl: image,
          desc: desc,
          success: function () { },
          cancel: function () { }
        });
        w.shareOnMoment({
          type: 'link',
          title: title1,
          link: link,
          desc: desc,
          imgUrl: image
        });
      }).catch((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('客户端出错:', err.error.message);
        } else {
          console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
        }
      });
  }

  /**
   * 微信分享方法
   * @param wechatObj 
   */
  wxShare(wechatObj: any) {
    wechatObj.initialize()
      .then((w: { callWechatApi: (arg0: string) => void; }) => {
        // w.callWechatApi('closeWindow');
        (<HTMLElement>document.querySelector('#showOptionMenu')).onclick = function () {
          w.callWechatApi('hideOptionMenu');
        };
      }).catch((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('客户端出错:', err.error.message);
        } else {
          console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
        }
      });
  }
}
