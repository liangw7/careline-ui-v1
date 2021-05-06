import { Injectable } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';


/**
 * 微信授权登录流程
 * 1：用户访问公众号页面。
 * 2：回调授权。
 * 3：用户同意授权。
 * 4：重定向到公众号，并返回code。
 * 5：公众号通过code获取网页授权access_token。
 * 6：刷新access_token。
 * 7：公众号通过access_token来获取用户信息。
 */
@Injectable()
export class WechatJssdkConfig {
    constructor(private sanitizer: DomSanitizer) { }
    // 微信二维码请求地址
    public wxQrcodBaseUrl = 'https://open.weixin.qq.com/connect/qrconnect';
    // 微信授权登陆请求地址
    public wxAuthBaseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    // 微信登陆授权回调地址
    public redirectUri = 'https://www.digitalbaseas.com/public-platform/homepage/login-poster';
    // 微信provider-card授权回调地址
    public redirectUri1 = 'https://www.digitalbaseas.com/public-platform/homepage/provider-card';
    public responseType = 'code';
    public scope = 'snsapi_login#wechat_redirect';
    public authScope = 'snsapi_userinfo';
    public state = 'STATE#wechat_redirect';

    /**
     * 关于code码返回验证说明如下:
     * 用户允许授权后，将会重定向到redirect_uri的网址上，并且带上code和state参数
     * redirect_uri?code=CODE&state=STATE
     * 
     * 若用户禁止授权，则重定向后不会带上code参数，仅会带上state参数
     * redirect_uri?state=STATE
     * 
     * 由此可见,code是用户确认授权登录后重定向到系统指定页面后传参;
     * 根据校验是否存在code码可知用户是否确认授权登录的标识符
     */

    public appID0: string = 'wx1456c566ec3e6686';
    public appSecrete0: string = '8ada6bb8a95c8d79abf7a374688aa9cd';
    // 微信二维码请求拼接地址
    public wechatRedirectUrl0 = this.wxQrcodBaseUrl + '?appid=' + this.appID0 +
        '&redirect_uri=' + this.redirectUri +
        '&response_type=' + this.responseType +
        '&scope=' + this.scope;
    // 微信二维码请求拼接安全处理地址
    public safeSrcUrl0 = this.sanitizer.bypassSecurityTrustResourceUrl(this.wechatRedirectUrl0);
    // 微信授权登陆拼接地址
    public wxAuthUrl0 = this.wxAuthBaseUrl + '?appid=' + this.appID0 +
        '&redirect_uri=' + this.redirectUri +
        '&response_type=' + this.responseType +
        '&scope=' + this.authScope +
        '&state=' + this.state;

    public appID1: string = 'wx154c4c5bdaeba8d9';
    public appSecrete1: string = '1336a2022d4970ee4098f20698a9eb0f';
    // 微信二维码请求拼接地址
    public wechatRedirectUrl1 = this.wxQrcodBaseUrl + '?appid=' + this.appID1 +
        '&redirect_uri=' + this.redirectUri +
        '&response_type=' + this.responseType +
        '&scope=' + this.scope;
    // 微信二维码请求拼接安全处理地址
    public safeSrcUrl1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.wechatRedirectUrl1);
    // 微信授权登陆拼接地址
    public wxAuthUrl1 = this.wxAuthBaseUrl + '?appid=' + this.appID0 +
        '&redirect_uri=' + this.redirectUri +
        '&response_type=' + this.responseType +
        '&scope=' + this.authScope +
        '&state=' + this.state;

}
