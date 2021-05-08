import {
  Component, OnInit, Inject, HostListener, ViewChild,
  AfterViewInit, OnDestroy, ElementRef
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import WechatJSSDK from 'wechat-jssdk/dist/client.umd';
import { ApiUrl, User } from 'src/app/core/models';
import { AllServices, WechatJssdkConfig } from 'src/app/core/common-services';
import { environment } from 'src/environments/environment';
const WechatJSSDK = require('wechat-jssdk');
@Component({
  selector: 'service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})

export class ServiceComponent implements OnInit, AfterViewInit, OnDestroy {
  isWeixin: any;
  serviceList: any;
  marketPlace: any;
  marketPlaceID: any;
  articleSelected: any;
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
  providerSelected: any;
  services: any;
  providers: any;
  signature: any;
  introForms: any;
  provider: any;
  articles: any;
  selectedArticle: any;
  articleForms: any;
  screenHeight: any;
  screenWidth: any;
  photo: any;
  @ViewChild('textInput', { read: ElementRef })
  textInput!: ElementRef;
  background:any;

  constructor(
    private entity: ApiUrl,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private wechatJssdkConfig: WechatJssdkConfig,
    private titleService: Title,
    private dialogRef: MatDialogRef<ServiceComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.language = this.storage.get('language');
    this.isWeixin = this.storage.get('isWeixin');
    this.screenHeight = window.screen.height * 1.2  + "px";
    this.screenWidth = window.screen.width * 1.48 + "px";
    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
    this.getScreenSize();
    //this.bigScreen = this.storage.get('bigScreen');
    // this.storage.set('bigScreen', this.bigScreen);
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {

    var screenWidth = window.innerWidth;
    
    if (screenWidth <= 992)
      this.bigScreen = 0;
    else
      this.bigScreen = 1;
  

  }


  ngOnInit() {
    var loc = location.href;
    this.storage.set('location', loc);
    this.allService.sharedPageTypeService.sendPageType('patient');

    this.titleService.setTitle("数基健康")
    var serviceID = this.route.snapshot.paramMap.get('serviceID');
    this.loading = true;
    this.allService.usersService.findUserById(serviceID).then((data: any) => {
      this.service = data;

      console.log('this.service', this.service)
      this.descSelected = true;

   //console.log ('image', image)
      this.introForms = [];
      this.getBackground();
      this.getPhoto();
      // console.log ('this.service.introForms[0]._id',this.service.introForms[0]._id)
      if (this.service.introForms.length > 0) {
        var formID = this.service.introForms[0]._id;
        //this.selectIntro(this.service.introForms[0]);
        this.allService.categoryService.getFormById({ formIDs: [formID] }).then((data: any) => {
          // this.temp=data;
          this.introForms = data;
          console.log('this.introForms', this.introForms)
          this.loading = false;
          if (this.introForms.length > 0) {
            if (this.introForms[0]) {
              if (!this.introForms[0].counter) {
                this.introForms[0].counter = 0;
              }
            }
            this.introForms[0].counter++;
            this.allService.categoryService.update(this.introForms[0]).then((data: any) => {
              //console.log ('counter',  this.introForms[0].counter++)
            })
          }

          console.log('this.introForms', this.introForms);
          this.getProviders();
          if (this.isWeixin) {
            this.getSignature(this.service.desc, this.service.name, this.photo);
          }
        })
      } else {
        this.getProviders();
        if (this.isWeixin) {
          this.getSignature(this.service.desc, this.service.name, this.photo);
        }
      }
    })
  }

  ngAfterViewInit() {

    //setTimeout(() => this.textInput.nativeElement.focus(), 10); 
  }

  getBackground(){
    if (this.service.activity){
        
      var image = this.entity.setFormUploadPhoto 
            + String(this.service.activity.backgroundImage) 
            + '.png';
  
      this.background = this.getUrl(image);
    }
  }

  getPhoto(){
    var image: any;
    if (this.service.photo&&this.service.photo.slice(0, 4) != 'http')
      image = this.entity.setFormUploadPhoto + String(this.service.photo) + '.png';
    else if (this.service.photo&&this.service.photo.slice(0, 4) == 'http')
      image = this.service.photo;
    this.photo = this.getUrl(image);
  }

  goToLogin() {

    this.router.navigate(['public-platform/homepage/login']);
  }

  getSignature(desc: any, title: any, image: any) {
    console.log('--ServiceCardComponent--getSignature--start');
    var jsApiList: [] = [];
    var link = location.href.split('#')[0];
    return this.allService.wechatJssdkService.getSignature(desc, title, title, image, link, jsApiList, 0);
  }


  getProfiles() {
   
    var profileIDs = [];
    for (let profile of this.service.profiles) {
      profileIDs.push(profile._id)
    }
    if (!this.profiles) {
      this.loading = true;
      //for testing, will change back
     // this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data: any) => {
        this.allService.categoryService.getCategoriesByFilter({ field: 'profile', status:'active' }).then((data: any) => {
    
        this.temp = data;
        this.profiles = this.temp;

        console.log('this.profiles', this.profiles)
        this.loading = false;
      })
    }
  }
  getBackgroundColor(hex:String, lum:any){

    var color=this.getLighter(hex, lum);
    return this.getLighter(color, lum);
    
  }

  getLighter(hex:any, lum:any){

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum*2 || 0;
  
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }
  
    return rgb;
  
}

  getProviders() {
    if (!this.providers) {
      var providerIDs = [];
      for (let provider of this.service.providers) {
        providerIDs.push(provider._id)
      }

      this.loading = true;
      //for teesting will change back
      this.allService.usersService.getByFilter({role:'provider' }).then((data: any) => {
      
    //  this.allService.usersService.getByFilter({ _id: { '$in': providerIDs }, status: '2' }).then((data: any) => {
        this.temp = data;
        this.providers = this.temp;

        console.log('this.providers', this.providers)
        this.loading = false;
      })
    }
  }


  getArticles() {
    if (!this.articles) {
      var providerIDs = [];
      this.articles = [];
      for (let provider of this.service.providers) {
        providerIDs.push(provider._id)
      }
      this.loading = true;
      this.allService.categoryService.getCategoriesByFilter({ 'createdBy._id': { '$in': providerIDs }, 'status': 'active' }).then((data: any) => {
        this.temp = data;
        this.articles = this.temp;

        console.log('this.artiles', this.articles)
        this.loading = false;
      })
    }
  }

  selectArticle(article: any) {
    this.articleForms = [];
    this.allService.categoryService.getFormById({ formIDs: [article._id] }).then((data: any) => {
      this.articleForms = data;
    })
  }

  selectIntro(form: any) {
    this.articleForms = [];
    this.allService.categoryService.getFormById({ formIDs: [form._id] }).then((data: any) => {
      this.introForms = data;
    })
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
  }


  providerRegister() {
    //alert('ok1')
    this.user = this.storage.get('user');
    
    if (this.user) {
      if (this.userRoleIsInRoleList(this.user)) {
        this.saveProvider();
      } else {
        // 如果不是医护工作者,不需要绑定
        this.allService.alertDialogService.warn('只有医护工作者才可以加盟,您当前账号非医护工作者!')
      }
    } else {
      // alert('ok2')
      var role = 'provider';
      // this.profiles=this.service.profiles;
      this.storage.set('profiles', this.profiles);
      this.storage.set('role', role);
      this.storage.set('service', this.service);
      this.isWeixin = this.storage.get('isWeixin');
      if (this.isWeixin) {
        window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
      } else {
        // 在已经登录情况下,根据用户角色重定向到登录页面
        let userBindInfo = new User;
        if (this.profile) {
          userBindInfo.profiles = this.profile;
        }
        if (this.service) {
          userBindInfo.service = this.service;
        }
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: 1,
            userBindInfo: userBindInfo
          }
        })
      }
    }
  }

  /**
   * 判断当天用户是否是医护工作者
   */
   userRoleIsInRoleList(user: any) {
    let flag = false;
    for (let index = 0; index < environment.healthCareWorkerRoles.length; index++) {
      const role = environment.healthCareWorkerRoles[index];
      if (user.role == role) {
        flag = true;
      }
    }
    return flag;
  }


  saveProvider() {
    if (!this.provider.profiles)
      this.provider.profiles = [];

    if (!this.allService.utilService.findItem(this.profile, this.provider.profiles)) {
      this.provider.profiles.push(this.profile);
    }
    console.log('this.provider', this.provider)
    if (this.bigScreen == 0 && !this.provider.openID) {
      this.provider.openID = this.storage.get('openID');
    }

    this.allService.usersService.updateUser(this.provider).then((data: any) => {
      this.temp = data;
      this.provider = this.temp;
      this.allService.alertDialogService.alert('Provider updated')
      console.log('user updated:', this.provider)
      this.storage.set('user', this.provider);
      this.router.navigate(['/provider-platform/my-projects/home']);
    })
  }

  goToHome() {
    this.router.navigate(['/homepage/profile-intro'])
  }
}