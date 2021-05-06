import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig }
  from "@angular/material/dialog";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllServices } from '../../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'patient-chart',
  templateUrl: './patient-chart.component.html',
  styleUrls: ['./patient-chart.component.scss']
})
export class PatientChartComponent implements OnInit {
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
  selectedList: any;
  totalProviderPatients: any;
  content:any;

  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.bigScreen = this.storage.get('bigScreen')
    this.showFilter = this.storage.get('showFilter')
    if (this.showChart == undefined)
      this.showChart = true;
    if (this.showFilter == undefined)
      this.showFilter = true;
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
      this.content='chart'
  }


  ngOnInit() {
    this.user = this.storage.get('user')
    this.service = this.user.service;
    this.selectedPatientList = { name: '', patients: [] };
    this.loading = true;
    var profileIDs = [];
    // if (this.user.patientLists&&this.user.patientLists.length>0)
    // this.target=this.user.patientLists[0].name;
    //  if (this.user.patientLists&&this.user.patientLists.length>0)
    // this.getPatients(this.user.patientLists[0]);
    this.color = this.storage.get('color')
    this.profiles = [];
    if (this.user.role != 'patient') {
      this.group = 'teamPatients'
      this.allServices.categoryService.getCategoriesByFilter({ field: 'profile', status: 'active' }).then((data) => {
        this.profiles = data;
        console.log('admin profiles', this.profiles)
        if (this.profiles.length > 0) {
          this.profiles[0].selected = true;
          if (this.bigScreen == 1)
            this.selectedProfile = this.profiles[0];
          this.selectedProfile.list = true;
          this.selectedProfile.filter = true;
        }
        for (let profile of this.profiles) {
          this.getProfilePatientsByProvider(profile);
        }
      });
    }
    //if the user is provider or market
    /* else{
       this.group='myPatients'
       this.profiles=this.user.profiles;
       console.log ('this.profiles',this.profiles)
       this.originalProfiles=this.profiles;
     


     for (let profile of this.profiles){
      
       profileIDs.push(profile);
     }

   
   this.categoryService.getCategoriesByFilter({'_id':{'$in':profileIDs}}).then((data)=>{
     this.temp =data;
     this.profiles=[];
     this.profiles=this.temp;
     for (let profile of this.profiles){
       this.getProfilePatientsByProvider(profile);
       if (this.profiles.indexOf(profile)==0){
         profile.selected=true;
         if (this.bigScreen==1)
         this.selectedProfile= profile;
       }
     }
   })
 }*/
    this.loading = false;
  }


  getProfilePatientsByProvider(profile: any) {
    this.allServices.usersService.getCount({
      role: 'patient',
      providers: { $elemMatch: { _id: this.user._id } },
      profiles: { $elemMatch: { _id: profile._id } }
    }).then((data) => {
      console.log('profile provider count', data);
      profile.totalPatientsByProvider = data;
    })
  }


  getMyPatientList(language: any) {
    if (language == 'Chinese')
      return '我的病人'
    else
      return 'My Patients'
  }


  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
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


  getAllPatients(profile: any) {
    /*  this.group='myPatients';
      
        if (this.user.role=='provider'){
         if (this.service&&this.group=='teamPatients'){
          this.loading=true;
           this.userService.getPatientsByProfileService(profile, this.service).then((data)=>{
             this.temp=data;
             profile.patients=this.temp;
            profile.totalPatients=[];
             profile.totalPatients=this.temp;
             this.loading=false;
            })
          }
          else if (this.group=='myPatients'){
            this.loading=true;
           this.userService.getByFilter({profiles:{'$elemMatch':{_id:profile._id}},
                                         providers:{'$elemMatch':{_id:this.user._id} },
                                         role:'patient'
                                        }).then((data)=>{
             this.temp=data;
            profile.patients=this.temp;
             profile.totalPatients=[];
             profile.totalPatients=this.temp;
             this.loading=false;
            })
       
          }
        }*/
    // else {
    this.allServices.usersService.getPatientsByProfile({ profileID: profile._id }).then((data) => {
      this.temp = data;
      profile.patients = this.temp;
      profile.totalPatients = [];
      profile.totalPatients = this.temp;
      this.loading = false;
    })
    // }
  }


  getFilterPatients(patientList: any, profile: any) {
    if (patientList) {
      this.loading = true;
      console.log('patientList', patientList)
      console.log('profile', profile)
      profile.selectedPatientList = patientList;
      /* if (this.service){
        this.dataService.getPatientsByFilter(
          {patientListID:patientList._id, 
            profileID:profile._id, 
            serviceID:this.service._id}).then((data)=>{
          profile.patients=[];
          profile.patients=data;
       
          this.loading=false;
       });
      }*/
      //  else{
      this.loading = true;
      this.allServices.datasService.getPatientsByFilter(
        {
          patientListID: patientList._id,
          profileID: profile._id
        }).then((data) => {
          profile.patients = [];
          profile.patients = data;
          console.log('profile.patients', profile.patients)
          this.loading = false;
        });
      //  }
    }
    this.loading = false;
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
      /*  if (this.service){
          this.userService.getPatientsByProfileService(patientList.profile, this.service).then((data)=>{
          
            patientList.patients=data;
          this.loading=false;
          })
        }*/
      // else {
      this.allServices.usersService.getPatientsByProfile(patientList.profile).then((data) => {
        patientList.patients = data;
        this.loading = false;
      })
      //}
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
}





