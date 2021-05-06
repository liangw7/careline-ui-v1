import { Component, OnInit, OnChanges, AfterViewInit, Input, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices, WechatJssdkConfig } from '../../core/common-services';
import { ScheduleDetailComponent } from '../../core/common-components/schedule-detail/schedule-detail.component';

@Component({
  selector: 'schedule-provider',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ProviderScheduleComponent implements OnChanges  {
  @Input() patient: any;
  @Input()  hideHeader: any;
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
  selectedPatients: any;
  profiles: any;
  @Input() user: any;


  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    public allServices: AllServices,
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<ScheduleDetailComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {

    this.bigScreen = this.storage.get('bigScreen');
    this.allWeek = true;
    this.dayView = true;
    this.monthView = false;
    this.weekView = false;
    // this.getScreenSize();
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    console.log('this.bigScreen', this.bigScreen);
    if (!this.user){
      this.user = this.storage.get('user')
    }
   
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




  ngOnChanges() {
    this.getPatientSchedules();
    if (this.currentWeek){
      this.getSchedules(this.currentWeek);
      this.getDaySchedule(this.currentWeek);
    }
    
    this.getProviderSchedules();


  }

  //one patient can reserve one time spot
  checkSchedule(week: any) {
    for (let schedule of week.scheduleList) {
      //console.log ('patient book schedule', schedule)
      if (schedule.status == 'reserved' && schedule.patientID == this.user._id) {
        return true;
      }
    }
    return false;
  }

  getScheduleForm(schedule: any) {
    if (!this.checkSchedule(this.currentWeek)
      || (schedule.status == 'reserved' && schedule.patientID == this.user._id)) {
      this.reserveSchedule = true;
      //find profile
      for (let providerProfile of schedule.provider.profiles) {
        for (let patientProfile of this.user.profiles) {
          if (providerProfile._id == patientProfile._id) {
            this.scheduleProfile = patientProfile;
          }
        }
      }
      this.loading = true;
      this.allServices.categoryService.getForm({
        patientID: this.user._id,
        profileIDs: [this.scheduleProfile._id],
        formTypes: ['schedule'],
        visitID: schedule._id
      }).then((data) => {
        this.temp = data;
        console.log('schedule form', this.temp)
        this.loading = false;
        if (this.temp.length > 0)
          this.scheduleForm = this.temp[0];
        var dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        if (this.bigScreen == 1) {

          dialogConfig.data = {
            scheduleForm: this.scheduleForm,
            provider: schedule.provider,
            language: this.language,
            patient: this.user,
            schedule: schedule
          };
          dialogConfig.maxWidth = '100vw',
            dialogConfig.maxHeight = '100vh',
            dialogConfig.height = '80%',
            dialogConfig.width = '80%'
        } else if (this.bigScreen == 0) {
          dialogConfig.data = {
            scheduleForm: this.scheduleForm,
            provider: schedule.provider,
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
            if (!result.delete) {
              console.log('result', result)
              this.sendMail(schedule.provider, schedule, "add reserve");
              schedule.status = 'reserved'
              schedule.patientID = this.user._id;
              schedule.patient = this.user;
              this.allServices.visitsService.update(schedule);
              this.allServices.formService.saveForms(result.forms, schedule, schedule.patient);
            } else {
              this.sendMail(schedule.provider, schedule, "cancel reserve");
              schedule.status = 'avail'
              schedule.patientID = null;
              schedule.patient = null;
              this.allServices.visitsService.update(schedule);
              this.allServices.datasService.getDatasByFilter2({ visitID: schedule._id }).then((data) => {
                this.temp = data;
                for (let item of this.temp) {
                  this.allServices.datasService.delete(item._id);
                }
              })
            }
          }
        });
      })
    }
  }


  sendMail(receiver: any, schedule: any, messageType: any) {
    var message = '';
    this.allServices.categoryService.getCategory(this.scheduleProfile._id).then((data) => {
      this.temp = data;
      var month = schedule.availableAtMonth + 1;
      if (messageType == 'add reserve') {
        message = '您的病人' + this.user.name + '在' +
          schedule.availableAtYear + '/' +
          month + '/' +
          schedule.availableAtDate + ' ' +
          schedule.availableAtHours + ':' +
          schedule.availableAtMinutes + '预约了微诊:' +
          this.temp.label.ch
      } else if (messageType == 'cancel reserve') {
        message = '您的病人: ' +
          this.user.name + '取消了微诊:' +
          schedule.availableAtYear + '/' +
          month + '/' +
          schedule.availableAtDate + ' ' +
          schedule.availableAtHours + ':' +
          schedule.availableAtMinutes +
          this.temp.label.ch
      }
      var filter = {
        appID: this.wechatJssdkConfig.appID0,
        appSecret: this.wechatJssdkConfig.appSecrete0,
        openID: receiver.openID,
        message: message
      };
      console.log('filter with mail message', filter)
      this.allServices.mailService.sendMessage(filter).then((data) => {
        console.log('message sent')
      })
    })
  }


  bookWeek(week: any) {
    this.profiles = []
    for (let profile of this.user.profiles) {
      this.profiles.push({ _id: profile._id, label: profile.label })
    }
    if (this.user.role == 'provider') {
      //if (! week.availableList)
      //console.log ('week', week)
      week.availableList = [];
      this.loading = true;
      for (let time of this.timeList) {
        for (let day of week) {
          //exclude sunday and saterday
          //   if (week.indexOf(day)!=0&&week.indexOf(day)!=6){
          if (!((day > week[6] && this.weeks.indexOf(week) == 0) || (day < week[0] && this.weeks.indexOf(week) > 1))) {
            this.availableAt = {
              year: this.date.getFullYear(),
              month: this.date.getMonth(),
              date: day,
              hours: time.hours,
              minutes: time.minutes
            };
            week.availableList.push(this.availableAt);
          }
          //  }
        }
      }
      // console.log ('week.availableList',week.availableList)
      for (let availableAt of week.availableList) {
        this.allServices.visitsService.getVisitsByFilter({
          providerID: this.user._id,
          availableAtYear: availableAt.year,
          availableAtMonth: availableAt.month,
          availableAtDate: availableAt.date,
          availableAtHours: availableAt.hours,
          availableAtMinutes: availableAt.minutes
        }).then((data) => {
          this.temp = data;
          console.log('schedule found', this.temp)
          if (this.temp.length == 0) {
            this.allServices.visitsService.createVisit({
              providerID: this.user._id,
              providerEmail: this.user.email,
              provider: {
                _id: this.user._id,
                name: this.user.name,
                title: this.user.title,
                profiles: this.profiles,
                photo: this.user.photo,
                openID: this.user.openID
              },
              type: '门诊',
              enType: 'office visit',
              status: 'avail',
              availableAtYear: availableAt.year,
              availableAtMonth: availableAt.month,
              availableAtDate: availableAt.date,
              availableAtHours: availableAt.hours,
              availableAtMinutes: availableAt.minutes
            }).then((data) => {
              this.temp_2 = data;
              console.log('schedule created', this.temp_2)
              if (!week.scheduleList)
                week.scheduleList = [];
              week.scheduleList.push(this.temp_2);
            })
            this.loading = false;
          } else {
            this.loading = false;
            // console.log ('found this.temp',this.temp)
            // week.scheduleList[this.timeList.indexOf(time)].push(this.temp[0]);
          }
        })
      }
    }
  }


  bookDate(currentDay: any, week: any) {
    this.profiles = []
    for (let profile of this.user.profiles) {
      this.profiles.push({ _id: profile._id, label: profile.label })
    }
    if (this.user.role == 'provider') {
      week.availableList = [];
      for (let time of this.timeList) {
        // console.log ('currentDay not null')
        if (week.indexOf(currentDay) != 0 && week.indexOf(currentDay) != 6) {
          if (!(currentDay > this.date.getDate() && this.weeks.indexOf(week) == 0) && !(currentDay < this.date.getDate() && this.weeks.indexOf(week) == this.weeks.length - 1)) {
            this.availableAt = {
              year: this.date.getFullYear(),
              month: this.date.getMonth(),
              date: currentDay,
              hours: time.hours,
              minutes: time.minutes
            };
            week.availableList.push(this.availableAt);
          }
        }
      }
      //   console.log ('week.availableList', week.availableList)
      for (let availableAt of week.availableList) {
        this.loading = true;
        this.allServices.visitsService.getVisitsByFilter({
          providerID: this.user._id,
          availableAtYear: availableAt.year,
          availableAtMonth: availableAt.month,
          availableAtDate: availableAt.date,
          availableAtHours: availableAt.hours,
          availableAtMinutes: availableAt.minutes
        }).then((data) => {
          this.temp = data;
          if (this.temp.length == 0) {
            this.allServices.visitsService.createVisit({
              providerID: this.user._id,
              providerEmail: this.user.email,
              provider: {
                _id: this.user._id,
                name: this.user.name,
                title: this.user.title,
                profiles: this.profiles,
                photo: this.user.photo,
                openID: this.user.openID
              },
              status: 'avail',
              type: '门诊',
              enType: 'office visit',
              availableAtYear: availableAt.year,
              availableAtMonth: availableAt.month,
              availableAtDate: availableAt.date,
              availableAtHours: availableAt.hours,
              availableAtMinutes: availableAt.minutes
            }).then((data) => {
              this.temp_2 = data;
              //   console.log ('schedule created', this.temp_2)
              if (!week.scheduleList)
                week.scheduleList = [];
              week.scheduleList.push(this.temp_2);
            })
            this.loading = false;
          } else {
            console.log('found this.temp', this.temp)
            this.loading = false;
            // week.scheduleList[this.timeList.indexOf(time)].push(this.temp[0]);
          }
        })
      }
    }
    //if (! week.availableList)
  }


  bookTime(week: any, date: any, time: any) {
    var profiles = []
    for (let profile of this.user.profiles) {
      profiles.push({ _id: profile._id, label: profile.label })
    }
    if (this.user.role == 'provider') {
      this.loading = true;
      console.log('week', week)
      var schedules = this.findSchedule(week, date, time.hours, time.minutes);
      if (!schedules) {
        this.loading = true;
        this.allServices.visitsService.createVisit({
          providerID: this.user._id,
          providerEmail: this.user.email,
          provider: {
            _id: this.user._id,
            name: this.user.name,
            title: this.user.title,
            profiles: profiles,
            photo: this.user.photo,
            openID: this.user.openID
          },
          status: 'avail',
          type: '门诊',
          enType: 'office visit',
          availableAtYear: this.date.getFullYear(),
          availableAtMonth: this.date.getMonth(),
          availableAtDate: date,
          availableAtHours: time.hours,
          availableAtMinutes: time.minutes
        }).then((data) => {
          this.loading = false;
          this.temp_2 = data;
          console.log('schedule created', this.temp_2)

          if (!week.scheduleList)
            week.scheduleList = [];
          week.scheduleList.push(this.temp_2);
          this.loading = false;
        })
      } else {
        if (schedules[0].status == 'avail') {
          this.unBookTime(week, schedules[0]);
          this.loading = false;
        } else if (schedules[0].status == 'reserved') {
          this.selectPatient(schedules[0].patient);
        }
        /*  for (let item of week.scheduleList){
            console.log ('item', item)
           // if (item._id==schedules[0]._id){
              console.log ('item._id', item._id)
              var index=week.scheduleList.indexOf(item)
                week.scheduleList.splice(index,1)
                this.visitService.delete(item.id).then((data)=>{
                 console.log ('deleted',data)
                  this.loading=false;
                })
              
           // }
          }*/
      }
    }
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
        providerID: this.user._id,
        availableAtYear: this.date.getFullYear(),
        availableAtMonth: this.date.getMonth(),
        availableAtDate: { $in: week }
      }).then((data) => {
        // console.log ('week schedule============', data)
        week.scheduleList = data;
        console.log('week', week)
        console.log('weeks', this.weeks)
        this.loading = false;
      })
    }
  }


  deleteTimeSchedule(schedule: any, week: any) {
    for (let scheduleItem of week.scheduleList) {
      if (scheduleItem._id == schedule._id) {
        var index = week.scheduleList.indexOf(scheduleItem);
        week.scheduleList.splice(index, 1)
      }
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
    this.allServices.visitsService.getVisitsByFilter({
      status: 'reserved',
      'patientID': this.user._id
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


  getDaySchedule(week: any) {
    if (!week) {
      week = this.currentWeek;
      console.log('week')
    }
    week.scheduleList = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter({
      availableAtYear: this.selectedDate.getFullYear(),
      availableAtMonth: this.selectedDate.getMonth(),
      availableAtDate: this.selectedDate.getDate(),
      providerID: this.user._id,
    }).then((data) => {
      console.log('day schedule===========', data)
      week.scheduleList = data;
      this.loading = false;
    })
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


  unBookTime(week: any, scheduleItem: any) {
    console.log('cheduleItem', scheduleItem)
    if (week.scheduleList && week.scheduleList.length > 0) {

      for (let schedule of week.scheduleList) {
        console.log('schedule.status', schedule.status)
        if (schedule._id == scheduleItem._id && schedule.status == 'avail') {
          var index = week.scheduleList.indexOf(schedule);
          //   console.log ('week.scheduleList',week.scheduleList)
          this.allServices.visitsService.delete(schedule._id).then((data) => {
            //     console.log ('delete', data);
          });
        }
      }
      week.scheduleList.splice(index, 1);
    }
  }


  bookWeeks() {
    for (let week of this.weeks) {
      week.show = true;
      this.bookWeek(week);
    }
  }


  unBookWeeks() {
    for (let week of this.weeks) {
      this.unBook(week);
    }
  }


  findSchedule(week: any, day: any, hours: any, minutes: any) {
 
    var schedules = [];
    var patientSchedules = [];
     console.log ('week.scheduleList',week.scheduleList)
    if (week && week.scheduleList) {
      if (day != null) {
        var year = this.date.getFullYear();
        var month = this.date.getMonth();
        var date = day;
      } else if (day == null) {
        var year = this.selectedDate.getFullYear();
        var month = this.selectedDate.getMonth();
        date = this.selectedDate.getDate();
      }
      for (let schedule of week.scheduleList) {
        if (schedule) {
          //console.log ('month',month)
           console.log ('schedule.availableAtMonth',schedule.availableAtMonth)
          // console.log ('year',year)
          // console.log ('schedule.availableAtYear',schedule.availableAtYear)
          //console.log ('date',date)
          // console.log ('schedule.availableAtDate',schedule.availableAtDate)
          if (schedule.availableAtYear == year &&
            schedule.availableAtMonth == month &&
            schedule.availableAtDate == date &&
            schedule.availableAtHours == hours &&
            schedule.availableAtMinutes == minutes &&
            this.user.role != 'patient') {
            if (!this.findItem(schedule, schedules))
              schedules.push(schedule);
          }
          if (schedule.availableAtYear == year &&
            schedule.availableAtMonth == month &&
            schedule.availableAtDate == date &&
            schedule.availableAtHours == hours &&
            schedule.availableAtMinutes == minutes &&
            this.user.role == 'patient' &&
            (schedule.patientID == undefined ||
              schedule.patientID == this.user._id)) {
            if (!this.findItem(schedule, schedules))
              patientSchedules.push(schedule);
          }
        }
      }
    }
    // console.log ('schedules',schedules)
    if (schedules.length > 0) {
      week.scheduled = true;
      return schedules;

    } else if (patientSchedules.length > 0) {
      week.scheduled = true;
      return patientSchedules;
    } else
      return null;
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
    if (this.currentWeek)
    this.getDaySchedule(this.currentWeek);
    this.getProviderSchedules();
    // this.getFollowups();
  }


  receiveWeekMessage($event: any) {
    this.currentWeek = $event;
    console.log('this.currentWeek from patient=========== ', this.currentWeek)
    if (this.currentWeek)
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


  selectPatient(patient: any) {
    this.loading = true;
    this.selectedPatients = [];
    this.selectedPatients = this.storage.get('selectedPatients');
    this.storage.set('patient', patient)

    this.selectedPatients = this.storage.get('selectedPatients');
    if (!this.selectedPatients)
      this.selectedPatients = [];
    if (!this.findItem(patient, this.selectedPatients))
      this.selectedPatients.splice(0, 0, patient)
    console.log('this.selectedPatients', this.selectedPatients);
    this.storage.set('selectedPatients', this.selectedPatients);
    this.storage.set('selectedPatient', patient);
    this.loading = false;
    if (this.bigScreen == 1)
      this.router.navigate(['/homepage/home/selected-patients']);
    else if (this.bigScreen == 0) {
      let dialogConfig = new MatDialogConfig();
      //  dialogConfig.disableClose = true;
      // dialogConfig.autoFocus = true;
      dialogConfig = {
        data: {
          'patient': patient,
          'language': this.language,
        },
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
      // const dialogRef = this.dialog.open(PatientStoryComponent,dialogConfig);
    }
  }
}
