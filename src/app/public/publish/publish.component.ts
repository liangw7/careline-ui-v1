import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// import WechatJSSDK from 'wechat-jssdk/dist/client.umd';
import { ApiUrl, User } from 'src/app/core/models';

import { AllServices } from 'src/app/core/common-services/all-services';
import { WechatJssdkConfig } from 'src/app/core/common-services';
const WechatJSSDK = require('wechat-jssdk');
@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit, AfterViewInit, OnDestroy {
  serviceList: any;
  marketPlace: any;
  marketPlaceID: any;
  temp: any;
  providerList: any;
  newPatient: any;
  service: any;
  profile: any;
  selectedIndex: any;
  registryList: any;
  user: any;
  photoList: any;
  loading: any;
  language: any;
  subscription: Subscription;
  publishID: any;
  forms: any;
  bigScreen: any;
  registryForm: any;
  formType: any;
  newUser: any;
  provider: any;
  wechatObj: any;
  accessToken: any;
  appSecrete: any;
  appID: any;
  signature: any;
  role: any;
  profiles: any;
  credentials: any;
  access: any;
  weChatAccess: any;
  color: any;
  code: any;
  scrollSize: any;
  screenSize: any;
  providers: any;
  education: any;
  registry: any;
  expert: any;
  reading: any;
  option: any;
  selectedProvider: any;
  missing: any;
  educations: any;
  patient: any;
  serviceID: any;
  image: any;
  desc: any;
  title: any;
  showInstruction: any;
  createdBy: any;
  createdAt: any;
  form: any;
  followup: any;
  consult: any;
  popOut: any;
  isWeixin: any;

  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    private apiUrl: ApiUrl,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    private dialogRef: MatDialogRef<PublishComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    this.bigScreen = this.storage.get('bigScreen');
    this.isWeixin = this.storage.get('isWeixin');
    this.language = this.storage.get('language');
    this.storage.set('publish', true);
    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
    //form
    this.publishID = this.route.snapshot.paramMap.get('publishID');
    if (!this.publishID) {
      this.publishID = this.storage.get('publishID')
      if (!this.publishID && data && data.form) {
        this.publishID = data.form._id;
      }
    } else {
      this.storage.set('publishID', this.publishID)
    }

    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.code = params['code'];
      //alert('got code'+this.code)
    });
  }


  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {

  //   var screenWidth = window.innerWidth;
  //   var screenHeight = window.innerHeight;
  //   this.screenSize = { width: screenWidth, height: screenHeight };
  //   if (screenWidth <= 992) {
  //     this.bigScreen = 0;
  //     this.scrollSize = this.screenSize.height * 0.8
  //   } else {
  //     this.bigScreen = 1;
  //     this.scrollSize = this.screenSize.height * 0.75
  //   }
  // }


  ngOnInit() {
    this.educations = [];
    // this.getScreenSize();
    this.getProfile().then(() => {
      console.log('profile', this.profile)
      this.education = true;
      this.getEducation();
    })
  }


  ngAfterViewInit() {

  }


  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }


  getEducation() {
    if (!this.forms) {

      this.loading = true;
      console.log('this.publishID', this.publishID)
      //form
      this.form = { _id: this.publishID };
      this.allService.formService.getForm(this.form, null, null, null).then((data: any) => {
        console.log('---this.form---');
        console.log(this.form);
        this.loading = false;
        this.createdAt = this.form.createdAt;
        this.createdBy = this.form.createdBy;
        this.forms = [this.form];
        if (!this.forms[0].counter) {
          this.forms[0].counter = 1000;
        }

        this.forms[0].counter++;

        this.allService.categoryService.update({ _id: this.forms[0]._id, counter: this.forms[0].counter }).then((data: any) => {
          if (this.forms[0].desc && this.forms[0].desc.patient) {
            this.desc = this.forms[0].desc.patient
          } else {
            this.desc = this.forms[0].obSets[0].obs[0].education.ch;
          }

          console.log('this.desc', this.desc);

          this.title = this.forms[0].label.ch;
          console.log('this.title', this.title)
          // this.titleService.setTitle(this.forms[0].label.ch);
          this.image = this.apiUrl.setFormUploadPhoto + String(this.forms[0].image) + '.png';
          if (this.isWeixin) {
            this.getSignature(this.title, this.desc, this.image);
          }
        })
      })
    }
  }


  getProfile() {
    return new Promise((resolve, reject) => {
      this.allService.categoryService.getCategoriesByFilter({ 'forms': { '$elemMatch': { _id: this.publishID } } }).then((data: any) => {
        this.temp = data;
        if (this.temp.length > 0)
          this.profile = this.temp[0];
        resolve(data);
        reject(new Error('error'));

      })
    })
  }

  submitProvider() {
    this.role = 'provider'
  }


  submitPatient() {
    this.storage.set('consult', true);
    if (this.profile.desc.ageGroup == 'child') {
      this.role = 'child'
    } else {
      this.role = 'patient'
    }
  }

  getProviders() {
    if (this.profile && !this.providers) {

      this.loading = true;
      this.allService.usersService.getByFilter({ 'status': { '$in': ['1', '2'] }, 'role': 'provider', 'profiles': { '$elemMatch': { _id: this.profile._id } } }).then((data: any) => {
        console.log('get form', data);
        this.temp = data;
        this.providers = this.temp;

        this.loading = false;
      })
    }
  }

  shareFriends(title: any, desc: any, image: any) {
    var link = location.href.split('#')[0];
    var jsApiList: string[] = [
      'updateAppMessageShareData',
      "onMenuShareTimeline",
      "onMenuShareAppMessage",
      "updateTimelineShareData",
      "closeWindow",
      "hideOptionMenu"
    ];
    return this.allService.wechatJssdkService.shareFriends(link, jsApiList);
  }


  getSignature(title: any, desc: any, image: any) {
    var jsApiList: string[] = [
      'updateAppMessageShareData',
      "onMenuShareTimeline",
      "onMenuShareAppMessage"
    ]
    var link = location.href.split('#')[0];
    return this.allService.wechatJssdkService.getSignature(desc, title, this.forms[0].label.ch, image, link, jsApiList, 1);
  }

  submit() {
    this.user = this.storage.get('user');
    if (this.user) {
      this.updatePatient();
    } else {
      this.profiles = [this.profile];
      this.storage.set('profiles', this.profiles);
      this.storage.set('role', this.role);
      this.storage.set('consult', this.consult);
      this.storage.set('followup', this.followup);
      this.storage.set('provider', this.selectedProvider);
      this.storage.set('profile', this.profile);
      if (this.forms[0].formType == 'education'){
        this.educations = { _id: this.forms[0] };
        this.storage.set('educations', this.educations);
      }

      this.storage.set('forms', [this.registryForm]);
      this.isWeixin = this.storage.get('isWeixin');
      if (this.isWeixin) {
        window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
      } else {
        // 在已经登录情况下,根据用户角色重定向到登录页面
        let userBindInfo = new User;
        if (this.selectedProvider) {
          userBindInfo.providers = this.selectedProvider;
        }
        if (this.profile) {
          userBindInfo.profiles = this.profile;
        }
        if (this.educations) {
          userBindInfo.educations = this.educations;
        }
        let userType = NaN;
        if (this.role == 'patient' || this.role == 'child') {
          userType = 0;
        }else if (this.role == 'provider') {
          userType = 1;
        }
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: userType,
            userBindInfo: userBindInfo
          }
        })
      }
    }
  }

  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false;
  }


  updatePatient() {
    this.loading = true;
    if (!this.patient.providers) {
      this.patient.providers = [];
    }
    if (!this.find(this.selectedProvider, this.patient.providers)) {
      this.patient.providers.push(this.selectedProvider);
    }
    if (!this.patient.serviceList) {
      this.patient.serviceList = [];
    }
    if (this.selectedProvider && this.selectedProvider.service) {
      this.serviceID = this.selectedProvider.service._id;
      if (!this.find(this.selectedProvider.service, this.patient.serviceList)) {
        this.patient.serviceList.push({ _id: this.serviceID });
      }
    }
    if (!this.patient.profiles)
      this.patient.profiles = [];
    for (let profile of this.profiles) {
      if (!this.find(profile, this.patient.profiles)) {
        this.patient.profiles.push(profile);
      }
    }

    if (!this.patient.educations)
      this.patient.educations = [];
    for (let education of this.educations) {
      if (!this.find(education, this.patient.educations)) {
        this.patient.educations.push(education);
      }
    }

    console.log('this.patient', this.patient)
    this.allService.usersService.updateUser(this.patient).then((data: any) => {
      this.temp = data;
      this.patient = this.temp;

      this.loading = false;
      this.allService.alertDialogService.alert('您的帐号已加入新项: ' + this.profile.label.ch)
      console.log('user updated:', this.patient)

      this.storage.set('user', this.patient);
      this.storage.set('patient', this.patient);
      console.log('new patient', this.patient);
      if (this.bigScreen == 1) {
        if (this.option == 'schedule') {
          this.router.navigate(['/provider-platform/provider/provider-schedule']);
        } else if (this.option == 'consult')
          this.router.navigate(['/homepage/home/mail']);
      } else if (this.bigScreen == 0) {
        this.router.navigate(['/homepage/home/patient-story']);
        if (this.option == 'schedule') {
          this.storage.set('schedule', true);
        } else if (this.option == 'consult')
          this.storage.set('consult', true);
      }
      //this.storage.set('role','');
      this.router.navigate(['/provider-platform/patient/patient-story']);
      
      // this.createVisit();
    })
  }



  createVisit() {
    //if patient is registering a project
    if (this.provider)
      var providerID = this.provider._id
    var visit = {
      patientID: this.user._id,
      visitDate: new Date(),
      profile: this.profile,
      type: '注册',
      enType: 'registry',
      providerID: providerID,
      createdBy: { _id: this.user._id }
    }
    this.allService.visitsService.getVisitsByFilter({
      'type': '注册',
      'patientID': this.user._id,
      'profile._id': this.profile._id
    })
      .then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          this.allService.visitsService.createVisit(visit).then((data: any) => {
            this.temp = data
            this.createMessage(this.temp)
            // this.saveForms(this.temp);
            this.allService.formService.saveForms([this.registryForm], this.temp[0], this.user);
          })
        } else {
          this.allService.formService.saveForms([this.registryForm], this.temp[0], this.user);
        }
      })
  }


  createMessage(visit: any) {
    //adde from patient
    var patientID = this.user._id;
    var providerID = this.selectedProvider._id;
    var mail = {
      contentList: [{ component: 'visit', visit: visit }],
      userID: this.user._id,
      patientID: patientID,
      providerID: providerID,
      status: 'active'
    }
    this.allService.mailService.create(mail).then((data: any) => {
      this.temp = data;
    })
  }


  registryService(service: any, profile: any) {
    this.service = this.storage.set('service', service)
    this.profile = this.storage.set('profile', profile)
    this.router.navigate(['/homepage/registry']);
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }


  receiveMessage($event: any) {
    if ($event == 'popOut') {
      // alert("got pop")
      this.popOut = false;
    }
  }

  follow() {
    window.location.href =
      "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MTYyODQ3MQ==#wechat_redirect"

  }
}
