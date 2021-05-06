import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';
import { User } from '../../models';
import { ThisReceiver } from '@angular/compiler';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent implements OnInit {
  // 是否展示家庭成员标识
  @Input() showFamilyMembers: any;
  // 关系树
  relationships: any;
  registryFamilyForms: any;
  bigScreen: any;
  familyUser = new User();
  gender: any;
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date> | undefined;
  birthdate: any;
  startdate: Date | undefined;
  events: string[] = [];
  user: any;
  patient: any;
  fileType = 'image';
  option = 'image';
  file: any;
  selectedImage: any;
  images: any;
  temp: any;
  @ViewChild('fileInput') myFileInput: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

  constructor(
    private allService: AllServices,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FamilyFormComponent>,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // 如果存在需要给新家庭成员绑定的内容,直接将其赋值给familyUser即可
    if (data && data.userToProfile) {
      this.familyUser = data.userToProfile;
    }
    this.user = this.storage.get('user');
    if (this.user.role == 'patient') {
      this.patient = this.user;
    }
    this.bigScreen = this.storage.get('bigScreen');
    this.relationships = [
      {
        code: 1,
        value: '子女'
      },
      {
        code: 2,
        value: '父母'
      },
      {
        code: 3,
        value: '其他'
      },
    ]
  }

  ngOnInit() {
    if (this.patient) {
      this.getFiles();
      this.reNameFile();
      this.uploadFile();
      this.getFamliyRegistry();
    }
  }


  ngOnChanges() {
    if (this.patient) {
      this.getFiles();
      this.reNameFile();
      this.uploadFile();
      this.getFamliyRegistry();
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.birthdate = `${event.value}`;
    this.familyUser.age = this.getAge();
  }

  close() {
    this.dialogRef.close();
  }

  getFamliyRegistry() {
    this.registryFamilyForms = [];
    this.allService.categoryService.getCategoriesByFilter({ formType: 'general registry' }).then((data) => {
      this.registryFamilyForms = data;
      console.log('registry forms=========', this.registryFamilyForms)
      this.allService.formService.getForm(this.registryFamilyForms[0], this.patient, null, null).then((data) => {
      })
    })
  }

  createFamliyMember() {
    let obs0 = this.registryFamilyForms[0].obSets[0].obs;
    if (this.birthdate) {
      let birthday = this.datePipe.transform(this.birthdate, 'yyyy-MM-dd');
      if (birthday) {
        this.familyUser.birthday = birthday;
      }
    } else {
      this.allService.alertDialogService.warn('请选择出生日期');
      return;
    }
    if (this.gender) {
      this.familyUser.gender = this.gender;
    } else {
      this.allService.alertDialogService.warn('请选择性别');
      return;
    }
    if (!this.familyUser.name) {
      this.allService.alertDialogService.warn('请填写姓名');
      return;
    }
    if (!this.familyUser.relationship) {
      this.allService.alertDialogService.warn('请选择关系');
      return;
    }

    obs0 = this.getObs(obs0);

    this.familyUser.role = 'patient';
    this.familyUser.father_id = this.user._id;
    console.log(this.familyUser);
    this.allService.authService.createFamliyMember(this.familyUser).then((data: any) => {
      if (data && data.code == 1) {
        console.log(data);
        var obs: any[] = [];
        for (let ob of obs0) {
          console.log('ob', ob.label.ch);
          this.user = this.storage.get('user');
          var model: any = {
            obID: ob._id,
            registryUserID: data.data._id,
            patientID: data.data._id,
            value: ob.value,
            values: ob.values
          }
          obs.push(model)
        }
        this.createUserObValue(obs).then(() => {
          this.allService.alertDialogService.success('添加家庭成员成功');
          this.showFamilyMembers = false;
          this.close();
          console.log('--formService--saveUserForm--end--');
        })
      } else {
        this.allService.alertDialogService.error(data.msg);
      }
    });
  }

  createUserObValue(obs: any) {
    console.log('--formService--createUserObValue--start--');
    return new Promise((resolve, reject) => {
      console.log('obs to be created', obs)
      if (obs.length > 0) {
        this.allService.datasService.createObs(obs).then(() => {
          resolve('resolved');
          console.log('--formService--createUserObValue--end--');
          reject(new Error('error'));
        })
      } else {
        resolve('resolved');
        console.log('--formService--createUserObValue--end--');
        reject(new Error('error'));
      }
    })
  }

  /**
   * 根据用户信息添加obs内容
   * @param obs 
   * @returns 
   */
  getObs(obs: any) {
    for (let ob of obs) {
      if (ob.value) {
        //  if (ob.changed||(obSet.changeObs&&obSet.changeObs.indexOf(ob._id)>-1)){
        if (ob.label.en == 'birthday') {
          ob.value = this.familyUser.birthday;
        } else if (ob.label.en == 'name') {
          ob.value = this.familyUser.name;
        } else if (ob.label.en == 'gender' && ob.values && ob.values.length > 0) {
          ob.values[0].text = this.familyUser.gender;
        } else if (ob.label.en == 'telephone') {
          ob.value = this.familyUser.phone;
        } else if (ob.label.en == 'photo') {
          ob.value = this.familyUser.photo;
        } else if (ob.label.en == 'city') {
          ob.value = this.familyUser.city;
        } else if (ob.label.en == 'title') {
          ob.value = this.familyUser.title;
        } else if (ob.label.en == 'specialty') {
          ob.value = this.familyUser.specialty;
        }
      }
    }
    return obs;
  }


  getAge() {
    var timeDiff = Math.abs(Date.now() - new Date(this.birthdate).getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

  getUrl(image: any) {
    return this.allService.utilService.getImageUrl(String(image._id));
  }

  getFiles() {
    // debugger;
    if (this.patient && !this.selectedImage) {
      this.allService.imagesService.getByFilter({ patientID: this.patient._id, about: null }).then((data) => {
        this.images = data;
        for (let image of this.images) {
          if (!image.uploaded) {
            this.allService.datasService.getDatasByFilter2({ patientID: this.patient._id, obID: image.obID, imageID: image._id }).then((data) => {
              this.temp = data;
              if (this.temp.length > 0) {
                image.value = this.temp[0].value;
                image.valueList = [];
                image.valueList = this.temp.valueList;
              }
            })
          }
        }
      }, (err: any) => {
        // Check if already authenticated
        console.log("not allowed");
      });
    } else if (this.selectedImage && this.selectedImage.url) {
      this.selectedImage.url = this.allService.utilService.getImageUrl(String(this.selectedImage._id));
    }
  }


  uploadImage() {
    // if (this.user){
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
    // }
  }


  reNameFile() {
    // debugger;
    this.uploader.onAfterAddingFile = (file) => {
      //     console.log ('upload onafteraddingfile-2')
      if (this.fileType == 'image' && file) {
        //      console.log ('upload onafteraddingfile-3')
        this.allService.imagesService.create({ patientID: this.patient._id, uploaded: 'true' }).then((data) => {
          this.file = data;
          this.selectedImage = data;
          file.file.name = this.file._id + '.png';
          this.familyUser.photo = this.file._id;
          file.withCredentials = false;
          this.uploader.uploadAll();
        })
      }
    };
  }


  uploadFile() {
    // debugger;
    this.uploader.progress = 0;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      this.images.push(this.file);
      console.log('photo', response);
      // this.allService.alertDialogService.success('文件上传成功');
      alert('文件上传成功');
    };
  }

}
