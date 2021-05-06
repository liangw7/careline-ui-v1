import {
  Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef,
  HostListener, AfterViewInit,
  AfterContentInit
} from '@angular/core';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { AllServices } from '../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'provider-folder',
  templateUrl: './provider-folder.component.html',
  styleUrls: ['./provider-folder.component.scss']
})
export class ProviderFolderComponent implements OnInit, OnChanges {
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
  monthNames: any;
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
  showProfile: any;
  showCard: any;
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
  totalProviderPatients: any;
  showMail: any;
  showSchedule: any;
  showBusinessCard: any;
  senderID: any;
  selected: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.bigScreen = this.storage.get('bigScreen');
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
    this.inPatient = true;
    this.showCard = true;
    this.senderID = this.storage.get('senderID');
    // alert('senderID in provider folder'+this.senderID)
    if (this.senderID) {
      this.allServices.usersService.findUserById(this.senderID).then((data) => {
        this.selected = data;
        this.showMail = true;
      })
    }
    // this.selectedPatientList =  this.storage.get('selectedPatientList');
    //  this.selectedPatient=data.patient;
    this.color = this.storage.get('color')
    this.uploader = new FileUploader({ url: URL, itemAlias: 'photo' });
    // this.getScreenSize();
    // this.bigScreen = 0
    // this.user = this.storage.get('user')
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    this.patient = this.storage.get('patient');
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
    if (!this.user) {
      this.router.navigate(['/homepage/login'])
    } else {
      this.getTotalPatientsByProvider();
      console.log('this.patient photo', this.user.photo)
      if (this.user.photo && this.user.photo.slice(0, 4) != 'http')
        this.user.photo = this.allServices.utilService.getImageUrl(String(this.user.photo));
      else if (this.user.photo && this.user.photo.slice(0, 4) == 'http') {
        this.user.photo = this.allServices.utilService.getUrl(String(this.user.photo));
      }
      var profileIDs = []
      for (let profile of this.user.profiles) {
        profileIDs.push(profile._id)
      }
      this.allServices.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data) => {
        this.user.profiles = [];
        this.user.profiles = data;
      })
    }
  }


  ngOnChanges() {
  }


  gotoPatientList() {
    this.router.navigate(['/provider-platform/provider/patient-list'])
  }


  saveProfile($event: any) {
    this.showProfile = $event;
  }


  getTotalPatientsByProvider() {
    this.allServices.usersService.getCount({
      role: 'patient',
      providers: { $elemMatch: { _id: this.user._id } }
    }).then((data) => {
      console.log('data count', data);
      this.temp = data;
      this.totalProviderPatients = this.temp;
    })
  }


  gotoMail() {
    this.router.navigate(['/homepage/home/mail'])
  }


  gotoSchedule() {
    this.router.navigate(['/provider-platform/provider/provider-schedule'])
  }


  gotoDashboard() {
    this.router.navigate(['/provider-platform/provider/dashboard'])
  }


  gotoPublish() {
    this.router.navigate(['/homepage/home/publish'])
  }


  gotoUser() {
    this.router.navigate(['/provider-platform/provider/account'])
  }


  gotoUserList() {
    this.router.navigate(['/homepage/home/user-list'])
  }


  gotoChart() {
    var showChart = true;
    var showFilter = false;
    this.router.navigate(['/homepage/home/patient-chart'])
  }


  gotoChat() {
    this.router.navigate(['/homepage/home/chat-list'])
  }


  gotoFilter() {
    var showFilter = true;
    var showChart = false;
    this.router.navigate(['/provider-platform/provider/patient-list'])
  }


  logout() {
    this.allServices.authService.logout(['/homepage']);
    this.user = null;
  }
}

