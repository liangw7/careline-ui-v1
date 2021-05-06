import { Component, OnInit,OnChanges, Inject, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit, OnChanges {

  @Input() allWeek: any;
  @Input() patient: any;
  @Input() currentWeek: any;
  @Input() followup: any;
  @Output() messageDateEvent = new EventEmitter<Date>();
  @Output() messageWeekEvent = new EventEmitter();
  @Output() messageShowWeekEvent = new EventEmitter();
  @Output() messageMonthEvent = new EventEmitter();
  @Input() role: any;

  selectedDate: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[] = [];
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
  weekList: any;
  showWeek: any;
  user: any;
  constructor(
    private allService: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.bigScreen = this.storage.get('bigScreen');
    this.color = this.storage.get('color');
    this.language = this.storage.get('language');
  }


  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   this.screenSize = { height: this.screenHeight, width: this.screenWidth }
  //   console.log('this.screenWidth. this.screenHeight', this.screenSize.Width, this.screenSize.height)

  // }

ngOnInit(){
  this.setup();
}
  setup() {
    console.log('allWeek===', this.allWeek)
    this.showWeek = { checked: true };
    // this.getScreenSize();
    // if (this.screenWidth <= 992)
    //   this.bigScreen = 0;
    // else
    //   this.bigScreen = 1;
    console.log('this.bigScreen', this.bigScreen);
    this.user = this.storage.get('user')
    console.log('user from storage', this.user)
    //  console.log ('user',this.user)
    //  this.monthNames=['Jan', 'Feb','Mar', 'Apr', 'May', 'Jun', 
    // 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec' ];
    this.monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'];
    this.date = new Date();//get today's date

    this.selectedDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    this.currentDay = new Date();
    this.currentMon = this.date.getMonth();
    //console.log ('this.currentMon',this.currentMon)
    this.getDaysOfMonth();
    console.log('this.currentWeek=========', this.currentWeek)
    if (this.currentWeek)
      this.getSelectedWeek(this.currentWeek);
    this.monthView = false;
    this.weekView = true;

  }

  ngOnChanges() {
  this.setup();

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

  findSchedule(week: any, day: any, hours: any, minutes: any) {

    var schedules = [];
    var patientSchedules = [];
    // console.log ('week.scheduleList',week.scheduleList)
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
          // console.log ('schedule.availableAtMonth',schedule.availableAtMonth)
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

            if (!this.allService.utilService.findItem(schedule, schedules))
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

            if (!this.allService.utilService.findItem(schedule, schedules))
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
    }
    else
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


  getDaysOfMonth() {
    //   console.log ('this.date', this.date)
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.weeks = new Array();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }


    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    //days of last month
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();

    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {

      this.daysInLastMonth.push(i);
      if (this.weeks.length === 0) {
        this.weeks.push([i]);
        if (i == this.selectedDate.getDate()) {
          this.currentWeek = this.weeks[this.weeks.length - 1];
          console.log('currentWeek-1', this.currentWeek)
        }
      } else {
        if (this.weeks[this.weeks.length - 1].length < 7) {
          this.temp = this.weeks[this.weeks.length - 1];
          this.temp.push(i);
          this.weeks[this.weeks.length - 1] = this.temp;
          if (i == this.selectedDate.getDate()) {
            this.currentWeek = this.temp;
            console.log('currentWeek-2', this.currentWeek)
          }
        } else if (this.weeks[this.weeks.length - 1].length == 7) {

          this.weeks.push([i]);
          if (i == this.selectedDate.getDate()) {
            this.currentWeek = this.weeks[this.weeks.length - 1];
            console.log('currentWeek-3', this.currentWeek)
          }
        }
      }
    }
    // console.log ('this.weeks', this.weeks);
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    for (var t = 0; t < thisNumOfDays; t++) {
      this.daysInThisMonth.push(t + 1);
      //  console.log ('')
      if (this.weeks.length === 0) {
        this.weeks.push([t + 1]);
        if (t == this.selectedDate.getDate()) {
          this.currentWeek = this.weeks[this.weeks.length - 1];
          console.log('currentWeek-4', this.currentWeek)
        }

      } else {

        if (this.weeks[this.weeks.length - 1].length < 7) {
          this.temp = this.weeks[this.weeks.length - 1];
          this.temp.push(t + 1);
          this.weeks[this.weeks.length - 1] = this.temp;

          if (t == this.selectedDate.getDate()) {
            this.currentWeek = this.temp;
            console.log('currentWeek-5', this.currentWeek)
          }
        } else if (this.weeks[this.weeks.length - 1].length == 7) {

          this.weeks.push([t + 1]);
          if (t == this.selectedDate.getDate() || t == 0) {
            this.currentWeek = this.weeks[this.weeks.length - 1];
            console.log('currentWeek-6', this.currentWeek)
          }
        }

      }


    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    //  var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var m = 0; m < (6 - lastDayThisMonth); m++) {
      this.daysInNextMonth.push(m + 1);

      if (this.weeks.length === 0) {
        this.weeks.push([i]);
      } else {
        if (this.weeks[this.weeks.length - 1].length < 7) {
          this.temp = this.weeks[this.weeks.length - 1];
          this.temp.push(m + 1);
          this.weeks[this.weeks.length - 1] = this.temp;
        } else if (this.weeks[this.weeks.length - 1].length == 7) {

          this.weeks.push([m + 1]);
        }
      }
    }

    //  console.log ('this.weeks', this.weeks);
    var totalDays = this.daysInLastMonth.length
      + this.daysInThisMonth.length
      + this.daysInNextMonth.length;

    if (totalDays < 36) {
      for (var n = (7 - lastDayThisMonth); n < 6; n++) {

        this.daysInNextMonth.push(n);

        if (this.weeks[this.weeks.length - 1].length < 7) {
          this.temp = this.weeks[this.weeks.length - 1];
          this.temp.push(n);
          this.weeks[this.weeks.length - 1] = this.temp;
        }

      }
      console.log('this.currentWeek', this.currentWeek);

    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
    this.messageMonthEvent.emit(this.weeks);
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
    this.messageMonthEvent.emit(this.weeks);
  }

  goToLastWeek() {

    if (this.weeks.indexOf(this.currentWeek) > 0)
      this.currentWeek = this.weeks[this.weeks.indexOf(this.currentWeek) - 1];
    else if (this.weeks.indexOf(this.currentWeek) == 0) {
      this.goToLastMonth();
      this.currentWeek = this.weeks[this.weeks.length - 1];
    }
  }

  goToNextWeek() {
    if (this.weeks.indexOf(this.currentWeek) < this.weeks.length - 1)
      this.currentWeek = this.weeks[this.weeks.indexOf(this.currentWeek) + 1];
    else if (this.weeks.indexOf(this.currentWeek) == this.weeks.length - 1) {
      this.goToNextMonth();
      this.currentWeek = this.weeks[0];
    }
  }


  goToLastDate() {

    var firstDateThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDate();

    if (this.selectedDate.getDate() > firstDateThisMonth) {
      //last date of last month
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1);
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
      if (this.selectedDate.getDate() < this.currentWeek[0]) {
        this.currentWeek = this.weeks[this.weeks.length - 1];
      }

    } else if (this.selectedDate.getDate() == firstDateThisMonth) {
      // this.date = new Date(this.date.getFullYear(), this.date.getMonth(),0);
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 0);
      this.goToLastMonth();
      this.currentWeek = this.weeks[this.weeks.length - 1];
    }


  }


  goToNextDate() {

    var lastDateThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    if (this.selectedDate.getDate() < lastDateThisMonth) {
      //last date of last month
      this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 1);
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + 1);
      if (this.selectedDate.getDate() > this.currentWeek[6]) {
        this.currentWeek = this.weeks[this.weeks.indexOf(this.currentWeek) + 1];
      }
    } else if (this.selectedDate.getDate() == lastDateThisMonth) {
      // this.date = new Date(this.date.getFullYear(), this.date.getMonth()+1,1);
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);

      this.goToNextMonth();
      this.currentWeek = this.weeks[0];

    }

  }


  getSelectedDate(day: any, week: any) {
    this.currentWeek = week;

    if (!(day > week[6] && this.weeks.indexOf(week) == 0) && !(day < week[0] && this.weeks.indexOf(week) > 1)) {
      this.selectedDate = new Date(this.date.getFullYear(), this.date.getMonth(), day);
      this.messageDateEvent.emit(this.selectedDate);

    }
  }


  getSelectedWeek(week: any) {
    if (this.showWeek.checked) {
      this.showWeek.checked = false;
    } else {
      this.showWeek.checked = true;

    }
    this.messageWeekEvent.emit(week);
    this.messageMonthEvent.emit(this.weeks);
    this.messageShowWeekEvent.emit(this.showWeek);
    console.log('this.showWeek===========', this.showWeek)
    //  console.log ('this.selectedDate.getDate()', this.selectedDate.getDate())
  }
}


