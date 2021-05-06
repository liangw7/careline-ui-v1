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
//const URL = 'http://localhost:8080/api/upload/';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'patient-cell',
  templateUrl: './patient-cell.component.html',
  styleUrls: ['./patient-cell.component.scss']
})
export class PatientCellComponent implements OnInit, OnChanges {
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
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
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
  nursePatient:any;
  ptPatient:any;
  nurseNote:any;
  ptNote:any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public dialogRef: MatDialogRef<PatientCellComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
    this.inPatient = true;
    this.nurseNote='nursing';
    this.ptNote='pt';
    // this.selectedPatientList =  this.storage.get('selectedPatientList');
    //  this.selectedPatient=data.patient;
    this.color = this.storage.get('color')
    this.uploader = new FileUploader({ url: URL, itemAlias: 'photo' });
    // this.getScreenSize();
    // this.bigScreen = 0
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    this.bigScreen = this.storage.get('bigScreen');
    this.user = this.storage.get('user');
    if (this.user && this.user.role == 'patient') {
      this.selectedPatient = this.storage.get('patient');
    }
    console.log('selectedPatient', this.selectedPatient)
    if (this.bigScreen == 1)
      this.summaryPatient = this.selectedPatient;
    else if (this.bigScreen == 0)
      this.profilePatient = this.selectedPatient;
  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   //  this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   // console.log(this.screenHeight, this.screenWidth);

  // }

  ngOnInit() {
    console.log('got here init')
    console.log('got here change')
    if (this.selectedPatient)
      this.selectedPatient.showRecord = true;
    this.user = this.storage.get('user');
    console.log('this.user111111111111111', this.user)
    if (this.user && this.user.role == 'patient') {
      this.selectedPatient = this.user;
      this.titleService.setTitle(this.user.name);
    }
    this.profiles = [];
    if (this.bigScreen == 1)
      this.summaryPatient = this.selectedPatient;
    else if (this.bigScreen == 0)
      this.profilePatient = this.selectedPatient;
    this.loadingSummary = true;
    console.log(' this.selectedPatient', this.selectedPatient)
  }


