import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { CategoryService } from './category.service';
import { ChatService } from './chat.service';
import { DatasService } from './datas.service';
import { DeviceService } from './device.service';
import { DiagnosisService } from './diagnosis.service';
import { FollowupsService } from './followups.service';
import { ImageItemsService } from './image-items.service';
import { ImagesService } from './images.service';
import { InvoiceService } from './invoice.service';
import { LabItemsService } from './lab-items.service';
import { LabsService } from './labs.service';
import { LoadPatientService } from './load-patient.service';
import { MailService } from './mails.service';
import { MedicalHistoryService } from './medical-history.service';
import { MedsService } from './meds.service';
import { NoteService } from './notes.service';
import { OrderItemsService } from './order-items.service';
import { OrdersService } from './orders.service';
import { PathwayService } from './pathway.service';
import { PaymentService } from './payment.service';
import { ProblemService } from './problems.service';
import { ReportsService } from './reports.service';
import { FormService } from './save-forms-void.service';
import { ScreeningService } from './screenings.service';
import { SetFormsService } from './set-forms.service';
import { SharedDataService } from './shared-data.service';
import { SharedPageTypeService } from './shared-page-type.service';
import { SharedRoleService } from './shared-role.service';
import { ShareProviderService } from './share-provider.service';
import { UploadService } from './upload.service';
import { UsersService } from './users.service';
import { VisitsService } from './visits.service';
import { HttpService } from './http.service';
import { UtilService } from './util.service';
import { ModelsModule } from '../models/models.module';
import { ApiUrl } from '../models/api-url';
import { CommonModule } from '@angular/common';
import { WechatJssdkConfig } from './wx-services/wechat-jssdk/wechat-jssdk-config';
import { ShortMessageService } from './short-message.service';
import { ShortMessageModel } from '../models/shortMessage';
import { alertDialogService } from './alertDialog.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModelsModule,
  ],
  providers: [AuthService,
    CategoryService,
    ChatService,
    DatasService,
    DeviceService,
    DiagnosisService,
    FollowupsService,
    ImageItemsService,
    ImagesService,
    InvoiceService,
    LabItemsService,
    LabsService,
    LoadPatientService,
    MailService,
    MedicalHistoryService,
    MedsService,
    NoteService,
    OrderItemsService,
    OrdersService,
    PathwayService,
    PaymentService,
    ProblemService,
    ReportsService,
    FormService,
    ScreeningService,
    SetFormsService,
    SharedDataService,
    SharedPageTypeService,
    SharedRoleService,
    ShareProviderService,
    UploadService,
    UsersService,
    VisitsService,
    HttpService,
    ApiUrl,
    UtilService,
    WechatJssdkConfig,
    ShortMessageService,
    ShortMessageModel,
    alertDialogService,
  ], exports: [
    ModelsModule,
  ]
})
export class CommonServicesModule { }
