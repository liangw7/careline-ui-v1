import {
  Component, OnInit, Inject, HostListener, Input, OnDestroy
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllServices, WechatJssdkConfig } from 'src/app/core/common-services';
import { AllModel, User } from 'src/app/core/models';
import { ShortMessageModel } from 'src/app/core/models/shortMessage';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // 微信二维码地址
  wxQrcodeUrl: any;
  // 邮箱
  email!: String;
  // 是否显示邮箱输入框
  isShowEmail: any;
  // 手机号码
  phone!: Number;
  // 是否显示手机输入框
  isShowPhone: any;
  // 登录方式
  loginType: any;
  // 是否显示微信二维码
  isShowWeixinQrcode: any;
  // 是否显示登录选择方式
  IsLoginWays: any;
  // 初始化登录角色 0:患者登录;1:医生登录;
  userType: any;
  // 登录,注册页面显示名称
  viewName: any;
  countDown = false; // 按钮是否可点击
  countDownTime = 300; //倒计时
  showButtonText = '发送短信验证码'; //按钮文字内容
  phoneIsInuser: boolean = false;
  userId: any; // 关联用户的id
  isLoginPosterIn: any;// 如果是logingPoster跳转进来的不显示返回按钮
  registryUserInfo!: User;
  // 是否需要绑定内容
  userBindInfo: User | undefined;
  password!: String;
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
  role: any;
  newProvider: any;
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
  providerLogin: any;
  filter: any;
  isRegister: any;
  registryForms: any;
  isVerified: any;
  sentVerify: any;
  verificationCode: any;
  passwordSecond: any;
  @Input() isService: any;
  @Input() myProjects: any;
  @Input() pageRole: any;
  // 手机端初始化登录页面,需要用户选择角色
  loginRoleSelect: any;

  constructor(
    private allModel: AllModel,
    private wechatJssdkConfig: WechatJssdkConfig,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public location: Location,
    public route: ActivatedRoute,
    private dialogRef: MatDialogRef<LoginComponent>,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private shortMessage: ShortMessageModel = new ShortMessageModel,
  ) {
    this.bigScreen = this.storage.get('bigScreen');
    if (this.bigScreen == 0) {
      // 初始显示登录
      this.loginRoleSelect = true;
    } else {
      this.IsLoginWays = true;
    }
    // 微信二维码地址由model拼接而成
    this.wxQrcodeUrl = this.wechatJssdkConfig.safeSrcUrl1;

    this.route.queryParams.subscribe(params => {
      // 此处注意,如果是poster进来,用户要注册的话,接收数据内容
      if (params['isLoginPosterIn']) {
        alert(params['isLoginPosterIn']);
        this.isRegister = params['isRegister'];
        this.isShowPhone = params['isShowPhone'];
        this.isShowEmail = params['isShowEmail'];
        this.loginRoleSelect = params['loginRoleSelect'];
        this.IsLoginWays = params['IsLoginWays'];
        this.isLoginPosterIn = params['isLoginPosterIn'];// 不显示注册内容中的返回按钮
        this.registryUserInfo = params['registryUserInfo'];
      }
      this.code = params['code'];
      this.userType = params['userType'];
      if (this.userType) {
        if (this.userType == 0) {
          this.viewName = '用户';
        } else {
          this.viewName = '医生';
        }
      }
      console.log('this.userType', this.userType);
      console.log('this.code', this.code);
    });
    this.patientCare = this.storage.get('patient-care')
    this.patientFolder = this.storage.get('patient-folder')
  }

  /**
   * 跳转注册页面方法
   * @returns 
   */
  async goToRegistry() {
    if (!this.phone) {
      this.allService.alertDialogService.warn('请输入手机号');
      return;
    }
    if (!this.allService.utilService.checkMobile(this.phone.toString())) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
    if (!this.email) {
      this.allService.alertDialogService.warn('请输入邮箱');
      return;
    }
    if (!this.allService.utilService.checkEmail(this.email)) {
      this.allService.alertDialogService.warn('邮箱格式错误,请重新输入');
      return;
    }
    if (!this.password) {
      this.allService.alertDialogService.warn('请输入密码');
      return;
    }
    if (!this.passwordSecond) {
      this.allService.alertDialogService.warn('请输入确认密码');
      return;
    }
    if (this.passwordSecond != this.password) {
      this.allService.alertDialogService.warn('两次密码输入不一致,请重新输入');
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
    // 后台查询手机号和邮箱是否已经注册过
    this.allService.usersService.getUserByPhone(this.phone).then((res1: any) => {
      var mobileIsInUse: any = res1;
      console.log('mobileIsInUse', mobileIsInUse)
      if (mobileIsInUse && mobileIsInUse.code != 1) {// 如果手机号未关联用户则继续执行下一步操作
        let filter = {
          email: this.email
        }
        this.allService.usersService.checkEmailIsInUse(filter).then((res2: any) => {
          if (res2 && res2.code != 1) {// 如果邮箱未关联用户则继续执行下一步操作
            this.shortMessage.mobile = this.phone.toString();
            this.shortMessage.num = this.verificationCode;
            this.allService.shortMessageService.checkShortMessage(this.shortMessage).then((data: any) => {
              if (data.code == 1) {// 返回code=1则说明发送成功
                this.registryUserInfo = new User;
                this.registryUserInfo.email = this.email;
                this.registryUserInfo.password = this.password;
                this.registryUserInfo.phone = this.phone + '';

                let queryParams = {
                  registryUser: this.registryUserInfo,
                  userType: this.userType,
                }
                this.router.navigate(['/public-platform/homepage/registry-user'], {
                  queryParams
                })
              } else {// 如果没有发送成功则返回提示信息即可
                this.allService.alertDialogService.warn('验证码错误,请重新输入或刷新页面重新发送');
                return;
              }
            });
          } else {// 如果邮箱没有关联用户,返回提示信息即可
            this.allService.alertDialogService.warn('该邮箱已经注册过,请重新输入邮箱');
            return;
          }
        });
      } else {// 如果手机号码没有关联用户,返回提示信息即可
        this.allService.alertDialogService.warn('该手机号已经注册过,请重新输入手机号');
        return;
      }
    });
  }
  PhoneLogin() {
    this.loginType = 'phoneLogin'
    this.changeLoginType()
  }
  AccountLogin() {
    this.loginType = 'mailLogin'
    this.changeLoginType()
  }
  WxLogin() {
    this.loginType = 'wxLogin'
    this.changeLoginType()
  }

  changeLoginType() {
    this.IsLoginWays = false
    if (this.loginType == 'phoneLogin') {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = true;
      this.isRegister = false;
    } else if (this.loginType == 'mailLogin') {
      this.isShowEmail = true;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = false;
      this.isRegister = false;
    } else if (this.loginType == 'wxLogin') {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = true;
      this.isShowPhone = false;
      this.isRegister = false;
    } else if (this.loginType == 'register') {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = false;
      this.isRegister = true;
    } else {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = false;
      this.isRegister = false;
    }
  }

  ngOnInit() {
    this.userBindInfo = this.route.snapshot.queryParams.userBindInfo;
    console.log(this.userBindInfo);
    this.loginType == 'phoneLogin';
    this.isShowPhone = false;
    console.log('---登录页面---初始化加载方法ngOnInit---begin');
    this.titleService.setTitle('数基健康');
    this.user = this.storage.get('user');
    console.log('this.user', this.user)
    if (this.user) {
      this.allService.authService.checkAuthentication().then((res: any) => {
        if (this.user.role != 'patient') {
          this.router.navigate(['provider']);
        } else {
          this.storage.set('patient', this.user);
          this.router.navigate(['patient']);
        }
      }, (err: any) => {
        console.log("Not already authorized");
      });
    } else {
      /**
       * 此处说明:微信程序可以使客户端也可以是app;
       * 因此此处不需要判断是否是手机端打开;
       * 只要是微信端打开的,就可以微信授权登陆
       * 如果已经是poster过来注册的,不需要再调用poster
       */
      var isWeixin = this.storage.get('isWeixin');
      if (isWeixin) {
        if (!this.isLoginPosterIn) {
          window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
        }
      }
    }
    console.log('---登录页面---初始化加载方法ngOnInit---end');
  }

  verify() {
    this.sentVerify = true;
  }

  close() {
    this.dialogRef.close();
  }

  login() {
    if (!this.loginType) {
      this.allService.alertDialogService.warn('请选择登录方式');
      return;
    }
    let username = null;
    if (this.loginType == 'phoneLogin') {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(String(this.phone)))) {
        this.allService.alertDialogService.warn("手机号码不正确，请重新输入");
        return;
      } else {
        username = this.phone;
      }
    } else if (this.loginType == 'mailLogin') {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (reg.test(String(this.email))) {
        username = this.email;
      } else {
        this.allService.alertDialogService.warn("邮箱格式不正确");
        return;
      }
    }
    if (!this.password) {
      this.allService.alertDialogService.warn("密码不能为空!");
      return;
    }
    let credentials = {
      email: username,
      password: this.password,
      role: ''
    };
    if (this.userType == 0) {
      credentials.role = 'patient'
    } else if (this.userType == 1) {
      credentials.role = 'provider'
    } else {
      this.allService.alertDialogService.warn("系统异常");
      return;
    }
    // 新窗口打开页面
    this.loading = true;
    this.allService.authService.login(credentials).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.user = this.storage.get('user');
      if (this.userBindInfo) {
        if (this.userType == 0) {
          this.user = this.bindItems(this.user, this.userBindInfo);
        } else {
          if (this.userBindInfo.profiles) {
            this.user.profiles.push(this.userBindInfo.profiles);
          }
          if (this.userBindInfo.service) {
            this.user.service = this.userBindInfo.service;
          }
        }
        this.allService.usersService.updateUser(this.user);//running behind
      }
      this.color = this.user.color;
      this.storage.set('color', this.color);

      if (this.user.role != 'patient') {
        this.allService.sharedRoleService.sendUserRole('provider')
        if (this.bigScreen == 0) {
          if (this.myProjects == true) {
            this.router.navigate(['project-admin']);
          } else {
            this.router.navigate(['provider/provider-folder']);
          }
        } else if (this.bigScreen == 1) {
          if (this.myProjects == true) {
            this.router.navigate(['project-admin']);
          } else {
            this.router.navigate(['provider/dashboard']);
          }
          console.log('login user', this.user);
        }
      } else {
        this.storage.set('patient', this.user);
        this.patient = this.user;
        if (this.bigScreen == 1) {
          this.allService.sharedRoleService.sendUserRole('patient')
          this.router.navigate(['patient/patient-story']);
        } else if (this.bigScreen == 0) {
          this.allService.sharedRoleService.sendUserRole('patient')
          this.router.navigate(['patient/patient-story']);
        }
      }
    }, (err: any) => {
      console.log(err);
      console.log("Not already authorized");
      this.error = '登录错误';
      if (this.userType == 0) {
        this.allService.alertDialogService.warn('用户名/密码错误,或者您还未注册用户,请确认后再次登录');
      }
      if (this.userType == 1) {
        this.allService.alertDialogService.warn('用户名/密码错误,或者您还未注册医生,请确认后再次登录');
      }
      this.loading = false;
    });

  }

  /**
   * 将各种项目等内容绑定到入参的user信息中,并返回user
   * @param user 入参
   * @returns 
   */
  bindItems(user: any, inputUser: User) {
    if (inputUser.profiles) {
      user.profiles.push(inputUser.profiles);
    }
    if (inputUser.service) {
      // registryUserInfo.service = this.service;
      user.serviceList.push(inputUser.service);
    }
    if (inputUser.educations) {
      user.educations.push(inputUser.educations);
    }
    if (inputUser.providers) {
      user.providers.push(inputUser.providers);
    }
    return user;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  /**
   * 发送验证码方法
   */
  sendMessage() {
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
    // 先校验该手机号是否与用户有关联,如果有关联,说明该账号已经注册过,则没有必要发短信
    this.allService.usersService.getUserByPhone(this.phone).then((res1: any) => {
      var mobileIsInUse: any = res1;
      console.log('mobileIsInUse', mobileIsInUse)
      if (mobileIsInUse && mobileIsInUse.code != 1) {// 如果手机号未关联用户则继续执行下一步操作
        this.phoneIsInuser = true;
        this.userId = mobileIsInUse.res;
        this.allService.shortMessageService.sendShortMessageForReset(this.shortMessage).then((data: any) => {
          if (data.code == 1) {// 返回code=1则说明发送成功
            this.allService.alertDialogService.alert('验证码已发送');
            this.countDown = true;
            this.showButtonText = '验证码已发送(' + 300 + 's)';
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
        this.allService.alertDialogService.warn('该手机号已经注册过,请重新输入手机号');
        return;
      }
    });
  }
}