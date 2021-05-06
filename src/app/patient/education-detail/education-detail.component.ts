
import { Component, OnInit, OnChanges, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";

import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
var URL: string = environment.apiUrl + 'upload/';

var QRCodeURL: string = 'https://www.digitalbaseas.com/';
@Component({
  selector: 'education-detail',
  templateUrl: './education-detail.component.html',
  styleUrls: ['./education-detail.component.scss']
})

export class EducationDetailComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() language: any;
  educationID: any;
  education: any;
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
    public dialogRef: MatDialogRef<EducationDetailComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.educationID = data.educationID;
    if (!this.educationID)
      this.educationID = data.form._id;
    this.user = this.storage.get('user');
    if (!this.patient)
      this.patient = this.storage.get('patient')
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
    if (!this.education)
      this.education = { _id: this.educationID }
    this.getForm(this.education);
  }
  ngOnInit() {

  }
  close() {
    this.dialogRef.close();
  }

  getForm(form: any) {

    form.obSets = [];

    var filter = {
      formIDs: [form._id]
    }

    this.allServices.categoryService.getFormById(filter).then((data) => {

      this.temp = data;
      console.log('form', this.temp)

      if (this.temp.length > 0) {
        form.obSets = this.temp[0].obSets;

        form.name = this.temp[0].name;
        form.image = this.temp[0].image
        if (form.image) {
          form.imageUrl = this.allServices.utilService.getImageUrl(String(form.image));
        }
        form.label = this.temp[0].label;
        form.formType = this.temp[0].formType;
        form.formStyle = this.temp[0].formStyle;
      }


    })
  }
}