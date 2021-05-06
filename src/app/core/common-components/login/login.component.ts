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
import { MessageBoxComponent } from 'src/app/core/common-components/message-box/message-box.component';
import { AllModel } from 'src/app/core/models';

@Component({
  selector: 'app-login',
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
  @Input() isService: any;
  @Input() myProjects: any;
  @Input() pageRole: any;


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
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    // 初始显示登录
    this.IsLoginWays = true;
    this.bigScreen = this.storage.get('bigScreen');
    // 微信二维码地址由model拼接而成
    this.wxQrcodeUrl = this.wechatJssdkConfig.safeSrcUrl1;

    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.code = params['code'];
      console.log('this.code', this.code)
    });
    this.patientCare = this.storage.get('patient-care')
    this.patientFolder = this.storage.get('patient-folder')
    if (this.profiles) {
      this.storage.set('profiles', this.profiles)
    } else {
      this.profiles = this.storage.get('profiles')
    }
    console.log('this.profiles-1', this.profiles)
    if (this.profile) {
      this.storage.set('profile', this.profile)
    } else {
      this.profile = this.storage.get('profile')
    }
    if (this.forms) {
      this.storage.set('forms', this.forms)
    } else {
      this.forms = this.storage.get('forms')
    }
    if (this.educations) {
      this.storage.set('educations', this.educations)
    } else {
      this.educations = this.storage.get('educations')
    }
    if (this.service) {
      this.storage.set('service', this.service)
    } else {
      this.service = this.storage.get('service')
    }

    if (this.provider) {
      this.storage.set('provider', this.provider)
    } else {
      this.provider = this.storage.get('provider')
    }

    if (this.role) {
      this.storage.set('role', this.role);
    }

    if (!this.role) {
      this.role = this.storage.get('role');

    }

    console.log('this.role set', this.role)
    // this.getScreenSize();
    // this.bigScreen = 0
    // console.log('this.screenWidth', this.screenWidth)
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    // console.log('this.bigScreen', this.bigScreen);

    this.language = this.storage.get('language');

    if (!this.language) {
      this.subscription = this.allService.sharedDataService.dataSent$.subscribe(
        (language: any) => {
          this.language = language;
          // this.storage.set('bigScreen', this.bigScreen)
        });
    }
    console.log('language', this.language);
  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   // console.log(this.screenHeight, this.screenWidth);

  // }
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
    } else if (this.loginType == 'mailLogin') {
      this.isShowEmail = true;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = false;
    } else if (this.loginType == 'wxLogin') {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = true;
      this.isShowPhone = false;
    } else {
      this.isShowEmail = false;
      this.isShowWeixinQrcode = false;
      this.isShowPhone = false;
    }
  }

  ngOnInit() {
    console.log('---登录页面---初始化加载方法ngOnInit---begin');
    this.titleService.setTitle('数基健康');
    this.user = this.storage.get('user');
    console.log('this.user', this.user)
    //  alert('this.code1 '+this.code)
    // if (this.user && this.user.email != 'liangw0730@gmail.com') {
    if (this.user) {
      if (this.user.father_id) {
        this.allService.usersService.findUserById(this.user.father_id).then((data: any) => {
          if (data) {
            if (data.email) {
              this.email = data.email;
              this.AccountLogin();
            }
            if (data.phone) {
              this.phone = data.phone;
              this.PhoneLogin();
            }
          } else {
            this.allService.alertDialogService.alert(data.msg);
          }
        })
      }else{
        this.allService.authService.checkAuthentication().then((res: any) => {
          if (this.user.role != 'patient') {
            this.router.navigate(['provider-platform/provider']);
          } else {
            this.storage.set('patient', this.user);
            this.router.navigate(['provider-platform/patient']);
          }
        }, (err: any) => {
          console.log("Not already authorized");
        });
      }
    }
    // else if (this.user && this.user.email == 'liangw0730@gmail.com') {
    //   this.router.navigate(['provider-platform/my-projects/home']);
    // } 
    // else if (!this.user && this.code) {
    else {
      if (this.code) {
        //this is for wechat scan have with existing code assinged by wechat
        this.loading = true;
        // 从配置model文件中获取appid和APPSecret信息
        // if (this.bigScreen == 1) {
        //   this.appID = this.wechatJssdkConfig.appID1;
        //   this.appSecrete = this.wechatJssdkConfig.appSecrete1;
        // } else if (this.bigScreen == 0) {
        //   this.appID = this.wechatJssdkConfig.appID0;
        //   this.appSecrete = this.wechatJssdkConfig.appSecrete0;
        // }
        this.allService.usersService.getWeChatAccess(this.code).then((data: any) => {
          this.weChatAccess = data;
          console.log('this.wechat access', this.weChatAccess);
          if (this.weChatAccess) {
            this.storage.set('openID', this.weChatAccess);
            if (this.weChatAccess.unionid) {
              var weChatID = this.weChatAccess.unionid;
            } else {
              weChatID = this.weChatAccess.openid;
            }

            this.allService.usersService.getByFilter({ weChatID: weChatID }).then((data: any) => {
              this.access = data;
              //if user has more than 0 acccount, 
              if (this.access.length > 0) {
                this.allService.usersService.getWeChatUserInfor(this.weChatAccess.access_token, this.weChatAccess.openid).then((data: any) => {
                  this.weChatUserInfor = data;
                  //if user has only one account
                  //register
                  if (this.role) {
                    console.log('role', this.role)
                    //this.role includes child
                    this.email = this.access[0].weChatID + this.role + '@db.com';
                    this.password = this.access[0].weChatID + this.role;
                    if (this.findRole(this.role, this.access)) {
                      if (this.role == 'patient' || this.role == 'child') {
                        this.updatePatient();
                      }
                      if (this.role == 'provider') {
                        this.updateProvider();
                      }
                    } else {
                      if (this.role == 'patient' || this.role == 'child') {
                        this.createPatient();
                      }
                      if (this.role == 'provider') {
                        this.createProvider();
                      }

                    }
                  } else if (!this.role) {
                    if (this.access.length == 1) {
                      this.email = this.access[0].email;
                      this.password = this.access[0].weChatID + this.access[0].role;
                      this.loading = false;
                      this.login();
                    } else if (this.access.length > 1) {
                      const dialogConfig = new MatDialogConfig();

                      // dialogConfig.disableClose = true;
                      var selectRole = []
                      dialogConfig.autoFocus = true;
                      for (let item of this.access) {
                        selectRole.push(item.role)
                      }

                      dialogConfig.data = {
                        'selectRole': selectRole,
                        'language': this.language
                      };

                      if (this.bigScreen == 1) {
                        dialogConfig.position = { top: '5%', left: '60%' };
                      } else {
                        dialogConfig.position = { top: '10%', left: '5%' };
                      }

                      this.loading = false;
                      const dialogRef = this.dialog.open(MessageBoxComponent,
                        dialogConfig);
                      dialogRef.afterClosed().subscribe((result: { role: { en: string; }; }) => {
                        if (result) {
                          this.allService.alertDialogService.alert('result.role.en' + result.role.en)
                          this.email = this.access[0].weChatID + result.role.en + '@db.com';
                          this.password = this.access[0].weChatID + result.role.en;
                          this.login();
                        }
                      })
                    }
                  }
                })
              } else {
                console.log('this.role get', this.role)
                if (!this.role) {
                  this.loading = false;
                  this.allService.alertDialogService.warn('请先选择健康项目')
                  this.router.navigate(['/public-platform/homepage/main']);
                } else {
                  if (this.role == 'patient') {
                    this.createPatient();
                  } else if (this.role == 'provider') {
                    // this.register=true;
                    //this.getRegistryForm();
                    this.createProvider();
                  }
                }
              }
            })
          }
        })
      } else {
        if (this.bigScreen == 0) {
          var isWeixin = this.storage.get('isWeixin');
          if (isWeixin) {
            window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
          } else {
            this.router.navigate(['/public-platform/homepage/login']);
          }
          // window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
          // 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.wechatJssdkConfig.appID1 + '&redirect_uri=https://www.digitalbaseas.com/homepage/login-poster&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        }
      }
    }
    console.log('---登录页面---初始化加载方法ngOnInit---end');
  }

  findRole(role: any, accounts: any) {
    for (let account of accounts) {
      if (role == account.role) {
        return true;
      }
    }
    return false;
  }

  updatePatient() {
    console.log('update patient', this.weChatUserInfor)
    console.log('this.profiles-2', this.profiles)
    // 拼接user.model数据
    let userModel = this.allModel.user;
    userModel.email = this.email;
    userModel.password = this.password;

    console.log('userModel', userModel)
    this.allService.authService.login(userModel).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.user = this.storage.get('user');
      this.patient = this.user;
      this.storage.set('patient', this.user);

      this.color = this.user.color;
      this.storage.set('user', this.user);
      this.storage.set('color', this.color);
      this.user.photo = this.weChatUserInfor.headimgurl;
      this.user.name = this.weChatUserInfor.nickname;
      this.addItems(this.profiles, this.user.profiles);
      if (this.service) {
        this.addItems([this.service], this.user.serviceList);
      }
      this.addItems(this.educations, this.user.serviceList);
      if (this.provider) {
        this.addItems([this.provider], this.user.providers);
      }
      //update patient
      if (this.bigScreen == 0 && !this.user.openID) {
        this.user.openID = this.storage.get('openID');
      }
      this.user.role = 'patient'
      console.log('user updated!!!!!!!!!', this.user)

      this.allService.usersService.updateUser(this.user).then((data: any) => {
        //add or update admin visit and visit data
        this.temp = data;
        this.user = this.temp;
        this.storage.set('user', this.user);
        this.storage.set('patient', this.user);
        console.log('user', this.user)
        this.createVisit();
        this.loading = false;
        if (this.bigScreen == 1) {
          console.log('跳转路由1')
          this.router.navigate(['homepage/home/patient']);
        } else if (this.bigScreen == 0) {
          console.log('跳转路由0')
          this.allService.sharedRoleService.sendUserRole('patient')
          this.router.navigate(['homepage/patient/patient-care']);
        }
      })
    }, (err: any) => {
      this.error = 'Not already authorized'
      console.log("Not already authorized", err);
    });
  }

  createPatient() {
    console.log('start to create new patient')
    this.allService.usersService.getWeChatUserInfor(this.weChatAccess.access_token,
      this.weChatAccess.openid).then((data: any) => {
        this.temp = data;
        if (this.temp) {
          var gender: any;
          if (this.temp.sex == 1)
            gender = '男';
          else if (this.temp.sex == 2) {
            gender = '女'
          }
          var serviceList: any;
          if (this.service) {
            serviceList = [this.service];
          }
          var providers: any;
          if (this.provider) {
            providers = [this.provider];
          }
          var weChatID: any;
          if (this.weChatAccess.unionid) {
            weChatID = this.weChatAccess.unionid;
          } else {
            weChatID = this.weChatAccess.openid;
          }
          var openID: any;
          if (this.bigScreen == 0) {
            openID = this.weChatAccess.openid;
          }
          // 拼接user.model信息;
          let userModel = this.allModel.user;
          userModel.email = weChatID + this.role + '@db.com';
          userModel.password = weChatID + this.role;
          userModel.role = 'patient';
          userModel.gender = gender;
          userModel.gender = gender;
          userModel.weChatID = weChatID;
          userModel.openID = openID;
          userModel.photo = this.temp.headimgurl;
          userModel.profiles = this.profiles;
          userModel.providers = providers;
          userModel.serviceList = serviceList;
          userModel.name = this.temp.nickname;
          userModel.educations = this.educations;

          console.log('userModel', userModel)
          this.allService.authService.createAccount(userModel).then((res: any) => {
            this.loading = false;
            // this.storage.set('bigScreen', this.bigScreen)

            console.log("Already authorized", res);
            this.allService.alertDialogService.success('注册成功!')
            this.user = this.storage.get('user');
            this.patient = this.user;
            this.storage.set('patient', this.user);
            this.createVisit();
            if (this.bigScreen == 1) {
              this.router.navigate(['homepage/patient/profile']);
            } else if (this.bigScreen == 0) {
              this.allService.sharedRoleService.sendUserRole('patient')
              this.router.navigate(['homepage/patient/patient-care']);
            }
          })
        }
      })
  }

  updateProvider() {
    console.log('start to update provider')
    // 拼接user.model数据
    let userModel = this.allModel.user;
    userModel.email = this.email;
    userModel.password = this.password;

    this.allService.authService.login(userModel).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.temp = res;
      this.user = this.storage.get('user');
      this.storage.set('patient', this.user);
      this.color = this.user.color;
      this.storage.set('user', this.user);
      this.storage.set('color', this.color);
      this.user.photo = this.weChatUserInfor.headimgurl;
      this.user.name = this.weChatUserInfor.nickname;
      console.log('this.user', this.user)
      console.log('this.profiles', this.profiles)
      console.log('this.user.profiles', this.user.profiles)
      this.addItems(this.profiles, this.user.profiles);
      //update provider
      if (this.bigScreen == 0 && !this.user.openID) {
        this.user.openID = this.storage.get('openID');
      }
      this.allService.usersService.updateUser(this.user).then((data: any) => {
        this.loading = false;
        this.allService.sharedRoleService.sendUserRole('provider')
        this.router.navigate(['provider-platform/provider/account']);
      })
    })
  }

  createProvider() {
    this.allService.usersService.getWeChatUserInfor(this.weChatAccess.access_token,
      this.weChatAccess.openid).then((data: any) => {
        this.temp = data;
        if (this.temp) {
          var gender: any;
          if (this.temp.sex == 1)
            gender = '男';
          else if (this.temp.sex == 2) {
            gender = '女'
          }
          var serviceList: any;
          if (this.service) {
            serviceList = [this.service];
          }
          var providers: any;
          if (this.provider) {
            providers = [this.provider];
          }
          this.profiles = this.storage.get('profiles');
          var weChatID: any;
          if (this.weChatAccess.unionid) {
            weChatID = this.weChatAccess.unionid;
          } else {
            weChatID = this.weChatAccess.openid;
          }
          var openID: any;
          if (this.bigScreen == 0) {
            openID = this.weChatAccess.openid;
          }
          let userModel = this.allModel.user;
          userModel.email = weChatID + 'provider' + '@db.com';
          userModel.password = weChatID + 'provider';
          userModel.role = this.role;
          userModel.gender = gender;
          userModel.weChatID = weChatID;
          userModel.openID = openID;
          userModel.photo = this.temp.headimgurl;
          userModel.profiles = this.profiles;
          userModel.name = this.temp.nickname;

          console.log('userModel', userModel)
          this.allService.authService.createAccount(userModel).then((res: any) => {
            this.loading = false;
            // this.storage.set('bigScreen', this.bigScreen)

            console.log("Already authorized", res);

            this.user = this.storage.get('user');

            this.allService.sharedRoleService.sendUserRole('provider')
            this.router.navigate(['provider-platform/provider/account']);
          })
        }
      })
  }


  createVisit() {
    //if patient is registering a project
    console.log('create visit!!!!!!!')
    if (this.provider)
      var providerID = this.provider._id

    this.allService.visitsService.getVisitsByFilter({ 'type': '注册', 'patientID': this.user._id, 'profile._id': this.profile._id })
      .then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          let visitModel = this.allModel.visit;
          visitModel.patientID = this.user._id;
          visitModel.visitDate = new Date();
          visitModel.profile = this.profile;
          visitModel.type = '注册';
          visitModel.enType = 'registry';
          visitModel.providerID = providerID;
          visitModel.createdBy = { _id: this.user._id };

          this.allService.visitsService.createVisit(visitModel).then((data: any) => {
            this.temp = data;
            this.createMessage(this.temp)
            this.saveForms(this.temp, this.user);
          })
        } else {
          this.saveForms(this.temp[0], this.user);
        }
      })
  }

  createMessage(visit: any) {
    //adde from patient

    var patientID = this.user._id;
    if (this.provider) {
      let mailModel = this.allModel.mail;
      mailModel.contentList = [{ component: 'visit', visit: visit }];
      mailModel.userID = this.user._id;
      mailModel.patientID = patientID;
      mailModel.providerID = this.provider._id;
      mailModel.status = 'active';

      this.allService.mailService.create(mailModel).then((data: any) => {
        this.temp = data;
        console.log('provider getting message:', this.provider)
        if (this.provider.openID) {
          var filter = {
            appID: this.wechatJssdkConfig.appID1,
            appSecret: this.wechatJssdkConfig.appSecrete1,
            openID: this.provider.openID,
            message: '有新病人加入您的项目:' + this.profile.label.ch
          };
          this.allService.mailService.sendMessage(filter).then((data: any) => {
            console.log('message sent')
          })
        }
      })
    }
  }

  saveForms(visit: any, user: any) {
    console.log('visit, user', visit, user)
    for (let item of this.forms) {

      for (let obSet of item.obSets) {

        for (let ob of obSet.obs) {
          if (obSet.field == 'problem') {
            this.saveProblemObData(ob, obSet, user);

          } else if (obSet.field == 'medication') {
            console.log('save meds')
            this.saveMedicationObData(ob, obSet, user);

          } else {
            this.savePatientProfileObData(ob, visit, user);
            this.saveProblem(ob, user);
            this.saveMedication(ob, user)
          }
        }
      }
    }
  }

  savePatientProfileObData(ob: any, visit: any, user: any) {

    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }

    if (ob.value || ob.valueList.length > 0) {
      console.log('ob-2', ob)
      if (ob.context == 'visit') {
        let dataModel = this.allModel.data;
        dataModel.patientID = user._id;
        dataModel.obID = ob._id;
        dataModel.visitID = visit._id;

        this.allService.datasService.getDatasByFilter2(this.allModel.data).then((data: any) => {
          this.temp = data;
          dataModel.patientEmail = user.email;
          dataModel.obName = ob.name;
          dataModel.obType = ob.type;
          dataModel.value = ob.value;
          dataModel.values = ob.valueList;
          if (this.temp.length == 0) {
            this.allService.datasService.create(dataModel).then((data: any) => {
              console.log('profile data created', data);
            });
          } else {
            dataModel._id = this.temp[0]._id;
            this.allService.datasService.update(dataModel).then((data: any) => {
              console.log('profile data created', data);
            });
          }
        })
      } else if (ob.context == 'patient') {
        let dataModel = this.allModel.data;
        dataModel.patientID = user._id;
        dataModel.obID = ob._id;
        this.allService.datasService.getDatasByFilter2(dataModel).then((data: any) => {
          this.temp = data;

          dataModel.patientEmail = user.email;
          dataModel.obName = ob.name;
          dataModel.obType = ob.type;
          dataModel.value = ob.value;
          dataModel.values = ob.valueList;

          if (this.temp.length == 0) {
            this.allService.datasService.create(dataModel).then((data: any) => {
              console.log('profile data created', data);
            });
          } else {
            dataModel._id = this.temp[0]._id;

            this.allService.datasService.update(dataModel).then((data: any) => {
              console.log('profile data updated', data);
            });
          }
        });
      }
    }
  }

  saveProblemObData(ob: any, obSet: any, user: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    if (obSet.obs.indexOf(ob) == 0) {
      var problemModel = this.allModel.problem;
      problemModel.patientID = user._id;
      problemModel.problemItemID = obSet._id
      this.allService.problemService.getProblemByFilter(problemModel).then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          problemModel.familyMember = 'self';
          this.allService.problemService.create(problemModel).then((data: any) => {
            console.log('problem created', data)
          });
        }
      })
    }
    if (ob.value || ob.valueList.length > 0) {
      let dataModel = this.allModel.data;
      dataModel.patientID = user._id;
      dataModel.problemItemID = obSet._id;
      dataModel.obID = ob._id;

      this.allService.datasService.getDatasByFilter2(dataModel).then((data: any) => {
        this.temp = data;

        dataModel.patientEmail = user.email;
        dataModel.obName = ob.name;
        dataModel.obType = ob.type;
        dataModel.value = ob.value;
        dataModel.familyMember = 'self';
        dataModel.values = ob.valueList;

        if (this.temp.length == 0) {
          this.allService.datasService.create(dataModel).then((data: any) => {
            console.log('problem data created', data);
          });
        } else {
          dataModel._id = this.temp[0]._id;
          this.allService.datasService.update(dataModel).then((data: any) => {
            console.log('problem data updated', data);
          });
        }
      });
    }
  }

  saveMedicationObData(ob: any, obSet: any, user: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }

    if (obSet.obs.indexOf(ob) == 0) {
      let medModel = this.allModel.med;
      medModel.patientID = user._id;
      medModel.medicationItemID = obSet._id;

      this.allService.medsService.getMedsByFilter(medModel).then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          this.allService.medsService.create(medModel).then((data: any) => {
            console.log('medication created', data)
          });
        }
      })
    }
    if (ob.value || ob.valueList.length > 0) {
      let dataModel = this.allModel.data;
      dataModel.patientID = user._id;
      dataModel.medicationItemID = obSet._id;
      dataModel.obID = ob._id;

      this.allService.datasService.getDatasByFilter2(dataModel).then((data: any) => {
        this.temp = data;
        dataModel.patientEmail = user.email;
        dataModel.obName = ob.name;
        dataModel.obType = ob.type;
        dataModel.value = ob.value;
        dataModel.source = 'patient';
        dataModel.values = ob.valueList;

        if (this.temp.length == 0) {
          this.allService.datasService.create(dataModel).then((data: any) => {
            console.log('medication data created', data);
          });
        } else {
          dataModel._id = this.temp[0]._id;
          this.allService.datasService.update(dataModel).then((data: any) => {
            console.log('medication data updated', data);
          });
        }
      })
    }
  }

  saveProblem(ob: any, user: any) {

    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value.problems && value.problems.length > 0) {
          if (value.comments == 'family') {
            var familyMember = value.text;
          } else {
            familyMember = 'self';
          }
          for (let problem of value.problems) {
            // this.getProblemInfor(problem,ob,form);
            let problemModel = this.allModel.problem;
            problemModel.patientID = user._id;
            problemModel.problemItemID = problem._id;
            problemModel.familyMember = familyMember;

            this.allService.problemService.getProblemByFilter(problemModel).then((data: any) => {
              this.temp = data;
              if (this.temp.length == 0) {
                this.allService.problemService.create(problemModel).then((data: any) => {
                  console.log('probem created', data)
                });
              }
            });
          }
        }
      }
    }
  }

  saveMedication(ob: any, user: any) {

    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value.medications && value.medications.length > 0) {
          for (let medication of value.medications) {
            // this.getMedicationInfor(medication,ob,form)
            let medModel = this.allModel.med;
            medModel.patientID = user._id;
            medModel.medicationItemID = medication._id;

            this.allService.medsService.getMedsByFilter(medModel).then((data: any) => {
              this.temp = data;
              if (this.temp.length == 0) {
                this.allService.medsService.create(medModel).then((data: any) => {
                  console.log('medication created', data)
                });
              }
            });
          }
        }
      }
    }
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

  getRegistryForm() {
    if (this.role == 'patient') {
      this.allService.categoryService.getCategoriesByFilter({ formType: 'general registry' }).then((data: any) => {
        this.temp = data;

        this.registryForm = this.temp[0];
        this.allService.categoryService.getFormById({ formIDs: [this.registryForm._id] }).then((data: any) => {
          this.temp = data;
          console.log('registry form', data);
          this.registryForm = this.temp[0];
          this.loading = false;
        })
      })
    } else if (this.role == 'provider') {
      this.allService.categoryService.getCategoriesByFilter({ internalName: 'provider registry' }).then((data: any) => {
        this.temp = data;

        this.registryForm = this.temp[0];
        this.allService.categoryService.getFormById({ formIDs: [this.registryForm._id] }).then((data: any) => {
          this.temp = data;
          console.log('registry form', data);
          this.registryForm = this.temp[0];
          this.loading = false;
        })
      })
    }
  }

  checkForm() {
    var missing = [];
    var educations = [];

    for (let obSet of this.registryForm.obSets) {

      for (let ob of obSet.obs) {
        if (ob.required && ob.type != 'list') {
          if (ob.label && (!ob.value || ob.value == ''))
            missing.push(ob.label.ch);
          else if (ob.name && (!ob.value || ob.value == ''))
            missing.push(ob.name);

        }
        else if (ob.required && ob.type == 'list') {
          if (ob.label && (!ob.values || (ob.values && ob.values.length == 0)))
            missing.push(ob.label.ch);
          else if (ob.name && (!ob.values || (ob.values && ob.values.length == 0)))
            missing.push(ob.name);
        }

        console.log('ob -1', ob)
        if (ob._id == '5a8c85b83f5083269ca2b54c')
          var name = ob.value;
        else if (ob._id == '5a8c91dd3f5083269ca2b550')
          var birthday = ob.value;
        else if (ob._id == '5a8c922b3f5083269ca2b551' && ob.values && ob.values.length > 0)
          var gender = ob.values[0].text;
        else if (ob._id == '5c924cdc87844811ec18ee5b')
          var ssn = ob.value;
        else if (ob._id == '5a8c91cd3f5083269ca2b54f')
          var phone = ob.value;
        else if (ob._id == '5a8491056973972028bc39ab')
          var photo = ob.value;
        else if (ob._id == '5a8c91593f5083269ca2b54e')
          this.password = ob.value;
        else if (ob._id == '5a8c914a3f5083269ca2b54d')
          this.email = ob.value;
        else if (ob._id == '5bdb08d5779fd617fc46a3c1')
          var age = ob.value;
      }
    }

    if (missing.length > 0) {

      // alert ("please enter the following field:"+this.missing)
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = { 'missing': missing, 'message': '以下信息需完成', 'color': this.color };
      if (this.bigScreen == 1) {
        dialogConfig.position = { top: '5%', left: '60%' };
      } else {
        dialogConfig.position = { top: '10%', left: '5%' };
      }

      const dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);

    } else {
      let param: any;
      param.name = name;
      param.gender = gender;
      param.birthday = birthday;
      param.age = age;
      param.phone = phone;
      param.ssn = ssn;
      param.photo = photo;
      if (this.weChatAccess) {
        param.weChatOpenID = this.weChatAccess.unionid
      }

      if (this.role == 'patient') {
        param.role = 'patient';
        this.newPatient = param;
      } else if (this.role == 'provider') {
        param.role = 'provider';
        this.newProvider = param;
      }
    }
  }

  registryUser() {
    if (this.role == 'patient') {
      this.registryPatient();
    }
    else if (this.role == 'provider') {
      this.registryProvider();
    }
  }

  registryPatient() {
    this.checkForm();
    console.log('this.newPatient', this.newPatient)
    if (this.newPatient) {
      if (!this.code) {
        let userModel = this.allModel.user;
        userModel.email = this.email;
        userModel.password = this.password;
        userModel.role = 'patient';

        //login
        this.allService.authService.createAccount(userModel).then((res: any) => {
          // this.storage.set('bigScreen', this.bigScreen)
          console.log("Already authorized", res);

          this.user = this.storage.get('user');

          if (this.user.role == 'patient')
            this.storage.set('patient', this.user);

          this.dialogRef.close({ 'user': this.user, userProperty: this.newPatient });

          for (let obSet of this.registryForm.obSets) {
            for (let ob of obSet.obs) {
              this.saveProfileObData(ob, this.user);
            }
          }
        }, (err: any) => {
          this.error = '用户已存在'
          console.log("already exist", err);
        })
      }
    }
  }

  registryProvider() {
    this.checkForm();

    if (this.newProvider) {
      if (!this.code) {
        let userModel = this.allModel.user;
        userModel.email = this.email;
        userModel.password = this.password;
        userModel.role = 'provider';

        this.allService.authService.createAccount(userModel).then((res: any) => {
          // this.storage.set('bigScreen', this.bigScreen)

          console.log("Already authorized", res);

          this.user = this.storage.get('user');

          this.dialogRef.close({ 'user': this.user, userProperty: this.newProvider });

          for (let obSet of this.registryForm.obSets) {
            for (let ob of obSet.obs) {
              this.saveUserObData(ob, this.user);
            }
          }
        }, (err: any) => {
          this.error = '用户已存在'
          console.log("Not already authorized", err);
        })

      } else {
        this.dialogRef.close({ 'user': this.user, userProperty: this.newProvider });
      }
    }
  }

  saveProfileObData(ob: any, user: any) {

    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }

    if (ob.value || ob.valueList.length > 0) {
      console.log('ob-2', ob)
      let dataModel = this.allModel.data;
      dataModel.patientID = user._id;
      dataModel.patientEmail = user.email;
      dataModel.obID = ob._id;
      dataModel.obName = ob.name;
      dataModel.source = 'patient';
      dataModel.obType = ob.type;
      dataModel.value = ob.value;
      dataModel.values = ob.valueList;

      this.allService.datasService.create(dataModel).then((data: any) => {
        console.log('profile data created', data);
      });
    }
  }

  saveObData(ob: any, user: any) {
    ob.valueList = [];
    if (ob.type == 'list' && ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    let dataModel = this.allModel.data;
    dataModel.obID = ob._id;
    dataModel.registryUserID = user._id;

    this.allService.datasService.getDatasByFilter2(dataModel).then((obData: any) => {
      this.temp = obData;
      //console.log ('visit obData',obData);
      dataModel.registryUserEmail = user.email;
      dataModel.userID = user._id;
      dataModel.userEmail = user.email;
      dataModel.obName = ob.name;
      dataModel.obType = ob.type;
      dataModel.value = ob.value;
      dataModel.values = ob.valueList;

      if (this.temp.length > 0) {
        dataModel._id = this.temp[0]._id;
        this.allService.datasService.update(dataModel).then((data: any) => {
          // console.log ('user data updated', data);
        });
      } else {
        this.allService.datasService.create(dataModel).then((data: any) => {
          console.log('user data created', data);
        })
      }
    });
  }

  saveUserObData(ob: any, user: any) {

    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }

    if (ob.value || ob.valueList.length > 0) {
      console.log('ob-2', ob)
      let dataModel = this.allModel.data;
      dataModel.userID = user._id;
      dataModel.registryUserID = user._id;
      dataModel.userEmail = user.email;
      dataModel.obID = ob._id;
      dataModel.obName = ob.name;
      dataModel.obType = ob.type;
      dataModel.value = ob.value;
      dataModel.values = ob.valueList;

      this.allService.datasService.create(dataModel).then((data: any) => {
        console.log('user data created', data);
      });
    }
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
        this.allService.alertDialogService.error("手机号码不正确，请重新输入");
        return;
      } else {
        username = this.phone;
      }
    } else if (this.loginType == 'mailLogin') {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (reg.test(String(this.email))) {
        username = this.email;
      } else {
        this.allService.alertDialogService.error("邮箱格式不正确");
        return;
      }
    }
    if (!this.password) {
      this.allService.alertDialogService.error("密码不能为空!");
      return;
    }
    let credentials = {
      email: username,
      password: this.password,
      role: 'patient'
    };
    // 新窗口打开页面
    if (!this.popOut) {
      this.loading = true;
      this.allService.authService.login(credentials).then((res: any) => {
        // this.storage.set('bigScreen', this.bigScreen)
        console.log("Already authorized", res);
        this.user = this.storage.get('user');
        let isWeixin = this.storage.get('isWeixin');
        if (this.bigScreen == 0) {
          this.allService.usersService.updateUser(this.user);//running behind
          // 如果是微信登陆需要保存openID 
          if (isWeixin) {
            this.user.openID = this.weChatAccess.openid;
          }
        }
        this.color = this.user.color;
        this.storage.set('color', this.color);
        this.closeDialogRef();
        // 左侧栏更新
        this.allService.communicateService.sendLoginMsg(this.user);
        this.router.navigate(['provider-platform/patient/profile']);
      }, (err: any) => {
        console.log(err);
        console.log("Not already authorized");
        this.error = '登录错误';
        this.allService.alertDialogService.error('用户名/密码错误,或者您还未注册用户,请确认后再次登录');
        this.loading = false;
      });
    } else {
      //login
      this.allService.authService.login(credentials).then((res: any) => {
        // this.storage.set('bigScreen', this.bigScreen)
        console.log("Already authorized", res);
        this.user = this.storage.get('user');
        if (this.user.role == 'patient')
          this.storage.set('patient', this.user);
        this.color = this.user.color;

        this.storage.set('color', this.color);
        this.allService.sharedRoleService.sendUserRole(this.user.role)
      })
    }
  }

  closeDialogRef() {
    this.allService.communicateService.sendLoginMsg(this.user);
    this.dialogRef.close();
  }

  wechatLogin() {

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}