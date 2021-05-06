import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProviderFolderComponent } from './provider-folder/provider-folder.component';
import { ChildPatientListComponent } from './patient-list/child-patient-list/child-patient-list.component';
import { ChartPatientListComponent } from './patient-list/chart-patient-list/chart-patient-list.component';
import { PatientListComponent } from './patient-list/patient-list/patient-list.component';
import { PatientChartComponent } from './patient-list/patient-chart/patient-chart.component';
import { ProfilePatientListComponent } from './patient-list/profile-patient-list/profile-patient-list.component';
import { SelectedPatientsComponent } from './patient-list/selected-patients/selected-patients.component';
import { ProviderScheduleComponent } from './schedule/schedule.component';
import { AccountProviderComponent } from './account/account.component';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ConsultListComponent } from './consult-list/consult-list.component';
import { ProviderHomeComponent } from './home/home.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { PatientModule } from './../patient/patient.module';
import { UserListComponent } from './user-list/user-list.component';
import { RegistryProviderComponent } from './registry-provider/registry-provider.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [DashboardComponent,
    ProviderFolderComponent,
    ChildPatientListComponent,
    ChartPatientListComponent,
    PatientListComponent,
    ProfilePatientListComponent,
    SelectedPatientsComponent,
    ProviderScheduleComponent,
    ConsultListComponent,
    AccountProviderComponent,
    ArticleComponent,
    ArticleListComponent,
    ProviderHomeComponent,
    PatientChartComponent,
    UserListComponent,
    RegistryProviderComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    PatientModule,
    CoreModule
  ]
})
export class ProviderModule { }
