
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/';
import { Component, OnDestroy, Input, Output, EventEmitter, Inject, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormComponent, MessageBoxComponent } from '../../common-components';
import { PosterComponent } from '../poster/poster.component';
import { AllServices } from '../../common-services';
import { ApiUrl } from '../../models';

var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements AfterViewInit, OnDestroy {
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

  @Input() showProfile;
  @Input() showCard;
  @Output() sendSubmit = new EventEmitter();
  @ViewChild('template')
  template!: FormComponent;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.allService.alertDialogService.alert('ok')
  }

  constructor(
    private apiUrl: ApiUrl,
    private allService: AllServices,
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
      this.allService.categoryService.getCategoriesByFilter({ field: 'profile', status: 'active' }).then((data: any) => {
        this.temp = data;
        this.user.profiles = [];
        this.user.profiles = this.temp;
      })
    }
    if (this.user.photo) {
      this.user.URLphoto = this.allService.utilService.getHttpUrl(this.user.photo);
      this.color = this.storage.get('color')

      console.log('this.user.photo', this.user.photo);
    }

    this.language = this.storage.get('language')

    this.subscription = this.allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
  }


  selectProfile(profile: any) {
    this.selectedProfile = profile;
    console.log('this.selectedProfile', this.selectedProfile)
  }


  getUrl(item: any) {
    // console.log ('service photo', this.photo)
    if (item)
      return this.allService.utilService.getImageUrl(String(item.imageOrigin));
    else
      return null;
  }


  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
  }


  getUserDataUrl(event: any) {
    var img = event.currentTarget;
    img.crossOrigin = 'Anonymous';
    console.log('img user', img)
    var canvas = <HTMLCanvasElement>document.getElementById('userCanvas')
    var ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      var dataURL = canvas.toDataURL("image/png");
      this.user.dataPhoto = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

  }


  getProfileDataUrl(event: any) {

    var img = event.currentTarget;
    img.crossOrigin = 'Anonymous';
    console.log('img profile user', img)
    var canvas = <HTMLCanvasElement>document.getElementById('profileCanvas')
    var ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      var dataURL = canvas.toDataURL("image/png");
      this.user.profilePhoto = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
  }


  downloadImage() {

    if (this.loadUser == true || this.user || !this.user.photo) {
      this.loading = true;
      this.image1 = new Image;
      //  this.image1.setAttribute('crossorigin', 'use-credentials')
      this.image1.src = this.selectedProfile.dataPhoto;
      this.image1.src = this.apiUrl.setFormUploadPhoto + String(this.selectedProfile.imageOrigin) + '.png';
      //this.image1.src=this.selectedProfile.image;
      console.log(' this.image1.src', this.image1.src)

      //user
      if (this.user.role == 'provider') {
        this.image3 = new Image;
        //  this.image3.setAttribute('crossorigin', 'use-credentials')
        //if (this.user.photo.slice(0,4)!='http')
        this.image3.src = this.apiUrl.setFormUploadPhoto + String(this.user.imageOrigin) + '.png';
        // else
        //this.image3.src=this.user.dataPhoto;

      }
      //bar code
      this.image2 = new Image;
      this.imageList = document.getElementsByTagName('img')
      for (let item of this.imageList) {
        if (item.src.includes('data')) {
          this.image2.src = item.src;
        }
      }
      this.image4 = new Image;
      this.image4.src = './assets/img/careline.png';
      this.image5 = new Image;
      this.image5.src = './assets/img/clouds.jpg';
      //var canvas = document.querySelector('canvas');
      var canvas = <HTMLCanvasElement>document.getElementById('canvas');

      var context = canvas.getContext('2d');
      if (context) {

        // context.drawImage(this.image5, 0, 0, canvas.width,canvas.height);

        context.drawImage(this.image1, 0, 0, canvas.width, canvas.height);
        if (this.user.role == 'provider')
          context.drawImage(this.image3, canvas.width * 0.75, canvas.height * 0.25, canvas.width / 4, canvas.width / 4);
        context.drawImage(this.image4, 0, canvas.height * 0.95, canvas.width / 12, canvas.width / 12);
        context.drawImage(this.image2, canvas.width - canvas.width / 6, canvas.height - canvas.width / 6, canvas.width / 6, canvas.width / 6);
        this.loading = false;
        // context.clearRect(0, canvas.height*0.4, canvas.width, canvas.height*0.5);
        context.fillStyle = "white";
        context.font = "bold 20px Comic Sans MS"

        context.fillText('数基健康', canvas.width / 12, canvas.height * 0.98);

        context.fillStyle = "white";
        context.font = "bold 26px Comic Sans MS"
        //title
        var title = this.selectedProfile.label.ch;
        var n = 0;
        while (title.length > 0) {

          console.log('title', n, title)
          if (title.length <= 9) {
            var sub = title;
            context.fillText(sub, canvas.width * 0.1, canvas.height * 0.15 + n * 35);
            title = '';
          } else if (title.length > 9) {

            sub = title.substr(0, 10);

            context.fillText(sub, canvas.width * 0.1, canvas.height * 0.15 + n * 35);
            console.log('sub', sub)
            title = title.substr(10, title.length - 10);
            console.log('title-2', title)
          }
          n++;
        }
        context.fillStyle = "white";
        context.font = "bold 13px Comic Sans MS"

        context.fillText('美国UPTODATE权威诊疗标准', 0, canvas.height * 0.05);

        //description
        if (this.selectedProfile.desc) {
          context.fillStyle = "white";
          context.font = "bold 16px Comic Sans MS"
          var descList = this.selectedProfile.desc.patient.split(".");
          console.log('descList', descList)
          var n = 0;
          for (let item of descList) {
            n++;
            var temp = item.match(/.{1,15}/g)
            console.log('temp', temp)
            if (temp && temp.length > 0) {
              for (let tem2 of temp) {
                console.log('tem2', tem2)
                n++;
                context.fillText(tem2, 10, canvas.height * 0.42 + n * 20);
              }
            }
          }
        }
        //this.href = document.getElementsByTagName('img')[0].src;
        this.href = canvas.toDataURL('data/png');
        // console.log ('this.href', this.href)
      }
    }
  }

  getLines(descList: any, context: any, canvas: any, num: any, heig: any) {
    var n = 0;
    for (let item of descList) {
      n++;
      if (num == 1) {
        var temp = item.match(/.{1,18}/g)
      } else if (num == 0) {
        var temp = item.match(/.{1,10}/g)
      }


      console.log('temp', temp)
      if (temp && temp.length > 0) {
        for (let tem2 of temp) {
          console.log('tem2', tem2)
          n++;
          context.fillText(tem2, 10, canvas.height * heig + n * 20);
        }
      }


    }
  }


  checkload(event: any) {
    var nloaded = 0;
    nloaded++;
    if (nloaded < 2) {
      return;
    }

    var canvas = document.querySelector('canvas');
    if (canvas) {
      var context = canvas.getContext('2d');
      if (context) {
        context.drawImage(this.image1, 0, 0, 50, 50);
        context.drawImage(this.image2, 50, 50, 100, 100);

        var combined = new Image;
        combined.src = canvas.toDataURL('data/gif');

        document.body.appendChild(combined);
      }
    }
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
  }


  ngAfterViewInit() {
    this.generalInfor = true;
    this.loading = true;
    this.allService.categoryService.getCategoriesByFilter({ 'field': 'form', 'label.en': this.user.role }).then((data: any) => {

      this.temp = data;
      if (this.temp.length > 0) {
        this.loading = true;
        this.allService.categoryService.getUserForm({ formIDs: [this.temp[0]._id], userID: this.user._id }).then((data: any) => {
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
      this.allService.alertDialogService.alert('provider is in other service')
    }
  }


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
        this.allService.usersService.updateUser(this.user).then((data: any) => {
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

    this.allService.datasService.getDatasByFilter2({
      obID: ob._id,
      registryUserID: user._id
    }).then((obData: any) => {
      this.temp = obData;
      //  console.log ('visit obData',obData);
      if (this.temp.length > 0) {

        ob.dataID = this.temp[0]._id;
        this.allService.datasService.update({
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
        }).then((data: any) => {
          // console.log ('user data updated', data);
        });
      } else {
        this.allService.datasService.create({
          registryUserID: user._id,
          registryUserEmail: user.email,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data: any) => {
          // console.log ('user data created', data);
        })
      }
    });
  }


  close() {
  }

  /**
   * 退出方法
   */
  logout() {
    this.allService.authService.logout('/homepage');
    this.user = null;
  }
}