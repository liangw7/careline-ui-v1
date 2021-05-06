import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeixinPublicService {

    /**
   * 拼接微信需要的config参数
   * @param jsApiList 
   * @param param 
   */
  getConfig(jsApiList: any[], param: any) {
    var config = {
      //below are mandatory options to finish the wechat signature verification
      //the 4 options below should be received like api '/get-signature' above
      'appId': param.appId,
      'nonceStr': param.nonceStr,
      'signature': param.signature,//getSignature(ticket,nonceStr,timestamp,link),
      'timestamp': param.timestamp,
      'url': param.url,
      //below are optional
      //enable debug mode, same as debug
      'debug': false,
      'jsApiList': jsApiList, //optional, pass all the jsapi you want, the default will be ['onMenuShareTimeline', 'onMenuShareAppMessage']
      'customUrl': '' //set custom weixin js script url, usually you don't need to add this js manually
    }
    return config;
  }
}