import {
  Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter,AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AllServices } from '../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges, AfterViewInit {
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
  @Input() language: any;
  @Input() selectedObSet: any;
  @Input() dataViewerType: any;
  @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    public allServices: AllServices,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.bigScreen = this.storage.get('bigScreen')
  }

  ngAfterViewInit() {
  }


  pedsPatient() {
    if (this.patient) {
      var birthday = new Date(this.patient.birthday)
      var timeDiff = Math.abs(Date.now() - birthday.getTime());
      var value = timeDiff / (1000 * 3600 * 24);
      value = value / 365;
      if (value < 18) {
        return true
      }
      else return false;
    } else {
      return false;
    }

    /* if (this.patient.ageObj){
       if (this.patient.ageObj.uom=='d'||this.patient.ageObj.uom=='m'){
         return true;
       }
       else if (this.patient.ageObj.uom=='y'&&this.patient.ageObj.number<18){
         return true
       }
       else if (this.patient.age){
         return false;
       }
       else
         return false;
     }
    else
    return false;*/
  }


  ngOnInit() {
    //  console.log ('this.patient', this.patient)
    this.setUp();
  }


  getProfileName(language: any, profile: any) {
    if (profile.label) {
      if (language == 'Chinese')
        return profile.label.ch
      else if (language == 'English')
        return profile.label.en
    }
    return '';
  }


  ngOnChanges() {
    this.setUp();
  }


  setUp() {
    this.user = this.storage.get('user');
    if (!this.patient) {
      if (this.user.role == 'patient') {
        this.patient = this.user;
      } else {
        this.patient = this.storage.get('patient')
      }
    }
    console.log('patient=========', this.patient)
    this.color = this.storage.get('color');
    this.language = this.storage.get('language');
    if (!this.language) {
      this.subscription = this.allServices.sharedDataService.dataSent$.subscribe(
        language => {
          this.language = language;
          this.storage.set('language', this.language)
        });
    }
    // this.bigScreen = this.storage.get('bigScreen')
    console.log('this.selectedObSet', this.selectedObSet)
    this.profiles = [];
    
    console.log('patient in summary for patint account', this.patient)
    if (this.patient && !this.selectedObSet) {
      this.loading = true;
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.temp = data;
        this.patient = this.temp;
        this.profiles = this.temp.profiles;

        for (let profile of this.profiles) {
          this.getReport(profile);
          this.loading = false;
        }
        if (this.pedsPatient()) {
          console.log('peds patient', this.pedsPatient())
          this.growthChartObs = []
          this.allServices.categoryService.getCategoriesByFilter({ 'formType': 'growth chart' }).then((data) => {
            this.temp = data;
            this.allServices.categoryService.getFormById({ 'formIDs': [this.temp[0]._id] }).then((data) => {
              console.log('growthChartforms', data)
              this.temp = data;

              this.growthChartObs = this.temp[0].obSets[0].obs;
              var obIDs = [];
              for (let ob of this.growthChartObs) {
                obIDs.push(ob._id)
              }
              this.allServices.categoryService.getCategoriesByFilter({ '_id': { '$in': obIDs } }).then((data) => {
                this.temp = data;
                for (let item of this.temp) {
                  for (let ob of this.growthChartObs) {
                    if (ob._id == item._id) {
                      ob.desc = item.desc;
                      ob.options = item.options
                    }
                  }
                }
              })
            })
          })
        }
      })
    }
  }


  getReport(profile: any) {
    this.loading = true;
    // this.loading=true;
    profile.summary = [];
    this.allServices.categoryService.getCategory(profile._id).then((data) => {
      this.temp = data;
      console.log('profile', this.temp)
      profile.label = this.temp.label;
      profile.forms = this.temp.forms;
      profile.image = this.temp.image;
      if (profile.image) {
        profile.imageUrl = this.allServices.utilService.getImageUrl(String(profile.image));
        // ob.image=URL+'photo-'+String(ob.image)+'.png';
      }
      for (let form of profile.forms) {
        if (form.formType == 'summary') {
          this.allServices.categoryService.getCategory(form._id).then((data) => {
            this.temp = data;
            profile.summary = this.temp.obSets;
            for (let item of profile.summary) {
              item.limit = 20
            }
            console.log('profile in summary', profile)
          })
        }
      }
      this.loading = false
    })
  }


  parseReport(event: any) {
    let selectedTab = event.tab;
    if (this.patient.profiles && this.patient.profiles.length > 0) {
      for (let profile of this.patient.profiles) {
        if (selectedTab.textLabel == profile.label.ch || selectedTab.textLabel == profile.label.en) {
          console.log('profile.label', profile.label)
          this.getReport(profile)
        }
      }
    }
  }
}