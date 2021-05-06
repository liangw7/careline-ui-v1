//import 'rxjs/add/operator/map';
import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  public user: any;
  public token: any;
  temp:any;

  constructor(
    public router: Router,
    public entity: ApiUrl,
    public httpservice: HttpService,
    @Inject(SESSION_STORAGE) private storage: WebStorageService) {
  }

  checkAuthentication() {
    console.log('--authService--checkAuthentication--start--');
    return this.httpservice.getAuth(this.entity.checkAuthentication);
  }

  async createAccountVoid(details: any) {
    console.log('--authService--createAccount--start--');
    let data: any = await this.httpservice.post(this.entity.register, details);
   // this.token = this.httpservice.token;
    this.token=data.token;
    this.storage.set('token', data.token);
    this.storage.set('user', data.user);
    return data;
  }

  createAccount(details: any) {
    return new Promise((resolve, reject) => {
      this.httpservice.post(this.entity.register, details)
          .then(data => {
             
              this.temp=data;
              this.token=this.temp.token;
              this.storage.set('token', this.token)
              this.storage.set('user', this.temp.user);
              console.log('created account',data);
              resolve(data);
          
          }, (err) => {
            
              reject(err);
           
          });
  });
  }


  async createFamliyMember(details: any) {
    console.log('--authService--createFamliyMember--start--');
    let data: any = await this.httpservice.postAuthParam(this.entity.registerFamliy, details);
    console.log(data);
    // this.token = this.httpservice.token;
    // this.storage.set('token', this.token);
    // this.storage.set('user', data.data);
    return data;
  }

  async login(credentials: any) {
    console.log('--authService--login--start--');
    let data: any = await this.httpservice.post(this.entity.login, credentials);

    console.log('user-data', data);
    this.token = data.token;
    this.user = data.user;
    console.log('token', this.token);
    console.log('token', this.user);
    this.storage.set('token', this.token);
    console.log('this.storage.get("token")')
    console.log(this.storage.get('token'));
    this.storage.set('user', data.user);
    // return data.json();
    console.log('--authService--login--end--');
  }

  /**
   * 退出方法,将所有放入在storage中的都remove
   * 如果不存在不知道会不会报错,暂且这么写
   * @param rout 跳转路由地址
   */
  logout(rout: any) {
    console.log('--authService--logout--start--');
    // this.storage.clear();
    this.storage.remove('token');
    this.storage.remove('role');
    this.storage.remove('profiles');
    this.storage.remove('educations');
    this.storage.remove('provider');
    this.storage.remove('providers');
    this.storage.remove('service');
    this.storage.remove('user');
    this.storage.remove('selectedPatients');
    this.storage.remove('patient');
    this.storage.remove('profile');
    this.storage.remove('followup');
    this.storage.remove('userType');
    if (rout) {
      this.router.navigate([rout]);
    }
    console.log('--authService--logout--end--');
  }

  /**
   * 在已经登录情况下,根据用户角色重定向到登录页面
   */
  redirectLogin() {
    var role = this.storage.get('role');
    console.log('--未登录,跳转到登录页面--');
    if (role) {
      if (role == 'patient') {
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: 0
          }
        })
      } else if (role == 'provider') {
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: 1
          }
        })
      } else {
        this.router.navigate(['/public-platform/homepage/main']);
      }
    } else {
      this.router.navigate(['/public-platform/homepage/main']);
    }
  }
}