import { Component, OnInit, AfterViewInit, Input, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices, WechatJssdkConfig } from '../../core/common-services';
import { ScheduleDetailComponent } from '../../core/common-components/schedule-detail/schedule-detail.component';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

var URL: string = environment.apiUrl + 'upload/';
@Component({
  selector: 'schedule-patient',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class PatientScheduleComponent implements OnInit {
  @Input() patient: any;
  @Input() selectedProvider: any;
  allWeek: any;
  selectedDate: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: any;
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  date: any;
  weeks: any;
  temp: any;
  mySchedules: any;
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
  loading: any;
  reserveSchedule: any;
  scheduleProfile: any;
  scheduleForm: any;
  language: any;
  bigScreen: any;
  screenHeight: any;
  screenWidth: any;
  screenSize: any;
  receipt: any;
  signature: any;
  @Input() editSchedule: any;
  @Output() messageEvent = new EventEmitter();
  user: any;
  //role pcyy代表pc端预约
  role: any;
  providers:any;
  myProviders:any;
  allProviders:any;
  profileProviders:any;
  showMyProviders:any;
  showProfileProviders:any;
  showAllProviders:any;
  search:any;

  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    public allServices: AllServices,
    private dialog: MatDialog,
    private router: Router,
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ScheduleDetailComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {

    if(!this.editSchedule) {
      this.editSchedule = true
    }

    this.bigScreen = this.storage.get('bigScreen');
    this.allWeek = true;
    this.dayView = true;
    this.monthView = false;
    this.weekView = false;
    this.role ='pcyy';
    // this.getScreenSize();
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    console.log('this.bigScreen', this.bigScreen);
    this.user = this.storage.get('user')
    this.timeList = [
      { hours: 8, minutes: 0, time: '8:00' },
      { hours: 8, minutes: 30, time: '8:30' },
      { hours: 9, minutes: 0, time: '9:00' },
      { hours: 9, minutes: 30, time: '9:30' },
      { hours: 10, minutes: 0, time: '10:00' },
      { hours: 10, minutes: 30, time: '10:30' },
      { hours: 11, minutes: 0, time: '11:00' },
      { hours: 11, minutes: 30, time: '11:30' },
      { hours: 13, minutes: 0, time: '13:00' },
      { hours: 13, minutes: 30, time: '13:30' },
      { hours: 14, minutes: 0, time: '14:00' },
      { hours: 14, minutes: 30, time: '14:30' },
      { hours: 15, minutes: 0, time: '15:00' },
      { hours: 15, minutes: 30, time: '15:30' },
      { hours: 16, minutes: 0, time: '16:00' },
      { hours: 16, minutes: 30, time: '16:30' }
    ];
    this.color = this.storage.get('color');
    this.language = this.storage.get('language');
    this.date = new Date();//get today's date
    this.selectedDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    this.currentDay = new Date();
    this.currentMon = this.date.getMonth();

  }
  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   this.screenSize = { height: this.screenHeight, width: this.screenWidth }
  //   console.log('this.screenWidth. this.screenHeight', this.screenSize.Width, this.screenSize.height)

  // }
  ngOnInit() {
    this.showMyProviders=true;
    this.getMyProviders();
    this.getPatientSchedules();
    
  }

  getDaySchedule() {
    var profileIDs = [];
    for (let profile of this.user.profiles) {
      
      profileIDs.push(profile._id)
    }
    this.scheduleList = [];
    this.loading = true;
    //find providers based ob patient profiles
  
      //find specific provider
      this.allServices.visitsService.getVisitsByFilter({
        availableAtYear: this.selectedDate.getFullYear(),
        availableAtMonth: this.selectedDate.getMonth(),
        availableAtDate: this.selectedDate.getDate(),
       // patientID: this.user._id
        providerID: this.selectedProvider._id,

      }).then((data) => {
        console.log('selected date schedule==========', data)
        this.scheduleList = data;
        this.loading = false;
      })
    
  }
getSchedule(time:any){


  var hours=time.hours;
  var minutes= time.minutes;
  for (let schedule of this.scheduleList){
     if (hours==schedule.availableAtHours&&minutes==schedule.availableAtMinutes){
       return schedule;
     }
  }
return null;
}

 

  getUrl(item: any) {
    return this.allServices.utilService.getHttpUrl(item.photo);
  }
  getMyProviders() {
    console.log('this.providers', this.providers);
    if (!this.myProviders) {
      this.myProviders = [];
      var providerIDs = [];
      for (let provider of this.user.providers) {
        providerIDs.push(provider._id)
      }
      this.allServices.usersService.getByFilter({ '_id': { '$in': providerIDs } }).then((data) => {
        this.myProviders = data;
        console.log('my providers', this.myProviders)
        if (this.bigScreen == 1)
          this.selectProvider(this.myProviders[0])
      })
    } else {
      this.selectProvider(this.myProviders[0])
    }
  }


  getProfileProviders() {
    var profileIDs=[];
    for (let profile of this.user.profiles){
      profileIDs.push(profile._id)
    }
    if (!this.profileProviders) {
      this.profileProviders = []
      this.allServices.usersService.getByFilter(
        { 'profiles': { '$elemMatch': { _id: {'$in':profileIDs } } }, 'role': 'provider' }).then((data) => {
          this.profileProviders = data;
          console.log('profile provides', this.profileProviders)
          if (this.bigScreen == 1)
            this.selectProvider(this.profileProviders[0])
        })
    } else {
      this.selectProvider(this.profileProviders[0])
    }
  }


  getAllProviders() {
    this.selectedProvider = null;
    if (!this.allProviders)
      // this.allServices.usersService.getByFilter({ 'role': 'provider' }).then((data) => {
      this.allServices.usersService.getWithDetailByFilter({ role: 'provider' }).then((data: any) => {
        this.allProviders = data;
      })
  }

  selectProvider(provider: any) {
    if (provider && provider._id) {
      this.selectedProvider = provider;
      this.allServices.usersService.findUserById(provider._id).then((data) => {
        this.temp = data;
        if (this.temp) {
         
          this.selectedProvider = this.temp;
          
          this.getDaySchedule();
       
        }
      })
    }
  }

  
  breakLines(str: any) {
    var temp = [];
    if (str)
      temp = str.split('/n');
    return temp;
  }
  //one patient can reserve one time spot
  checkSchedule() {
    for (let schedule of this.scheduleList) {
      //console.log ('patient book schedule', schedule)
      if (schedule.status == 'reserved' && schedule.patientID == this.user._id) {
        return true;
      }
    }
    return false;
  }


  getScheduleForm(time: any) {
   
    var hours=time.hours;
  var minutes= time.minutes;
  for (let scheduleItem of this.scheduleList){
     if (hours==scheduleItem.availableAtHours&&minutes==scheduleItem.availableAtMinutes){
      var schedule=scheduleItem;
     }
  }
    console.log('schedule===========', schedule)
    if (!this.checkSchedule()
      || (schedule.status == 'reserved' && schedule.patientID == this.user._id)) {
      this.reserveSchedule = true;
      //find profile
      /* for (let providerProfile of schedule.provider.profiles){
         for (let patientProfile of this.user.profiles){
           if (providerProfile._id==patientProfile._id){
             this.scheduleProfile=patientProfile;
             
           
           }
         }
       }*/
      //   this.loading=true;
      //   console.log('this.scheduleProfile===========',this.scheduleProfile)
      //   this.categoryService.getForm({patientID:this.user._id, 
      //                                profileIDs:[this.scheduleProfile._id], 
      //                                 formTypes:['schedule'],
      //                                 visitID:schedule._id}).then((data)=>{
      //       this.temp=data;
      //        console.log ('schedule form',this.temp)
      //        this.loading=false;
      //        if (this.temp.length>0)
      //          this.scheduleForm=this.temp[0];
      var dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      if (this.bigScreen == 1) {
        dialogConfig.data = { //scheduleForm:  this.scheduleForm,
          //  provider:schedule.provider, 
          language: this.language,
          patient: this.user,
          schedule: schedule
        };
        dialogConfig.maxWidth = '100vw',
          dialogConfig.maxHeight = '100vh',
          dialogConfig.height = '80%',
          dialogConfig.width = '80%'
      } else if (this.bigScreen == 0) {
        dialogConfig.data = {//scheduleForm:  this.scheduleForm,
          // provider:schedule.provider, 
          language: this.language,
          patient: this.user,
          schedule: schedule
        };
        dialogConfig.maxWidth = '100vw',
          dialogConfig.maxHeight = '100vh',
          dialogConfig.height = '100%',
          dialogConfig.width = '100%'
      }
      const dialogRef = this.dialog.open(ScheduleDetailComponent,
        dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.scheduleProfile = result.profile;
          if (!result.delete) {
            console.log('result', result)
            schedule.patientID = this.user._id;
            // schedule.patientEmail=this.user.email;
            schedule.patient = this.user;
            // schedule.providerEmail=provider.email;
            this.loading = true;
            if (schedule.status == 'avail') {
              schedule.status = 'reserved'
              this.mySchedules.push(schedule);
              this.allServices.visitsService.update(schedule).then((data) => {
                console.log('schedule', schedule)
                this.allServices.formService.saveForms(result.forms, schedule, this.user).then((data) => {
                  this.loading = false;
                  this.sendMail(schedule.provider, schedule, "add reserve");
                })
                //  if (result.forms&&result.forms.length>0)
                //  
              });
            } else {
              this.allServices.formService.saveForms(result.forms, schedule, this.user).then((data) => {
                this.loading = false;
              })
            }
          } else {
            // this.sendMail(provider, schedule,"cancel reserve");
            schedule.status = 'avail'
            schedule.patientID = null;
            schedule.patient = null;
            for (let item of this.mySchedules) {
              if (item._id == schedule._id) {
                var index = this.mySchedules.indexOf(item)
              }
            }
            this.mySchedules.splice(index, 1);
            this.allServices.visitsService.update(schedule).then((data) => {
              this.allServices.datasService.getDatasByFilter2({ visitID: schedule._id }).then((data) => {
                this.temp = data;
                for (let item of this.temp) {
                  this.allServices.datasService.delete(item._id);
                }
              })
            });
          }
        }
      });
      //      })
    }
  }


  sendMail(receiver: any, schedule: any, messageType: any) {
    //   this.categoryService.getCategory(this.scheduleProfile._id).then((data)=>{
    //     this.temp=data;
    var message = '';
    var month = schedule.availableAtMonth + 1;
    if (messageType == 'add reserve') {
      var message = '您的病人' + this.user.name + '在' +
        schedule.availableAtYear + '/' +
        month + '/' +
        schedule.availableAtDate + ' ' +
        schedule.availableAtHours + ':' +
        schedule.availableAtMinutes + '预约了微诊:' +
        this.scheduleProfile.label.ch
    } else if (messageType == 'cancel reserve') {
      message = '您的病人: ' +
        this.user.name + '取消了微诊:' +
        schedule.availableAtYear + '/' +
        month + '/' +
        schedule.availableAtDate + ' ' +
        schedule.availableAtHours + ':' +
        schedule.availableAtMinutes +
        this.scheduleProfile.label.ch
    }
    var filter = {
      appID: this.wechatJssdkConfig.appID0,
      appSecret: this.wechatJssdkConfig.appSecrete0,
      openID: receiver.openID,
      message: message
    };

    console.log('filter with mail message', filter)
    this.allServices.mailService.sendMessage(filter).then((data) => {
      console.log('message sent');
    })
    //    })
  }



  getProviderInfor(providerID: any) {
    this.allServices.usersService.findUserById(providerID).then((data) => {
      this.temp = data;
      //  console.log ('provider', this.temp)
      return this.temp;
    })
  }


  getPatientInfor(patientID: any) {
    this.allServices.usersService.findUserById(patientID).then((data) => {
      this.temp = data;
      //   console.log ('patient', this.temp)
      return this.temp;
    })
  }


  reserve(schedule: any, schedules: any) {
    var reserved = false;
    for (let item of schedules) {
      if (item.patientID == this.user._id)
        reserved = true;
    }
    if (this.user.role == 'patient' && !reserved) {
      schedule.patientID = this.user._id;
      schedule.patient = this.user._id;
      schedule.patientEmail = this.user.email;
      schedule.status = 'reserved'
      schedule.patient = {
        name: this.user.name,
        age: this.user.age,
        gender: this.user.gender,
        profiles: this.user.profiles
      },
        schedule.reservedAt = new Date();
      this.allServices.visitsService.update(schedule).then((data) => {
        schedule = data;
        //  console.log ('schedules', schedules)
        this.allServices.alertDialogService.alert("预订成功!")
      })
    }
  }


  showWeek(week: any, weeks: any) {
    var index = weeks.indexOf(week);
    console.log('week index', index)
    week.show = true;
    for (let weekItem of weeks) {
      if (weeks.indexOf(weekItem) != index) {
        weekItem.show = false;
      }
    }
  }


  getSchedules(week: any) {
    if (week) {
      this.currentWeek = week;
      if (week && !week.scheduleList)
        week.scheduleList = [];
      this.loading = true;
      this.allServices.visitsService.getVisitsByFilter({
        //  providerID: this.user._id,
        availableAtYear: this.date.getFullYear(),
        availableAtMonth: this.date.getMonth(),
        availableAtDate: { $in: week }
      }).then((data) => {
        console.log('data', data)
        week.scheduleList = data;
        console.log('week', week)
        console.log('weeks', this.weeks)
        this.loading = false;
      })
    }
  }


 

  getProviderSchedules() {
    this.mySchedules = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter({
      availableAtYear: this.selectedDate.getFullYear(),
      availableAtMonth: this.selectedDate.getMonth(),
      availableAtDate: this.selectedDate.getDate(),
      status: 'reserved',
      'provider._id': this.user._id
    }).then((data) => {
      //  console.log ('data', data)
      this.mySchedules = data;
      for (let mySchedule of this.mySchedules) {
        mySchedule.reservedDate = new Date(mySchedule.availableAtYear,
          mySchedule.availableAtMonth,
          mySchedule.availableAtDate,
          mySchedule.availableAtHours,
          mySchedule.availableAtMinutes)
      }
      this.loading = false;
    })
  }


  getPatientSchedules() {
    this.mySchedules = [];
    this.loading = true;
    if (!this.selectedProvider) {
      this.allServices.visitsService.getVisitsByFilter({
        status: 'reserved',
        type: { '$in': ['门诊', 'visit', 'vedio'] },
        'patientID': this.user._id
      }).then((data) => {
        //  console.log ('data', data)
        this.mySchedules = data;
        console.log('this.mySchedules', this.mySchedules)
        for (let mySchedule of this.mySchedules) {
          mySchedule.reservedDate = new Date(mySchedule.availableAtYear,
            mySchedule.availableAtMonth,
            mySchedule.availableAtDate,
            mySchedule.availableAtHours,
            mySchedule.availableAtMinutes)
        }
        this.loading = false;
      })
    } else {
      this.allServices.visitsService.getVisitsByFilter({

        status: 'reserved',
        type: { '$in': ['门诊', 'visit', 'vedio'] },
        'patientID': this.user._id,
        'providerID': this.selectedProvider
      }).then((data) => {
        //  console.log ('data', data)
        this.mySchedules = data;
        console.log('this.mySchedules', this.mySchedules)
        for (let mySchedule of this.mySchedules) {
          mySchedule.reservedDate = new Date(mySchedule.availableAtYear,
            mySchedule.availableAtMonth,
            mySchedule.availableAtDate,
            mySchedule.availableAtHours,
            mySchedule.availableAtMinutes)
        }
        this.loading = false;
      })
    }
  }


 
  getVisitDate(visit: any) {
    return new Date(visit.availableAtYear,
      visit.availableAtMonth,
      visit.availableAtDate,
      visit.availableAtHours,
      visit.availableAtMinutes)
  }


  findItem(item: any, list: any) {
    for (let i of list) {
      if (item._id == i)
        return true
    }
    return false;
  }


  getWeekView() {
    this.dayView = true;
    this.weekView = false;
    this.monthView = false;
    this.getSchedules(this.currentWeek);
    //  console.log ('ok here')
  }


  unBook(week: any) {
    if (week.scheduleList && week.scheduleList.length > 0) {
      for (let schedule of week.scheduleList) {
        //   console.log ('week.scheduleList',week.scheduleList)
        this.allServices.visitsService.delete(schedule._id).then((data) => {
          //     console.log ('delete', data);
        });
      }
      week.scheduleList = [];
    }
  }




 
  myProvider(schedule: any) {
    for (let provider of this.user.providers) {
      if (schedule.providerID == provider._id) {
        return true;
      }
    }
    return false;
  }


  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
  }


  receiveDateMessage($event: any) {
    this.selectedDate = $event;
    this.weekView = false;
    this.dayView = true;

    this.getDaySchedule();

    // this.getFollowups();
  }


  receiveWeekMessage($event: any) {
    this.currentWeek = $event;
    console.log('this.currentWeek from patient=========== ', this.currentWeek)
    this.getSchedules(this.currentWeek);

    this.getProviderSchedules();
    // this.getFollowups();
  }


  receiveMonthMessage($event: any) {
    this.weeks = $event;
  }


  receiveShowWeekMessage($event: any) {
    console.log('$event', $event)
    this.weekView = $event;
    if (this.weekView.checked == true) {
      this.weekView = true;
      this.dayView = false;
    } else if (!this.weekView.checked) {
      this.weekView = false;
      this.dayView = true;
    }
    console.log('this.weekView', this.weekView)
  }


  sendMessageToPatientStory() {
    this.messageEvent.emit(this.editSchedule);
  }
}