  ngOnChanges() {
    if (this.bigScreen == 1)
      this.summaryPatient = this.selectedPatient;
    else if (this.bigScreen == 0)
      this.profilePatient = this.selectedPatient;
    console.log('got here change')
    if (this.selectedPatientID) {
      this.user = this.storage.get('user');
      if (this.user.role == 'patient') {
        this.selectedPatient = this.user;
        this.titleService.setTitle(this.user.name);
      }
      this.profiles = [];
      this.selectedPatient.showRecord = true;
      this.loadingSummary = true;
      console.log(' this.selectedPatient', this.selectedPatient)
    }
    //get mails
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id)
        return true;
    }
    return false;
  }


  logout() {
    this.allServices.authService.logout(['/homepage']);
    this.user = null;
  }


  goToHome() {
    this.router.navigate(['/homepage']);
  }


  getLabel(label: any, language: any) {
    if (language == 'English' && label == '临床总结')
      return 'Clinical Summary'
    else if (language == 'Chinese' && label == '临床总结')
      return label;
    else if (language == 'English' && label == '病史')
      return 'History'
    else if (language == 'Chinese' && label == '病史')
      return label;
    else if (language == 'English' && label == '用药')
      return 'Medication History'
    else if (language == 'Chinese' && label == '用药')
      return label;
    else if (language == 'English' && label == '门诊')
      return 'Visit'
    else if (language == 'Chinese' && label == '门诊')
      return label;
    else if (language == 'English' && label == '实验室报告')
      return 'Lab Report'
    else if (language == 'Chinese' && label == '实验室报告')
      return label;
    else if (language == 'English' && label == '影像学报告')
      return 'Image Report'
    else if (language == 'Chinese' && label == '影像学报告')
      return label;
    else if (language == 'English' && label == '会诊')
      return 'Consult'
    else if (language == 'Chinese' && label == '会诊')
      return label;
    else if (language == 'English' && label == '患者教育')
      return 'Patient Education'
    else if (language == 'Chinese' && label == '患者教育')
      return label;
    else if (language == 'English' && label == '治疗计划')
      return 'Care Plan'
    else if (language == 'Chinese' && label == '治疗计划')
      return label;
    else if (language == 'English' && label == '健康计划')
      return 'Patient Dairy'
    else if (language == 'Chinese' && label == '健康计划')
      return label;

    else if (language == 'English' && label == '上传文件')
      return 'file upload'
    else if (language == 'Chinese' && label == '上传文件')
      return label;

    else if (language == 'English' && label == '预约')
      return 'Schedule'
    else if (language == 'Chinese' && label == '预约')
      return label;
    if (language == 'English' && label == '信箱')
      return 'Message Box'
    else if (language == 'Chinese' && label == '信箱')
      return label;
    if (language == 'English' && label == '档案')
      return 'Patient Profile'
    else if (language == 'Chinese' && label == '档案')
      return label;
    if (language == 'English' && label == '随访')
      return 'followup'
    else if (language == 'Chinese' && label == '随访')
      return label;
    else if (label == 'pt'){
       
          return '物理治疗记录'
    }
    else if (label == 'nurse'){
          return '护士记录'
        
      }
      return label;
  }


  getForm(form: any) {
    form.obSets = [];
    var filter = {
      formIDs: [form._id]
    }
    this.loading = true;
    this.allServices.categoryService.getFormById(filter).then((data) => {
      this.temp = data;
      console.log('form', this.temp)
      this.loading = false;
      if (this.temp.length > 0) {
        form.obSets = this.temp[0].obSets;

        form.name = this.temp[0].name;

        form.label = this.temp[0].label;
        form.formType = this.temp[0].formType;
        form.formStyle = this.temp[0].formStyle;
      }
    })
  }


  selectedPatientChanged(event: any) {
    console.log('selectedPatient-2', this.selectedPatient)
    if (event.tab.textLabel == '临床总结' || event.tab.textLabel == 'Clinical Summary')
      this.summaryPatient = this.selectedPatient;
    else if (event.tab.textLabel == '病史' || event.tab.textLabel == 'History')
      this.problemPatient = this.selectedPatient;
    else if (event.tab.textLabel == '用药' || event.tab.textLabel == 'Medication History') {
      this.medicationPatient = this.selectedPatient;
      console.log('this.medicationPatient', this.medicationPatient)
    }
    else if (event.tab.textLabel == '门诊' || event.tab.textLabel == 'Visit')
      this.visitPatient = this.selectedPatient;
    else if (event.tab.textLabel == '实验室报告' || event.tab.textLabel == 'Lab Report')
      this.labPatient = this.selectedPatient;
    else if (event.tab.textLabel == '影像学报告' || event.tab.textLabel == 'Image Report')
      this.imagePatient = this.selectedPatient;
    else if (event.tab.textLabel == '会诊' || event.tab.textLabel == 'Consult')
      this.consultPatient = this.selectedPatient;
    else if (event.tab.textLabel == '患者教育' || event.tab.textLabel == 'Patient Education')
      this.educationPatient = this.selectedPatient;
    else if (event.tab.textLabel == '健康计划' || event.tab.textLabel == 'Patient Dairy')
      this.followupPatient = this.selectedPatient;
    else if (event.tab.textLabel == '上传文件' || event.tab.textLabel == 'file upload')
      this.filePatient = this.selectedPatient;
    else if (event.tab.textLabel == '信箱' || event.tab.textLabel == 'Message Box')
      this.mailPatient = this.selectedPatient;
    else if (event.tab.textLabel == '档案' || event.tab.textLabel == 'Patient Profile')
      this.profilePatient = this.selectedPatient;
      else if (event.tab.textLabel == '护士记录' || event.tab.textLabel == 'nurse')
      this.nursePatient = this.selectedPatient;
      else if (event.tab.textLabel == '物理治疗记录' || event.tab.textLabel == 'pt')
      this.ptPatient = this.selectedPatient;
  }
  close() {
    this.dialogRef.close();
  }
}
