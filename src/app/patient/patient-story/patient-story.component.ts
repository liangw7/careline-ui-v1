import {
  Component, OnInit, Inject, Input, OnChanges
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from '../../core/common-services';

import { AreaChinaComponent } from '../../core/common-components/area-china/area-china.component';

//const URL = 'http://localhost:8080/api/upload/';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'patient-story',
  templateUrl: './patient-story.component.html',
  styleUrls: ['./patient-story.component.scss']
})
export class PatientStoryComponent implements OnInit, OnChanges {
  //@ViewChild('graph')  graph: GraphComponent;
  //@ViewChild('summary')  summary: SummaryComponent;
  //@ViewChild('visitList')  visitList: VisitListComponent;
  //@ViewChild('followups') template: FollowupsComponent;
  //@ViewChild('profile') profile: ProfileComponent;
  @Input() selectedPatient: any;
  @Input() selectedPatientID: any;
  @Input() language: any;
  patients: any;
  visits: any;
  visit: any;
  provider: any;
  patientId: any;
  temp: any;
  date: any;
  screenings: any;
  problems: any;
  orders: any;
  pathways: any;
  found: any;
  followups: any;
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  patient: any;
  followupId: any;
  followup: any;
  //followups: any;
  problemId: any;
  formId: any;
  formIds: any;
  followupRecord: any;
  selectedDate: any;
  weeks: any;
  profileId: any;
  //summary: any;
  temp_2: any;
  temp_3: any;
  temp_4: any;
  datasets: any;
  @Input() dashData: any;
  element: any;
  testBar: any;
  firstDataSet: any;
  secondDataSet: any;
  test: any;
  form: any;
  obSets: any;
  obSetTemp: any;
  obTemp: any;
  forms: any;
  registryId: any;
  registryForms: any;
  registryForm: any;
  user: any;
  consults: any;
  profiles: any;
  tiles: any;
  bigScreen: any;
  screenWidth: any;
  selectedIndex: any;
  activeSummary: any;
  activeVisits: any;
  activeFollowups: any;
  activeConsults: any;
  activeResearch: any;
  activeLab: any;
  activeImage: any;
  activeMessage: any;
  activeTreatment: any;
  activeDemographic: any;
  mails: any;
  mail: any;
  addMail: any;
  providers: any;
  topic: any;
  content: any;
  url: any;
  urlList: any;
  imageData: any;
  selectedPatientList: any;
  selectedPatientIndex: any;
  color: any;
  menuItems: any;
  wapMenuItems: any;
  summaryPatient: any;
  problemPatient: any;
  medicationPatient: any;
  visitPatient: any;
  labPatient: any;
  imagePatient: any;
  consultPatient: any;
  educationPatient: any;
  carePlanPatient: any;
  followupPatient: any;
  schedulePatient: any;
  filePatient: any;
  mailPatient: any;
  profilePatient: any;
  loadingSummary: any;
  loadingVisit: any;
  medical: any;
  surgical: any;
  family: any;
  social: any;
  medicalProblems: any;
  surgicalProblems: any;
  familyProblems: any;
  socialProblems: any;
  tabList: any;
  loading: any;
  subscription: Subscription;
  inPatient: any;
  selectedProvider: any;
  showCalendar: any;
  showProfile: any;
  popOut: any;
  editSchedule: any;
  role: any;
  screenHeight: any;
  selected: any;
  scheduleProvider: any;
  senderID: any;
  selectedItem:any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public titleService: Title,
    private allService: AllServices,
    public dialogRef: MatDialogRef<PatientStoryComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.bigScreen = this.storage.get('bigScreen');
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
    this.inPatient = true;
    this.showCalendar = false;
    this.role = this.storage.get('role');
    //   if (this.role=='patient')
    //   this.showProfile=true;
    //   this.senderID=this.storage.get('senderID');
    //   if (this.senderID){
    //    this.selected={_id:this.senderID}
    //  }
    // this.selectedPatientList =  this.storage.get('selectedPatientList');
    //  this.selectedPatient=data.patient;
    this.color = this.storage.get('color')
    // this.color='green'
    this.uploader = new FileUploader({ url: URL, itemAlias: 'photo' });
    // this.getScreenSize();
    // this.bigScreen = 0
    this.user = this.storage.get('user')
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    if (this.user.role == 'patient')
      this.patient = this.user;
    //this.patient=this.storage.get('patient');
    if (!this.patient) {
      this.patient = data.patient;
      this.popOut = true;
      // alert('popOut'+this.popOut)
    }
    if (this.bigScreen == 1)
      this.summaryPatient = this.selectedPatient;
    else if (this.bigScreen == 0)
      this.profilePatient = this.selectedPatient;
  }


  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   // console.log(this.screenHeight, this.screenWidth);

  // }
  ngOnInit() {
    this.menuItems = [
      { active: false, focus: 'profile', path: '/provider-platform/patient/profile', para: '', title: '个人信息', enTitle: 'profile', icon: 'fa fa-list', class: '',img:'' },
     { active: true, focus: 'patient', path: '/provider-platform/patient/provider-list', para: '', title: '在线咨询', enTitle: 'consult', icon: 'fa fa-area-chart', class: '',img:'../../../assets/images/core/online.png'},
      { active: false, focus: 'patient', path: '/provider-platform/patient/followups', para: '', title: '每日日志', enTitle: 'followup', icon: 'fa fa-users', class: '',img:'../../../assets/images/core/log.png' },
      { active: false, focus: 'patient', path: '/provider-platform/patient/summary', para: '', title: '临床总结', enTitle: 'Summary', icon: 'fa fa-users', class: '',img:'../../../assets/images/core/clinical.png' },
      { active: false, focus: 'management', path: '/provider-platform/patient/visit-list', para: '', title: '门诊', enTitle: 'Ouitpatient', icon: 'fa fa-calendar', class: '',img:'../../../assets/images/core/Outpatient.png' },
      { active: false, focus: 'management', path: '/provider-platform/patient/patient-schedule', para: '', title: '预约', enTitle: 'Schedule', icon: 'fa fa-calendar', class: '',img:'../../../assets/images/core/appoint.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/lab', para: '', title: '实验室报告', enTitle: 'labs', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/report.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/image', para: '', title: '影像结果', enTitle: 'images', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/Imaging.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/medication', para: '', title: '用药', enTitle: 'medication', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/medicine.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/health-file', para: '', title: '历史病史', enTitle: 'health records', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/history.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/education', para: '', title: '患病教育', enTitle: 'education', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/education.png' },
    ];
    this.wapMenuItems = [
      { active: false, focus: 'patient', path: '/provider-platform/patient/summary', para: '', title: '临床总结', enTitle: 'Summary', icon: 'fa fa-users', class: '',img:'../../../assets/images/core/clinical.png' },
      { active: false, focus: 'management', path: '/provider-platform/patient/visit-list', para: '', title: '门诊', enTitle: 'Ouitpatient', icon: 'fa fa-calendar', class: '',img:'../../../assets/images/core/Outpatient.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/lab', para: '', title: '实验室报告', enTitle: 'labs', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/report.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/image', para: '', title: '影像结果', enTitle: 'images', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/Imaging.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/medication', para: '', title: '用药', enTitle: 'medication', icon: 'fa fa-list', class: '',img:'../../assets/images/core/medicine.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/health-file', para: '', title: '历史病史', enTitle: 'health records', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/history.png' },
      { active: false, focus: 'article', path: '/provider-platform/patient/education', para: '', title: '患病教育', enTitle: 'education', icon: 'fa fa-list', class: '',img:'../../../assets/images/core/education.png' },
    ];
    if (!this.user) {
      this.storage.set('patient-folder', true)
      this.router.navigate(['/homepage/login'])
    }
    console.log('this.patient photo', this.patient.photo)
    if (this.patient.photo && this.patient.photo.slice(0, 4) != 'http')
      this.patient.photo = this.allServices.utilService.getImageUrl(String(this.patient.photo));
    else if (this.patient.photo && this.patient.photo.slice(0, 4) == 'http') {
      this.patient.photo = this.allServices.utilService.getUrl(String(this.patient.photo));
    }
    var profileIDs = []
    for (let profile of this.patient.profiles) {
      profileIDs.push(profile._id)
    }
    this.allServices.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data) => {
      this.patient.profiles = [];
      this.patient.profiles = data;
    })
  }
  


  getUrl(patient: any) {
    return this.allServices.utilService.getImageUrl(String(patient.photo));
  }


  ngOnChanges() {
  }

  areaFn() {
    let dialogRef = this.dialog.open(AreaChinaComponent, {
      height: '400px',
      width: '600px',
    });
  }
  goToHome() {
    
  }
  getItem(menuItem:any){
    // alert(12)
    // console.log('menuItem',menuItem)
    // if (menuItem.enTitle== 'profile'){
  
    //   this.selectedItem=menuItem;
      
    // }
    let item = menuItem;
    this.router.navigate([item.path]);
    this.storage.set('patient', item.param);
    // 发布数据
    this.allServices.communicateService.send(item);
  }

  getLink(item: any) {
    for (let i of this.menuItems) {
      if (i.path == item.path) {
        i.active = true;
      } else {
        i.active = false;
      }
    }
    this.router.navigate([item.path]);
    this.storage.set('patient', item.param);
    // 发布数据
    this.allServices.communicateService.send(item);
  }

  
  gotoSummary() {
    this.router.navigate(['/homepage/home/summary'])
  }


  gotoAllergy() {
    this.router.navigate(['/homepage/home/allergy'])
  }


  gotoProblem() {
    this.router.navigate(['/homepage/home/problem'])
  }


  gotoMedication() {
    this.router.navigate(['/homepage/home/medication'])
  }


  gotoFollowup() {
    this.router.navigate(['/homepage/home/followups'])
  }


  gotoVisit() {
    this.router.navigate(['/homepage/home/visit'])
  }


  gotoProfile() {
    this.router.navigate(['/homepage/home/profile'])
  }


  gotoSchedule() {
    this.router.navigate(['/provider-platform/provider/provider-schedule'])
  }


  gotoLab() {
    this.router.navigate(['/homepage/home/lab'])
  }


  gotoImage() {
    this.router.navigate(['/homepage/home/image'])
  }


  close() {
    this.dialogRef.close();
  }


  receiveMessageFromSchedule($event: any) {
    this.editSchedule = $event;
  }


  saveProfile($event: any) {
    this.showProfile = $event.showProfile;
    if ($event.showConsult == true) {
      this.selected = this.storage.get('provider')
    } else if ($event.showSchedule == true) {
      this.editSchedule = $event.showSchedule;
      this.scheduleProvider = this.storage.get('provider')
    }
  }
  
  
    /**
     * 退出方法
     */
    logout() {
      this.allService.authService.logout('/public-platform/homepage');
      this.user = null;
    }
}

