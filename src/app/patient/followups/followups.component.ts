import { Component, OnInit, OnChanges, Inject, Input, HostListener } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { FollowupDetailComponent } from '../followup-detail/followup-detail.component';
import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'followups',
  templateUrl: './followups.component.html',
  styleUrls: ['./followups.component.scss']
})
export class FollowupsComponent implements OnInit, OnChanges {
  @Input() patient: any;
  @Input() language: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  date: any;
  weeks: any;
  temp: any;
  selectedDate: any;
  timeList: any;
  scheduleList: any;
  availableAt: any;
  temp_2: any;
  month: any;
  reservedAt: any;
  dayView: any;
  weekView: any;
  monthView: any;
  currentWeek: any;
  currentDay: any;
  currentMon: any;
  color: any;
  forms: any;
  followups: any;
  search: any;
  bigScreen: any;
  followupList: any;
  followup: any;
  profileIDs: any;
  update: any;
  loading: any;
  more: any;
  user: any;
  monthNames: any;
  followupSchedule: any;
  profiles: any;
  visit: any;
  followupDate: any;
  selectedEnd: any;
  selectedStart: any;
  differentDate: any;
  popOut: any;
  followupTime: any;
  selectedForm: any;
  followupForms: any;
  followupFullDate: any;
  selectedForms: any;
  monitorForm: any;
  showMonitor: any;
  showFollowup: any;
  followupTypeList: any;
  monitorForms: any;
  followupIDs: any;
  loadingWords: any;
  screenHeight: any;
  followupType: any;
  selectedFollowupType: any;


  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    @Inject(SESSION_STORAGE) private storage: StorageService) {

    this.color = this.storage.get('color');
    this.user = this.storage.get('user')
    if (this.user.role == 'patient')
      this.patient = this.user;
    if (!this.language)
      this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    this.profileIDs = [];
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
  }


  ngOnInit() {
    this.setup();
  }


  ngOnChanges() {
    this.setup();
  }


  setup() {
    if (this.patient) {
      for (let profile of this.patient.profiles) {
        this.profileIDs.push(profile._id);
      }
      this.followupSchedule = true;
      this.followupTime = ""
      console.log('patient', this.patient)
      this.update = [];
      this.followupList = [];
      this.user = this.storage.get('user')
      //  console.log ('user',this.user)
      this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.date = new Date();//get today's date
      //  this.getFollowups();
      this.selectedDate = new Date();
      this.selectedStart = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 0, 0).toUTCString();
      this.selectedEnd = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 23, 59).toUTCString();
      console.log('this.selectedEnd', this.selectedEnd)
      //this.getForm();
      //this.getFollowups();
      // this.getFollowupForms();
      this.currentDay = new Date();
      this.currentMon = this.date.getMonth();
      this.getFollowupTypes().then((data) => {
        this.followupTypeList = data;
        var profileIDs = [];
        for (let profile of this.patient.profiles) {
          profileIDs.push(profile._id)
        }
        this.selectedForms = [];
        console.log('this.followupTypeList', this.followupTypeList)
        this.allServices.categoryService.getCategoriesByFilter({ _id: { '$in': profileIDs } }).then((data) => {
          this.profiles = data;
          this.getFollowupForms();
        })
      });
      //console.log ('this.currentMon',this.currentMon)
      // this.getFollowListByDate();
    }
  }


  getFollowupForms() {
    var count = 0
    this.loading = true;
    this.loadingWords = 'loading ' + this.followupTypeList[0].name;
    this.followupFullDate = new Date(this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
    );
    //find the visit or create a visit
    var filter = {
      patientID: this.patient._id,
      visitDate: this.followupFullDate,
      type: 'followup'
    }
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      this.temp = data;
      if (this.temp.length > 0) {
        this.followup = this.temp[0];
        for (let followupType of this.followupTypeList) {
          this.getForms(followupType, this.temp[0]).then((data) => {
            count++;
            console.log('followupType.forms=============', count, followupType.forms)
            if (this.bigScreen == 1) {
              this.selectedForms = this.followupTypeList[0].forms;
              this.selectedFollowupType = this.followupTypeList[0];
              this.followupTypeList[0].selected = true;
              console.log('this.selectedForms=============', this.selectedForms)
            }
            if (count == this.followupTypeList.length) {
              this.loading = false;
              this.loadingWords = '';
            }
          })
        }
      } else {
        this.allServices.visitsService.createVisit(filter).then((data) => {
          this.followup = data;
          // console.log ('followup', this.followup)
          for (let followupType of this.followupTypeList) {
            this.getForms(followupType, this.followup).then((data) => {
              count++;
              // console.log ('followupType.forms=============',count,followupType.forms)
              if (this.bigScreen == 1) {
                this.selectedForms = this.followupTypeList[0].forms;
                this.followupTypeList[0].selected = true;
                this.selectedFollowupType = this.followupTypeList[0];
                //  console.log ('this.selectedForms=============',this.selectedForms)
              }
              if (count == this.followupTypeList.length) {
                this.loading = false;
                this.loadingWords = '';
              }
            })
          }
        })
      }
    })
  }


  getFollowupTypes() {
    return new Promise((resolve, reject) => {
      if (!this.followupTypeList) {
        this.followupTypeList = [];
      }
      this.loading = true;
      this.allServices.categoryService.getCategoriesByFilter({ 'label.en': 'followup type' }).then((data) => {
        this.temp = data;
        for (let option of this.temp[0].options) {
          this.followupTypeList.push({ name: option.text, forms: [] })
        }
        this.loading = false;
        resolve(this.followupTypeList);
        reject(new Error('error'));
      })
    })
  }


  selectChanged() {
    this.followupDate = new Date(this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      this.followupTime.split(':')[0],
      this.followupTime.split(':')[1].split(' ')[0]);
    console.log('this.followupDate', this.followupDate)
    this.addFollowup();
  }


  getValue(obSet: any) {
    for (let ob of obSet.obs) {
      if (ob.type == 'calculation' && ob.values) {
        return ob.values
      }
    }
    return null
  }


  getForms(followupType: any, followup: any) {
    return new Promise((resolve, reject) => {
      for (let profile of this.profiles) {
        for (let form of profile.forms) {
          // console.log ('form for followup========',form.label.ch, form.formType,form.followupType)
          if (form.followupType && form.followupType == followupType.name) {
            if (!this.find(form, followupType.forms)) {
              followupType.forms.push(form)
            }
          }
          if (form.followupType == 'monitor') {
            if (!this.monitorForms)
              this.monitorForms = [];
            if (!this.find(form, this.monitorForms))
              this.monitorForms.push(form);
          }
        }
      }
      if (followupType.name != 'monitor') {
        this.showMonitor = false;
        console.log('follow up visit=================', this.temp)
        this.followup = this.temp[0];
        // console.log ('followup', this.followup)
        // console.log ('followupType.forms', followupType.forms)
        if (followupType.forms.length > 0) {
          var formCount = 0;
          for (let form of followupType.forms) {
            this.allServices.formService.getForm(form, this.patient, followup, null).then((data) => {
              formCount++;
              if (formCount == followupType.forms.length) {
                resolve(followupType.forms);
                reject(new Error('error'));
              }
            })
          }
        } else {
          resolve('error');
          reject(new Error('error'));
        }
      } else {
        resolve('error');
        reject(new Error('error'));
      }
    })
  }


  selectForms(followupType: any) {
    this.selectedFollowupType = followupType;
    if (followupType.name != 'monitor') {
      this.selectedForms = followupType.forms
      this.followup = true;
      this.showMonitor = false;
    } else {
      this.followup = false;
      this.showMonitor = true;
      this.getFollowups();
    }
  }


  getFollowups() {
    return new Promise((resolve, reject) => {
      if (this.patient) {
        this.followupList = [];
        this.allServices.visitsService.getfollowupsByDate(
          {
            patientID: this.patient._id,
            selectedStart: this.selectedStart,
            selectedEnd: this.selectedEnd
          })
          .then((data) => {
            //console.log ('this.selectedStart',this.selectedStart)
            //console.log ('this.selectedEnd',this.selectedEnd)
            console.log('this.followupList=================', data)
            //visit
            this.followupList = data;
            if (this.followupList.length > 0) {
              for (let followup of this.followupList) {
                followup.forms = [];
                for (let form of this.monitorForms) {
                  var tempForm = { _id: form._id };
                  followup.forms.push(tempForm)
                }
                if (followup.forms.length > 0) {
                  for (let form of followup.forms) {
                    this.allServices.formService.getForm(form, this.patient, followup, null).then((data) => {

                      if (this.followupList.indexOf(followup) == this.followupList.length - 1
                        && followup.forms.indexOf(form) == followup.forms.length - 1) {
                        resolve(this.followupList);
                        reject(new Error('error'));
                      }
                    })
                  }
                }
              }
            } else {
              resolve('err');
              reject(new Error('error'));
            }
            //console.log (' this.followupList', this.followupList)
          })
      } else {
        resolve('err');
        reject(new Error('error'));
      }
    })
  }


  getImage(followupType: any) {
    if (followupType.name == 'mood') {
      return "./assets/img/mood.png"
    } else if (followupType.name == 'sleep') {
      return "./assets/img/sleep.png"
    } else if (followupType.name == 'nutrition') {
      return "./assets/img/nutrition.png"
    } else if (followupType.name == 'sports') {
      return "./assets/img/sports.png"
    } else if (followupType.name == 'monitor') {
      return "./assets/img/monitor.png"
    }
    else
      return ''
  }


  getLabel(followupType: any) {
    if (followupType.name == 'mood') {
      return "情绪"
    } else if (followupType.name == 'sleep') {
      return "睡眠"
    } else if (followupType.name == 'nutrition') {
      return "自我症状监查"
    } else if (followupType.name == 'sports') {
      return "运动"
    } else if (followupType.name == 'monitor') {
      return "监测"
    }
    else
      return '';
  }


  addTime() {
    this.popOut = true;
    var toDay = new Date();
    console.log('toDay', toDay.getFullYear(), toDay.getMonth(), toDay.getDate())
    if (this.selectedDate.getFullYear() == toDay.getFullYear()
      && this.selectedDate.getMonth() == toDay.getMonth()
      && this.selectedDate.getDate() == toDay.getDate()) {
      //if chart cuurent day
      console.log('this.selectedDate-1', this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate())
      this.followupDate = toDay;
    } else {
      this.differentDate = true;
      //if chart different day
      console.log('this.selectedDate-2', this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate())
      this.followupDate = this.selectedDate;
    }
  }


  selectForm(form: any, followup: any, followupList: any) {
    for (let followupItem of followupList) {
      followupItem.selected = false;
      if (followupItem.forms && followup._id == followupItem._id) {
        followupItem.selected = true;
        for (let formItem of followupItem.forms) {
          formItem.selected = false;
          if (form._id == formItem._id) {
            formItem.selected = true;
            this.selectedForm = form;
            console.log('this.selectedForm', this.selectedForm)
          }
        }
      }
    }
  }


  addFollowup() {
    if (this.monitorForms) {
      console.log('add this.profileIDs', this.profileIDs);
      let dialogConfig = new MatDialogConfig();
      //created followup
      console.log('this.followupDate', this.followupDate)
      if (!this.followupList)
        this.followupList = [];
      this.loading = true;
      this.allServices.visitsService.createVisit({
        patientID: this.patient._id,
        visitDate: this.followupDate,
        type: 'followup',
        desc: 'monitor'
      }).then((data) => {
        console.log('visit created', data)
        this.followup = data;
        this.followup.forms = [];
        for (let form of this.monitorForms) {
          var tempForm = { _id: form._id };
          this.followup.forms.push(tempForm)
        }
        this.followup.popOut = true;
        this.followupList.splice(0, 0, this.followup);
        var count = 0;
        for (let form of this.followup.forms) {
          count++;
          this.allServices.formService.getForm(form, this.patient, this.followup, null).then((data) => {
            if (count == this.followup.forms.length)
              this.loading = false;
          });
        }
      })
    }
  }


  getSummary(obSet: any) {
    console.log('this.selectedStart', this.selectedStart)
    console.log('this.selectedEnd', this.selectedEnd);
    obSet.dataSet = [];
    obSet.timeList = [];
    console.log('obSet', obSet)
    this.loading = true;
    this.allServices.categoryService.getSummary({
      patientID: this.patient._id,
      obSetID: obSet._id, limit: 100,
      selectedStart: this.selectedStart,
      selectedEnd: this.selectedEnd
    }).then((data) => {
      this.temp = data;
      console.log('data', this.temp)
      this.loading = false;
      if (this.temp.length > 0)
        obSet.obs = this.temp[0].obs;
    });
  }


  getForm() {
    this.forms = [];
    this.profiles = [];
    if (this.patient) {
      this.profileIDs = [];
      for (let profile of this.patient.profiles) {
        this.profileIDs.push(profile._id)
      }
      console.log('get form this.profileIDs', this.profileIDs);
      this.allServices.categoryService.getCategoriesByFilter({ _id: { '$in': this.profileIDs } }).then((data) => {
        this.temp = data;
        this.profiles = this.temp;
        for (let profile of this.profiles) {
          for (let form of profile.forms) {
            if (form.formType == 'followup') {
              this.allServices.categoryService.getCategoriesByFilter({ _id: form._id }).then((data) => {
                this.temp_2 = data;
                for (let obSet of this.temp_2[0].obSets) {
                  this.getSummary(obSet);
                }
                this.forms.push(this.temp_2[0]);
              })
            }
          }
        }
        console.log('get forms', this.forms);
      })
    }
  }


  getFollowupList() {
    this.followupList = [];
    this.followupTypeList = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter({ patientID: this.patient._id, visitType: 'followup' }).then((data) => {
      this.followupList = data;
      this.loading = false;
    })
  }


  /*getFollowupForms(){
  
    this.followupIDs=[];
    this.followupTypeList=[];
    if(this.patient){
    
        this.userService.findUserById(this.patient._id).then((data)=>{
          this.patient=data;
  
          if (this.patient.followups&&this.patient.followups.length>0){
            for (let followup of this.patient.followups){
              this.followupIDs.push(followup._id)
            }
          
          this.categoryService.getCategoriesByFilter({'_id':{'$in':this.followupIDs}}).then((data)=>{
            this.followupForms=data;
            console.log ('this.followupForms', this.followupForms)
            for (let form of this.followupForms){
              if (this.followupTypeList.indexOf(form.followupType)==-1)
              this.followupTypeList.push(form.followupType);
            }
          })
          }
          else{
            var profileIDs=[]
            for (let profile of this.patient.profiles){
              profileIDs.push(profile._id)
            }
            this.followupIDs=[];
            this.categoryService.getCategoriesByFilter({_id:{'$in':profileIDs}}).then((data)=>{
              this.temp=data;
              console.log ('profile', this.temp)
              if (this.temp.length>0){
                for (let item of this.temp){
                  for (let form of item.forms){
                    if (form.formType=='followup'){
                         
                           this.followupIDs.push(form._id)
                    }
                  }
              
                }
                console.log ('this.followupIDs', this.followupIDs)
                this.categoryService.getCategoriesByFilter({_id:{'$in':this.followupIDs}}).then((data)=>{
                  this.followupForms=data;
                  console.log ('this.followupForms', this.followupForms)
                  for (let form of this.followupForms){
                    if (this.followupTypeList.indexOf(form.followupType)==-1)
                    this.followupTypeList.push(form.followupType);
                  }
                })
              }
              console.log ('this.followupForms', this.followupForms)
             
            })
          }
        })
      }
  
  }*/


  receiveMessage($event: any) {
    this.forms = [];
    this.selectedDate = $event;
    this.selectedStart = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 0, 0).toUTCString();
    this.selectedEnd = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), 23, 59).toUTCString();
    this.getFollowupForms();
    // this.getFollowups();
  }


  getFollowListByDate() {
    this.allServices.visitsService.getVisitsByFilter(
      {
        patientID: this.patient._id,
        type: 'followup',
        'selectedDate': this.selectedDate
      }).then((data) => {
        this.followupList = data;
      })
  }

  find(item: any, list: any) {
    for (let i of list) {
      if (item._id == i._id)
        return true
    }
    return false;
  }


  add() {
    console.log('add this.profileIDs', this.profileIDs);
    let dialogConfig = new MatDialogConfig();
    //created followup
    var toDay = new Date();
    console.log('toDay', toDay.getFullYear(), toDay.getMonth(), toDay.getDate())
    if (this.selectedDate.getFullYear() == toDay.getFullYear()
      && this.selectedDate.getMonth() == toDay.getMonth()
      && this.selectedDate.getDate() == toDay.getDate()) {
      //if chart cuurent day
      console.log('this.selectedDate-1', this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate())
      this.followupDate = toDay;
    } else {
      //if chart different day
      console.log('this.selectedDate-2', this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate())
      this.followupDate = this.selectedDate;
    }
    console.log('this.followupDate', this.followupDate)
    this.allServices.visitsService.createVisit({
      patientID: this.patient._id,
      visitDate: this.followupDate,
      type: 'followup'
    }).then((data) => {
      console.log('visit created', data)
      this.visit = data;
      if (this.bigScreen == 1) {
        dialogConfig = {
          data: {
            'patient': this.patient,
            'language': this.language,
            'profileIDs': this.profileIDs,
            'followupDate': this.followupDate,
            'visit': this.visit
          },
          maxWidth: '80vw',
          maxHeight: '80vh',
          height: '80%',
          width: '80%'
        }
      } else if (this.bigScreen == 0) {
        dialogConfig = {
          data: {
            'patient': this.patient,
            'language': this.language,
            'profileIDs': this.profileIDs,
            'followupDate': this.followupDate,
            'visit': this.visit
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        }
      }
      const dialogRef = this.dialog.open(FollowupDetailComponent,
        dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.getForm();
        }
      })
    })
  }


  delete(time: any) {
    this.allServices.visitsService.getVisitsByFilter({ visitDate: time, patientID: this.patient._id })
      .then((data) => {
        this.temp = data;
        console.log('visit', this.temp)
        if (this.temp.length > 0)
          this.allServices.visitsService.delete(this.temp[0]._id).then((data) => {
            console.log('delete', this.temp[0])
          })
      })
  }


  edit(time: any) {
    //find for visit
    this.allServices.visitsService.getVisitsByFilter({ visitDate: time, patientID: this.patient._id })
      .then((data) => {
        this.temp = data;
        console.log('visit id', this.temp[0]._id);
        let dialogConfig = new MatDialogConfig();
        if (this.bigScreen == 1) {
          dialogConfig = {
            data: {
              'patient': this.patient,
              'language': this.language,
              'profileIDs': this.profileIDs,
              'visit': this.temp[0],
              'followupDate': this.temp[0].visitDate,
            },
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: '80%',
            width: '80%'
          }
        } else if (this.bigScreen == 1) {
          dialogConfig = {
            data: {
              'patient': this.patient,
              'language': this.language,
              'profileIDs': this.profileIDs,
              'visit': this.temp[0],
              'followupDate': this.temp[0].visitDate,
            },
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          }
        }
        const dialogRef = this.dialog.open(FollowupDetailComponent,
          dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getForm();
          }
        })
      })
  }
}
