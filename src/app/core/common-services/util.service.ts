import { Injectable } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { ApiUrl } from "../models";

@Injectable()
export class UtilService {

    private baseUrl: string = '';
    constructor(
        private sanitizer: DomSanitizer,
        private entity: ApiUrl,
    ) {
        this.baseUrl = entity.setFormUploadPhoto;

    }

    findItem(item: any, list: any) {
        // console.log('--utilService--findItem--start--');
        for (let i of list) {
            if (i._id == item._id) {
                // console.log('--utilService--findItem--end--');
                return true
            }
        }
        // console.log('--utilService--findItem--end--');
        return false;
    }

    /**
     * 安全的获取图片地址
     * 需要拼接
     * 防止跨站点脚本安全漏洞（XSS）
     * @param url 图片名称
     */
    getImageUrl(url: any) {
        // console.log('--utilService--getImageUrl--start--');
        if (url) {
            return this.sanitizer.bypassSecurityTrustUrl(this.baseUrl + String(url) + '.png');
        } else {
            return null;
        }
    }


    /**
     * 安全的获取文件/图片地址
     * 不需要拼接
     * 防止跨站点脚本安全漏洞（XSS）
     * @param url 文件/图片等地址信息
     */
    getUrl(url: any) {
        if (url) {
            return this.sanitizer.bypassSecurityTrustUrl(url)
        } else {
            return null;
        }
    }

    getHttpUrl(url: any) {
        // console.log('--utilService--getHttpUrl--start--');
        if (url) {
            if (url.includes('http')) {
                return this.getUrl(String(url));
            } else {
                return this.getImageUrl(url);
            }
        } else {
            return null;
        }
    }

    /**
    * 正则校验手机号
    * @param {手机号} mobile 
    */
     checkMobile(mobile: String) {
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile + ""))) {
            console.log("手机号码不合法，请重新输入");
            return false;
        } else {
            return true;
        }
    }

    /**
    * 正则校验短信验证码
    * @param num 短信验证码
    * @returns 
    */
    checkVerificationCode(num: any) {
        if (!(/^\d{6}$/.test(num + ""))) {
            console.log("验证码只能是6位数字，请确认后重新输入");
            return false;
        } else {
            return true;
        }
    }

    /**
    * 正则校验邮箱
    * @param email 邮箱
    * @returns 
    */
    checkEmail(email: any) {
        if (!(/^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/.test(email + ""))) {
            console.log("邮箱验证错误");
            return false;
        } else {
            return true;
        }
    }

}