import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { AllServices } from '../../core/common-services';
import { PosterComponent } from '../../core/common-components/poster/poster.component';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { MessageBoxComponent } from '../../core/common-components/message-box/message-box.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'account-provider',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountProviderComponent implements AfterViewInit, OnDestroy {
  forms: any;
  temp: any;
  registryUser: any;
  user: any;
  role: any;
  profiles: any;
  selectedProfiles: any;
  serviceList: any;
  selectedServiceList: any;
  providers: any;
  source: any;
  selectedProviders: any;
  selectedService: any;
  color: any;
  result: any;
  addUser: any;
  language: any;
  subscription: Subscription;
  QRCodeURL: any;
  count: any;
  href: any;
  image1: any;
  image2: any;
  imageList: any;
  image3: any;
  bigScreen: any;
  combined: any;
  loading: any;
  selectedProfile: any;
  loadUser: any;
  image4: any;
  image5: any;
  generalInfor: any;
  profileInfor: any;
  follow: any;
  missing: any;
  emBed: any;
  providerUrl: any;
  QRCode: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  @Input() showProfile;
  @Input() showCard;
  @Output() sendSubmit = new EventEmitter();

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
  //  this.allServices.alertDialogService.alert('ok')
  }

  constructor(
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    public router: Router,
    private dialog: MatDialog,
    //public dialogRef: MatDialogRef<UserRegistryComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.emBed = true;
    this.QRCodeURL = QRCodeURL;
    this.user = this.storage.get('user');
    this.QRCode = this.QRCodeURL + 'homepage/provider-card/' + this.user._id;
    this.color = this.storage.get('color')
    this.bigScreen = this.storage.get('bigScreen')
    if (this.bigScreen == 1) {
      this.showProfile = true;
      this.showCard = true;
    }
    this.user.imageOrigin = this.user.photo;
    if (this.user.role == 'admin') {
      this.allServices.categoryService.getCategoriesByFilter({ field: 'profile', status: 'active' }).then((data) => {
        this.temp = data;
        this.user.profiles = [];
        this.user.profiles = this.temp;
      })
    }
    if (this.user.photo) {
      if (this.user.photo.slice(0, 4) != 'http') {

        this.user.photo = URL + 'photo-' + String(this.user.photo) + '.png';
      }
      this.user.URLphoto = this.allServices.utilService.getUrl(String(this.user.photo));
      this.color = this.storage.get('color')
      console.log('this.user.photo', this.user.photo);
    }

    this.language = this.storage.get('language')
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
    /* if (this.user.role!='admin'){
       for (let profile of this.user.profiles){
             profile.QRCode=this.QRCodeURL+'homepage/registry/'+profile._id+'/'+this.user._id+'/'+this.color+'/'+this.user.undefined
        
             console.log (' profile.QRCode', profile.QRCode)
             this.categoryService.getCategory(profile._id).then((data)=>{
               this.temp=data;
               profile.imageOrigin=this.temp.image;
               profile.image=this.getUrl(profile);
               console.log ('profile.image',profile.image)
               profile.desc=this.temp.desc;
               if (this.user.profiles.indexOf(profile)==0){
                 this.selectedProfile=profile;
               }
             })
        }
     } else{
     this.categoryService.getCategoriesByFilter({field:'profile',status:'active'}).then((data)=>{
       this.temp=data;
       this.user.profiles=[];
       this.user.profiles=this.temp;
      console.log ('this.user.profiles',this.user.profiles)
       for (let profile of this.user.profiles){
         if (this.user.role=='provider'){
           profile.QRCode=this.QRCodeURL+'homepage/registry/'+profile._id+'/'+this.user._id+'/'+this.color+'/'+this.user.undefined
         } else{
           profile.QRCode=this.QRCodeURL+'homepage/registry/'+profile._id+'/'+this.user.undefined+'/'+this.color+'/'+this.user.undefined
      
         }
         profile.imageOrigin=profile.image;
         profile.image=this.getUrl(profile);
         if (this.user.profiles.indexOf(profile)==0){
           this.selectedProfile=profile;
         }
       }
     })
   }*/
  }


  selectProfile(profile: any) {
    this.selectedProfile = profile;
    console.log('this.selectedProfile', this.selectedProfile)
  }


  getUrl(item: any) {
    // console.log ('service photo', this.photo)
    if (item)
      return this.allServices.utilService.getImageUrl(String(item.imageOrigin));
    else
      return null
  }


  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
  }


  ngOnDestroy() {
    //  this.unloadNotification(this);
  }


  share(profile: any) {
    // this.save();
    // if (this.missing.length==0){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // this.bigScreen = this.storage.get('bigScreen');
    //find the provider for this profile
    dialogConfig.data = { profile: profile, user: this.user };
    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '90%',
        dialogConfig.width = '100%'
    }
    const dialogRef = this.dialog.open(PosterComponent,
      dialogConfig);
    // }
  }


  ngAfterViewInit() {
    this.generalInfor = true;
    this.loading = true;
    this.allServices.categoryService.getCategoriesByFilter({ 'field': 'form', 'label.en': this.user.role }).then((data) => {
      this.temp = data;
      if (this.temp.length > 0) {
        this.loading = true;
        this.allServices.categoryService.getUserForm({ formIDs: [this.temp[0]._id], userID: this.user._id }).then((data) => {
          this.temp = data;
          this.forms = this.temp;
          this.loading = false;
        })
      }
    })
  }


  tabSelectionChanged(event: any) {
    // Get the selected tab
    let selectedTab = event.tab;
    for (let profile of this.user.profiles) {
      if (profile.label.ch == selectedTab.textLabel) {
        this.selectedProfile = profile;
      }
    }
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (item._id == i._id) {
        return true;
      }
    }
    return false;
  }


  select(item: any, list: any) {
    if (!item.service) {
      if (!this.find(item, list)) {
        list.push({ _id: item._id, label: item.label });
      } else {
        list.splice(list.indexOf(item), 1);
      }
    } else {
      alert('provider is in other service')
    }
  }


  /*weixinShareTimeline(title,desc,link,imgUrl){
    WeixinJSBridge.invoke('shareTimeline',{
      "img_url":imgUrl,
      //"img_width":"640",
      //"img_height":"640",
      "link":link,
      "desc": desc,
      "title":title
    })
  }*/


  save() {
    if (this.follow)
      this.user.follow = this.follow;
    this.missing = [];
    for (let item of this.forms) {
      for (let obSet of item.obSets) {

        for (let ob of obSet.obs) {
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
          //   console.log ('ob.label',ob.label)
          if (ob.label.en == 'birthday')
            this.user.birthday = ob.value;
          else if (ob.label.en == 'name')
            this.user.name = ob.value;
          else if (ob.label.en == 'age')
            this.user.age = ob.value;
          else if (ob.label.en == 'gender' && ob.values && ob.values.length > 0)
            this.user.gender = ob.values[0].text;
          else if (ob.label.en == 'color' && ob.values && ob.values.length > 0)
            this.user.color = ob.values[0].text;
          else if (ob.label.en == 'ssn')
            this.user.ssn = ob.value;
          else if (ob.label.en == 'telephone')
            this.user.phone = ob.value;
          else if (ob.label.en == 'photo')
            this.user.photo = ob.value;
          else if (ob.label.en == 'title' && ob.values && ob.values.length > 0)
            this.user.title = ob.values[0].text;
          else if (ob.label.en == 'city' && ob.values && ob.values.length > 0)
            this.user.city = ob.values[0].text;
          else if (ob.label.en == 'specialty' && ob.values && ob.values.length > 0) {
            this.user.specialty = ob.values[0].text;
            var desc = ob.values[0].comments;
          } else if (ob.label.en == 'title description') {
            this.user.desc = ob.value;
            console.log('this.user.desc============', this.user.desc)
          } else if (ob.label.en == 'enTitle')
            this.user.enTile = ob.value;
          this.saveObData(ob, this.user);
        }
        if (!this.user.desc) {
          this.user.desc = desc;
        }

        console.log('this.user============', this.user)
        this.loading = true;
        this.allServices.usersService.updateUser(this.user).then((data) => {
          this.user = data;
          this.loading = false;
          var showProfile = false;
          this.sendSubmit.emit(showProfile);
          this.storage.set('user', this.user)
          console.log('user updated', this.user)
        })
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
      const dialogRef = this.dialog.open(MessageBoxComponent,
        dialogConfig);
    }
    if (this.follow)
      window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MTYyODQ3MQ==#wechat_redirect"
  }


  saveObData(ob: any, user: any) {
    ob.valueList = [];
    if (ob.type == 'list' && ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    this.allServices.datasService.getDatasByFilter2({
      obID: ob._id,
      registryUserID: user._id
    }).then((obData) => {
      this.temp = obData;
      //  console.log ('visit obData',obData);
      if (this.temp.length > 0) {
        ob.dataID = this.temp[0]._id;
        this.allServices.datasService.update({
          _id: ob.dataID,
          registryUserID: user._id,
          registryUserEmail: user.email,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          // console.log ('user data updated', data);
        });
      } else {
        this.allServices.datasService.create({
          registryUserID: user._id,
          registryUserEmail: user.email,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          // console.log ('user data created', data);
        })
      }
    });
  }


  close() {
    //     this.dialogRef.close()
  }


  logout() {
    this.allServices.authService.logout(['/homepage']);
    this.user = null;
  }
}