import {
  Component, OnInit, Inject, ViewChild, Input, OnChanges,
  AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../../core/common-services';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'chart-patient-list',
  templateUrl: './chart-patient-list.component.html',
  styleUrls: ['./chart-patient-list.component.scss']
})
export class ChartPatientListComponent implements OnInit {
  limit: any;
  selectedOb: any;
  patients: any;
  selectedPatient: any;
  formId: any;
  temp: any;
  patientLists: any;
  filters: any;
  patientList: any;
  selectedObs: any;
  report: any;
  isReport: any;
  emailList: any;
  filterIndex: any;
  profiles: any;
  consultProfiles: any;
  searchProfile: any;
  search: any;
  originalProfiles: any;
  selectedProfile: any;
  selectedPatientList: any;
  selectedPatients: any;
  user: any;
  color: any;
  selectedIndex: any;
  target: any;
  loading: any;
  language: any;
  subscription: Subscription;
  service: any;
  devicePatients: any;
  deviceFilterPatients: any;
  group: any;
  showChart: any;
  showFilter: any;
  bigScreen: any;


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
  }


  ngOnInit() {
    this.user = this.storage.get('user')
    this.service = this.user.service;
    this.selectedPatientList = { name: '', patients: [] };
    this.loading = true;
    // if (this.user.patientLists&&this.user.patientLists.length>0)
    // this.target=this.user.patientLists[0].name;
    //  if (this.user.patientLists&&this.user.patientLists.length>0)
    // this.getPatients(this.user.patientLists[0]);
    this.color = this.storage.get('color')
    this.profiles = [];
    if (this.user.role != 'provider') {
      this.group = 'teamPatients'
      this.allServices.categoryService.getCategoriesByFilter({ field: 'profile', status: 'active' }).then((data) => {
        this.profiles = data;
        console.log('admin profiles', this.profiles)
      });
    }
    //if the user is provider or market
    else {
      this.group = 'myPatients'
      this.profiles = this.user.profiles;
      this.originalProfiles = this.profiles;
    }

    for (let profileItem of this.profiles) {
      this.allServices.categoryService.getCategory(profileItem._id).then((data) => {
        this.temp = data;
        profileItem.forms = [];
        profileItem.forms = this.temp.forms;
        profileItem.patientLists = [];
        profileItem.patientLists = this.temp.patientLists
        profileItem.label = this.temp.label;
        profileItem.image = this.temp.image;
        profileItem.profileUrl = this.temp.profileUrl;
        if (profileItem.image)
        profileItem.imageUrl = this.allServices.utilService.getImageUrl(String(profileItem.image));
        //  console.log ('this.profiles',this.profiles)
        if (this.profiles.indexOf(profileItem) == 0 && this.bigScreen == 1) {
          profileItem.selected = true;
          this.getReport(profileItem);
        }
      })
    }
    this.loading = false;
  }


  getMyPatientList(language: any) {
    if (language == 'Chinese')
      return '我的病人'
    else
      return 'My Patients'
  }

  getProfileName(language: any, profile: any) {
    if (language == 'Chinese') {
      if (!profile.label) {
        return profile.name;
      } else {
        return profile.label.ch
      }
    } else if (language == 'English') {
      if (!profile.label) {
        return profile.name;
      } else {
        return profile.label.en
      }
    }
  }


  getPatientListName(language: any, patientList: any) {
    if (patientList.label) {
      if (language == 'Chinese')
        return patientList.label.ch
      else if (language == 'English')
        return patientList.label.en
    } else
      return patientList.name;
  }


  profileSelected(event: any) {
    this.target = event.tab.textLabel;
    for (let profile of this.profiles) {
      profile.selected = false;
      if (profile.label.ch == this.target || profile.label.en == this.target) {
        this.getReport(profile)
      }

    }
  }


  getPatientList(event: any) {
    this.target = event.tab.textLabel;
    for (let patientList of this.user.patientLists) {
      if (this.target == patientList.name) {

        this.getPatients(patientList);
      }
    }
  }


  //search profile
  loadPatient() {
    console.log('ok', this.searchProfile.length)
    if (this.searchProfile.length > 0) {
      this.profiles = [];
      for (let profile of this.originalProfiles) {
        if (profile.name.toLowerCase().indexOf(this.searchProfile.toLowerCase()) > -1) {
          this.profiles.push(profile);
        }
      }
    } else if (this.searchProfile.length == 0) {
      this.profiles = [];
      this.profiles = this.originalProfiles;
    }
  }


  getPatients(patientList: any) {
    console.log('patientList', patientList)
    if (patientList.list) {
      this.loading = true;
      this.allServices.datasService.getPatientsByFilter({ patientListID: patientList.list._id, profileID: patientList.profile._id }).then((data) => {
        patientList.patients = data;
        this.loading = false;
      });
    } else {
      this.loading = true;
      if (this.service) {
        this.allServices.usersService.getPatientsByProfileService(patientList.profile, this.service).then((data) => {

          patientList.patients = data;
          this.loading = false;
        })
      } else {
        this.allServices.usersService.getPatientsByProfile(patientList.profile).then((data) => {

          patientList.patients = data;
          this.loading = false;
        })
      }
    }
  }


  deletePatientList(patientList: any) {
    var index = this.user.patientLists.indexOf(patientList)
    this.user.patientLists.splice(index, 1);
    this.allServices.usersService.updateUser(this.user).then((data) => {
      console.log('user patient list deleted', data);
      this.storage.set('user', this.user)
    })
  }


  getReport(profile: any) {
    console.log('ok-1', profile)
    profile.isReport = true;
    if (profile.forms && profile.forms.length > 0) {
      //console.log ('ok-2',profile.forms)
      for (let form of profile.forms) {
        if (form.formType == 'report' && !profile.report)
          profile.report = form;
      }
      // console.log ('profile.report.obSets',profile.report.obSets)
      if (profile.report && !profile.report.obSets) {
        console.log('ok-3')
        this.allServices.categoryService.getCategory(profile.report._id).then((data) => {
          this.temp = data;
          profile.report.obSets = [];
          profile.report.obSets = this.temp.obSets;
          for (let obSet of profile.report.obSets) {
            this.allServices.categoryService.getCategory(obSet._id).then((data) => {
              this.temp = data;
              obSet.obs = [];
              obSet.obs = this.temp.obs;
            })
          }
          //    console.log ('this.report',profile.report)
        })
      }
    }
  }


  getObSetLabel(language: any, obSet: any) {
    if (language == 'Chinese') {
      if (obSet.label)
        return obSet.label.ch;
      else if (!obSet.label)
        return obSet.name;
    } else if (language == 'English')
      if (obSet.label)
        return obSet.label.en;
      else if (!obSet.label)
        return obSet.name;
  }

  
  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
  }

}


