import {
  Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, ViewChild
} from '@angular/core';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientFileComponent } from '../patient-file/patient-file.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { AllServices } from '../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
//const URL = 'http://localhost:8080/api/upload/';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() selectedImage: any;
  @Input() language: any;
  @Input() viewOnly: any;
  @Input() visit: any;
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
      //alert('no user image')
      this.viewOnly = true;
    } else if (!this.patient && this.user && this.user.role == 'patient')
      this.patient = this.storage.get('user');
    this.color = this.storage.get('color');
    this.language = this.storage.get('language')
  }


  ngOnInit() {
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
      this.allServices.imagesService.getByFilter({ patientID: this.patient._id, about: null }).then((data) => {
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


 /* reNameFile() {
    //  console.log ('upload onafteraddingfile-1')
    this.uploader.onAfterAddingFile = (file) => {
      //     console.log ('upload onafteraddingfile-2')
      if (this.fileType == 'image' && file) {
        //      console.log ('upload onafteraddingfile-3')
        this.allServices.imagesService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
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
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      this.images.push(this.file)
      console.log('photo', response)
      this.allServices.alertDialogService.alert('文件上传成功');
    };
  }
*/
reNameFile(){


  //  console.log ('upload onafteraddingfile-1')
    this.uploader.onAfterAddingFile = (file) => { 
  //     console.log ('upload onafteraddingfile-2')
      if (this.fileType=='image'&&file){
    //      console.log ('upload onafteraddingfile-3')
        this.allServices.imagesService.create({patientID: this.patient._id, uploaded: 'true'}).then((data)=>{
          
          this.file=data;
        
          file.file.name=this.file._id+'.png';
          file.withCredentials = false; 
          this.uploader.uploadAll();
        })
        
      }
  
      
          
      };
    }
  
uploadFile(){
    
    this.uploader.progress=0;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
     
      console.log('ImageUpload:uploaded:', item, status, response);
      this.images.push(this.file)
      console.log ('photo',  response)
      
      alert('文件上传成功');
      
      
  };
  
  }
  

  moreFile() {
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
  }


  getUrl(image: any) {
    return this.allServices.utilService.getImageUrl(String(image._id));
  }


  deleteUploadedImagevoid(image: any) {
    console.log('image',image)
    this.allServices.imagesService.delete(image._id).then((data) => {
      this.temp = data;
      var index = this.images.indexOf(image);
      this.images.splice(index, 1)
      this.allServices.alertDialogService.alert('deleted' + this.temp.ok)
    })
  }

  deleteUploadedImage(image:any){
  
    this.allServices.imagesService.delete(image._id).then((data)=>{
      this.temp=data;
      var index=this.images.indexOf(image);
      this.images.splice(index,1)
      alert('deleted'+this.temp.name)
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
    dialogConfig.data = { 'fileType': 'image', 'option': 'option' };
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