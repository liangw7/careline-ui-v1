import { Injectable, Injector } from '@angular/core';
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
import { WechatJssdkService } from './wx-services/wechat-jssdk/wechat-jssdk.service'
import { WeixinJsapiService } from './wx-services/weixin-jsapi/weixin-jsapi.service';
import { ShortMessageService } from './short-message.service';
import { CommunicateService } from './communicate.service';
import { alertDialogService } from './alertDialog.service';
@Injectable({
  providedIn: 'root',
})
export class AllServices {

  constructor(private injector: Injector) { }

  get authService() { return this.injector.get(AuthService); }
  get categoryService() { return this.injector.get(CategoryService); }
  get chatService() { return this.injector.get(ChatService); }
  get datasService() { return this.injector.get(DatasService); }
  get deviceService() { return this.injector.get(DeviceService); }
  get diagnosisService() { return this.injector.get(DiagnosisService); }
  get followupsService() { return this.injector.get(FollowupsService); }
  get imageItemsService() { return this.injector.get(ImageItemsService); }
  get imagesService() { return this.injector.get(ImagesService); }
  get invoiceService() { return this.injector.get(InvoiceService); }
  get labItemsService() { return this.injector.get(LabItemsService); }
  get labsService() { return this.injector.get(LabsService); }
  get loadPatientService() { return this.injector.get(LoadPatientService); }
  get mailService() { return this.injector.get(MailService); }
  get medicalHistoryService() { return this.injector.get(MedicalHistoryService); }
  get medsService() { return this.injector.get(MedsService); }
  get noteService() { return this.injector.get(NoteService); }
  get orderItemsService() { return this.injector.get(OrderItemsService); }
  get ordersService() { return this.injector.get(OrdersService); }
  get pathwayService() { return this.injector.get(PathwayService); }
  get paymentService() { return this.injector.get(PaymentService); }
  get problemService() { return this.injector.get(ProblemService); }
  get reportsService() { return this.injector.get(ReportsService); }
  get formService() { return this.injector.get(FormService); }
  get screeningService() { return this.injector.get(ScreeningService); }
  get setFormsService() { return this.injector.get(SetFormsService); }
  get sharedDataService() { return this.injector.get(SharedDataService); }
  get sharedPageTypeService() { return this.injector.get(SharedPageTypeService); }
  get sharedRoleService() { return this.injector.get(SharedRoleService); }
  get shareProviderService() { return this.injector.get(ShareProviderService); }
  get uploadService() { return this.injector.get(UploadService); }
  get usersService() { return this.injector.get(UsersService); }
  get visitsService() { return this.injector.get(VisitsService); }
  get httpService() { return this.injector.get(HttpService); }
  get utilService() { return this.injector.get(UtilService); }
  get wechatJssdkService() { return this.injector.get(WechatJssdkService); }
  get weixinJsapiService() { return this.injector.get(WeixinJsapiService); }
  get shortMessageService() { return this.injector.get(ShortMessageService); }
  get communicateService() { return this.injector.get(CommunicateService); }
  get alertDialogService() { return this.injector.get(alertDialogService); }
}
