import { Component, OnInit, OnChanges, Inject, Input, HostListener, ViewChild } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { FileUploader } from 'ng2-file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { AllServices } from '../../core/common-services';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { PatientFileComponent } from '../patient-file/patient-file.component';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'health-file',
  templateUrl: './health-file.component.html',
  styleUrls: ['./health-file.component.scss']
})
export class HealthFileComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() selectedImage: any;
  @Input() language: any;
  @Input() viewOnly: any;
  @Input() visit: any;
  viewRecordOnly: any;
  user: any;
  images: any;
  color: any;
  bigScreen: any;
  fileType = 'image';
  option = 'image';
  file: any;
  @ViewChild('fileInput') myFileInput: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {

    this.bigScreen = this.storage.get('bigScreen');
    this.user = this.storage.get('user');
    if (!this.user) {
      this.viewOnly = true;
    }
    if (this.user && this.user.role == 'patient') {
      this.patient = this.storage.get('user');
      this.getFiles();
    }
    this.color = this.storage.get('color');
    this.language = this.storage.get('language')
  }


  ngOnInit() {
    //patient from component
    if (this.patient) {
      this.getFiles();
      this.reNameFile();
      this.uploadFile();
    }
  }


  ngOnChanges() {
    if (this.patient) {
      this.getFiles();
      this.reNameFile();
      this.uploadFile();
    }
  }


  getFiles() {
    // this.bigScreen = this.storage.get('bigScreen')
    if (this.patient && !this.selectedImage) {
      this.allServices.imagesService.getByFilter({ patientID: this.patient._id, about: 'medical file' }).then((data) => {
        this.images = data;
        for (let image of this.images) {
          if (!image.uploaded) {
            this.allServices.datasService.getDatasByFilter2({ patientID: this.patient._id, obID: image.obID, imageID: image._id }).then((data) => {
              this.temp = data;
              if (this.temp.length > 0) {
                image.value = this.temp[0].value;
                image.valueList = [];
                image.valueList = this.temp.valueList;
              }
            })
          }
        }
      }, (err) => {
        // Check if already authenticated
        console.log("not allowed");
      });
    }
    else if (this.selectedImage && this.selectedImage.url)
      this.selectedImage.url = this.allServices.utilService.getImageUrl(String(this.selectedImage._id));
  }


  reNameFile() {
    //debugger;
    //  console.log ('upload onafteraddingfile-1')
    this.uploader.onAfterAddingFile = (file) => {
      //     console.log ('upload onafteraddingfile-2')
      if (this.fileType == 'image' && file) {
        //      console.log ('upload onafteraddingfile-3')
        this.allServices.imagesService.create({ patientID: this.patient._id, about: 'medical file', uploaded: 'true' }).then((data) => {
          this.file = data;
          file.file.name = this.file._id + '.png';
          file.withCredentials = false;
          this.uploader.uploadAll();
        })
      }
    };
  }


  uploadFile() {
    this.uploader.progress = 0;
    if (!this.images) {
      this.images = [];
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      this.images.push(this.file);
      console.log('photo', response);
      this.reNameFile();
      this.allServices.alertDialogService.alert('??????????????????');
    };
  }


  moreFile() {
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
  }


  getUrl(image: any) {
    return this.allServices.utilService.getImageUrl(String(image._id));
  }


  deleteUploadedImage(image: any) {
    this.allServices.imagesService.delete(image._id).then((data) => {
      this.temp = data;
      var index = this.images.indexOf(image);
      this.images.splice(index, 1)
      // alert('deleted' + this.temp.name);
      this.allServices.alertDialogService.alert('????????????!');
    })
  }


  openFile(item: any) {
    if (this.bigScreen == 1) {
      const dialogRef = this.dialog.open(PatientFileComponent, {
        width: '70%',
        height: '80%',
        data: { item: item, createdAt: item.createdAt }
      });
    } else if (this.bigScreen == 0) {
      const dialogRef = this.dialog.open(PatientFileComponent, {
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: { item: item, createdAt: item.createdAt }
      });
    }
  }


  addFile() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // this.bigScreen = this.storage.get('bigScreen')
    dialogConfig.data = { 'fileType': 'image', 'option': 'option', about: 'medical file' };
    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '90%',
        dialogConfig.width = '100%'
    } else {
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '50%',
        dialogConfig.width = '50%'
    }
    const dialogRef = this.dialog.open(FileUploadComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.allServices.imagesService.getByFilter({ patientID: this.patient._id, uploaded: { $exists: true } }).then((data) => {
          this.images = data;
          for (let image of this.images) {
            if (image.uploaded) {//if lab is uploaded file
              image.url = this.allServices.utilService.getImageUrl(String(image._id));
            }

          }
        }, (err) => {
          // Check if already authenticated
          console.log("not allowed");
        });
      }
    })
  }
}