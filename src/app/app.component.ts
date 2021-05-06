import { Component, AfterViewInit, HostListener, Inject } from '@angular/core';
import {
  Router, NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from './core/common-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  loading: any;
  screenHeight: any;
  screenWidth: any;
  bigScreen: any;
  isPcVisit: any;


  constructor(
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private allServices: AllServices
  ) {
    this.loading = true;
    this.isPcVisit = this.isPc();
    console.log(this.isPcVisit);
    this.storage.set('isPc', this.isPcVisit);
    var isWeixin = this.isWeiXin();
    console.log(isWeixin);
    this.storage.set('isWeixin', isWeixin);
    this.getScreenSize();
    // this.isLogin();
    // 此处要初始化一下,要不然默认进来不会给bigScreen赋值,导致无法打开页面内容
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(this.screenHeight, this.screenWidth);
    this.bigScreen = 0
    console.log('this.screenWidth', this.screenWidth)
    if (!this.isPcVisit) {
      if (this.screenWidth <= 992) {
        this.bigScreen = 0;
      } else {
        this.bigScreen = 1;
      }
    } else {
      this.bigScreen = 1;
    }
    var screenSize = {
      height: this.screenHeight,
      width: this.screenWidth
    }
    this.storage.set('bigScreen', this.bigScreen)
    this.storage.set('screenSize', screenSize)
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.loading = false;
        }
      });
  }

  /**
   *  判断是否是在微信浏览器内打开的
   */
  // @HostListener('window:resize', ['$event'])
  isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') !== -1) {//如果不是微信内打开时
      console.log('---在微信浏览器内打开---');
      return true;
    } else {//如果是微信内打开时
      console.log('---不是在微信浏览器内打开---');
      return false;
    }
  }

  /**
   * 判断是pc端,手机端还是平板访问
   */
  isPc() {
    var ua = navigator.userAgent;
    var isWindowsPhone = /(?:Windows Phone)/.test(ua);
    var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
    var isAndroid = /(?:Android)/.test(ua);
    var isFireFox = /(?:Firefox)/.test(ua);
    var isChrome = /(?:Chrome|CriOS)/.test(ua);
    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
    var isPhone = /(?:iPhone)/.test(ua) && !isTablet;
    var isPc = !isPhone && !isAndroid && !isSymbian;
    if (isTablet) {// 平板
      console.log('---平板端打开---');
      return false;
    } else if (isPhone || isAndroid) {// 手机
      console.log('---手机端打开---');
      return false;
    } else if (isPc) {// 电脑端
      console.log('---电脑端打开---');
      return true;
    } else {// 未知情况
      console.log('---未知端打开---');
      return true;
    }
  }

  isLogin() {
    console.log('--原请求地址--');
    var url = location.pathname + location.search + location.hash;
    console.log(url);
    var token = this.storage.get('token');
    var role = this.storage.get('role');
    if (token == null || token == '' || token == undefined) {
      console.log('--未登录,跳转到登录页面--');
      // 在已经登录情况下,根据用户角色重定向到登录页面
      this.allServices.authService.redirectLogin();
    }
  }
}


