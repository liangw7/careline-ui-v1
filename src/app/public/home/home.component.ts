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
    console.log('bigScreen', this.bigScreen)
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


