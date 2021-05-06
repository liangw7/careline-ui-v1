import { Injectable } from '@angular/core';
import wx from 'weixin-jsapi';
import { UsersService } from '../../users.service';
import { WeixinPublicService } from '../weixin-public.service';
import { alertDialogService } from '../../alertDialog.service'

@Injectable({
  providedIn: 'root'
})
export class WeixinJsapiService {
  signature: any;
  constructor(
    private usersService: UsersService,
    private alertDialogService: alertDialogService,
    private weixinPublicService: WeixinPublicService,
  ) { }

  getJsapiConfig(link: any, jsApiList: any[]) {
    console.log('--WeixinJsapiService--getConfig--start');
    this.usersService.getWeChatSignature(link).then((data: any) => {
      this.signature = data;
      console.log('this.signature', this.signature)
      var config = this.weixinPublicService.getConfig(jsApiList, this.signature);
      wx.config(config);
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: jsApiList,
          success: function (res: any) {
            console.log("seccess")
            console.log(res)
            console.log('--WeixinJsapiService--getConfig--end');
          }
        })
      })

    }).catch((error: any) => {
      console.log('error', error)
      this.alertDialogService.alert('获取config失败，请重试')
      console.log('--WeixinJsapiService--getConfig--end');
    })

  }

}
