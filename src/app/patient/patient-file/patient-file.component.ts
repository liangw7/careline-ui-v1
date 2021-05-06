import {
  Component, OnInit, Inject, Input, OnChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from '../../core/common-services';
//const URL = 'http://localhost:8080/api/upload/';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'patient-file',
  templateUrl: './patient-file.component.html',
  styleUrls: ['./patient-file.component.scss']
})
export class PatientFileComponent implements OnInit, OnChanges {
  url: any;
  dataSource: any;
  createdAt: any;
  fileType: any;
  saveBlocked: any;
  file: any;
  patient: any;
  temp: any;
  bigScreen: any;
  item: any;


  constructor(
    public dialogRef: MatDialogRef<PatientFileComponent>,
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.file = data.file;
    this.item = data.item;
    this.dataSource = data.dataSource;
    this.createdAt = data.createdAt;
    this.patient = data.patient;
  }


  ngOnChanges() {
  }
  ngOnInit() {
  }


  save() {
    if (!this.fileType) {
      this.saveBlocked = true;
    } else {
      if (this.fileType == 'lab') {
        this.saveLab();
      } else if (this.fileType == 'image') {
        this.saveImage();
      }
    }
    this.dialogRef.close();
  }


  cancel() {
    this.dialogRef.close();
  }


  saveLab() {
    // console.log ('upload onafteraddingfile-3')
    this.allServices.labsService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
      this.temp = data;
    })
  }


  saveImage() {
  }


  getUrl(item: any) {
    return this.allServices.utilService.getImageUrl(String(item._id));
  }
}