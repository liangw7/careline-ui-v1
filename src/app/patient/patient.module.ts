import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareProvidersComponent } from './care-providers/care-providers.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageComponent } from './image/image.component';
import { LabComponent } from './lab/lab.component';
import { ChatComponent } from './chat/chat.component';
import { AddVisitComponent } from './add-visit/add-visit.component';
import { AddLabsComponent } from './add-lab/add-lab.component';
import { MedicationComponent } from './medication/medication.component';
import { PatientCareComponent } from './patient-care/patient-care.component';
import { PatientCellComponent } from './patient-cell/patient-cell.component';
import { PatientFileComponent } from './patient-file/patient-file.component';
import { PatientRegistryComponent } from './patient-registry/patient-registry.component';
import { PatientStoryComponent } from './patient-story/patient-story.component';
import { PatientComponent } from './patient/patient.component';
import { ProblemComponent } from './problem/problem.component';
import { ReportComponent } from './report/report.component';
import { SummaryComponent } from './summary/summary.component';
import { FlowsheetComponent } from './flowsheet/flowsheet.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { VisitListComponent } from './visit-list/visit-list.component';
import { FollowupsComponent } from './followups/followups.component';
import { FollowupDetailComponent } from './followup-detail/followup-detail.component';
import { PatientScheduleComponent } from './schedule/schedule.component';
import { AllergyComponent } from './allergy/allergy.component';
import { ProfileComponent } from './profile/profile.component';
import { HealthFileComponent } from './health-file/health-file.component';
import { EducationDetailComponent } from './education-detail/education-detail.component';
import { EducationComponent } from './education/education.component';
import { OrderComposeComponent } from './visit/order-compose/order-compose.component';
import { VisitComponent } from './visit/visit/visit.component';
import { PatientRoutingModule } from './patient-routing.module';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
import { WxPayComponent } from './wx-pay/wx-pay.component';
//module
import { CoreModule } from '../core/core.module';
import { PublicModule } from '../public/public.module';
//import { PublicPlatformModule } from '../../../public-platform/public-platform.module';
@NgModule({
  declarations:  [
    CareProvidersComponent,
    FileUploadComponent,
    ImageComponent,
    LabComponent,
    MedicationComponent,
    PatientCareComponent,
    PatientCellComponent,
    PatientFileComponent,
    PatientRegistryComponent,
    PatientStoryComponent,
    PatientComponent,
    ProblemComponent,
    ReportComponent,
    SummaryComponent,
    VisitListComponent,
    FollowupsComponent,
    PatientScheduleComponent,
    AllergyComponent,
    OrderComposeComponent,
    VisitComponent,
    ProviderListComponent,
    FollowupDetailComponent,
    ProfileComponent ,
    AddVisitComponent,
    AddLabsComponent,
    EducationComponent,
    EducationDetailComponent,
    HealthFileComponent,
    ChatComponent,
    FlowsheetComponent,
    ClinicalNoteComponent,
    WxPayComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    CoreModule,
    PublicModule
  //  PublicPlatformModule
  ],
  exports:[
    AddLabsComponent,
    AddVisitComponent,
    CareProvidersComponent,
    FileUploadComponent,
    ImageComponent,
    LabComponent,
    MedicationComponent,
    PatientCareComponent,
    PatientCellComponent,
    PatientFileComponent,
    PatientRegistryComponent,
    PatientStoryComponent,
    PatientComponent,
    ProblemComponent,
    ReportComponent,
    SummaryComponent,
    VisitListComponent,
    FollowupsComponent,
    PatientScheduleComponent,
    AllergyComponent,
    OrderComposeComponent,
    VisitComponent,
    ProviderListComponent,
    FollowupDetailComponent,
    ProfileComponent,
    EducationComponent,
    EducationDetailComponent,
    HealthFileComponent,
    ChatComponent,
    FlowsheetComponent,
    ClinicalNoteComponent
  ]
})
export class PatientModule { }
