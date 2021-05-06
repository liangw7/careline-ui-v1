import { Component, OnInit, Inject, Input } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'followup-detail',
  templateUrl: './followup-detail.component.html',
  styleUrls: ['./followup-detail.component.scss']
})
export class FollowupDetailComponent implements OnInit {
  @Input() patient: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  date: any;
  weeks: any;
  temp: any;
  selectedDate: any;
  timeList: any;
  scheduleList: any;
  availableAt: any;
  temp_2: any;
  month: any;
  reservedAt: any;
  dayView: any;
  weekView: any;
  monthView: any;
  currentWeek: any;
  currentDay: any;
  currentMon: any;
  color: any;
  forms: any;
  followups: any;
  search: any;
  emBed: any;
  language: any;
  followupDate: any;
  bigScreen: any;
  profileIDs: any;
  visitID: any;
  loading: any;
  visit: any;
  user: any;


  constructor(public allServices: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialogRef: MatDialogRef<FollowupDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.color = this.storage.get('color');
    this.user = this.storage.get('user')
    this.patient = this.storage.get('patient')
    this.language = this.storage.get('language')

    if (!this.patient) {
      this.patient = data.patient;
    }

    console.log('this.selectedDate', this.selectedDate)
    if (!this.language) {
      this.language = data.language;
    }
    this.profileIDs = data.profileIDs;
    this.visitID = data.visit._id;
    this.visit = data.visit;
    this.followupDate = data.followupDate
  }


  ngOnInit() {
    this.emBed = true;
    this.loading = true;
    console.log('this.profileIDs', this.profileIDs)
    this.allServices.categoryService.getForm({
      patientID: this.patient._id,
      visitID: this.visitID,
      profileIDs: this.profileIDs,
      formTypes: ['followup']
    }).then((data) => {

      this.forms = data;
      console.log('followup', this.forms)
      this.loading = false;
    })
  }


  save() {
    this.dialogRef.close({ forms: this.forms, visitID: this.visitID, followupDate: this.followupDate });
  }


  close() {
    this.dialogRef.close();
  }
}