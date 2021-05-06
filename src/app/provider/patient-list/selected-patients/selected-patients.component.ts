import {
  Component, OnInit, Inject, ViewChild, Input, OnChanges,
  AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../../core/common-services';

@Component({
  selector: 'selected-patients',
  templateUrl: './selected-patients.component.html',
  styleUrls: ['./selected-patients.component.scss']
})
export class SelectedPatientsComponent implements OnInit {
  selectedPatients: any;
  selectedPatient: any;
  selectedIndex: any;
  menuItems: any;
  temp: any;
  language: any;
  subscription: Subscription;


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    private dialogRef: MatDialogRef<SelectedPatientsComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
  }


  ngOnInit() {
    this.selectedPatients = this.storage.get('selectedPatients');
    for (let item of this.selectedPatients) {
      if (item.selected) {
        this.selectedIndex = this.selectedPatients.indexOf(item);
      }
    }
    // this.selectedPatients[0].selected=true;
    // this.userService.findUserById(this.selectedPatients[0]._id).then((data)=>{
    //  this.temp=data;
    //  this.selectedPatients[0]=this.temp;
    //   this.selectedPatients[0].selected=true;
    //  this.storage.set('patient', this.selectedPatients[0]);
    // });
    this.menuItems =
      [
        { path: '/home/selected-patients/summary', title: '临床总结', icon: 'library_books', class: '' },
        { path: '/home/selected-patients/visit-list', title: '门诊', icon: 'people', class: '' },
        { path: '/home/selected-patients/consult-list', title: '会诊请求', icon: 'schedule', class: '' },
        { path: '/home/selected-patients/lab', title: '实验室报告', icon: 'content_paste', class: '' },
        { path: '/home/selected-patients/image', title: '影像学报告', icon: 'content_paste', class: '' },
        { path: '/home/selected-patients/followups', title: '病人日志', icon: 'library_books', class: '' },
        { path: '/home/selected-patients/file-upload', title: '上传文件', icon: 'bubble_chart', class: '' },
        { path: '/home/selected-patients/mail', title: '信箱', icon: 'mail', class: '' },
        { path: '/home/selected-patients/profile', title: '我', icon: 'person', class: '' },
        // { path: '/home/category-list', title: 'Category',  icon:'list', class: '' },
      ];
  }


  getSeletedPatient(event: any) {
    let selectedTab = event.tab;
    for (let patient of this.selectedPatients) {
      patient.selected = false;
      if (selectedTab.textLabel.includes(patient.name)) {
        console.log('selectedPatient', patient)
        patient.selected = true;
        //  })
      }
    }
  }

  
  close() {
    this.dialogRef.close();
  }
}

