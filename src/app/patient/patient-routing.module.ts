import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { CareProvidersComponent } from './care-providers/care-providers.component';
import { MedicationComponent } from './medication/medication.component';
import { PatientCareComponent } from './patient-care/patient-care.component';
import { PatientCellComponent } from './patient-cell/patient-cell.component';
import { PatientRegistryComponent } from './patient-registry/patient-registry.component';
import { PatientStoryComponent } from './patient-story/patient-story.component';
import { PatientComponent } from './patient/patient.component';
import { ProblemComponent } from './problem/problem.component';
import { ReportComponent } from './report/report.component';
import { VisitListComponent } from './visit-list/visit-list.component';
import { FollowupsComponent } from './followups/followups.component';
import { PatientScheduleComponent } from './schedule/schedule.component';
import { AllergyComponent } from './allergy/allergy.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderComposeComponent } from './visit/order-compose/order-compose.component';
import { VisitComponent } from './visit/visit/visit.component';
import { EducationDetailComponent } from './education-detail/education-detail.component';
import { EducationComponent } from './education/education.component';
import { FollowupDetailComponent } from './followup-detail/followup-detail.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageComponent } from './image/image.component';
import { LabComponent } from './lab/lab.component';
import { HealthFileComponent } from './health-file/health-file.component';
import { PatientFileComponent } from './patient-file/patient-file.component';
import { SummaryComponent } from './summary/summary.component';
import { WxPayComponent } from './wx-pay/wx-pay.component';

import { FlowsheetComponent } from './flowsheet/flowsheet.component';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
const routes: Routes = [
  {
    path: '', component: PatientComponent, children: [
      { path: '', redirectTo: 'provider-list', pathMatch: 'full' },
      { path: "care-providers", component: CareProvidersComponent },
      { path: "provider-list", component: ProviderListComponent },
      { path: "file-upload", component: FileUploadComponent },
      { path: "image", component: ImageComponent },
      { path: "h5-pay-redirect/:visitId/:orderId", component: WxPayComponent },
      { path: "flowsheet", component: FlowsheetComponent },
      { path: "lab", component: LabComponent },
      { path: "health-file", component: HealthFileComponent },
      { path: "clinical-note", component: ClinicalNoteComponent },
      { path: "education", component: EducationComponent },
      { path: "medication", component: MedicationComponent },
      { path: "patient-care", component: PatientCareComponent },
      { path: "patient-cell", component: PatientCellComponent },
      { path: "patient-file", component: PatientFileComponent },
      { path: "profile", component: ProfileComponent },
      { path: "patient-registry", component: PatientRegistryComponent },
      { path: "patient-story", component: PatientStoryComponent },
      { path: "problem", component: ProblemComponent },
      { path: "report", component: ReportComponent },

      { path: "summary", component: SummaryComponent },
      { path: "visit-list", component: VisitListComponent },
      { path: "followups", component: FollowupsComponent },
      { path: "patient-schedule", component: PatientScheduleComponent },
      { path: "allergy", component: AllergyComponent },
      { path: "order-compose", component: OrderComposeComponent },
      { path: "visit", component: VisitComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }