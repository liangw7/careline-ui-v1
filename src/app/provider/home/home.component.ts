import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
@Component({
  selector: 'provider-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProviderHomeComponent implements OnInit {
  bigScreen: any;
  menuItems: any[] = [];
  sidebarShow:any;
  user:any;
  title:any;

  constructor(
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) 
  {
}

  goIndex() {
    console.log('========================================')
    this.router.navigate(['/public-platform/homepage/main'])
  }
  ngOnInit(): void {
    this.sidebarShow=true;
    this.user=this.storage.get('user');
    if (this.user.role=='provider'){
      this.title='预约'
    }
    else if (this.user.role=='nurse'){
      this.title='护士工作站'
    }
    else if (this.user.role=='caseMananger'){
      this.title='病案管理师工作室'
    }
    else if (this.user.role=='physicalTherapist'){
      this.title='物理治疗师工作室'
    }
    this.menuItems = [
      { active: true, focus: 'patient', path: '../provider/dashboard', param: null, title: '主页', enTitle: 'Home', icon: 'fa fa-area-chart', class: '',img:'../../../../../assets/images/core/sy.png' },
      { active: false, focus: 'patient', path: '../provider/patient-list', param: null, title: '病人分类', enTitle: 'Patient List', icon: 'fa fa-users', class: '',img:'../../../../../assets/images/core/lczj.png' },
      { active: false, focus: 'patient', path: '../provider/patient-chart', param: null, title: '临床智能', enTitle: 'Patient List', icon: 'fa fa-users', class: '',img:'../../../../../assets/images/core/lczj.png' },
      { active: false, focus: 'patient', path: '../provider/consult-list', param: null, title: '咨询', enTitle: 'Consult', icon: 'fa fa-users', class: '',img:'../../../../../assets/images/core/zxzx.png' },
      { active: false, focus: 'management', path: '../provider/provider-schedule', param:null, title: this.title, enTitle: 'Schedule', icon: 'fa fa-calendar', class: '',img:'../../../../../assets/images/core/mrrz.png' },
      { active: false, focus: 'article', path: '../provider/user-list', param: null, title: '用户注册', enTitle: 'article', icon: 'fa fa-list', class: '',img:'../../../../../assets/images/core/sysbg.png' },
    
      { active: false, focus: 'article', path: '../provider/article-list', param: null, title: '文章', enTitle: 'article', icon: 'fa fa-list', class: '',img:'../../../../../assets/images/core/sysbg.png' },
      { active: false, focus: 'me', path: '../provider/account', param: null, title: '我的', enTitle: 'me', icon: 'fa fa-list', class: '',img:'../../../../../assets/images/core/yy.png' },
    ];
  }
}
