import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientFileComponent } from '../patient-file/patient-file.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  visit: any;
  user: any;
  consults: any;
  urlList: any;
  url: any;
  @Input() fileType: any;
  @Input() option: any;
  loading: any;
  @Input() language: any;
  about: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PatientFileComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.fileType = data.fileType;
    this.option = data.option;
    this.about = data.about;
    this.user = this.storage.get('user')
    if (!this.patient)
      this.patient = this.storage.get('patient')
  }


  ngOnInit() {
    if (this.patient) {
      // this.getFiles();
      this.reNameFile();
      this.uploadFile();
      this.uploader.onProgressItem = (progress: any) => {
        console.log(progress['progress']);
      };
    }
  }


  ngOnChanges() {
    console.log('file patient', this.patient)
    if (this.patient) {
      // this.getFiles();
      this.reNameFile();
      this.uploadFile();
    }
  }


  findURL(url: any, urlList: any) {
    for (let item of urlList) {
      if (item.url == url)
        return true;
    }
    return false;
  }


  //get existing files from server
  getFiles() {
    this.urlList = []
    this.allServices.labsService.getByFilter({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
      this.temp = data;
      console.log('uploaded data', this.temp)
      for (let item of this.temp) {
        var url = this.allServices.utilService.getImageUrl(String(item._id));
        if (!this.findURL(url, this.urlList))
          this.urlList.push({ url: url, createdAt: item.createdAt, fileType: 'lab' });
      }
    })
    this.allServices.imagesService.getByFilter({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
      this.temp = data;
      console.log('uploaded data', this.temp)
      for (let item of this.temp) {
        var url = this.allServices.utilService.getImageUrl(String(item._id));
        if (!this.findURL(url, this.urlList))
          this.urlList.push({ url: url, createdAt: item.createdAt, fileType: 'image' });
      }
    })
  }


  reNameFile() {
    // console.log ('upload onafteraddingfile-1')
    this.uploader.onAfterAddingFile = (file) => {
      // console.log ('upload onafteraddingfile-2')
      if (this.fileType == 'lab' && file) {
        // console.log ('upload onafteraddingfile-3')
        this.allServices.labsService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
          this.temp = data;
          //   console.log ('upload onafteraddingfile-4')
          if (file._file.type == 'video/mp4')
            file.file.name = this.temp._id + '.mp4';
          else
            file.file.name = this.temp._id + '.png';
          file.withCredentials = false;
          this.url = this.allServices.utilService.getUrl((window.URL.createObjectURL(file._file)));
          //    this.urlList.push({url:this.url, fileType: this.fileType, createdAt: Date.now()})
        })
      } else if (this.fileType == 'image' && file) {
        this.allServices.imagesService.create({ patientID: this.patient._id, uploaded: 'true', about: this.about }).then((data) => {
          this.temp = data;
          if (file._file.type == 'video/mp4')
            file.file.name = this.temp._id + '.mp4';
          else
            file.file.name = this.temp._id + '.png';
          file.withCredentials = false;
          console.log('file.file.name', file.file.name)
          this.url = this.allServices.utilService.getUrl((window.URL.createObjectURL(file._file)));
          console.log('this.url', this.url)
        })
      }
    };
  }


  uploadFile() {
    if (!this.urlList)
      this.urlList = [];
    this.uploader.progress = 0;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      console.log('photo', response)
      this.allServices.alertDialogService.alert('File uploaded successfully');
      this.urlList.push({ url: this.url, fileType: this.fileType, createdAt: Date.now() })
      this.fileType = null;
    };
  }


  save() {
    this.dialogRef.close({ uploaded: true });
  }


  close() {
    this.dialogRef.close();
  }


  openFile(item: any) {
    const dialogRef = this.dialog.open(PatientFileComponent, {
      width: '1200px',
      data: { url: item.url, createdAt: item.createdAt }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
