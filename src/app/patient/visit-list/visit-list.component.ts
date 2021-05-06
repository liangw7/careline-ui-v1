import { Component, OnInit, OnChanges, Inject, Input, HostListener, AfterViewInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AllServices } from '../../core/common-services';
import { AddVisitComponent } from '../add-visit/add-visit.component';
import { VisitComponent } from '../visit/visit/visit.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})

export class VisitListComponent implements OnInit, OnChanges, AfterViewInit {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() language: any;
  visit: any;
  user: any;
  consults: any;
  color: any;
  bigScreen: any;
  @Input() loading: any;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    public dialogRef: MatDialogRef<VisitListComponent>,
    private dialog: MatDialog,
  ) {

    this.user = this.storage.get('user')
    if (this.user.role == 'patient')
      this.patient = this.storage.get('patient')
    this.color = this.storage.get('color')
    this.language = this.storage.get('language')
    this.bigScreen = this.storage.get('bigScreen')
  }


  ngOnChanges() {
    if (this.patient) {
      this.loading = true;
      this.visits = [];
      this.allServices.visitsService.getVisitListByFilter(
        { patientID: this.patient._id, type: { '$in': ['门诊'] } }).then((data) => {
          this.temp = data;
          this.visits = this.temp;
          console.log('this.visits change', this.temp)
          this.loading = false;
        });
    }
  }


  ngOnInit() {
    if (this.patient) {
      this.loading = true;
      this.visits = [];
      this.allServices.visitsService.getVisitListByFilter(
        { patientID: this.patient._id, type: { '$ne': 'followup' } }
      ).then((data) => {
        this.visits = data;
        console.log('this.visits init', this.visits)
        this.loading = false;
      });
    }
  }


  ngAfterViewInit() {
  }


  addVisit() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    console.log('patient-1', this.patient)
    dialogConfig.data = { 'patient': this.patient, 'language': this.language };
    const dialogRef = this.dialog.open(AddVisitComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result) {
        var serviceName = '';
        var serviceEnName = '';
        if (this.user.service) {
          serviceName = this.user.service.name;
          serviceEnName = this.user.service.enName;
        }
        var profileIDs = [];
        for (let profile of result.profiles) {
          profileIDs.push(profile._id);
        }
        this.allServices.visitsService.createVisit({
          patientID: this.patient._id,
          visitDate: new Date(),
          status: 'active',
          desc: { label: result.profiles[0].label, profileIDs: profileIDs },
          profiles: result.profiles,
          type: '门诊',
          providerID: this.user._id,
          createdBy: {
            _id: this.user._id,
            name: this.user.name,
            enName: this.user.enName,
            title: this.user.title,
            enTitle: this.user.enTitle,
            service: serviceName,
            enService: serviceEnName,
            specialty: this.user.specialty
          }
        }).then((data) => {
          this.visit = data;
          this.visits.push(this.visit);
        })
      }
    })
  }


  getStatus(visit: any) {
    if (visit.status == 'active') {
      return '有效'
    }
    else if (visit.status == 'canceled')
      return '取消'
    else if (visit.status == 'reserved')
      return '已预订'
    else return ''
  }


  addPostOp() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AddVisitComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result) {
        var serviceName = '';
        var serviceEnName = '';
        if (this.user.service) {
          serviceName = this.user.service.name;
          serviceEnName = this.user.service.enName;
        }
        var profile = {
          _id: result._id,
          label: result.label,
          procedureDate: result.procedureDate,
          forms: result.forms,
          visitType: result.visitType
        };
        this.allServices.visitsService.createVisit({
          desc: { label: profile.label, profileIDs: [profile._id] },
          patientID: this.patient._id,
          visitDate: new Date(),
          profiles: [profile],
          type: 'visit',
          enType: 'office visit',
          providerID: this.user._id,
          createdBy: {
            _id: this.user._id,
            name: this.user.name,
            enName: this.user.enName,
            title: this.user.title,
            enTitle: this.user.enTitle,
            service: serviceName,
            enService: serviceEnName,
            specialty: this.user.specialty
          }
        }).then((data) => {
          this.visit = data;
          console.log('profile', profile)
          this.visits.push(this.visit);
          for (let profileItem of this.patient.profiles) {
            if (profileItem._id == profile._id) {
              profileItem.procedureDate = profile.procedureDate;
            }
          }
          console.log('update patient-1', this.patient)
          this.allServices.usersService.updateUser(this.patient).then((data) => {
            this.temp = data;
            this.patient = this.temp;
            this.allServices.alertDialogService.alert('user updated')
            console.log('update patient-2', this.patient)
            //this.storage.set('patient', this.patient)
          })
        })
      }
    })
  }


  getVisit(visit: any) {
    if (this.bigScreen == 1) {
      // if (visit.type!='followup'){
      if (this.user.role != 'patient') {
        let dialogConfig = new MatDialogConfig();
        //  dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        console.log('visit', visit)
        dialogConfig = {
          data: {
            'visit': visit,
            'patient': this.patient,
            'language': this.language,
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        }
        const dialogRef = this.dialog.open(VisitComponent,
          dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
          }
        })
      }
      /* else {
         let dialogConfig = new MatDialogConfig();
         
       //  dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
       console.log ('visit', visit)
          dialogConfig={data : {'visit': visit,
                             'patient': this.patient,
                             'language': this.language,
                             },
                         maxWidth: '100vw',
                         maxHeight: '100vh',
                         height: '100%',
                         width: '100%'
                             }
                           
       
          const dialogRef = this.dialog.open(PatientVisitComponent,
             dialogConfig);
        
       }*/
    } else {
      if (this.user.role == 'patient') {
        this.router.navigate(['/homepage/patient-visit/', this.patient._id, visit._id, visit.profiles[0]._id]);
      } else {
        let dialogConfig = new MatDialogConfig();
        //  dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        console.log('visit', visit)
        dialogConfig = {
          data: {
            'visit': visit,
            'patient': this.patient,
            'language': this.language,
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        }
        const dialogRef = this.dialog.open(VisitComponent,
          dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          console.log('vsiit result', result)
          if (result)
            visit.modifiedBy = result.modifiedBy;
        })
      }
    }
  }


  delete(visit: any) {
    this.allServices.visitsService.delete(visit._id);
    for (const item of this.visits) {
      if (item._id === visit._id) {
        const index = this.visits.indexOf(item);

      }
    }
  }


  cancel() {
    this.dialogRef.close();
  }
}