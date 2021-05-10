import { Component, OnInit, Input, HostListener,Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
@Component({
  selector: 'patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  screenHeight: any;
  screenWidth: any;
  bigScreen: any;
  sidebarShow: any; //是否显示左侧栏
  menuItems: any[] = [];
  language: any = 'Chinese';
  constructor(
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.sidebarShow = true;
    this.menuItems = [
      { active: true, focus: 'patient', path: 'patient/patient-story', para: '', title: '首页', enTitle: 'home', icon: 'fa fa-area-chart', class: '',img:'../../../assets/images/core/sy.png' },
      { active: false, focus: 'patient', path: 'patient/provider-list', para: '', title: '在线咨询', enTitle: 'consult', icon: 'fa fa-area-chart', class: '',img:'../../../assets/images/core/zxzx.png' },
      { active: false, focus: 'patient', path: 'patient/followups', para: '', title: '每日日志', enTitle: 'followup', icon: 'fa fa-users', class: '',img:'../../../assets/images/core/mrrz.png' },
      { active: false, focus: 'patient', path: 'patient/summary', para: '', title: '临床总结', enTitle: 'Summary', icon: 'fa fa-users', class: '',img:'../../../assets/images/core/lczj.png' },
      { active: false, focus: 'management', path: 'patient/visit-list', para: '', title: '门诊', enTitle: 'Ouitpatient', icon: 'fa fa-calendar', class: '',img:'../../../assets/images/core/zymz.png' },
      { active: false, focus: 'management', path: 'patient/patient-schedule', para: '', title: '预约', enTitle: 'Schedule', icon: 'fa fa-calendar', class: '',img:'../../../assets/images/core/zxzx.png' },
      { active: false, focus: 'article', path: 'patient/lab', para: '', title: '实验室报告', enTitle: 'labs', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/sysbg.png' },
      { active: false, focus: 'article', path: 'patient/image', para: '', title: '影像结果', enTitle: 'images', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/yxjg.png' },
      { active: false, focus: 'article', path: 'patient/medication', para: '', title: '用药', enTitle: 'medication', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/yy.png' },
      { active: false, focus: 'article', path: 'patient/health-file', para: '', title: '历史病史', enTitle: 'health records', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/lsbs.png' },
      { active: false, focus: 'article', path: 'patient/education', para: '', title: '患病教育', enTitle: 'education', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/hzjy.png' },

     // { active: false, focus: 'profile', path: '/provider-platform/patient/profile', para: '', title: '个人信息', enTitle: 'profile', icon: 'fa fa-list', class: '',img:'../../../../../assets/images/core/yy.png' },

    ];
    /*    if (this.user.role == 'admin') {
          this.menuItems = [
            { focus: 'patient', path: '/provider-platform/provider/dashboard', para: '', title: '主页', enTitle: 'Home', icon: 'fa fa-area-chart', class: '' },
            { focus: 'patient', path: '/provider-platform/provider/patient-list', para: '', title: '病人分类', enTitle: 'Patient List', icon: 'fa fa-users', class: '' },
            { focus: 'management', path: '/homepage/home/user-list', para: '', title: '用户注册', enTitle: 'User Registry', icon: 'fa fa-drivers-license-o', class: '' },
            { focus: 'management', path: '/homepage/home/add-patient', para: '', title: '病人注册', enTitle: 'Patient Registry', icon: 'fa fa-drivers-license-o', class: '' },
            { focus: 'management', path: '/homepage/home/consults/', para: 'menu', title: '会诊', enTitle: 'Consult', icon: 'fa fa-user-md', class: '' },
            { focus: 'management', path: '/provider-platform/provider/provider-schedule-provider', para: '', title: '预约', enTitle: 'Schedule', icon: 'fa fa-calendar', class: '' },
            { focus: 'management', path: '/homepage/home/quality-control', para: '', title: '质量控制', enTitle: 'Quality Control', icon: 'fa fa-list', class: '' },
            { focus: 'management', path: '/homepage/home/category-list', para: '', title: 'Category', enTitle: 'Config', icon: 'fa fa-list', class: '' },
            { focus: 'management', path: '/homepage/home/loading', para: '', title: 'Loading', enTitle: 'Loading', icon: 'fa fa-list', class: '' },
            { focus: 'me', path: '/provider-platform/provider/account', para: '', title: '我', enTitle: 'Me', icon: 'fa fa-user', class: '' },
            { focus: 'article', path: '/homepage/home/article-list', para: '', title: 'article', enTitle: 'article', icon: 'fa fa-list', class: '' },
    
          ];
    
          this.patientList = this.storage.get('selectedPatientList');
          this.patientLinkList = [];
          if (this.patientList) {
            console.log('selectedPatientList', this.patientList);
            for (let patient of this.patientList) {
              if (patient.name)
                this.title = patient.name;
              else
                this.title = patient.email;
              this.patientLinkList.push({ path: '/homepage/home/patient', title: this.title, icon: 'people', class: '', param: patient })
            }
          }
        } 
        else if (this.user.role != 'patient' && this.user.role != 'admin') {
          this.menuItems = [
            { focus: 'patient', path: '/provider-platform/provider/dashboard', para: '', title: '主页', enTitle: 'Home', icon: 'fa fa-area-chart', class: '' },
            { focus: 'patient', path: '/homepage/home/patient-consult-list', para: '', title: '咨询', enTitle: 'Consult', icon: 'fa fa-users', class: '' },
            { focus: 'patient', path: '/provider-platform/provider/patient-list', para: '', title: '病人分类', enTitle: 'Patient List', icon: 'fa fa-users', class: '' },
            { focus: 'management', path: '/homepage/home/consults/', para: 'menu', title: '会诊', enTitle: 'Consult', icon: 'fa fa-user-md', class: '' },
            { focus: 'management', path: '/provider-platform/provider/provider-schedule-provider', para: '', title: '预约', enTitle: 'Schedule', icon: 'fa fa-calendar', class: '' },
            { focus: 'management', path: '/homepage/home/category-list', para: '', title: 'Category', enTitle: 'Config', icon: 'fa fa-list', class: '' },
            { focus: 'management', path: '/homepage/home/loading', para: '', title: 'Loading', enTitle: 'Loading', icon: 'fa fa-list', class: '' },
            { focus: 'me', path: '/provider-platform/provider/account', para: '', title: '我', enTitle: 'Me', icon: 'fa fa-user', class: '' },
            { focus: 'article', path: '/homepage/home/article-list', para: '', title: 'article', enTitle: 'article', icon: 'fa fa-list', class: '' },
    
          ];
        
          if (this.patientList) {
            console.log('selectedPatientList', this.patientList);
            for (let patient of this.patientList) {
              if (patient.name)
                this.title = patient.name;
              else
                this.title = patient.email;
              this.patientLinkList.push({ path: '/homepage/home/patient', title: this.title, icon: 'people', class: '', param: patient })
            }
          }
        } else if (this.user.role == 'patient') {
          console.log('patient', this.user.role)
          this.allService.usersService.findUserById(this.user._id).then((data: any) => {
            this.patient = data;
            this.storage.set('patient', this.patient);
          })
    
          this.menuItems =
            [
              { path: '/provider-platform/patient/provider-list', title: '咨询', enTitle: 'Clinical Sumary', para: '', icon: 'fa fa-user-md', class: '' },
              { path: '/provider-platform/patient/summary', title: '临床总结', enTitle: 'Clinical Sumary', para: '', icon: 'library_books', class: '' },
              { path: '/homepage/patient/education', title: '患者教育', enTitle: 'education', para: '', icon: 'library_books', class: '' },
              { path: '/homepage/patient/visit-list', title: '门诊', enTitle: 'Office Visits', para: '', icon: 'people', class: '' },
              { path: '/homepage/patient/consult-list', title: '会诊请求', enTitle: 'Consults', para: '', icon: 'schedule', class: '' },
              { path: '/homepage/patient/lab', title: '实验室报告', enTitle: 'Labs', para: '', icon: 'content_paste', class: '' },
              { path: '/homepage/patient/image', title: '影像学报告', enTitle: 'Images', para: '', icon: 'content_paste', class: '' },
              { path: '/provider-platform/patient/followups', title: '健康计划', enTitle: 'Dairy', para: '', icon: 'library_books', class: '' },
              { path: '/homepage/patient/health-file', title: '上传文件', enTitle: 'Upload Files', para: '', icon: 'bubble_chart', class: '' },
              { path: '/homepage/patient/schedule-patient', title: '预约', enTitle: 'Schedules', para: '', icon: 'schedule', class: '' },
              // { path: '/homepage/home/mail', title: '咨询',  enTitle: 'Messages',para:'',icon:'mail', class: '' },
              // { path: '/homepage/home/chat-list', title: '在线问诊', enTitle: 'Notifications',para:'', icon:'fa fa-user-md', class: '' },
              { path: '/homepage/patient/profile', title: '我', enTitle: 'Me', para: '', icon: 'person', class: '' },
            ];
        }*/

      this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if(this.screenWidth < 1300) {
      this.sidebarShow = false;
    }
  }

  ngOnInit(): void {
    this.bigScreen=this.storage.get('bigScreen')
  }

  goIndex() {
    console.log('========================================')
    this.router.navigate(['/public-platform/homepage/main'])
  }
}
