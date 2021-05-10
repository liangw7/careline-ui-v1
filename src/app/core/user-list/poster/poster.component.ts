
import { Subscription } from 'rxjs/';
import { Component, OnInit, OnDestroy, Input, Inject, ViewChild, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormComponent } from '../../common-components';
import { AllServices } from '../../common-services';
import { ApiUrl } from '../../models';

var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss']
})
export class PosterComponent implements OnInit, OnDestroy {
  forms: any;
  temp: any;
  registryUser: any;
  user: any;
  role: any;
  profiles: any;
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
  @Input() profile: any;
  loadUser: any;
  image4: any;
  image5: any;
  generalInfor: any;
  profileInfor: any;
  follow: any;
  hideEducation: any;
  patient: any;
  visit: any;
  desc: any;
  width: any;
  height: any;

  @ViewChild('template')
  template!: FormComponent;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.allService.alertDialogService.alert('ok')
  }

  constructor(
    private apiUrl: ApiUrl,
    private allService: AllServices,
    public dialogRef: MatDialogRef<PosterComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log ('this.profile+++++++++++++', this.profile)
    this.QRCodeURL = QRCodeURL;
    // if (!this.profile)
    this.profile = data.profile;
    // alert('profile'+this.profile._id)
    this.user = this.storage.get('user')
    if (this.user.role == 'provider') {
      this.hideEducation = undefined;
    } else {
      this.hideEducation = true;
    }

    this.patient = data.patient;
    // alert('this.patient.photo'+this.patient.photo)
    this.visit = data.visit;
    if (!this.visit) {
      this.width = 400;
      this.height = 600;
    } else {
      this.width = 400;
      this.height = 250;
    }
    this.desc = data.desc;
    if (this.desc)
      this.desc = this.patient.gender + ',' + this.patient.age + ',' + this.desc;
    // alert('visit'+this.visit._id)
    // alert('patient'+this.patient._id)
    this.color = this.storage.get('color')
    this.bigScreen = this.storage.get('bigScreen')
    // this.user.URLphoto=this.allService.utilService.getImageUrl(URL+'photo-'+String(this.user.photo)+'.png');


    if (this.user) {
      if (this.user.photo) {
        this.user.imageOrigin = this.user.photo;

        this.user.URLphoto = this.allService.utilService.getHttpUrl(this.user.photo);

        this.color = this.storage.get('color')

        console.log('this.user.photo', this.user.photo);
      }
    }

    this.language = this.storage.get('language')

    this.subscription = this.allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
    if (this.user.role == 'provider' && this.profile && !this.visit) {
      this.profile.QRCode = this.QRCodeURL + 'homepage/provider-card/'
        + this.user._id + '/'
        + this.profile._id + '/'


    } else if (this.user.role != 'provider' && this.profile && !this.visit) {
      this.profile.QRCode = this.QRCodeURL + 'homepage/registry/'
        + this.profile._id + '/'
        + undefined + '/'
        + this.color + '/'
        + undefined


    } else if (this.visit) {
      this.profile.QRCode = this.QRCodeURL + 'homepage/patient-visit/'
        + this.patient._id + '/'
        + this.visit._id + '/'
        + this.profile._id + '/'
      //  +'profile registry';
    }
    console.log(' profile.QRCode', this.profile.QRCode)
    this.allService.categoryService.getCategory(this.profile._id).then((data: any) => {
      this.profile = data;
      //  this.profile.imageOrigin=this.temp.image;
      //this.profile.image=this.getUrl(this.profile);
      console.log('profile.image', this.profile.image)
      //this.profile.desc=this.temp.desc;
    })
  }

  getUrl(item: any) {
    return this.allService.utilService.getHttpUrl(item);
  }


  getUserDataUrl(event: { currentTarget: any; }) {
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


  getProfileDataUrl(event: { currentTarget: any; }) {

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
      //    this.profilePhoto=dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
  }

  downloadImage() {

    // if (this.loadUser==true||this.user||!this.user.photo){
    if (!this.image1) {
      this.loading = true;
      this.image1 = new Image;
      //  this.image1.setAttribute('crossorigin', 'use-credentials')
      // this.image1.src=this.profile.dataPhoto;  
      this.image1.src = this.apiUrl.setFormUploadPhoto + String(this.profile.image) + '.png';
      //this.image1.src=this.profile.image;
      console.log(' this.image1.src', this.image1.src)

      //user
      if (!this.visit && this.user && this.user.role == 'provider') {
        this.image3 = new Image;
        //  this.image3.setAttribute('crossorigin', 'use-credentials')
        if (this.user.photo.slice(0, 4) != 'http')
          this.image3.src = this.apiUrl.setFormUploadPhoto + String(this.user.photo) + '.png';
        else
          this.image3.src = this.user.photo;

      } else if (this.patient && this.visit) {
        this.image3 = new Image;
        //  this.image3.setAttribute('crossorigin', 'use-credentials')
        if (this.patient.photo.slice(0, 4) != 'http')
          this.image3.src = this.apiUrl.setFormUploadPhoto + String(this.patient.photo) + '.png';
        // else
        // this.image3.src=this.patient.photo;
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

        context.drawImage(this.image1, 0, 0, canvas.width, canvas.height);
        if (this.image3)
          context.drawImage(this.image3, canvas.width - canvas.width / 5, canvas.height - canvas.height / 5, canvas.height / 5, canvas.height / 5);

        context.drawImage(this.image4, 0, canvas.height * 0.95, canvas.width / 12, canvas.width / 12);
        context.drawImage(this.image2, canvas.width - canvas.width / 5, canvas.height / 25, canvas.width / 6, canvas.width / 6);
        this.loading = false;
        // context.clearRect(0, canvas.height*0.4, canvas.width, canvas.height*0.5);
        context.fillStyle = "black";
        context.font = "bold 20px Comic Sans MS"

        context.fillText('数基健康', canvas.width / 12, canvas.height * 0.98);

        context.fillStyle = "black";
        context.font = "bold 26px Comic Sans MS"
        //title
        var title = this.profile.label.ch;
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
        if (!this.desc) {
          this.desc = this.profile.desc.patient;
        }
        // alert('desc'+this.desc)
        if (this.desc) {
          context.fillStyle = "black";
          context.font = "bold 16px Comic Sans MS"
          var descList = this.desc.split(".");
          console.log('descList', descList)
          var n = 0;
          for (let item of descList) {
            n++;
            var temp = item.match(/.{1,25}/g)
            console.log('temp', temp)
            if (temp && temp.length > 0) {
              for (let tem2 of temp) {
                console.log('tem2', tem2)
                n++;
                context.fillText(tem2, 10, canvas.height * 0.3 + n * 20);
              }
            }


          }

        }
        //this.href = document.getElementsByTagName('img')[0].src;
        this.href = canvas.toDataURL('data/png');
        // console.log ('this.href', this.href)

        // }
      }
      // context.drawImage(this.image5, 0, 0, canvas.width,canvas.height);


    }
  }

  getLines(descList: any, context: { fillText: (arg0: any, arg1: number, arg2: number) => void; }, canvas: { height: number; }, num: number, heig: number) {
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

  downloadVisitImage() {

    // if (this.loadUser==true||this.user||!this.user.photo){
    this.loading = true;
    this.image1 = new Image;
    //  this.image1.setAttribute('crossorigin', 'use-credentials')
    this.image1.src = this.profile.dataPhoto;
    this.image1.src = this.apiUrl.setFormUploadPhoto + String(this.profile.image) + '.png';
    //this.image1.src=this.profile.image;
    console.log(' this.image1.src', this.image1.src)

    //user

    //bar code
    this.image2 = new Image;
    this.imageList = document.getElementsByTagName('img')
    for (let item of this.imageList) {
      if (item.src.includes('data')) {
        this.image2.src = item.src;
      }
    }
    this.image3 = new Image;
    if (this.patient.photo.slice(0, 4) != 'http')
      this.image3.src = this.apiUrl.setFormUploadPhoto + String(this.patient.photo) + '.png';
    else
      this.image3.src = this.user.photo;

    this.image4 = new Image;
    this.image4.src = './assets/img/careline.png';
    this.image5 = new Image;
    this.image5.src = './assets/img/clouds.jpg';
    //var canvas = document.querySelector('canvas');
    var canvas = <HTMLCanvasElement>document.getElementById('canvas');

    var context = canvas.getContext('2d');
    if (context) {

      // context.drawImage(this.image5, 0, 0, canvas.width,canvas.height);

      context.drawImage(this.image1, canvas.width * 0.6, 0, canvas.width * 0.4, canvas.height);

      context.drawImage(this.image3, 0, 0, canvas.width / 6, canvas.width / 6);
      //context.drawImage(this.image4, canvas.width-canvas.width/12,canvas.height-canvas.width/12, canvas.width/12, canvas.width/12);
      context.drawImage(this.image2, canvas.width - canvas.width / 6, canvas.height - canvas.width / 6, canvas.width / 6, canvas.width / 6);
      this.loading = false;
      // context.clearRect(0, canvas.height*0.4, canvas.width, canvas.height*0.5);
      context.fillStyle = "black";
      context.font = "10px Comic Sans MS"

      context.fillText('数基健康', canvas.width - canvas.width / 3, canvas.height * 0.98);

      context.fillStyle = "steelblue";
      context.font = "20px Comic Sans MS"
      //title
      var title = this.profile.label.ch;
      var n = 0;
      while (title.length > 0) {

        console.log('title', n, title)
        if (title.length <= 9) {
          var sub = title;
          context.fillText(sub, canvas.width * 0.2, canvas.height * 0.15 + n * 35);
          title = '';
        } else if (title.length > 9) {

          sub = title.substr(0, 10);


          context.fillText(sub, canvas.width * 0.2, canvas.height * 0.15 + n * 35);
          console.log('sub', sub)
          title = title.substr(10, title.length - 10);
          console.log('title-2', title)
        }
        n++;
      }
      // context.fillStyle = "white";
      // context.font="bold 13px Comic Sans MS"

      // context.fillText( '美国UPTODATE权威诊疗标准',0, canvas.height*0.05);

      //description
      var infor = this.patient.gender + ',' + this.patient.age;

      if (infor) {
        context.fillStyle = "steelblue";
        // context.font="bold 16px Comic Sans MS"
        context.font = "18px Comic Sans MS"
        context.fillText(infor, canvas.width / 5, canvas.height * 0.3);

      }
      //var desc=this.forms[0].obSets[0].obs[1].value;;

      if (this.desc) {
        context.fillStyle = "steelblue";
        // context.font="bold 16px Comic Sans MS"
        context.font = "15px Comic Sans MS"
        var descList = this.desc.split(".");
        console.log('descList', descList)
        var n = 0;
        for (let item of descList) {
          n++;
          var temp = item.match(/.{1,30}/g)
          console.log('temp', temp)
          if (temp && temp.length > 0) {
            for (let tem2 of temp) {
              console.log('tem2', tem2)
              n++;
              context.fillText(tem2, 10, canvas.height * 0.3 + n * 25);
            }
          }
        }
      }
      //this.href = document.getElementsByTagName('img')[0].src;
      this.href = canvas.toDataURL('data/png');
      console.log('this.href', this.href)
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
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close()
  }
}