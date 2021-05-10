import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';
import { UtilService } from './util.service';
import { WechatJssdkConfig } from './wx-services/wechat-jssdk/wechat-jssdk-config';

@Injectable()
export class UsersService {
  appID: string = '';
  appSecret: string = '';
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private wechatJssdkConfig: WechatJssdkConfig,
    public entity: ApiUrl,
    private httpservice: HttpService,
    private utilService: UtilService,
  ) {
    const bigScreen = this.storage.get('bigScreen');
    if (bigScreen == 1) {
      this.appID = this.wechatJssdkConfig.appID1;
      this.appSecret = this.wechatJssdkConfig.appSecrete1;
    } else if (bigScreen == 0) {
      this.appID = this.wechatJssdkConfig.appID0;
      this.appSecret = this.wechatJssdkConfig.appSecrete0;
    }
  }

  /**
   * 根据father
   * @param params father_id
   */
  getUserByFatherId(params: any){
    console.log('--usersService--getUserByFatherId--start--');
    return this.httpservice.postAuthParam(this.entity.getUserByFatherId, params);
  }

  /**
   *  appID,    固定值
   *  appSecret,固定值
   * @param code 
   */
  getWeChatAccess(code: any) {
    console.log('--usersService--getWeChatAccess--start--');
    var filter = { 'code': code, 'appID': this.appID, 'appSecret': this.appSecret }
    return this.httpservice.postParam(this.entity.wechat, filter);
  }

  /**
   * 获取微信用户信息
   * @param accessToken 
   * @param openID 
   * @returns 
   */
  getWeChatUserInfor(accessToken: any, openID: any) {
    console.log('--usersService--getWeChatUserInfor--start--');
    var filter = { 'accessToken': accessToken, 'openID': openID }
    return this.httpservice.postAuthParam(this.entity.wechatUserInfor, filter);
  }

  getWeChatLinkAccess(appID: any, appSecret: any) {
    console.log('--usersService--getWeChatLinkAccess--start--');
    var filter = { 'appID': appID, 'appSecret': appSecret }
    return this.httpservice.postAuthParam(this.entity.wechatLink, filter);
  }

  /*getWeChatSignature(accessToken){
   
    var filter={ 'accessToken':accessToken }
    return new Promise((resolve, reject) => {
   
      let headers = new Headers();
      headers.append('Authorization', this.authService.token);
  
      this.http.post(url+'wechatTicket/',filter, {headers: headers})
       // .map(res => res.json())
        .subscribe(res => {
            let data = res.json();
            resolve(data);
            console.log ('data', data)
        }, (err) => {
          reject(err);
          console.log ('err',err)
        });
    });
  
  }*/

  getProviderMails(filter: any) {
    console.log('--usersService--getProviderMails--start--');
    return this.httpservice.postAuthParam(this.entity.getProviderMails, filter);
  }

  getPhoto(user: any) {
    console.log('--usersService--getPhoto--start--');
    return this.utilService.getHttpUrl(user.photo);
  }

  getVisitsByProvider(filter: any) {
    console.log('--usersService--getVisitsByProvider--start--');
    return this.httpservice.postAuthParam(this.entity.getVisitsByProvider, filter);
  }

  getVisitsBySelectedProvider(filter: any) {
    console.log('--usersService--getVisitsBySelectedProvider--start--');
    return this.httpservice.postAuthParam(this.entity.getVisitsBySelectedProvider, filter);
  }

  getPatientMailsFromProviders(filter: any) {
    console.log('--usersService--getPatientMailsFromProviders--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientMailsFromProviders, filter);
  }

  getPatientMails(filter: any) {
    console.log('--usersService--getPatientMails--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientMails, filter);
  }

  getUsers() {
    console.log('--usersService--getUsers--start--');
    return this.httpservice.getAuth(this.entity.users);
  }

  getWeChatSignature(publishUrl: any) {
    console.log('--usersService--getWeChatSignature--start--');
    var filter = { "url": publishUrl }
    return this.httpservice.postAuthParam(this.entity.usersSignature, filter);
  }

  getByFilter(filter: any) {
    console.log('--usersService--getByFilter--start--');
    // return this.httpservice.postAuthParam(this.entity.usersFilter, filter);
    return this.httpservice.post(this.entity.usersFilter, filter);
  }

  getUserProfiles(filter: any) {
    console.log('--usersService--getUserProfiles--start--');
    return this.httpservice.postAuthParam(this.entity.getUserProfiles, filter);
  }

  getlabItems(filter: any) {
    console.log('--usersService--getlabItems--start--');
    return this.httpservice.postAuthParam(this.entity.usersGetlabItems, filter);
  }

  getProviders(filter: any) {
    console.log('--usersService--getProviders--start--');
    return this.httpservice.postAuthParam(this.entity.getProviders, filter);
  }

  getCount(filter: any) {
    console.log('--usersService--getCount--start--');
    return this.httpservice.postAuthParam(this.entity.usersCount, filter);
  }

  getDailyPatients(days: any) {
    console.log('--usersService--getDailyPatients--start--');
    var dayNumber = { days: days };
    return this.httpservice.postAuthParam(this.entity.dailyPatients, dayNumber);
  }

  getMonthlyPatients(filter: any) {
    console.log('--usersService--getMonthlyPatients--start--');
    return this.httpservice.postAuthParam(this.entity.monthlyPatients, filter);
  }

  getMonthlyPatientsByProvider(filter: any) {
    console.log('--usersService--getMonthlyPatientsByProvider--start--');
    return this.httpservice.postAuthParam(this.entity.getMonthlyPatientsByProvider, filter);
  }

  getCountByService(filter: any) {
    console.log('--usersService--getCountByService--start--');
    return this.httpservice.postAuthParam(this.entity.getCountByService, filter);
  }

  getUsersByRole(role: any) {
    console.log('--usersService--getUsersByRole--start--');
    return this.httpservice.postAuthParam(this.entity.usersRole, role);
  }

  getUserByEmail(email: any) {
    console.log('--usersService--getUserByEmail--start--');
    return this.httpservice.postAuthParam(this.entity.usersMail, email);
  }

  /**
   * 校验邮箱是否已经存在
   * @param filter {email: ''}
   * @returns 
   */
  checkEmailIsInUse(filter: any){
    console.log('--usersService--checkEmailIsInUse--start--');
    return this.httpservice.postParam(this.entity.checkEmailIsInUse, filter);
  }

  getPatientsByProfileService(profile: any, service: any) {
    console.log('--usersService--getPatientsByProfileService--start--');
    var filter = {
      'profiles': { $elemMatch: { _id: profile._id } },
      'serviceList': { $elemMatch: { _id: service._id } },
      'role': 'patient'
    };
    return this.httpservice.postAuthParam(this.entity.usersProfile, filter);
  }

  getWithDetailByFilter(filter: any) {
    console.log('--usersService--getWithDetailByFilter--start--');
    // return this.httpservice.postAuthParam(this.entity.getWithDetailByFilter, filter);
    return this.httpservice.post(this.entity.getWithDetailByFilter, filter);
  }


  getPatientsByProfile(filter: any) {
    console.log('--usersService--getPatientsByProfile--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientsByProfile, filter);
  }

  getPatientsByService(profile: any, service: any) {
    console.log('--usersService--getPatientsByService--start--');
    var filter = {
      'profiles': { $elemMatch: { _id: profile._id } },
      'serviceList': { $elemMatch: { _id: service._id } },
      'role': 'patient'
    };
    return this.httpservice.postAuthParam(this.entity.usersProfile, filter);
  }

  createUser(user: any) {
    console.log('--usersService--createUser--start--');
    return this.httpservice.postAuthParam(this.entity.users, user);
  }

  getProfilePhoto(ID: any) {
    console.log('--usersService--getProfilePhoto--start--');
    console.log('id in provider', ID)
    return this.httpservice.postAuthParam(this.entity.getProfilePhoto, { userId: ID });
  }

  updateUser(user: any) {
    console.log('--usersService--updateUser--start--');
    return this.httpservice.postAuthParam(this.entity.usersupdate, user);
  }

  updateUser1(user: any) {
    console.log('--usersService--updateUser--start--');
    return this.httpservice.postParam(this.entity.usersupdate, user);
  }

  deleteUser(id: any) {
    console.log('--usersService--deleteUser--start--');
    return this.httpservice.deleteAuth(this.entity.users + id);
  }

  findUserById(id: any) {
    console.log('--usersService--findUserById--start--');
    // return this.httpservice.getAuth(this.entity.users + id);
    return this.httpservice.get(this.entity.users + id);
  }

  query(objList: any, search: any) {
    console.log('--usersService--query--start--');
    console.log('name', search)
    let temp = [];
    for (let obj of objList) {
      if (obj.name.search(search) != -1) {
        if (temp.indexOf(obj) == -1) {

          this.getProfilePhoto(obj._id).then((data) => {
            obj.profilePic = data;
            obj.profilePic = obj.profilePic._body

          }, (err) => {
            console.log(err);
          });
          temp.push(obj)

        }
      }
      if (obj.specialty != undefined && obj.specialty.search(search) != -1) {
        if (temp.indexOf(obj) == -1) {
          this.getProfilePhoto(obj._id).then((data) => {
            obj.profilePic = data;
            obj.profilePic = obj.profilePic._body

          }, (err) => {
            console.log(err);
          });
          temp.push(obj)
        }
      }

    }
    console.log('--usersService--query--end--');
    return temp;
  }

  /**
   * 根据手机号校验是否与用户关联(根据手机号是否能够查询到用户,如果查询到了则返回code=1)
   * @param phone 手机号
   */
  getUserByPhone(phone: any) {
    console.log('--usersService--getUserByPhone--start--');
    // { code: 1, msg: '有用户与该手机号关联' }
    var phoneObj={'phone': phone}
    return this.httpservice.postParam(this.entity.usersPhone, phoneObj);
  }

  /**
   * 根据手机号查询所有关联的用户信息
   * @param phone 手机号
   */
   getUsersByPhone(phone: any) {
    console.log('--usersService--getUserByPhone--start--');
    // { code: 1, msg: '有用户与该手机号关联' }
    var phoneObj={'phone': phone}
    return this.httpservice.postParam(this.entity.getUsersByPhone, phoneObj);
  }

  /**
   * 更改用户密码接口
   * @param userInfo {id: '用户id', password: '新密码'}
   */
  updateUserPassword(userInfo: any){
    console.log('--usersService--updateUserPassword--start--');
    // { code: 1, msg: '更改成功' }  { code: -1, msg: '更改失败' }
    return this.httpservice.postParam(this.entity.updateUserPassword, userInfo);
  }

  /**
   * 更改用户密码接口
   * @param userInfo {id: '用户id', password: '新密码'}
   */
   updateUserPasswordAuth(userInfo: any){
    console.log('--usersService--updateUserPassword--start--');
    // { code: 1, msg: '更改成功' }  { code: -1, msg: '更改失败' }
    return this.httpservice.postAuthParam(this.entity.updateUserPassword, userInfo);
  }
  
  /**
   * 校验用户原密码准确性
   * @param user {id: '用户id', password: '原密码'}
   */
  checkUserPassword(user: any){
    console.log('--usersService--checkUserPassword--start--');
    // { code: 1, msg: '校验正确' }  { code: -1, msg: '校验错误' }
    return this.httpservice.postParam(this.entity.checkUserPassword, user);
  }
}