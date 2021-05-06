import { Component, OnInit, OnChanges, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { EducationDetailComponent } from '../education-detail/education-detail.component';
import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() language: any;
  visit: any;
  user: any;
  consults: any;
  color: any;
  subscription: any;
  @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
  ) {

    this.user = this.storage.get('user');
    if (!this.patient)
      this.patient = this.storage.get('patient');
    console.log('this.patient education', this.patient)
    this.color = this.storage.get('color');
    this.language = this.storage.get('language');
    if (!this.language) {
      this.subscription = allServices.sharedDataService.dataSent$.subscribe(
        language => {
          this.language = language;
        });
    }
  }


  ngOnChanges() {
    console.log('this.patient', this.patient)
    if (this.patient) {
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.temp = data;
        if (!this.patient.educations)
          this.patient.educations = [];
        this.patient.educations = this.temp.educations;
      })
    }
  }


  ngOnInit() {
  }


  selectEducation(education: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      data: {
        'educationID': education._id
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    }
    const dialogRef = this.dialog.open(EducationDetailComponent,
      dialogConfig);
  }

  
  getUrl(education: any) {
    return this.allServices.utilService.getImageUrl(String(education.image));
  }
}