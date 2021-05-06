import {
  Component, OnInit, OnChanges, Inject, Input
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import * as Chartist from 'chartist';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../core/common-services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'dashboard-provider',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  @Input() serviceID: any;
  user: any;
  color: any;
  service: any;
  totalServicePatients: any;
  totalMarketPatients: any;
  dailyPatients: any;
  monthlyPatients: any;
  monthlyNewPatientsChart: any;
  monthlyVisitList: any;
  monthlyVisitsChart: any;
  providerList: any;
  providers: any;
  temp: any;
  schedules: any;
  mails: any;
  patient: any;
  subscription: Subscription;
  language: any;
  patientProfileChart: any;
  serviceList: any;
  monthlyVisitListByProvider: any;
  monthlyVisitsByProviderChart: any;
  totalProviderPatients: any;
  monthlyPatientsByProvider: any;
  monthlyNewPatientsByProviderChart: any;
  patientProfileByProviderChart: any;
  loading: any;
  hasProvider: any;
  bigScreen: any;
  profiles:any;

  constructor(
    public router: Router,
    public allServices: AllServices,
    private dialog: MatDialog,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.color = this.storage.get('color');
    this.user = this.storage.get('user');
    //console.log ('this.user',this.user)
    this.patient = this.storage.get('patient');
    this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    this.subscription = this.allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
  }


  ngOnInit() {
    if (!this.serviceID) {
      // console.log ('ngOnInit')
      this.hasProvider = true;
      if (this.user.service) {
        this.serviceID = this.user.service._id;
        //  console.log ('serviceID', this.serviceID)
        this.loading = true;
        this.allServices.usersService.findUserById(this.serviceID).then((data) => {
          this.temp = data;
          this.service = this.temp;
          this.loading = false;
          this.getServiceDashboard();
        })
      }
      this.getProviderDashboard();
    }
    else{
      this.getProviderDashboard()
    }
  }


  tabSelectionChanged(event: any) {
    let selectedTab = event.tab;
    if (selectedTab.textLabel == '概况' || selectedTab.textLabel == 'my business') {
      this.getProviderDashboard();
    }
    else {
      this.getServiceDashboard();
    }
  }


  getProviderDashboard() {
    console.log ('provider')
    for (let profile of this.user.profiles) {
      this.getProfilePatientsByProvider(profile);
    }
    //chart
    this.monthlyNewPatientsByProvider();
    this.monthlyVisitsByProvider(24);
    this.patientsByProfileByProvider();
    //count
    this.getTotalPatientsByProvider();
  }


  getServiceDashboard() {
    console.log ('service')
    for (let profile of this.service.profiles) {
      this.getProfilePatients(profile);
    }
    // console.log ('this.service',this.service)
    //chart
    this.monthlyNewPatients();
    this.monthlyVisits();
    this.patientsByProfile();
    //count
    this.getTotalPatients();
    this.getProviders();
    this.loading = false
  }


  ngOnChanges() {
    if (this.serviceID) {
      // console.log ('ngOnChanges')
      this.allServices.usersService.findUserById(this.serviceID).then((data) => {
        this.temp = data;
        this.service = this.temp;

        //  this.getServiceDashboard()
      })
    }
  }


  getLabel(label: any) {
    if (this.language == 'English') {
      if (label == '团队医生') {
        return 'providers'
      } else if (label == '团队') {
        return 'service'
      } else if (label == '我的病人') {
        return 'my business'
      }
    } else {
      return label;
    }
  }


  getTotalPatients() {
    this.allServices.usersService.getCount({
      role: 'patient',
      serviceList: { $elemMatch: { _id: this.service._id } }
    }).then((data) => {
      //  console.log ('data count', data);
      this.temp = data;
      this.totalServicePatients = this.temp;
    })
  }


  gotoProviderFolder() {
    this.router.navigate(['/homepage/provider-folder'])
  }


  getTotalPatientsByProvider() {
    this.allServices.usersService.getCount({
      role: 'patient',
      providers: { $elemMatch: { _id: this.user._id } }
    }).then((data) => {
      //  console.log ('data count', data);
      this.temp = data;
      this.totalProviderPatients = this.temp;
    })
  }


  getProfilePatients(profile: any) {
    this.allServices.usersService.getCount({
      role: 'patient',
      serviceList: { $elemMatch: { _id: this.service._id } },
      profiles: { $elemMatch: { _id: profile._id } }
    }).then((data) => {
      //  console.log ('profile count', data);
      profile.totalPatients = data;
    })
  }


  getProfilePatientsByProvider(profile: any) {
    this.allServices.usersService.getCount({
      role: 'patient',
      providers: { $elemMatch: { _id: this.user._id } },
      profiles: { $elemMatch: { _id: profile._id } }
    }).then((data) => {
      //   console.log ('profile provider count', data);
      profile.totalPatientsByProvider = data;
    })
  }


  monthlyNewPatients() {
    // console.log ('service in new patient report', this.service)
    this.monthlyNewPatientsChart = {
      labels: [],
      series: [
        []
      ]
    };
    if (this.serviceID) {
      this.allServices.usersService.getMonthlyPatients({ serviceIDs: [this.serviceID], months: 24 }).then((data) => {
        this.monthlyPatients = data;
        if (this.monthlyPatients.length > 0) {
          for (let item of this.monthlyPatients) {
            this.monthlyNewPatientsChart.labels.push(this.convert(item._id.month));
            this.monthlyNewPatientsChart.series[0].push(item.count);
          }
          const optionsDailySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
            }),
            low: 0,
            high: 200, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
          }
          //  setTimeout(() => {
          //  console.log ('this.service', this.service)
          var serviceNewPatientChart = new Chartist.Line('#patient', this.monthlyNewPatientsChart, optionsDailySalesChart);
          this.startAnimationForLineChart(serviceNewPatientChart);
          // },1000); 
        }
      })
    }
  }


  monthlyNewPatientsByProvider() {
    
    this.allServices.usersService.getMonthlyPatientsByProvider({ providerID: [this.user._id], months: 24 }).then((data) => {
      this.monthlyPatientsByProvider = data;
    
    //  if (this.monthlyPatientsByProvider.length > 0) {
       /* for (let item of this.monthlyPatientsByProvider) {
          this.monthlyNewPatientsByProviderChart.labels.push(this.convert(item._id.month));
          this.monthlyNewPatientsByProviderChart.series[0].push(item.count);
        }*/
        this.monthlyNewPatientsByProviderChart = {
          labels: [this.convert(1),
            this.convert(1),
            this.convert(2),
            this.convert(3),
            this.convert(4),
            this.convert(5),
            this.convert(6),
            this.convert(7),
            this.convert(8),
            this.convert(9),
            this.convert(10),
            this.convert(11),
            this.convert(12)
          ],
          series: [
            [100,122,333,555,111,231,222,122,111,222,345,672,566]
          ]
        };
        let max = this.totalProviderPatients;
        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: max, 
          showArea:true,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
        }
     
        var serviceNewPatientChart = new Chartist.Line('#patientByProvider', this.monthlyNewPatientsByProviderChart, optionsDailySalesChart);
        this.startAnimationForLineChart(serviceNewPatientChart);
      
   //   }
    })
   
  }


  monthlyVisits() {
    this.monthlyVisitsChart = {
      labels: [],
      series: [
        []
      ]
    };
    if (this.service) {
      this.allServices.visitsService.getMonthlyVisits({ months: 24, serviceIDs: [this.service._id] }).then((data) => {
        this.monthlyVisitList = data;
        // console.log ('this.monthlyVisitList',this.monthlyVisitList)
        if (this.monthlyVisitList.length > 0) {
          for (let item of this.monthlyVisitList) {
            this.monthlyVisitsChart.labels.push(this.convert(item._id.month));
            this.monthlyVisitsChart.series[0].push(item.count);
          }
          var optionswebsiteViewsChart = {
            axisX: {
              showGrid: false
            },
            low: 0,
            high: 300,
            chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
          };
          var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value: any) {
                  return value[0];
                }
              }
            }]
          ];
          // console.log ('service in visit report', this.service)
          var visitViewsChart = new Chartist.Bar('#visit', this.monthlyVisitsChart, optionswebsiteViewsChart,
            responsiveOptions);
          //start animation for the Emails Subscription Chart
          this.startAnimationForBarChart(visitViewsChart);
        }
      })
    }
  }


  monthlyVisitsByProvider(months: any) {
    this.monthlyVisitsByProviderChart = {
      labels: [],
      series: [
        []
      ]
    };
    //if (this.service){
    this.allServices.visitsService.getMonthlyVisitsByProvider({ months: months, providerIDs: [this.user._id] }).then((data) => {
      this.monthlyVisitListByProvider = data;
      // console.log ('this.monthlyVisitListByProvider',this.monthlyVisitListByProvider)
      if (this.monthlyVisitListByProvider.length > 0) {
       /* for (let item of this.monthlyVisitListByProvider) {
          this.monthlyVisitsByProviderChart.labels.push(this.convert(item._id.month));
          this.monthlyVisitsByProviderChart.series[0].push(item.count);
        }*/
        this.monthlyVisitsByProviderChart = {
          labels: [this.convert(1),
            this.convert(1),
            this.convert(2),
            this.convert(3),
            this.convert(4),
            this.convert(5),
            this.convert(6),
            this.convert(7),
            this.convert(8),
            this.convert(9),
            this.convert(10),
            this.convert(11),
            this.convert(12)
          ],
          series: [
            [70,92,45,55,111,131,122,122,87,92,45,172,200]
          ]
        };
        var optionswebsiteViewsChart = {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 300,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
        };
        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value: any) {
                return value[0];
              }
            }
          }]
        ];
        // console.log ('service in visit report', this.service)
        var visitViewsChart = new Chartist.Bar('#visitByProvider', this.monthlyVisitsByProviderChart, optionswebsiteViewsChart,
          responsiveOptions);
        //start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(visitViewsChart);
      }
    })
    // }
  }


  patientsByProfile() {
    this.patientProfileChart = {
      labels: [],
      series: [
        []
      ]
    }

    for (let profile of this.service.profiles) {
      this.allServices.usersService.getCount({
        role: 'patient',
        serviceList: { $elemMatch: { _id: this.service._id } },
        profiles: { $elemMatch: { _id: profile._id } }
      }).then((data) => {
        //  console.log ('profile count', data);
        profile.totalPatients = data;
        if (this.language == 'Chinese')
          this.patientProfileChart.labels.push(profile.label.ch);
        else if (this.language == 'English')
          this.patientProfileChart.labels.push(profile.label.en);
        this.patientProfileChart.series[0].push(profile.totalPatients);
        if (this.service.profiles.indexOf(profile) == this.service.profiles.length - 1) {
          let max = this.totalProviderPatients;
          var optionswebsiteViewsChart = {
            axisX: {
              showGrid: false
            },
            low: 0,
            high: max,
            chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
          };
          var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value: any) {
                  return value[0];
                }
              }
            }]
          ];
          var visitViewsChart = new Chartist.Bar('#TasksChart', this.patientProfileChart, optionswebsiteViewsChart,
            responsiveOptions);
          //start animation for the Emails Subscription Chart
          this.startAnimationForBarChart(visitViewsChart);
        }
      })
    }
  }


  patientsByProfileByProvider() {
    this.patientProfileByProviderChart = {
      labels: [],
      series: [
        []
      ]
    }
    this.allServices.categoryService.getCategoriesByFilter({'field':'profile', 'status':'active'})
    .then((data:any)=>{
      this.profiles=data;
    })
    for (let profile of this.user.profiles) {
      this.allServices.usersService.getCount({
        role: 'patient',
        // serviceList:{ $elemMatch: { _id:this.user._id} },
        profiles: { $elemMatch: { _id: profile._id } }
       // providers: { $elemMatch: { _id: this.user._id } }
      }).then((data) => {
       var i=this.user.profiles.indexOf(profile);
       if (i==0){
        profile.totalPatients = 50;
       }
       else if (i==1){
        profile.totalPatients = 150;
       }
       else if (i==2){
        profile.totalPatients = 30;
       }
       else if (i==3){
        profile.totalPatients = 350;
       }
       else if (i==4){
        profile.totalPatients = 250;
       }
       else if (i==5){
        profile.totalPatients = 150;
       }
      // profile.totalPatients = data;
        if (this.language == 'Chinese')
          this.patientProfileByProviderChart.labels.push(profile.label.ch);
        else if (this.language == 'English')
          this.patientProfileByProviderChart.labels.push(profile.label.en);
        this.patientProfileByProviderChart.series[0].push(profile.totalPatients);
        //  console.log (' this.patientProfileByProviderChart.series[0]', this.patientProfileByProviderChart.series[0]);
        if (this.user.profiles.indexOf(profile) == this.user.profiles.length - 1) {
          let max = this.totalProviderPatients;
          var optionswebsiteViewsByProviderChart = {
            axisX: {
              showGrid: false
            },
            low: 0,
            high: max,
           
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
          };
          var responsiveOptions: any[] = [
            ['screen and (max-width: 300px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value: any) {
                  return value[0];
                }
              }
            }]
          ];
          var visitViewsChart = new Chartist.Bar('#TasksChartByProvider',
            this.patientProfileByProviderChart, optionswebsiteViewsByProviderChart,
            responsiveOptions);
          //start animation for the Emails Subscription Chart
          this.startAnimationForBarChart(visitViewsChart);
        }
      })
    }
  }


  convert(month: any) {
   
    if (month == '2')
      return 'Feb'
    else if (month == '3')
      return 'Mar'
    else if (month == '4')
      return 'Apr'
    else if (month == '5')
      return 'May'
    else if (month == '6')
      return 'Jun'
    else if (month == '7')
      return 'Jul'
    else if (month == '8')
      return 'Aug'
    else if (month == '9')
      return 'Sep'
    else if (month == '10')
      return 'Oct'
    else if (month == '11')
      return 'Nov'
    else if (month == '12')
      return 'Dec'
    else {
      return 'Jan'
    }
  }


  getProviders() {
    if (!this.serviceID)
      this.serviceID = this.user.service._id;
    this.providers = [];
    if (this.user.service) {
      this.allServices.usersService.findUserById(this.serviceID).then((data) => {
        this.temp = data;
        this.providers = this.temp.providers;
        // console.log ('providers', this.providers)
      })
    }
  }


  getCurrentSchedule() {
    var today = new Date();
    this.allServices.visitsService.getVisitsByFilter({
      providerID: this.user._id,
      availableAtYear: today.getFullYear(),
      availableAtMonth: today.getMonth(),
      availableAtDate: today.getDate(),
      patientID: { $exists: true }
    }).then((data) => {
      this.schedules = data;
      //  console.log ('schedules', this.schedules)
    })
  }


  getMails() {
    this.allServices.mailService.getMailByFilter({ providerID: this.user._id, status: 'unread' }).then((data) => {
      this.mails = data;
    })
  }


  startAnimationForLineChart(chart: any) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function (data: any) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq = 0;
  };


  startAnimationForBarChart(chart: any) {
    let seq2: any, delays2: any, durations2: any;
    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data: any) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq2 = 0;
  };
}
