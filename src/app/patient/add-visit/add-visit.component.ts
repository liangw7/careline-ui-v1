import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../core/common-services';

@Component({
  selector: 'add-visit',
  templateUrl: './add-visit.component.html',
  styleUrls: ['./add-visit.component.scss']
})
export class AddVisitComponent implements OnInit {
  categories: any;
  category: any;
  profiles: any;
  temp: any;
  subProfiles: any;
  selectedProfile: any;
  selectedProfiles: any;
  patient: any;
  user: any;
  procedureDate: any;
  language: any;
  visitTypeList: any;
  visitType: any;


  constructor(
    public allServices: AllServices,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddVisitComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.user = this.storage.get('user')
    if (this.user.role == 'patient') {
      this.patient = this.storage.get('patient');
    } else {
      this.patient = data.patient;
    }
    this.language = this.storage.get('language');
  }


  ngOnInit() {
    this.profiles = [];
    //get forms for profile
    /*this.userService.getUserProfiles({filterID:this.patient._id}).then((data)=>{
      this.temp=data;
      
      this.profiles=this.temp[0].profiles;
      for (let profileItem of this.patient.profiles){
        for (let profile of this.profiles){
          if (profileItem._id==profile._id){
            profile.produreDate=profileItem.procedureDate;
          }
        }
      }
      console.log ('profiles', this.profiles)
      console.log ('this.patient.profiles', this.patient.profiles)
    })*/
    this.selectedProfiles = [];
    this.allServices.usersService.getUserProfiles({ filterID: this.patient._id }).then((data) => {
      this.temp = data;
      this.profiles = this.temp[0].profiles;
    })
  }


  selectProfile(profile: any) {
    profile.subProfiles = [];
    this.selectedProfile = profile;
    console.log('this.selectedProfile', this.selectedProfile)
    if (!this.selectedProfile.procedureDate) {
      this.selectedProfile.procedureDate = new Date;
    }
    for (let form of profile.forms) {
      if (form.visitType) {
        var forms = [];
        if (this.findVisitType(form, profile.subProfiles) == -1) {
          forms = [form];
          profile.subProfiles.push({
            _id: profile._id,
            label: profile.label,
            procedureDate: this.selectedProfile.procedureDate,
            visitType: form.visitType,
            forms: forms
          })
        } else {
          var index = this.findVisitType(form, profile.subProfiles);
          profile.subProfiles[index].forms.push(form);
        }
      }
    }
  }


  findItem(item: any, list: any) {
    if (list.length > 0) {
      for (let i of list) {
        if (i._id == item._id) {
          return list.indexOf(i);
        }
      }
      return -1;
    } else {
      return -1;
    }
  }


  selectProfiles(profile: any) {
    var index = this.findItem(profile, this.selectedProfiles);
    if (index == -1) {
      this.selectedProfiles.push({ _id: profile._id, label: profile.label })
    } else if (index > -1) {
      this.selectedProfiles.splice(index, 1)
    }
  }


  addScreeningForms(subProfile: any) {
    if (this.patient.screeningList && this.patient.screeningList.length > 0) {
      for (let form of this.patient.screeningList) {
        if (form.visitType == subProfile.visitType && !this.findForm(form, subProfile.forms))
          subProfile.forms.push(form)
      }
    }
  }


  findForm(form: any, list: any) {
    for (let item of list) {
      if (form._id == item._id)
        return true;
    }
    return false;
  }


  findVisitType(form: any, profiles: any) {
    for (let profile of profiles) {
      for (let formItem of profile.forms) {
        if (form.visitType == formItem.visitType) {
          return profiles.indexOf(profile)
        }
      }
    }
    return -1;
  }


  selectSubProfile(subProfile: any) {
    this.addScreeningForms(subProfile)
    console.log('this.procedureDate', this.procedureDate)
    subProfile.procedureDate = this.selectedProfile.procedureDate
    this.dialogRef.close(subProfile);
  }


  submit() {
    this.dialogRef.close({ profiles: this.selectedProfiles, visitType: this.visitType });
  }

  
  close() {
    this.dialogRef.close();
  }
}
