import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProviderFolderComponent } from './provider-folder/provider-folder.component';
import { ChildPatientListComponent } from './patient-list/child-patient-list/child-patient-list.component';
import { ChartPatientListComponent } from './patient-list/chart-patient-list/chart-patient-list.component';
import { PatientListComponent } from './patient-list/patient-list/patient-list.component';
import { ProfilePatientListComponent } from './patient-list/profile-patient-list/profile-patient-list.component';
import { SelectedPatientsComponent } from './patient-list/selected-patients/selected-patients.component';
import { ProviderScheduleComponent } from './schedule/schedule.component';
import { ConsultListComponent } from './consult-list/consult-list.component';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ProviderHomeComponent } from './home/home.component';
import { AccountProviderComponent } from './account/account.component';
import { UserListComponent } from './user-list/user-list.component';
import { RegistryProviderComponent } from './registry-provider/registry-provider.component';
import { PatientChartComponent } from './patient-list/patient-chart/patient-chart.component';

  
const routes: Routes = [
  {
    path: '', component: ProviderHomeComponent, children: [


      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: "dashboard", component: DashboardComponent },
      { path: "account", component: AccountProviderComponent },
      { path: "provider-folder", component: ProviderFolderComponent },
      { path: "child-list", component: ChildPatientListComponent },
      { path: "chart-patient-list", component: ChartPatientListComponent },
      { path: "patient-list", component: PatientListComponent },
      { path: "patient-chart", component: PatientChartComponent },
      { path: "profile-patient-list", component: ProfilePatientListComponent },
      { path: "selected-patients", component: SelectedPatientsComponent },
      { path: "provider-schedule", component: ProviderScheduleComponent },
      { path: "article", component: ArticleComponent },
      { path: "registry-provider", component: RegistryProviderComponent },
      { path: "user-list", component: UserListComponent },
      { path: "article-list", component: ArticleListComponent },
      { path: "consult-list", component: ConsultListComponent },
    ]
}

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
   // MyProjectsModule
  ],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
