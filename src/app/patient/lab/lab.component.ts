
import {
  Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, ViewChild
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { PatientFileComponent } from '../patient-file/patient-file.component';
import { AddLabsComponent } from '../add-lab/add-lab.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AllServices } from '../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() language: any;
  @Input() visit: any;
  @Input() selectedLabSet: any;
  @Input() selectedLabImage: any;
  @Input() viewOnly: any;
  user: any;
  labSets: any;
  uploadedLabs: any;
  color: any;
  newValue: any;
  newTimeStamp: any;
  loading: any;
  firstLabSet: any;
  showFile: any;
  labs: any;
  fileType = 'lab';
  option = 'lab';
  bigScreen: any;
  file: any;
  newValueItem:any;
  selectedLabSetdeleteBox:any;
  @ViewChild('fileInput') myFileInput: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {

    this.color = this.storage.get('color');
    this.user = this.storage.get('user');
    if (!this.user) {
      this.viewOnly = true;
    }
    this.showFile = false;
    if (!this.patient && this.user && this.user.role == 'patient') {
      this.patient = this.storage.get('user')
    }
    this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    console.log('bigScreen in lab', this.bigScreen)
  }


  ngOnInit() {
    if (this.patient) {
      this.language = this.storage.get('language');
      // this.bigScreen = this.storage.get('bigScreen');
      console.log('bigScreen in lab', this.bigScreen)
      this.getLabs();
      this.reNameFile();
      this.uploadFile();
    }

  }


  ngOnChanges() {
    if (this.patient) {
      this.language = this.storage.get('language');
      // this.bigScreen = this.storage.get('bigScreen');
      console.log('bigScreen in lab', this.bigScreen)
      this.getLabs();
      this.reNameFile();
      this.uploadFile();
    }
  }


  getLabs() {
    if (this.patient && !this.selectedLabSet) {
      this.loading = true;
      //aggregation
      console.log('this.patient', this.patient)
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.temp = data;
        this.patient = this.temp;
       
          this.allServices.usersService.getlabItems({ patientID: this.patient._id }).then((data) => {
            console.log('lab data', data)
            this.temp = data;
            this.labSets = this.temp;
            this.loading = false;
            console.log('labs', this.labSets)
            for (let labSet of this.labSets) {
              if (this.labSets.indexOf(labSet) == 0 && this.bigScreen == 1)
                labSet.show = true
              labSet.deleteBox = [];
              for (let lab of labSet.labs) {
                labSet.deleteBox.push(false);
                lab.edits = [];
                lab.editBox = [];
                for (let valueItem of lab.valueSet) {
                  lab.edits.push(false);
                  lab.editBox.push(false);
                }
              }
            }
          })
      
      })
      this.allServices.labsService.getByFilter({ patientID: this.patient._id, uploaded: { $exists: true } }).then((data) => {
        this.uploadedLabs = data;
        console.log('this.uploadedLabs', this.uploadedLabs)
        //for (let lab of this.uploadedLabs){
        //   if (lab.uploaded){//if lab is uploaded file
        //         lab.url=this.sanitizer.bypassSecurityTrustUrl(URL+'photo-'+String(lab._id)+'.png');
        //     }

        // }
      }, (err) => {
        // Check if already authenticated
        console.log("not allowed");
      });
    } else if (this.patient && this.selectedLabSet) {
      this.selectedLabSet.timeStamps = [];
      this.allServices.categoryService.getlabItems({ patientID: this.patient._id, labIDs: [this.selectedLabSet._id] }).then((data) => {
        console.log('lab data', data)
        this.temp = data;
        this.selectedLabSet = this.temp[0];
        this.loading = false;
        this.selectedLabSet.show = true
        this.selectedLabSet.deleteBox = [];
        if (this.selectedLabSet.labs.length > 0) {
          this.selectedLabSet.timeStamps = this.selectedLabSet.labs[0].timeStamps;
          for (let lab of this.selectedLabSet.labs) {
            this.selectedLabSet.deleteBox.push(false);
            lab.edits = [];
            lab.editBox = [];
            for (let valueItem of lab.valueSet) {
              lab.edits.push(false);
              lab.editBox.push(false);
            }
          }
        }
      })
    }
  }


  reNameFile(){


    //  console.log ('upload onafteraddingfile-1')
      this.uploader.onAfterAddingFile = (file) => { 
    //     console.log ('upload onafteraddingfile-2')
        if (this.fileType=='lab'&&file){
      //      console.log ('upload onafteraddingfile-3')
          this.allServices.labsService.create({patientID: this.patient._id, uploaded: 'true'}).then((data)=>{
            
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
        this.uploadedLabs.push(this.file)
        console.log ('photo',  response)
        
        alert('文件上传成功');
        
        
    };
    
    } 
    
    moreFile(){
      let fileLoad=this.myFileInput.nativeElement;
       fileLoad.click();
    }
    


  openFile(item: any) {
    if (this.bigScreen == 1) {
      const dialogRef = this.dialog.open(PatientFileComponent, {
        width: '700px',
        height: '80%',
        data: { item: item, createdAt: item.createdAt }
      });
    } else if (this.bigScreen == 0) {
      const dialogRef = this.dialog.open(PatientFileComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data: { item: item, createdAt: item.createdAt }
      });
    }
  }


  showLabSet(labSet: any) {
    for (let labSetItem of this.labSets) {
      labSetItem.show = false;
    }
    labSet.show = true;
    this.showFile = false;
  }


  showLabFile() {
    if (this.labSets) {
      for (let labSetItem of this.labSets) {
        labSetItem.show = false;
      }
      this.showFile = true;
    }
  }


  addLabs() {
    const dialogConfig = new MatDialogConfig();
    var set = [];
    for (let labSet of this.labSets) {
      set.push({ _id: labSet._id, label: labSet.label })
    }
    dialogConfig.data = { 'selectedItems': set };
    const dialogRef = this.dialog.open(AddLabsComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.labs = result;
      var labIDs = [];
      console.log('this.labs', this.labs);
      this.patient.labs = [];
      this.patient.labs = this.labs;
      console.log('this.patient', this.patient)
      this.allServices.usersService.updateUser(this.patient).then((data) => {
        this.patient = data;
        this.storage.set('patient', data)
        console.log('this.patient updated', data)
      })
      for (let lab of this.labs) {
        labIDs.push(lab._id)
      }
      this.loading=true;
      this.allServices.categoryService.getlabItems({ patientID: this.patient._id, labIDs: labIDs }).then((data) => {
        console.log('lab data', data)
        this.temp = data;
        this.labSets = this.temp;
        this.loading = false;
        console.log('labs', this.labSets)
        for (let labSet of this.labSets) {
          if (this.labSets.indexOf(labSet) == 0)
            labSet.show = true
          labSet.deleteBox = [];
          for (let lab of labSet.labs) {
            labSet.deleteBox.push(false);
            lab.edits = [];
            lab.editBox = [];
            for (let valueItem of lab.valueSet) {
              lab.edits.push(false);
              lab.editBox.push(false);
            }
          }
        }
      })
    })
  }


  addFile() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // this.bigScreen = this.storage.get('bigScreen')
    dialogConfig.data = { 'fileType': 'lab', 'option': 'option' };
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
        this.allServices.labsService.getByFilter({ patientID: this.patient._id, uploaded: { $exists: true } }).then((data) => {
          this.uploadedLabs = data;
          for (let lab of this.uploadedLabs) {
            if (lab.uploaded) {//if lab is uploaded file
              lab.url = this.allServices.utilService.getImageUrl(String(lab._id));
            }
          }
        }, (err) => {
          // Check if already authenticated
          console.log("not allowed");
        });
      }
    })
  }


  deleteUploadedLab(lab: any) {
    this.allServices.labsService.delete(lab._id).then((data) => {
      this.temp = data;
      var index = this.uploadedLabs.indexOf(lab);
      this.uploadedLabs.splice(index, 1)
      this.allServices.alertDialogService.alert('deleted' + this.temp.name)
    })
  }


  saveEdit(valueItem: any, lab: any, i: any) {
 
    if (this.visit)
      var visitID = this.visit._id;
    else
      visitID = '';
    var labValue = {
      _id: lab.labValueID[i],
      value: valueItem,
      labItemID: lab._id,
      resultAt: lab.timeStamps[i],
      enteredBy: { _id: this.user._id, name: this.user.name },
      patientID: this.patient._id,
      visitID: visitID
    };
    this.allServices.labsService.update(labValue).then((data) => {
      console.log('lab updated', data)
      //  lab.edits[lab.valueSet.indexOf(valueItem)]=false;
    })
  }


  addLabValue(value: any, timeStamp: any, lab: any, labSet: any) {
    if (this.visit)
      var visitID = this.visit._id;
    else
      visitID = '';

    if (value == undefined)
      value = '';
    var labValue = {
      value: value,
      labItemID: lab._id,
      resultAt: timeStamp,
      enteredBy: { _id: this.user._id, name: this.user.name },
      patientID: this.patient._id,
      visitID: visitID
    };
    this.allServices.labsService.getByFilter({ resultAt: timeStamp, labItemID: lab._id, patientID: this.patient._id }).then((data) => {
      this.temp = data;
      console.log('this.temp', this.temp)
      if (this.temp.length == 0) {
        this.allServices.labsService.create(labValue).then((data) => {
          console.log('lab created', data)
          lab.valueSet.push(value);
          lab.timeStamps.push(timeStamp);
          lab.newValue = '';
          labSet.newTimeStamp = '';
        })
      } else if (this.temp.length > 0) {
        this.temp[0].value = value;
        this.temp[0].resultAt = timeStamp;
        this.allServices.labsService.update(labValue).then((data) => {
          console.log('lab updated', data)
          lab.valueSet.push(value);
          lab.timeStamps.push(timeStamp);
          lab.newValue = '';
          labSet.newTimeStamp = '';
        })
      }
    })
  }


  addValue(labSet: any) {
    for (let lab of labSet.labs) {
      this.addLabValue(lab.newValue, labSet.newTimeStamp, lab, labSet);
    }
  }


  delete(labSet: any, timeStamp: any) {
    var index = labSet.labs[0].timeStamps.indexOf(timeStamp);
    for (let lab of labSet.labs) {
      this.allServices.labsService.delete(lab.labValueID[index]).then((data) => {
        console.log('deleted', data)
        var index = labSet.labs.indexOf(lab);
        lab.timeStamps.splice(index, 1);
        lab.valueSet.splice(index, 1);
        lab.labValueID.splice(index, 1);
      });
    }
  }


  getUrl(image: any) {
    if (image){
    return this.sanitizer.bypassSecurityTrustUrl(URL + 'photo-' + String(image._id) + '.png');
  }
  else{
    return null
  }
}
}

