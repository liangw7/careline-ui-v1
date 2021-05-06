import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObComponent } from './ob/ob.component';
import { ObSetComponent } from './ob-set/ob-set.component';
import { FormComponent } from './form/form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AlertComponent } from './alert/alert.component';
import { CalendarComponent } from './calendar/calendar.component';
import { GraphDeviceSummaryComponent } from './graph-device-summary/graph-device-summary.component';
import { GraphSummaryComponent } from './graph-summary/graph-summary.component';
import { GraphReportComponent } from './graph-report/graph-report.component';
import { GrowthChartComponent } from './growth-chart/growth-chart.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {ShareModule} from '../common-modules/share.modules';
//module
import { MaterialModule } from '../common-modules/material.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';

import { OrderModule } from 'ngx-order-pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RouterModule } from '@angular/router';
import { FamilyFormComponent } from './family-form/family-form.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { AreaChinaComponent } from './area-china/area-china.component';
import { LoginComponent } from './login/login.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { PosterComponent } from './poster/poster.component';
import { CategoryImageComponent } from './category-image/category-image.component';


@NgModule({
  declarations: [ ObComponent, 
                  ObSetComponent, 
                  FormComponent, 
                  SidebarComponent,
                  AlertComponent,
                  CalendarComponent,
                  GraphDeviceSummaryComponent,
                  GraphSummaryComponent,
                  GraphReportComponent,
                  GrowthChartComponent,
                  SpinnerComponent,
                  FamilyFormComponent,
                  MessageBoxComponent,
                  ScheduleDetailComponent,
                  AreaChinaComponent,
                  LoginComponent,
                  DiagnosisComponent,
                  PosterComponent,
                  CategoryImageComponent
                   ],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    NgxQRCodeModule,
    MaterialModule,//material
    Ng2SearchPipeModule,
    OrderModule, 
    OrderModule,
    RouterModule
  ],
  exports:[
    ObComponent, 
    ObSetComponent, 
    FormComponent, 
    SidebarComponent,
    AlertComponent,
    CalendarComponent,
    GraphDeviceSummaryComponent,
    GraphSummaryComponent,
    GraphReportComponent,
    GrowthChartComponent,
    SpinnerComponent,
    FamilyFormComponent,
    MessageBoxComponent,
    ScheduleDetailComponent,
    AreaChinaComponent,
    LoginComponent,
    DiagnosisComponent

  ]
})
export class CommonComponentsModule { }
