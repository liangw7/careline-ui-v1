import {
  Component, OnInit, Inject, HostListener, ViewChild,
  AfterViewInit, OnDestroy, ElementRef
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import WechatJSSDK from 'wechat-jssdk/dist/client.umd';
import { AllServices, WechatJssdkConfig } from 'src/app/core/common-services';
import { ApiUrl, User } from 'src/app/core/models';


const WechatJSSDK = require('wechat-jssdk');
@Component({
  selector: 'provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit, AfterViewInit, OnDestroy {
  isWeixin: any;
  serviceList: any;
  marketPlace: any;
  marketPlaceID: any;
  temp: any
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
  profiles: any;
  search: any;
  title: any;
  bigScreen: any;
  appID: any;
  appSecrete: any;
  code: any;
  weChatAccess: any;
  access: any;
  credentials: any;
  color: any;
  scrollSize: any;
  profileSelected: any;
  descSelected: any;
  mapSelected: any;
  articleSelected: any;
  services: any;
  providers: any;
  provider: any;
  forms: any;
  educations: any;
  oneProfile: any;
  selectedProfile: any;
  signature: any;
  option: any;
  selectedProvider: any;
  patient: any;
  serviceID: any;
  missing: any;
  formRegistry: any;
  patientProfiles: any;
  showInstruction: any;
  articles: any;
  selectedArticle: any;
  articleForms: any;
  role: any;
  showSelectedProfile: any;
  homePage: any;
  followup: any;
  consult: any;
  popOut: any;
  @ViewChild('textInput', { read: ElementRef })
  textInput!: ElementRef;

  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    private apiUrl: ApiUrl,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    private dialogRef: MatDialogRef<ProviderComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.language = this.storage.get('language');
    this.isWeixin = this.storage.get('isWeixin');
    this.subscription = this.allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
    this.getScreenSize();
    this.bigScreen = this.storage.get('bigScreen');
    // this.storage.set('bigScreen', this.bigScreen);
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {

    var screenWidth = window.innerWidth;
    if (screenWidth <= 992) {
      // this.bigScreen = 0;
      this.scrollSize = window.innerHeight * 0.88;
    } else {
      // this.bigScreen = 1;
      this.scrollSize = window.innerHeight * 0.6;
    }
  }

  ngOnInit() {
    var loc = location.href;
    this.storage.set('location', loc);
    this.allService.sharedPageTypeService.sendPageType('patient');

    this.titleService.setTitle("数基健康")
    var providerID = this.route.snapshot.paramMap.get('providerID');
    var profileID = this.route.snapshot.paramMap.get('profileID');


    //var articleID=this.route.snapshot.paramMap.get('articleID');
    if (providerID && profileID) {
      this.profileSelected = false;
      this.allService.categoryService.getCategory(profileID).then((data: any) => {
        this.temp = data;
        if (!this.temp && providerID) {
          this.allService.usersService.findUserById(providerID).then((data: any) => {
            this.provider = data;
            this.storage.set('profiles', this.provider.profiles)
            this.storage.set('provider', this.provider);
            console.log('provider', this.provider);
            if (this.bigScreen == 1)
              this.descSelected = true;
            else
              this.homePage = true;

            var image: any;
            if (this.provider.photo.slice(0, 4) != 'http')
              image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
            else if (this.provider.photo.slice(0, 4) == 'http')
              image = this.provider.photo;
            this.storage.set('color', this.provider.color)
            var link = location.href.split('#')[0];
            if (this.isWeixin) {
              this.getSignature(this.provider.desc, this.provider.name + ', ' + this.provider.title, image, link);
            }
          })
        }
        else if (this.temp && providerID) {
          if (this.temp.field == 'profile') {
            this.allService.usersService.findUserById(providerID).then((data: any) => {
              this.provider = data;
              this.selectedProfile = this.temp;
              this.storage.set('provider', this.provider)
              this.storage.set('profiles', [this.selectedProfile]);
              this.storage.set('profile', this.selectedProfile);

              if (this.selectedProfile.desc && this.selectedProfile.desc.ageGroup == 'child') {
                this.role = 'child'
              } else {
                this.role = 'patient'
              }
              this.storage.set('role', this.role);

              this.getForms(this.selectedProfile);

              this.profileSelected = true;

              var image: any;
              if (this.provider.photo.slice(0, 4) != 'http')
                image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
              else if (this.provider.photo.slice(0, 4) == 'http')
                image = this.provider.photo;
              this.storage.set('color', this.provider.color)
              var title = this.provider.name + ', ' + this.provider.title + '|' + this.selectedProfile.label.ch;
              var link = location.href.split('#')[0];
              if (this.isWeixin) {
                this.getSignature(this.profile.desc.patient, title, image, link);
              }
            })
          } else if (this.temp.field == 'form') {
            this.allService.usersService.findUserById(providerID).then((data: any) => {
              this.provider = data;
              console.log('provider', this.provider)

              this.selectedArticle = this.temp;
              console.log('this.selectedArticle', this.selectedArticle)
              this.selectArticle(this.selectedArticle);

              this.articleSelected = true;
              var image: any;
              if (this.provider.photo.slice(0, 4) != 'http')
                image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
              else if (this.provider.photo.slice(0, 4) == 'http')
                image = this.provider.photo;
              this.storage.set('color', this.provider.color)
              var title = this.provider.name + ', ' + this.provider.title + '|' + this.selectedArticle.label.ch;
              var link = location.href.split('#')[0];
              if (this.isWeixin) {
                this.getSignature(this.selectedArticle.desc.patient, title, image, link);
              }
            })
          }
        }
      })
    } else if (providerID && !profileID) {
      this.allService.usersService.findUserById(providerID).then((data: any) => {
        this.provider = data;
        console.log('provider', this.provider)
        this.storage.set('provider', this.provider);
        // this.descSelected=true;
        if (this.bigScreen == 1)
          this.descSelected = true;
        else
          this.homePage = true;
        var image: any;
        if (this.provider.photo.slice(0, 4) != 'http')
          image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
        else if (this.provider.photo.slice(0, 4) == 'http')
          image = this.provider.photo;
        this.storage.set('color', this.provider.color)
        var link = location.href.split('#')[0];
        if (this.isWeixin) {
          this.getSignature(this.provider.desc, this.provider.name + ', ' + this.provider.title, image, link);
        }
      })
    }
  }

  receiveMessage($event: any) {
    if ($event == 'popOut') {
      // alert("got pop")
      this.popOut = false;
    }
  }


  ngAfterViewInit() {

    //setTimeout(() => this.textInput.nativeElement.focus(), 10); 
  }


  getArticles() {
    if (!this.articles) {

      this.articles = [];
      this.allService.usersService.getByFilter({ providers: { 'elemMatch': { _id: this.provider._id } } }).then((data: any) => {
        this.temp = data;
        if (this.temp.length > 0) {
          var providerIDs = [];
          for (let provider of this.temp.providers) {
            providerIDs.push(provider._id)
          }
          this.loading = true;
          this.allService.categoryService.getCategoriesByFilter({ 'createdBy._id': { '$in': providerIDs }, 'status': 'active' }).then((data: any) => {
            this.temp = data;
            this.articles = this.temp;

            console.log('this.artiles', this.articles)
            this.loading = false;

          })
        } else if (this.temp.length == 0) {
          this.loading = true;
          this.allService.categoryService.getCategoriesByFilter({ 'createdBy._id': this.provider._id, 'status': 'active' }).then((data: any) => {
            this.temp = data;
            this.articles = this.temp;
            console.log('this.artiles', this.articles)
            this.loading = false;

          })
        }
      })
    }
  }

  selectArticle(article: any) {
    this.articleForms = [];
    this.allService.categoryService.getFormById({ formIDs: [article._id] }).then((data: any) => {
      this.articleForms = data;
      var image: any;
      if (this.provider.photo.slice(0, 4) != 'http') {
        image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
      } else if (this.provider.photo.slice(0, 4) == 'http') {
        image = this.provider.photo;
      }

      this.storage.set('color', this.provider.color)
      var title = this.provider.name + ', ' + this.provider.title + '|' + article.label.ch;
      var link = 'https://www.digitalbaseas.com/public-platform/homepage/provider-card/' + this.provider._id + '/' + article._id;
      if (this.isWeixin) {
        this.getSignature(article.desc.patient, title, image, link);
      }
    })
  }

  reserve() {
    this.option = 'schedule';
    this.storage.set('option', this.option)
    this.selectedProvider = this.provider;
    this.submit();
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false;
  }

  checkForm() {
    this.missing = [];
    this.patientProfiles = [this.profile];

    //for (let form of this.forms){
    //if (form.formType=='education'){
    // this.educations.push({_id:form._id, label:form.label,image:form.image,formType:form.formType})
    // }
    //}
    for (let item of this.forms) {
      for (let obSet of item.obSets) {

        for (let ob of obSet.obs) {
          if (ob.type != 'instruction') {
            if (ob.required && ob.type != 'list') {
              if (ob.label && (!ob.value || ob.value == ''))
                this.missing.push(ob.label.ch);
              else if (ob.name && (!ob.value || ob.value == ''))
                this.missing.push(ob.name);

            } else if (ob.required && ob.type == 'list') {
              if (ob.label && (!ob.values || (ob.values && ob.values.length == 0)))
                this.missing.push(ob.label.ch);
              else if (ob.name && (!ob.values || (ob.values && ob.values.length == 0)))
                this.missing.push(ob.name);

            }
          } else {
            if (ob.addsIn && !ob.show) {
              this.missing.push(ob.name);
            }
          }
          if (ob.values && ob.values.length > 0) {
            for (let value of ob.values) {
              if (value.profiles && value.profiles.length > 0) {
                for (let profile of value.profiles) {
                  if (!this.find(profile, this.patientProfiles))
                    this.patientProfiles.push({ _id: profile._id });
                }
              }
              if (value.forms && value.forms.length > 0) {
                for (let form of value.forms) {
                  if (!this.find(form, this.educations))
                    this.educations.push({ _id: form._id, label: form.label, formType: form.formType, image: form.image });
                }
              }
            }
          }
        }
      }
    }

    if (this.missing.length > 0) {

      // alert ("please enter the following field:"+this.missing)
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = { 'missing': this.missing, 'message': '以下信息需完成', 'color': this.color };
      if (this.bigScreen == 1) {
        dialogConfig.position = { top: '5%', left: '60%' };
      } else {
        dialogConfig.position = { top: '10%', left: '5%' };
      }

     // const dialogRef = this.dialog.open(MessageBoxComponent,
     //   dialogConfig);

    }

    console.log('this.educations', this.educations)

  }

  submit() {
    //set up submit role

    //this.selectedProvider=this.storage.get('selectedProvider')
    this.checkForm();
    var service: any;
    if (this.service) {
      service = { _id: this.provider.service._id, name: this.provider.service.name };
    }
    if (!this.selectedProvider && this.provider) {
      this.selectedProvider = this.provider;
    }

    this.user = this.storage.get('user');

    if (this.user) {
      this.save();
    } else {
      this.storage.set('role', this.role);
      this.storage.set('provider', this.selectedProvider);
      this.storage.set('profiles', this.patientProfiles);
      this.storage.set('profile', this.profile);
      this.storage.set('educations', this.educations);
      this.storage.set('service', service);
      this.storage.set('followup', this.followup);
      this.storage.set('consult', this.consult);
      for (let form of this.forms) {
        if (form.formType == 'profile registry') {
          this.formRegistry = form;
          this.storage.set('forms', [this.formRegistry]);
        }
      }
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
        if (this.service) {
          userBindInfo.service = this.service;
        }
        let userType = NaN;
        if (this.role == 'patient' || this.role == 'child') {
          userType = 0;
        } else if (this.role == 'provider') {
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

  breakLines(str: any) {
    console.log(str);
    var temp = [];
    temp = str.split('/n');
    return temp;
  }

  save() {
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
    for (let profile of this.patientProfiles) {
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
            this.allService.formService.saveForms([this.formRegistry], this.temp[0], this.user);
          })
        } else {
          this.allService.formService.saveForms([this.formRegistry], this.temp[0], this.user);
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


  getSignature(desc: any, title: any, image: any, link: any) {
    var jsApiList: [] = [];
    return this.allService.wechatJssdkService.getSignature(desc, title, title, image, link, jsApiList, 0);
  }


  getForms(profile: any) {
    this.storage.set('profile', profile)
    //  alert('got profile: '+profile.label.ch)
    this.profile = profile;
    this.selectedProfile = profile;
    if (this.selectedProfile.desc && this.selectedProfile.desc.ageGroup == 'child') {
      this.role = 'child'
    } else {
      this.role = 'patient'
    }
    this.storage.set('role', this.role);
    this.loading = true;
    this.educations = [];
    this.allService.categoryService.getForm({
      profileIDs: [profile._id],
      formTypes: ['introduction', 'profile registry']
    }).then((data: any) => {

      this.temp = data;

      this.forms = this.temp;
      var obIDs = [];
      for (let form of this.forms) {

        for (let obSet of form.obSets) {
          for (let ob of obSet.obs) {
            obIDs.push(ob._id)
          }
        }
      }
      this.allService.categoryService.getCategoriesByFilter({ '_id': { '$in': obIDs } }).then((data: any) => {
        this.temp = data;
        this.loading = false;
        for (let item of this.temp) {
          for (let form of this.forms) {
            for (let obSet of form.obSets) {
              for (let ob of obSet.obs) {
                if (ob._id == item._id) {
                  ob.education = item.education;
                  ob.options = [];
                  ob.options = item.options;
                  ob.formula = item.formula;
                }
              }
            }
          }
        }
        this.storage.set('forms', this.forms)
        // this.formReady=true;
        var image: any;
        if (this.provider.photo.slice(0, 4) != 'http') {
          image = this.apiUrl.setFormUploadPhoto + String(this.provider.photo) + '.png';
        } else if (this.provider.photo.slice(0, 4) == 'http') {
          image = this.provider.photo;
        }

        this.storage.set('color', this.provider.color)
        var title = this.provider.name + ', ' + this.provider.title + '|' + this.selectedProfile.label.ch;
        var link = 'https://www.digitalbaseas.com/public-platform/homepage/provider-card/' + this.provider._id + '/' + this.profile._id;
        if (this.isWeixin) {
          this.getSignature(this.profile.desc.patient, title, image, link);
        }
        console.log('get form', this.forms);
        this.loading = false;
      })
    })
  }


  getProfiles() {

    var profileIDs = [];
    for (let profile of this.provider.profiles) {
      profileIDs.push(profile._id)
    }
    if (!this.profiles) {
      this.loading = true;
      this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data: any) => {
        this.temp = data;
        this.profiles = this.temp;

        console.log('this.profiles', this.profiles)
        this.loading = false;
      })
    }
  }


  getServices() {
    if (!this.services) {
      this.loading = true;
      this.allService.usersService.getByFilter({ role: 'service' }).then((data: any) => {
        this.temp = data;
        this.services = this.temp;
        this.loading = false;
      })
    }
  }


  getProviders() {
    if (!this.providers) {
      this.loading = true;
      this.allService.usersService.getByFilter({ role: 'provider', status: '2' }).then((data: any) => {
        this.temp = data;
        this.providers = this.temp;
        this.loading = false;
      })
    }
  }

  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }


  registryService(service: any, profile: any) {

    this.service = this.storage.set('service', service)
    this.profile = this.storage.set('profile', profile)
    this.router.navigate(['/homepage/registry']);
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


  getProfile(profile: any) {
    this.storage.set('profileID', profile._id);
    this.storage.set('photo', profile.image);
    this.storage.set('profile', profile)
  }

  goToHome() {
    this.router.navigate(['/homepage/profile-intro'])
  }
}