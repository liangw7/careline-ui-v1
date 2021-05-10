import { Component, OnInit, Inject, ElementRef, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { AllServices } from '../../common-services';

/**
 * 暂存此处,后期调整
 */
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  focus: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/provider-platform/provider/dashboard', title: '主页', icon: 'fa fa-area-chart', class: '', focus: 'management' },
  { path: '/provider-platform/provider/patient-list', title: '病人', icon: 'fa fa-patient', class: '', focus: 'patient' },
  { path: '/homepage/home/user-list', title: '用户注册', icon: 'fa fa-drivers-license-o', class: '', focus: 'management' },
  { path: '/homepage/home/consults', title: '会诊', icon: 'fa fa-user-md', class: '', focus: 'patient' },
  { path: '/provider-platform/provider/provider-schedule', title: '预约', icon: 'fa fa-calendar', class: '', focus: 'patient' },
  { path: '/homepage/home/notifications', title: '通知', icon: 'fa fa-bell', class: '', focus: 'management' },
  { path: '/homepage/home/user-profile', title: '我', icon: 'fa fa-user', class: '', focus: 'management' },
  { path: '/homepage/home/category-list', title: 'Category', icon: 'fa fa-list', class: '', focus: 'management' },
];

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private sidebarVisible: boolean;
  user: any;
  language: any;
  listTitles: any;
  toggleButton: any;
  mobile_menu_visible: any = 0;
  bigScreen: any;
  screenWidth: any;
  screenHeight: any;
  color: any;

  constructor(
    private allService: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public location: Location,
    private element: ElementRef,
    private router: Router
  ) {
    this.user = this.storage.get('user');
    this.language = this.storage.get('language');
    this.allService.sharedDataService.sendLanguage(this.language);
    this.sidebarVisible = false;
    this.bigScreen = this.storage.get('bigScreen');
    // this.getScreenSize();
    this.color = this.storage.get('color')

  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   this.bigScreen = 0
  //   console.log('this.screenWidth', this.screenWidth)
  //   if (this.screenWidth <= 992)
  //     this.bigScreen = 0;
  //   else
  //     this.bigScreen = 1;
  //   this.storage.set('bigScreen', this.bigScreen)
  // }


  ngOnInit() {

    if (this.user && this.user.email != 'liangw0730@gmail.com') {
      this.allService.authService.checkAuthentication().then((res: any) => {

        console.log("Already authorized", res);

      }, (err: any) => {
        this.router.navigate(['/homepage/login']);

      });
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event: any) => {
        //this.sidebarClose();
        var $layer: any = document.getElementsByClassName('close-layer')[0];
        if ($layer) {
          $layer.remove();
          this.mobile_menu_visible = 0;
        }
      });
    }
  }


  goBack() {
    this.router.navigate(['/homepage/sidebar']);
  }


  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
  };

  setLanguae($event: { value: any; }) {
    this.language = $event.value;
    this.storage.set('language', this.language);
    this.allService.sharedDataService.sendLanguage(this.language);
  }


  isMaps(path: any) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    }
    else {
      return true;
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  /**
   * 退出方法
   */
  logout() {
    this.allService.authService.logout('/homepage/profile-intro');
    this.allService.sharedRoleService.sendUserRole('');
    this.user = null;
  }

}
