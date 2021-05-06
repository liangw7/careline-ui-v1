import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllServices } from 'src/app/core/common-services/all-services';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit {
  bigScreen: any;
  screenWidth: any;
  screenHeight: any;
  loading: any;
  language: any;
  screenSize: any;
  appID: any;
  appSecrete: any;
  temp: any;
  accessToken: any;
  signature: any;
  user: any;
  weChatAccess: any;
  access: any;
  code: any;
  color: any;
  credentials: any;
  subscription: Subscription;
  userRole: any;
  registry: any;
  publish: any;
  photo: any;
  profileID: any;
  projectSelected: any;
  pageType: any;
  isWeixin: any;
  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HomeComponent>) {
    this.loading = true;
    this.language = 'Chinese';
    this.allService.sharedDataService.sendLanguage(this.language);
    this.storage.set('language', this.language);
    this.user = this.storage.get('user');
    this.isWeixin = this.storage.get('isWeixin');
    
    this.subscription = this.allService.sharedRoleService.dataSent$.subscribe(
      (userRole: any) => {
        this.userRole = userRole;
      });
    this.subscription = this.allService.sharedPageTypeService.dataSent$.subscribe(
      (pageType: any) => {
        this.pageType = pageType;
      });

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.bigScreen = this.storage.get('bigScreen');

    if (this.bigScreen == 0)
      this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
        this.code = params['code'];
        //alert('got code'+this.code)
      });
    this.photo = this.storage.get('photo');
    this.profileID = this.storage.get('profileID');
    // console.log(this.screenHeight, this.screenWidth);
  }

  ngOnInit() {
    this.bigScreen = this.storage.get('bigScreen');
    this.getScreenSize();
   console.log ('bigScreen', this.bigScreen)
    this.titleService.setTitle('数基健康');
    var loc = location.href;
  }

  ngAfterContentInit() {
    this.loading = false;
  }

  setLanguage($event: any) {
    this.language = $event.value;
    this.storage.set('language', this.language);
    this.allService.sharedDataService.sendLanguage(this.language);
  }

  setLanguageCell(event: any) {
    this.language = event;
    this.storage.set('language', this.language);
    this.allService.sharedDataService.sendLanguage(this.language);
  }

  // login() {
  //   this.allService.usersService.getWeChatAccess(this.code).then((data: any) => {
  //     this.weChatAccess = data;
  //     if (this.weChatAccess) {
  //       var weChatID = this.weChatAccess.unionid;
  //       this.allService.usersService.getByFilter({ weChatID: weChatID }).then((data: any) => {
  //       //  console.log(data);
  //         this.access = data;
  //         //if user has more than 0 acccount
  //         if (this.access.length == 1) {
  //           this.credentials = {
  //             email: this.access[0].email,
  //             password: this.access[0].weChatID + this.access[0].role
  //           };
  //           this.loginUser();
  //         }
  //         else if (this.access.length > 1) {
  //           const dialogConfig = new MatDialogConfig();

  //           // dialogConfig.disableClose = true;
  //           var selectRole = []
  //           dialogConfig.autoFocus = true;
  //           for (let item of this.access) {
  //             selectRole.push(item.role)
  //           }


  //           dialogConfig.data = {
  //             'selectRole': selectRole,
  //             'language': this.language
  //           };
  //           if (this.bigScreen == 1) {
  //             dialogConfig.position = { top: '5%', left: '60%' };
  //           }
  //           else {
  //             dialogConfig.position = { top: '10%', left: '5%' };
  //           }
  //           this.loading = false;
  //           const dialogRef = this.dialog.open(MessageBoxComponent,
  //             dialogConfig);
  //           dialogRef.afterClosed().subscribe((result: { role: { en: any; }; }) => {
  //             if (result) {
  //               this.credentials = {
  //                 email: this.access[0].weChatID + result.role.en + '@db.com',
  //                 password: this.access[0].weChatID + result.role.en
  //               }

  //               this.loginUser();
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }
  // loginUser() {
  //   this.allService.authService.login(this.credentials).then((res: any) => {
  //     // this.storage.set('bigScreen', this.bigScreen)
  //    // console.log("Already authorized", res);
  //     this.user = this.storage.get('user');
  //     if (this.user.role == 'patient')
  //       this.storage.set('patient', this.user);
  //     this.color = this.user.color;
  //     this.storage.set('user', this.user);
  //     this.storage.set('color', this.color);
  //     if (this.user.role == 'patient') {
  //       this.allService.sharedRoleService.sendUserRole('patient');
  //       this.storage.set('userRole', 'patient')
  //     }
  //     else if (this.user.role == 'provider') {
  //       this.allService.sharedRoleService.sendUserRole('provider');
  //       this.storage.set('userRole', 'provider')
  //     }
  //     window.location.href = this.storage.get('location');
  //   }, (err: any) => {
  //   //  console.log("Not already authorized");
  //     window.location.href = this.storage.get('location')
  //     this.loading = false;
  //   });
  // }
  loginConsult() {
    this.storage.set('consult', true);
    this.router.navigate(['/homepage/login-poster'])

  }
  goToProviderList() {
    this.storage.set('consult', true);
    this.router.navigate(['/homepage/login-poster'])
  }
  getProject() {
    var lot = this.storage.get('location');
    if (!lot) {
      this.router.navigate(['homepage/profile-intro'])
    }
    else {
      window.location.href = lot;
    }
  }
}


