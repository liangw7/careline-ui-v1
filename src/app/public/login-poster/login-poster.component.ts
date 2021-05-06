import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllServices, WechatJssdkConfig } from 'src/app/core/common-services';
import { ShortMessageModel } from 'src/app/core/models/shortMessage';
import { User } from 'src/app/core/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'login-poster',
  templateUrl: './login-poster.component.html',
  styleUrls: ['./login-poster.component.scss']
})
export class LoginPosterComponent implements OnInit, OnDestroy {
  /** -----------微信公众号授权登录业务说明----------- */
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
  /** -----------微信公众号授权登录业务说明----------- */

  isCreateFamilyMember: any;
  bindUser: any; // 是否绑定已注册平台用户标识
  phone: any; // 绑定平台已经注册过的手机号信息
  sentVerify: any;
  verificationCode: any;
  countDown = false; // 按钮是否可点击
  countDownTime = 300; //倒计时
  showButtonText = '发送短信验证码'; //按钮文字内容
  phoneIsInuser: boolean = false;
  userId: any;// 要绑定账户的id
  healthCareWorkerRoles: any;// 医生对应的角色
  allFamilyMembers: any;// 对应患者所有家庭成员信息
  childrenMembers: any;// 家庭成员中符合儿童的家庭成员集合

  email: string | string[] | undefined;
  password: string | undefined;
  user: any;
  patient: any;
  registry: any;
  bigScreen: any;
  screenHeight: any;
  screenWidth: any;
  serviceList: any;
  temp: any;
  providerList: any;
  newPatient: any;
  service: any;
  profile: any;
  provider: any;
  selectedIndex: any;
  registryList: any;
  color: any;
  loading: any;
  error: any;
  popOut: any;
  register: any;
  registryForm: any;
  // 项目使用人员类别标识: patient:成人 child:小孩 provider:医生加盟
  profileRole: any;
  newProvider: any;
  consult: any;
  subscription: Subscription = new Subscription;
  language: any;
  code: any;
  weChatAccess: any;
  profiles: any;
  access: any;
  educations: any;
  forms: any;
  weChatUserInfor: any;
  appID: any;
  appSecrete: any;
  patientCare: any;
  patientFolder: any;
  from: any;
  senderID: any;
  mailRole: any;
  visit: any;
  registryForms: any;
  openID: any;
  loadWords: any;
  followup: any;
  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public location: Location,
    public route: ActivatedRoute,
    private dialogRef: MatDialogRef<LoginPosterComponent>,
    private shortMessage: ShortMessageModel = new ShortMessageModel,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.healthCareWorkerRoles = environment.healthCareWorkerRoles;
    this.bigScreen = this.storage.get('bigScreen');

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
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      // 重定向后获取url中参数方法,获取code判断用户是否确认了微信授权登录
      this.code = params['code'];
      console.log('this.code', this.code)
    });

    if (!this.profileRole) { // 项目使用人员类别标识: patient:成人 child:小孩(跳转到添加家庭成员页面进行操作)
      this.profileRole = this.storage.get('role');
    }
    if (!this.profiles) {// 项目s
      this.profiles = this.storage.get('profiles');
      console.log('this.profiles-1', this.profiles);
    }
    if (!this.profile) {// 项目
      this.profile = this.storage.get('profile');
    }
    if (!this.forms) {// 项目注册表单
      this.forms = this.storage.get('forms');
    }
    if (!this.service) {// 工作室
      this.service = this.storage.get('service');
    }
    // 患者教育---文章绑定到患者信息中
    this.educations = this.storage.get('educations');
    // 负责医生
    this.provider = this.storage.get('provider');
  }

  ngOnInit() {
    this.titleService.setTitle('数基健康');
    this.user = this.storage.get('user');
    if (this.user) {
      this.user = undefined;
      this.storage.set('user', undefined);
      this.storage.remove('user')
    }
    console.log('this.user', this.user);
    // 根据校验code是否存在,判断用户是否确认授权登录
    // 4：重定向到公众号，并返回code。
    if (this.code) {
      // 用户已经同意授权登录,则继续执行后续操作
      this.mailRole = this.storage.get('mailRole');// 公众号推送消息,信息接收者的角色
      this.senderID = this.storage.get('senderID');// 发消息人员的user._id
      this.checkRole();
    } else {
      // 如果没有同意授权登录,则需要提示用户,不授权登录无法执行后续操作;
      if (this.bigScreen && this.bigScreen == 0) {
        this.mailRole = this.route.snapshot.paramMap.get('role');// 项目类别公众号推送消息,信息接收者的角色
        this.storage.set('mailRole', this.mailRole);
        this.senderID = this.route.snapshot.paramMap.get('senderID');// 发消息人员的user._id
        this.storage.set('senderID', this.senderID);

        let confirmData = {
          title: '温馨提示', //标题  选填 默认值为提示
          content: '由于您未在微信端同意授权登录,则不能继续后续操作.是否需要重新授权操作?', //内容  必填 询问的内容
        }
        this.allService.alertDialogService.confirm(confirmData).subscribe(res => {
          if (res) {// 确定调用方法
            window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
          } else {// 取消调用方法
            this.router.navigate(['/public-platform/homepage/login'])
          }
        });
      }
    }
  }

  checkRole() {
    this.loading = true;
    // 5：公众号通过code获取网页授权access_token。
    this.allService.usersService.getWeChatAccess(this.code).then((data: any) => {
      // 微信授权登录返回参数
      // { access_token: '',
      //  expires_in: 7200,
      //  refresh_token: '',
      //  openid: '',
      //  scope: '',
      //  unionid: '' }
      this.weChatAccess = data;

      // if it is within wechat
      if (this.weChatAccess) {
        if (this.weChatAccess.openid) {
          this.openID = this.weChatAccess.openid;
          console.log('this.wechat access', this.weChatAccess);
          this.storage.set('openID', this.weChatAccess);
        }
        let weChatID: string | null = null;
        if (this.weChatAccess.unionid) {
          weChatID = this.weChatAccess.unionid;
        } else {
          weChatID = this.weChatAccess.openid;
        }
        // 根据weChatID去user信息中查询是否存在对应用户信息
        if (weChatID) {
          this.allService.usersService.getWithDetailByFilter({ weChatID: weChatID }).then((data: any) => {
            this.access = data;
            console.log('this.access', this.access);
            // 如果可以查询到信息,说明已经通过微信在平台注册过了
            if (this.access.length > 0) {
              /**
               * this.profileRole = patient/child
               * 患者咨询绑定项目标识
               * this.profileRole = provider
               * 医生加盟绑定项目标识
               */
              if (this.profileRole) {
                if (this.profileRole == 'patient') {
                  if (this.findRole(this.profileRole, this.access)) {
                    // 如果已经注册过,直接修改用户信息即可;
                    this.login(this.getUserByRole(this.access, 'patient'), true);
                  } else {
                    // 如果没有注册过,需要携带所有需要的参数路由跳转到登录页面注册部分
                    const content = '您还未在本平台注册用户,是否前往注册?'
                    this.goToRegistryKnowRole(content, 0);
                  }
                }

                if (this.profileRole == 'child') {
                  this.getUserRoleState(this.access);
                  if (this.childrenMembers) {
                    // 如果该账号及其家庭成员账号中存在儿童,这绑定到该儿童下;

                    // 如果是多条数据,需要用户选择对应人员后进行绑定
                    // 通过调用组件将多条用户信息展示出来,由用户选择后进行登录操作
                    let dialogConfig = new MatDialogConfig();
                    dialogConfig.autoFocus = true;
                    if (this.bigScreen == 1) {
                      dialogConfig.data = {
                        'users': this.childrenMembers,
                        'language': this.language
                      }
                      dialogConfig.position = { top: '5%', left: '60%' };
                    } else {
                      dialogConfig = {
                        data: {
                          'users': this.childrenMembers,
                          'language': this.language
                        },
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        height: '100%',
                        width: '100%'
                      }
                    }

                    this.loading = false;
                   /* const dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);
                    dialogRef.afterClosed().subscribe((result: { user: { email: string | string[]; sortNumber: string; }; }) => {
                      if (result) {
                        console.log('result.user', result.user)
                        this.loadWords = '开始登录';
                        this.login(result.user, false);
                      }
                    })*/
                  } else {
                    // 如果没有儿童,需要登录后跳转到添加家庭成员功能出进行绑定
                    this.isCreateFamilyMember = true;
                    this.login(this.getUserByRole(this.access, 'patient'), false);
                  }
                }

                if (this.profileRole == 'provider') {
                  if (this.findRole(this.profileRole, this.access)) {
                    // 如果已经注册过,直接修改医护工作者信息即可;
                    this.login(this.getUserByRole(this.access, 'provider'), true);
                  } else {
                    // 如果没有注册过,需要携带所有需要的参数路由跳转到登录页面注册部分
                    const content = '您还未在本平台注册过医护工作者,是否前往注册?'
                    this.goToRegistryKnowRole(content, 1);
                  }
                }
              } else {//directly scan
                if (this.access.length == 1) {
                  this.loading = false;
                  this.login(this.access, false);
                } else if (this.access.length > 1) {

                  // 通过调用组件将多条用户信息展示出来,由用户选择后进行登录操作
                  let dialogConfig = new MatDialogConfig();
                  dialogConfig.autoFocus = true;
                  if (this.bigScreen == 1) {
                    dialogConfig.data = {
                      'users': this.access,
                      'language': this.language
                    }
                    dialogConfig.position = { top: '5%', left: '60%' };
                  } else {
                    dialogConfig = {
                      data: {
                        'users': this.access,
                        'language': this.language
                      },
                      maxWidth: '100vw',
                      maxHeight: '100vh',
                      height: '100%',
                      width: '100%'
                    }
                  }

                  this.loading = false;
                /*  const dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);
                  dialogRef.afterClosed().subscribe((result: { user: { email: string | string[]; sortNumber: string; }; }) => {
                    if (result) {
                      console.log('result.user', result.user)
                      this.loadWords = '开始登录';
                      this.login(result.user, false);
                    }
                  })*/
                }
              }
            } else {// 没有在平台绑定过微信或者从未在平台注册过
              // 弹窗提示用户是否在平台注册过
              this.goToRegistryUnknowRole();
            }
          })
        }
      }
    }, (err: any) => {
      console.log('not login we wechat')
      this.allService.alertDialogService.warn('请登录微信')
    })
  }

  goToRegistryUnknowRole() {
    let data = {
      title: '温馨提示', //标题  选填 默认值为提示
      content: '是否已经在平台注册过账号？', //内容  必填 询问的内容
      button: '是', //确定按钮文字  选填  默认值为确定
      cancel: '否'//取消按钮文字  选填  默认值为取消
    }
    this.allService.alertDialogService.confirm(data).subscribe(res => {
      if (res) {//确定调用方法
        // 将已经注册过的账号与微信账号进行绑定
        this.bindUser = true;
      } else {// 取消调用方法
        // 新注册账号
        // 弹窗提示用户是否在平台注册过
        data = {
          title: '注册提示', //标题  选填 默认值为提示
          content: '您要注册平台的角色是?', //内容  必填 询问的内容
          button: '医护工作者', //确定按钮文字  选填  默认值为确定
          cancel: '普通用户' //取消按钮文字  选填  默认值为取消
        }
        this.allService.alertDialogService.confirm(data).subscribe(res => {
          // 跳转到login组件,隐藏前端内容,直接显示登录
          let registryUserInfo = new User;
          registryUserInfo.weChatID = this.weChatAccess.unionid;
          registryUserInfo.openID = this.weChatAccess.openid;
          let queryParams = {
            userType: 1,
            isRegister: true,
            isShowPhone: false,
            isShowEmail: false,
            loginRoleSelect: false,
            IsLoginWays: false,
            isLoginPosterIn: true,// 不显示注册内容中的返回按钮
            registryUserInfo: registryUserInfo,
          }
          if (res) {// 确定调用方法
            // 医护工作中注册
            queryParams.userType = 1;
            this.router.navigate(['/public-platform/homepage/login'], {
              queryParams
            })
          } else {// 取消调用方法
            // 普通用户注册
            queryParams.userType = 0;
            this.router.navigate(['/public-platform/homepage/login'], {
              queryParams
            })
          }
        });
      }
    });
  }

  /**
   * 未注册的需要带着参数跳转到登录注册页面走注册流程
   * @param content 提示内容
   * @param userType 要注册的角色: patient/provider
   */
  goToRegistryKnowRole(content: any, userType: any) {
    let data = {
      title: '温馨提示', //标题  选填 默认值为提示
      content: content, //内容  必填 询问的内容
      button: '是', //确定按钮文字  选填  默认值为确定
      cancel: '否'//取消按钮文字  选填  默认值为取消
    }
    this.allService.alertDialogService.confirm(data).subscribe(res => {
      // 跳转到login组件,隐藏前端内容,直接显示登录
      let registryUserInfo = new User;
      if (userType == 0) {
        registryUserInfo = this.bindItems(registryUserInfo);
      } else {
        if (this.profile) {
          registryUserInfo.profiles.push(this.profile);
        }
      }
      registryUserInfo.weChatID = this.weChatAccess.unionid;
      registryUserInfo.openID = this.weChatAccess.openid;
      this.allService.usersService.getWeChatUserInfor(this.weChatAccess.access_token,
        this.weChatAccess.openid).then(data => {
          if (this.temp) {
            var gender: any;
            if (this.temp.sex == 1)
              gender = '男';
            else if (this.temp.sex == 2) {
              gender = '女'
            }
            registryUserInfo.gender = gender;
            registryUserInfo.photo = this.temp.headimgurl;
            registryUserInfo.name = this.temp.nickname;

            let queryParams = {
              userType: 1,
              isRegister: true,
              isShowPhone: false,
              isShowEmail: false,
              loginRoleSelect: false,
              IsLoginWays: false,
              isLoginPosterIn: true,// 不显示注册内容中的返回按钮
              registryUserInfo: registryUserInfo,
            }
            if (res) {// 确定调用方法
              // 医护工作中注册
              queryParams.userType = userType;
              this.router.navigate(['/public-platform/homepage/login'], {
                queryParams
              })
            } else {// 取消调用方法
              this.router.navigate(['/public-platform/homepage/main'])
            }
          }
        }, (err: any) => {
          if (err.error instanceof Error) {
            console.log('客户端出错:', err.error.message);
          } else {
            console.log('服务端返回码:' + err.status + ', 返回html:' + err.error);
          }
        });
    });
  }

  /**
   * 根据外部进入的角色,对应查询出是否有存在的用户角色信息
   * @param users 微信绑定的所有用户信息集合
   * @returns 
   */
  async getUserRoleState(users: any) {
    for (let index = 0; index < users.length; index++) {
      const u = users[index];
      if (u.role == 'patient') {
        this.allFamilyMembers = await this.getFamilyUsers(u);
        for (let index = 0; index < this.allFamilyMembers.length; index++) {
          const memnber = this.allFamilyMembers[index];
          if (memnber.age <= 18) {// 如果本患者年龄符合儿童年龄要求,返回1
            this.childrenMembers.push(memnber);
          }
        }
      }
    }
  }

  /**
   * 根据外部进入的角色,对应查询出是否有存在的用户角色信息
   * @param users 微信绑定的所有用户信息集合
   * @returns 
   */
  getUserByRole(users: any, role: any) {
    for (let index = 0; index < users.length; index++) {
      const u = users[index];
      if (u.role == role) {
        return u;
      }
    }
  }

  /**
   * 根据患者信息,查询其家庭成员信息
   * @param user 患者用户信息
   * @returns 该患者和他的家庭成员信息集合
   */
  getFamilyUsers(user: any) {
    return new Promise((resolve, reject) => {
      let allMembers: any = null;
      let params = {
        father_id: user._id
      }
      this.allService.usersService.getUserByFatherId(params).then((data1: any) => {
        if (data1 && data1.code == 1) {
          allMembers = data1.data;
          if (Array.isArray(allMembers)) {
            allMembers.concat(user);
          } else {
            let arrays: any[] = [];
            arrays.push(...data1.data);
            arrays.push(user);
            allMembers = arrays;
          }
          console.log('allMembers------', allMembers);
        }
        resolve(allMembers);
      }, (err: any) => {
        reject(err);
      });
    });

  }


  /**
   * 
   * @param role 绑定项目对应的项目类别
   * @param accounts 
   * @returns 
   */
  findRole(role: any, accounts: any) {
    let flag = false;
    for (let account of accounts) {
      if (role == 'patient' && account.role == role) {
        flag = true;
      } else {
        for (let index = 0; index < this.healthCareWorkerRoles; index++) {
          const healthCareWorker = this.healthCareWorkerRoles[index];
          if (healthCareWorker == role) {
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }

  /**
   * 登录+修改用户信息方法
   * @param user 需要登录的用户信息
   * @param updateFlag 是否需要更新用户标识
   */
  login(user: any, updateFlag: boolean) {
    this.loading = true;
    let credentials = {
      email: this.weChatAccess.unionid,
      password: '1',// 不给默认值后台报错
      role: ''
    };
    if (user.role) {
      credentials.role = user.role;
    }
    this.allService.authService.login(credentials).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.user = this.storage.get('user');
      this.storage.set('openID', this.openID);
      this.color = this.user.color;
      this.storage.set('color', this.color);
      if (updateFlag) {
        this.allService.usersService.updateUser(this.user).then((data: any) => {
          this.loading = false;
          this.allService.sharedRoleService.sendUserRole('provider');
          this.redirectRoute(user);
        })
      }else{
        // 跳转路由方法
        this.loading = false;
        this.redirectRoute(user);
      }
    }, (err: any) => {
      console.log("Not already authorized");
      this.error = '登录错误';
      this.loading = false;
    });
  }

  /**
   * 跳转路由地址方法
   * @param user user信息
   */
  redirectRoute(user: any) {
    if (user.role != 'patient') {
      this.allService.sharedRoleService.sendUserRole('provider')
      if (this.bigScreen == 0) {
        if (this.consult == true || this.mailRole) {
          this.loadWords = '登录成功!!正在打开咨询室 请稍等...';
          this.router.navigate(['/provider-platform/provider/consult-list']);
        } else {
          this.loadWords = '登录成功!';
          this.router.navigate(['/provider-platform/provider/provider-folder']);
        }
      } else if (this.bigScreen == 1) {
        this.router.navigate(['/provider-platform/provider/dashboard']);
      }
    } else {
      this.storage.set('patient', user);
      this.patient = user;
      // 如果需要登录后添加家庭成员
      if (this.isCreateFamilyMember) {
        // /provider-platform/patient/profile
        let userToProfile = new User;
        userToProfile = this.bindItems(userToProfile);
        let queryParams = {
          showProfile: false,
          showForm: false,
          showService: false,
          showFamilyMembers: true,
          showResetPsd: false,
          userToProfile: userToProfile,
        }
        // 跳转到个人信息页面,添加家庭成员
        this.router.navigate(['/provider-platform/patient/profile'], {
          queryParams
        })
      } else {
        if (this.bigScreen == 1) {
          this.allService.sharedRoleService.sendUserRole('patient')
          this.router.navigate(['/provider-platform/patient/provider-list']);
        } else if (this.bigScreen == 0) {
          this.allService.sharedRoleService.sendUserRole('patient');
          this.consult = this.storage.get('consult');
          this.followup = this.storage.get('followup');
          if (this.consult == true || this.mailRole) {
            this.loadWords = '登录成功!!正在打开咨询室 请稍等...';
            this.router.navigate(['/provider-platform/patient/provider-list']);
          } else if (this.followup == true || this.mailRole) {
            this.loadWords = '登录成功!!正在打开每日日志 请稍等...';
            this.router.navigate(['/provider-platform/patient/followups']);
          } else {
            this.loadWords = '登录成功!';
            this.router.navigate(['/provider-platform/patient/patient-story']);
          }
        }
      }
    }
  }

  /**
   * 退出方法
   */
  logout() {
    this.allService.authService.logout('/public-platform/homepage/main');
    this.user = undefined;
  }

  /**
   * 将各种项目等内容绑定到入参的user信息中,并返回user
   * @param user 入参
   * @returns 
   */
  bindItems(user: User) {
    if (this.profile) {
      user.profiles.push(this.profile);
    }
    if (this.service) {
      // registryUserInfo.service = this.service;
      user.serviceList.push(this.service);
    }
    if (this.educations) {
      user.educations.push(this.educations);
    }
    if (this.provider) {
      user.providers.push(this.provider);
    }
    return user;
  }


  addItems(subList: any, list: any) {
    //add subList into list 
    if (!list) {
      list = [];
    }
    for (let subItem of subList) {
      if (!this.allService.utilService.findItem(subItem, list)) {
        list.push(subItem)
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription)
      this.subscription.unsubscribe();
  }


  /**    绑定平台已注册用户逻辑用到的方法在下方    */
  verify() {
    this.sentVerify = true;
  }

  /**
   * 发送验证码方法
   */
  sendMessage() {
    debugger;
    console.log(this.shortMessage);
    if (!this.phone) {
      this.allService.alertDialogService.warn('请输入手机号');
      return;
    }
    if (!this.allService.utilService.checkMobile(this.phone.toString())) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
    this.shortMessage.mobile = this.phone.toString();
    // 先校验该手机号是否与用户有关联,如果有关联,说明该账号已经注册过;需要发送验证码校验是否是本人
    this.allService.usersService.getUserByPhone(this.phone).then((res1: any) => {
      var mobileIsInUse: any = res1;
      console.log('mobileIsInUse', mobileIsInUse)
      if (mobileIsInUse && mobileIsInUse.code == 1) {
        // 如果手机号已经关联用户则继续执行下一步操作
        this.userId = mobileIsInUse.res;
        this.phoneIsInuser = true;
        this.allService.shortMessageService.sendShortMessageForReset(this.shortMessage).then((data: any) => {
          if (data.code == 1) {// 返回code=1则说明发送成功
            this.allService.alertDialogService.alert('验证码已发送');
            this.countDown = true;
            this.showButtonText = '验证码已发送(' + 300 + 's)';
            debugger;
            console.log(data);
            const start = setInterval(() => { //间歇调用计时器，间隔为1000ms
              if (this.countDownTime >= 0) {
                this.showButtonText = '验证码已发送(' + this.countDownTime-- + 's)';
              } else {
                clearInterval(start); // 清除计时器
                this.showButtonText = '重新发送';
                this.countDown = false;
                this.countDownTime = 300;
              }
            }, 1000);
          } else {// 如果没有发送成功则返回提示信息即可
            this.allService.alertDialogService.warn(data.msg);
            return;
          }
        });
      } else {// 如果手机号码没有关联用户,则不会发送短信,返回提示信息即可
        this.phoneIsInuser = false;
        this.allService.alertDialogService.warn('该手机号未注册,请重新输入手机号');
        return;
      }
    });
  }

  /**
   * 已经在平台注册过,需要将此次登录的微信用户绑定到已注册账户中
   * @returns 
   */
  bindUserInfo() {
    if (!this.phone) {
      this.allService.alertDialogService.warn('请输入手机号');
      return;
    }
    if (!this.allService.utilService.checkMobile(this.phone.toString())) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
    if (!this.phoneIsInuser) {
      this.allService.alertDialogService.warn('您还未发送验证码');
      return;
    }
    if (!this.verificationCode) {
      this.allService.alertDialogService.warn('请输入验证码');
      return;
    }
    if (!this.allService.utilService.checkVerificationCode(this.verificationCode)) {
      this.allService.alertDialogService.warn('验证码只能是6位数字，请确认后重新输入');
      return;
    }
    this.shortMessage.mobile = this.phone.toString();
    this.shortMessage.num = this.verificationCode;
    this.allService.shortMessageService.checkShortMessage(this.shortMessage).then((data: any) => {
      if (data.code == 1) {// 返回code=1则说明发送成功
        this.allService.usersService.getUsersByPhone(this.phone).then((data: any) => {
          if (data.length > 0) {
            if (data.length > 1) {
              for (let index = 0; index < data.length; index++) {
                const user = data[index];
                user.openID = this.weChatAccess.openid;
                user.weChatID = this.weChatAccess.unionid;
                this.updateUserAndLogin(user);
              }
            } else {
              data.openID = this.weChatAccess.openid;
              data.weChatID = this.weChatAccess.unionid;
              this.updateUserAndLogin(data);
            }
          }
        });
      } else {// 如果没有发送成功则返回提示信息即可
        this.allService.alertDialogService.warn('验证码错误,请重新输入或刷新页面重新发送');
        return;
      }
    });
  }

  updateUserAndLogin(user: any) {
    return new Promise((resolve, reject) => {
      this.allService.usersService.updateUser(user).then((res: any) => {
        this.loadWords = '绑定成功!正在登录中,请稍后...';
        let params = {
          email: user.weChatID,
          password: '1',// 不给默认值后台报错
          role: user.role
        }
        this.allService.authService.login(params).then((res: any) => {
          // 登录成功后需要进行的操作....
          resolve(res);
        }, (err: any) => {
          reject(err);
        });
      }, (err: any) => {
        reject(err);
      });
    });
  }

}