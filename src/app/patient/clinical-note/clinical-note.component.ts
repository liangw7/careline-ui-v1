import {
    Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter,AfterViewInit
  } from '@angular/core';
  import { Router, ActivatedRoute } from '@angular/router';
  import { AllServices } from '../../core/common-services';
  import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
  import { DomSanitizer } from '@angular/platform-browser';
  import { ObSetComponent } from '../../core/common-components/ob-set/ob-set.component';
  import { Subscription } from 'rxjs';
  import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
  import { environment } from '../../../environments/environment';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { visitAll } from '@angular/compiler';
  var URL: string = environment.apiUrl + 'upload/';
  
  @Component({
    selector: 'clinical-note',
    templateUrl: './clinical-note.component.html',
    styleUrls: ['./clinical-note.component.scss']
  })
  export class ClinicalNoteComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() patient: any;
    temp: any;
    profiles: any;
    user: any;
    color: any;
    subscription: any;
    bigScreen: any;
    selectedProfile: any;
    showFiles = true;
    growthChartObs: any;
    loading: any;
    showGrowthChart: any;
    obWeight: any;
    obHeight: any;
    selectedOb: any;
    obIDs:any;
    limit:any;
    timeList:any;
    visits:any;
    clinicalForms:any;
    formIDs:any;
    nurseForm:any;
    ptForm:any;
    homeNote:any;
    visitNote:any;
    addNote:any;
    visitType:any;
    visit:any;

    @Input() noteType: any;
    @Input() language: any;
    @Input() selectedObSet: any;
    @Input() dataViewerType: any;
    @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();
  
  
    constructor(
      public allServices: AllServices,
      public router: Router,
      public route: ActivatedRoute,
      private dialog: MatDialog,
      public sanitizer: DomSanitizer,
      @Inject(SESSION_STORAGE) private storage: StorageService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
        this.bigScreen = this.storage.get('bigScreen')
    }
  
    ngAfterViewInit() {
    }
  
  
  
    ngOnInit() {
      this.visitNote=true;
      this.homeNote=false;
      this.setUp() ;
     
    }
    ngOnChanges() {
      this.visitNote=true;
      this.homeNote=false;
      this.setUp() ;
     
    }
   

    setUp() {
      this.color = this.storage.get('color');
      this.language = this.storage.get('language');
      if (!this.language) {
        this.subscription = this.allServices.sharedDataService.dataSent$.subscribe(
          language => {
            this.language = language;
            this.storage.set('language', this.language)
          });
      }
     
      if (!this.patient) {
        this.user=this.storage.get('user')
        if (this.user.role == 'patient') {
          this.patient = this.user;
        } else {
          this.patient = this.storage.get('patient')
        }
      }
      if (this.patient){
     
          this.getPorfiles(this.patient);
        }
     
        
 
    }
    profileSelected(profileItem: any) {
      for (let profile of this.profiles) {
        profile.selected = false;
        if (profile._id == profileItem._id) {
          //profile.chart=false;
          // profile.list=false;
          profile.selected = true;
          this.selectedProfile = profile;
        
        }
      }
    }
    
    getPorfiles(patient:any){
      this.profiles = [];
      //get profile for visit
      this.allServices.usersService.findUserById(patient._id).then((data) => {
      this.temp = data;
      this.profiles = this.temp.profiles;
      this.selectedProfile=this.profiles[0];
      this.profiles[0].selected=true;
      //get home care form
    
    })

    }
  addVisit(noteType:any){
    this.addNote=false;
    if (noteType=='nursing'){
      this.visitType='home nursing';
        this.visit={
          desc: { label: '家庭护理' },
          patientID: this.patient._id,
          provider: { _id: this.user._id, name: this.user.name, title: this.user.title },
          type: this.visitType
        }
      }
      else if (noteType=='pt'){
        this.visitType='home nursing';
          this.visit={
            desc: { label: '物理治疗' },
            patientID: this.patient._id,
            provider: { _id: this.user._id, name: this.user.name, title: this.user.title },
            type: this.noteType
          }
        }
        this.loading=true;
      this.allServices.visitsService.createVisit(this.visit).then((data)=>{
        console.log ('new visit=============', data)
        this.addNote=true;
        this.loading=false;
      })

    }
  
  }