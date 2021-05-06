import {
  Component, OnInit, Inject, ViewChild, Input, OnChanges,
  AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { SelectedPatientsComponent } from '../selected-patients/selected-patients.component';
import { PatientCellComponent } from '../../../patient/patient-cell/patient-cell.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../../core/common-services';

@Component({
  selector: 'child-patient-list',
  templateUrl: './child-patient-list.component.html',
  styleUrls: ['./child-patient-list.component.scss']
})
export class ChildPatientListComponent implements OnInit, OnChanges{
  @Input() patients: any;
  @Input() devicePatients: any;
  @Input() selectedObs: any;
  @Input() listName: any;
  @Input() language: any;
  @Input() profile: any;
  user: any;
  color: any;
  selectedPatients: any;
  temp: any;
  loading: any;
  temp_2: any;
  search: any;
  bigScreen: any;


  constructor(
    private dialog: MatDialog,
    public router: Router,
    public allServices: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.bigScreen = this.storage.get('bigScreen');

  }

  ngOnInit() {
    if (this.patients){
    if (!this.selectedObs)
      this.selectedObs = [];
      var obIDs=[];
      var patientIDs=[];
    console.log ('this.selectedObs================',this.selectedObs)
    for (let ob of this.selectedObs ){
      obIDs.push(ob._id)
    }
    
    for (let patient of this.patients){
      patientIDs.push(patient._id)
    }
    this.allServices.datasService.getDatasByFilter2(
                {'patientID':{'$in':patientIDs}, 
                 'obID':{'$in':obIDs}}).then((data)=>{
                  this.temp=data;
                  console.log ('patient data', this.temp)
                })
    
              }
  }
  ngOnChanges() {
    if (this.patients){
    if (!this.selectedObs)
      this.selectedObs = [];
      var obIDs=[];
      var patientIDs=[];
 

    for (let ob of this.selectedObs ){
      obIDs.push(ob._id)
    }
    
    for (let patient of this.patients){
      patientIDs.push(patient._id);
  
     
    }
    this.loading=true;
    this.allServices.datasService.getDatasByFilter2(
                {'patientID':{'$in':patientIDs}, 
                 'obID':{'$in':obIDs}}).then((data)=>{
                  this.temp=data;
               //  console.log ('data=========', this.temp)
              
                  for (let patient of this.patients){
                    patient.selectedObs=[];
                    for (let obItem of this.selectedObs){
                      patient.selectedObs.push({_id:obItem._id, label:obItem.label})
                 //  patient.selectedObs.push(obItem)
                    }
                      for (let item of this.temp){
                         if (patient._id==item.patientID){
                      
                           for (let ob of patient.selectedObs){
                             if (ob._id==item.obID){
                                   ob.value=item.value;
                                  ob.values=item.values;
                             }
                           }
                         }
                       }
                    
                    }
                  
   this.loading=false;
                 
            //      console.log ('patient data',this.patients)
                })
    
              }
  }

  findOb(item:any, list:any){
    for (let item_1 of list){
      if (item_1._id==item.obID){
        return true;
      }
    }
    return false;
  }

  select(patient: any) {
    if (patient.profiles) {
      this.selectedPatients = this.storage.get('selectedPatients');
      if (!this.selectedPatients)
        this.selectedPatients = [];
      if (!this.findPatient(patient, this.selectedPatients))
        this.selectedPatients.splice(0, 0, patient)
      for (let item of this.selectedPatients) {
        item.selected = false;
        if (item._id == patient._id) {
          item.selected = true;
        }
      }
      console.log('this.selectedPatients', this.selectedPatients);
      this.storage.set('selectedPatients', this.selectedPatients);
      this.storage.set('selectedPatient', patient);
      this.storage.set('patient', patient);
      this.loading = false;
      if (this.bigScreen == 1) {
        let dialogConfig = new MatDialogConfig();
        //  dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        dialogConfig = {
          data: {
            'patient': patient,
            'language': this.language,
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        }
        const dialogRef = this.dialog.open(SelectedPatientsComponent,
          dialogConfig);
      }
      // this.router.navigate(['/homepage/home/selected-patients']); 
      /* else if (this.bigScreen==0){
         let dialogConfig = new MatDialogConfig();
   
         //  dialogConfig.disableClose = true;
          // dialogConfig.autoFocus = true;
       
            dialogConfig={data : {
                               'patient': patient,
                               'language': this.language,
                               },
                           maxWidth: '100vw',
                           maxHeight: '100vh',
                           height: '100%',
                           width: '100%'
                               }
                             
         
            const dialogRef = this.dialog.open(PatientStoryComponent,
               dialogConfig);
       }*/
    } else {
      this.loading = true;
      this.allServices.usersService.findUserById(patient._id).then((data) => {
        this.loading = false;
        this.temp = data;
        patient.profiles = [];
        patient.profiles = this.temp.profiles;
        this.selectedPatients = this.storage.get('selectedPatients');
        if (!this.selectedPatients)
          this.selectedPatients = [];
        if (!this.findPatient(patient, this.selectedPatients))
          this.selectedPatients.splice(0, 0, patient)
        for (let item of this.selectedPatients) {
          item.selected = false;
          if (item._id == patient._id) {
            item.selected = true;
          }
        }
        console.log('this.selectedPatients', this.selectedPatients);
        this.storage.set('selectedPatients', this.selectedPatients);
        this.storage.set('selectedPatient', patient);
        this.storage.set('patient', patient);
        this.loading = false;
        if (this.bigScreen == 1) {
          let dialogConfig = new MatDialogConfig();
          //  dialogConfig.disableClose = true;
          // dialogConfig.autoFocus = true;
          dialogConfig = {
            data: {
              'patient': patient,
              'language': this.language,
            },
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          }
          const dialogRef = this.dialog.open(SelectedPatientsComponent,
            dialogConfig);
        }
        // this.router.navigate(['/homepage/home/selected-patients']); 
        /*  else if (this.bigScreen==0){
            let dialogConfig = new MatDialogConfig();
      
            //  dialogConfig.disableClose = true;
             // dialogConfig.autoFocus = true;
          
               dialogConfig={data : {
                                  'patient': patient,
                                  'language': this.language,
                                  },
                              maxWidth: '100vw',
                              maxHeight: '100vh',
                              height: '100%',
                              width: '100%'
                                  }
               const dialogRef = this.dialog.open(PatientStoryComponent,
                  dialogConfig);
          }*/
      })
    }
  }


  selectVoid(patient: any) {
    if (patient.profiles) {
     
      this.storage.set('selectedPatient', patient);
      this.storage.set('patient', patient);
      this.loading = false;
      if (this.bigScreen == 1) {
        let dialogConfig = new MatDialogConfig();
        //  dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        dialogConfig = {
          data: {
            'patient': patient,
            'language': this.language,
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        }
        const dialogRef = this.dialog.open(PatientCellComponent,
          dialogConfig);
      }
      // this.router.navigate(['/homepage/home/selected-patients']); 
      /* else if (this.bigScreen==0){
         let dialogConfig = new MatDialogConfig();
   
         //  dialogConfig.disableClose = true;
          // dialogConfig.autoFocus = true;
       
            dialogConfig={data : {
                               'patient': patient,
                               'language': this.language,
                               },
                           maxWidth: '100vw',
                           maxHeight: '100vh',
                           height: '100%',
                           width: '100%'
                               }
                             
         
            const dialogRef = this.dialog.open(PatientStoryComponent,
               dialogConfig);
       }*/
    } else {
      this.loading = true;
      this.allServices.usersService.findUserById(patient._id).then((data) => {
        this.loading = false;
        this.temp = data;
        patient.profiles = [];
        patient.profiles = this.temp.profiles;
       
        this.storage.set('selectedPatient', patient);
        this.storage.set('patient', patient);
        this.loading = false;
        if (this.bigScreen == 1) {
          let dialogConfig = new MatDialogConfig();
          //  dialogConfig.disableClose = true;
          // dialogConfig.autoFocus = true;
          dialogConfig = {
            data: {
              'patient': patient,
              'language': this.language,
            },
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          }
          const dialogRef = this.dialog.open(PatientCellComponent,
            dialogConfig);
        }
        // this.router.navigate(['/homepage/home/selected-patients']); 
        /*  else if (this.bigScreen==0){
            let dialogConfig = new MatDialogConfig();
      
            //  dialogConfig.disableClose = true;
             // dialogConfig.autoFocus = true;
          
               dialogConfig={data : {
                                  'patient': patient,
                                  'language': this.language,
                                  },
                              maxWidth: '100vw',
                              maxHeight: '100vh',
                              height: '100%',
                              width: '100%'
                                  }
               const dialogRef = this.dialog.open(PatientStoryComponent,
                  dialogConfig);
          }*/
      })
    }
  }
  getUserData(patient: any) {
    this.allServices.usersService.getByFilter({ deviceUserID: patient.userID, userName: patient.userName }).then((data) => {
      this.temp = data;
      if (this.temp.length == 0) {
        //create a user
        var newUser = {
          deviceUserID: patient.userID,
          userName: patient.userName,
          password: patient.password,
          email: patient.userName + '@test.com',
          profiles: [this.profile],
          serviceList: [this.user.service],
          role: 'patient'
        }
        this.allServices.usersService.createUser(newUser).then((data) => {
          this.temp_2 = data;
          console.log('user created', data);
          this.selectedPatients = this.storage.get('selectedPatients');
          if (!this.selectedPatients)
            this.selectedPatients = [];
          if (!this.findPatient(this.temp_2, this.selectedPatients))
            this.selectedPatients.splice(0, 0, this.temp_2)
          console.log('this.selectedPatients', this.selectedPatients);
          this.storage.set('selectedPatients', this.selectedPatients);
          this.loading = false;
          this.router.navigate(['/home/selected-patients']);
        })
      } else {
        this.temp[0].profiles = [this.profile];
        this.temp[0].deviceUserID = patient.userID,
          this.temp[0].role = 'patient';
        this.temp[0].serviceList = [this.user.service]
        this.allServices.usersService.updateUser(this.temp[0]).then((data) => {
          this.temp_2 = data;
          console.log('user updated', data);
          this.selectedPatients = this.storage.get('selectedPatients');
          if (!this.selectedPatients)
            this.selectedPatients = [];
          if (!this.findPatient(this.temp_2, this.selectedPatients))
            this.selectedPatients.splice(0, 0, this.temp_2)
          console.log('this.selectedPatients', this.selectedPatients);
          this.storage.set('selectedPatients', this.selectedPatients);
          this.loading = false;
          this.router.navigate(['/home/selected-patients']);
        })
      }
    })
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false
  }


  findPatient(patient: any, patients: any) {
    for (let item of patients) {
      if (item._id == patient._id)
        return true;
    }
    return false;
  }


  findPatient2(item: any, patients: any) {
    for (let patient of patients) {
      if (item.patientID == patient._id)
        return true;
    }
    return false;
  }

  /* addColumn() {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = true;
     if (!this.selectedObs)
     this.selectedObs=[];
     dialogConfig.data = { 'selectedObs': this.selectedObs};
     const dialogRef = this.dialog.open(SearchColumnComponent,dialogConfig);
     dialogRef.afterClosed().subscribe(result => {
       console.log ('result', result);
       if (result){
           this.selectedObs=result;
           //if (patientList.selectedObs==undefined)
           //profile.selectedObs=[];
          // profile.selectedObs=this.selectedObs;
          /* this.categoryService.update({_id:profile._id,
                                        name: profile.name,
                                        forms: profile.formd,
                                        patientLists: profile.patientLists,
                                        selectedObs: profile.selectedObs,
                                        profileType: profile.profileType,
                                        field: profile.field  
                                       } ).then((data)=>{                                     
                                     this.temp=data;
                                     console.log ('after update patient list', this.temp)
                                 });
 
           if (this.patients&&this.patients.length>0){
             for (let patient of this.patients){
               for (let ob of this.selectedObs){
                   this.findValue(patient, ob);
               }
             }
           }
       }
     });
   }*/

  findValue(patient: any, ob: any) {
    patient.selectedObs = [];
    for (const item of this.selectedObs) {
      patient.selectedObs.push(null)
    }
    this.loading = true;
    this.allServices.datasService.getDatasByPatient(patient._id, ob._id).then((data: any) => {
      this.temp = data;
      if (this.temp.length > 0)
        for (const item of this.selectedObs) {
          if (item._id == this.temp[0].obID) {
            var index = this.selectedObs.indexOf(item);
            patient.selectedObs[index] = this.temp[0];
            //  console.log ('ok-ob',patient.selectedObs[index] )
          }
        }
      this.loading = false;
    })
  }


  sortList(patientList: any, patient: any) {
    let temp = [];
    temp = patient.selectedObs;
    console.log('got sort', temp)
    console.log('patient.selectedObs', patient.selectedObs)
    patient.selectedObs = [];
    for (let ob of patientList.selectedObs) {
      for (let obItem of temp) {
        console.log('ob.name', ob.name)
        console.log('obItem.obName', obItem.obName)
        if (ob.name == obItem.obName) {

          patient.selectedObs.push(obItem)
        }
      }
    }
  }
}


