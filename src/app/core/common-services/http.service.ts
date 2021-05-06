import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';

/**
 * 封装HttpClient，主要解决：
 * + 优化HttpClient在参数上便利性
 * + 统一实现 loading
 * + 统一处理时间格式问题
 */
@Injectable({
    providedIn: 'root',
})
// tslint:disable-next-line:class-name
export class HttpService {
    public token: any;
    public user: any;
    public httpOptions: any;
    public httpAuthOptions: any;
    constructor(
        public http: HttpClient,
        @Inject(SESSION_STORAGE) private storage: WebStorageService) {

        this.token = this.storage.get('token');
        this.user = this.storage.get('user');
        console.log('token============', this.token);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        // 临时这么写,因为目前这个校验是否登录不是很明确,导致有的不应该校验的部分被拦截导致报错
        // if(this.token){
        this.httpAuthOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.token
            })
        };
        // }else{
        //     this.httpAuthOptions = {
        //         headers: new HttpHeaders({
        //             'Content-Type': 'application/json',
        //         })
        //     };
        // }
        console.log(this.httpOptions);
        console.log(this.httpAuthOptions);
    }

    get(url: string) {
        console.log('--httpService--get--start--');
        return new Promise((resolve, reject) => {
            this.http.get(url, this.httpOptions)
                .subscribe(data => {
                    resolve(data);
                    console.log('--httpService--get--end--');
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                    console.log('--httpService--get--end--');
                });
        });
    }

    getAuth(url: string) {
        console.log('--httpService--getAuth--start--');
        console.log('url', url);
        return new Promise((resolve, reject) => {
            this.http.get(url, this.httpAuthOptions)
                .subscribe(response => {
                    resolve(response);
                    console.log('--httpService--getAuth--end--');
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                    console.log('--httpService--getAuth--end--');
                });
        });
    }

    postAuthParam(url: string, param: any) {
       
        this.token = this.storage.get('token');
        this.httpAuthOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.token
            })
        };
        return new Promise((resolve, reject) => {
            this.http.post(url, param, this.httpAuthOptions)
                .subscribe(data => {
                    console.log('--httpService--postAuthParam--end--data--');
                    console.log(data);
                    resolve(data);
                
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                 
                });
        });
    }

    postAuth(url: string) {
        console.log('--httpService--postAuth--start--');
        return new Promise((resolve, reject) => {
            // headers.append('Authorization', this.authService.token);
            this.http.post(url, this.httpAuthOptions)
                .subscribe(data => {
                    resolve(data);
                    console.log('--httpService--postAuth--end--');
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                    console.log('--httpService--postAuth--end--');
                });
        });
    }

    /**
     * 不需要身份校验就能访问的post请求
     * @param url 请求地址
     * @param data 请求参数
     * @returns 
     */
    post(url: string, data: any) {
        console.log('--httpService--post--start--');
        console.log('token', this.token)
        console.log('user', this.user)
        console.log('http options', url, this.httpOptions, data);
        return new Promise((resolve, reject) => {
            this.http.post(url, JSON.stringify(data), this.httpOptions)
                .subscribe(response => {
                    resolve(response);
                    console.log('--httpService--post--end--', response);
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                    console.log('--httpService--post--end--');
                });

        });

    }

    postParam(url: string, param: any) {
        console.log('--httpService--postParam--start--');
        return new Promise((resolve, reject) => {
            this.http.post(url, param, this.httpOptions)
                .subscribe(data => {
                    resolve(data);
                    console.log('--httpService--postParam--end--');
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log('客户端出错:', err.error.message);
                    } else {
                        console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                    }
                    reject(err);
                    console.log('--httpService--postParam--end--');
                });
        });
    };

    deleteAuth(url: string) {
        console.log('--httpService--deleteAuth--start--');
        return new Promise((resolve, reject) => {
            this.http.delete(url, this.httpAuthOptions).subscribe((res) => {
                resolve(res);
                console.log('--httpService--deleteAuth--end--');
            }, (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log('客户端出错:', err.error.message);
                } else {
                    console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
                }
                reject(err);
                console.log('--httpService--deleteAuth--end--');
            });

        });

    }
}