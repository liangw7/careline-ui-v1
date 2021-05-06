import { environment } from '../../../environments/environment';
import { ApiPublicUrl } from './api-public-url';

const url: string = environment.apiUrl;

export class AuthModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    public auth: string = url + 'auth/';
    public checkAuthentication: string = this.auth + 'protected/';
    public register: string = this.auth + this.apiPublicUrl.REGISTER;
    public login: string = this.auth + this.apiPublicUrl.LOGIN;
}

export class CategoriesModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // categories.service.ts
    public categories: string = url + 'categories/';
    public getlabItems: string = this.categories + 'getlabItems/';
    public getForm: string = this.categories + 'getForm/';
    public getProblemForm: string = this.categories + 'getProblemForm/';
    public getSummary: string = this.categories + 'getSummary/';
    public getReport: string = this.categories + 'getReport/';
    public getUserForm: string = this.categories + 'getUserForm/';
    public getFormById: string = this.categories + 'getFormById/';
    public orderMaster: string = this.categories + 'orderMaster/';
    public field: string = this.categories + 'field/';
    public profiles: string = this.categories + 'profiles/';
    public activityType: string = this.categories + 'activityType/';
    public formType: string = this.categories + 'formType/';
    public fields: string = this.categories + 'fields/';
    public internalFilter: string = this.categories + 'internalFilter/';
    public categoriesFilter: string = this.categories + this.apiPublicUrl.FILTER;
    public update: string = this.categories + 'update';
    public bulk: string = this.categories + this.apiPublicUrl.BULK;
}

export class DatasModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // datas.service.ts
    public datas: string = url + 'datas/';
    public createMany: string = this.datas + this.apiPublicUrl.CREATEMANY;
    public dataFilter: string = this.datas + this.apiPublicUrl.FILTER;
    public getPatientsByFilter: string = this.datas + 'getPatientsByFilter/';
    public datasGetReport: string = this.datas + 'getReport/';
    public getMultiReport: string = this.datas + 'getMultiReport/';
    public datasVisit: string = this.datas + this.apiPublicUrl.VISIT;
    public patient: string = this.datas + this.apiPublicUrl.PATIENT;
    public order: string = this.datas + 'order/';
    public ob: string = this.datas + 'ob/';
    public dataFollowup: string = this.datas + 'followup/';
    public datasupdate: string = this.datas + this.apiPublicUrl.UPDATE;
}

export class DeviceModel {
    // device.service.ts
    public getPatients: string = url + 'AxiService/UserTable';
    public getDevices: string = url + 'AxiDB/AxiDevice';
    public deviceValueByDevice: string = url + 'AxiDB/deviceValueByDevice';
    public deviceValueByDeviceByFilter: string = url + 'AxiDB/deviceValueByDeviceByFilter';
    public getSimpleDB: string = 'getSimpleDB/';
    public getCombineDB: string = 'getCombineDB/';
    public getComplexDB: string = 'getComplexDB/';
}

export class DiagnosisModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // diagnosis.service.ts
    public diagnosis: string = url + 'diagnosis/';
    public diagnosisFilter: string = this.diagnosis + this.apiPublicUrl.FILTER;
    public diagnosisSearch: string = this.diagnosis + 'search/';
    public diagnosisupdate: string = this.diagnosis + this.apiPublicUrl.UPDATE;
    public diagnosisBulk: string = this.diagnosis + this.apiPublicUrl.BULK;
}

export class FollowupsModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
   // followups.service.ts
   public followups: string = url + 'followups/';
   public followupsPatient: string = this.followups + this.apiPublicUrl.PATIENT;
   public followupsRequester: string = this.followups + 'requester/';
   public followupsProvider: string = this.followups + 'provider/';
   public followupsDate: string = this.followups + 'date/';
   public followupsupdate: string = this.followups + this.apiPublicUrl.UPDATE;
}

export class ImagesItemsModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // images-items.service.ts
    public imagesItems: string = url + 'imageItem/';
    public imagesItemsFilter: string = this.imagesItems + this.apiPublicUrl.FILTER;
    public imagesItemsupdate: string = this.imagesItems + this.apiPublicUrl.UPDATE;
}

export class ImagesModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // images.service.ts
    public images: string = url + 'images/';
    public imagesPatient: string = this.images + this.apiPublicUrl.PATIENT;
    public imagesFilter: string = this.images + this.apiPublicUrl.FILTER;
    public imagesVisit: string = this.images + this.apiPublicUrl.VISIT;
    public imagesupdate: string = this.images + this.apiPublicUrl.UPDATE;
}

export class InvoiceModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // invoice.service.ts
    public invoice: string = url + 'invoices/';
    public getInvoices: string = this.invoice + 'getInvoices/';
    public invoicePatient: string = this.invoice + this.apiPublicUrl.PATIENT;
    public invoiceUpate: string = this.invoice + this.apiPublicUrl.UPDATE;
}

export class LabItemsModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // lab-items.service.ts
    public labItems: string = url + 'labItem/';
    public labItemsFileter: string = this.labItems + this.apiPublicUrl.FILTER;
    public labItemsupdate: string = this.labItems + this.apiPublicUrl.UPDATE;
}

export class LabsModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // labs.service.ts
    public labs: string = url + 'labs/';
    public labsPatient: string = this.labs + this.apiPublicUrl.PATIENT;
    public labsFilter: string = this.labs + this.apiPublicUrl.FILTER;
    public labsVisit: string = this.labs + this.apiPublicUrl.VISIT;
    public labsupdate: string = this.labs + this.apiPublicUrl.UPDATE;
}

export class LoadPatientModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // load-patient.service.ts
    public patientUrl: string = "assets/load-patient.json";
    public icdChUrl: string = "assets/icd-ch.json";
    public icdUrl: string = "assets/load-icd.json";
    public obUrl: string = 'assets/load-ASQ.json';
}

export class MailsModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // mails.service.ts
    public mails: string = url + 'mail/';
    public mailsMessage: string = this.mails + 'message/';
    public mailsMessageLink: string = this.mails + 'messageLink/';
    public mailsFilter: string = this.mails + this.apiPublicUrl.FILTER;
    public getPatientMails: string = this.mails + 'getPatientMails/';
    public mailsupdate: string = this.mails + this.apiPublicUrl.UPDATE;
}

export class MedicalHistoryModel {
    constructor(public apiPublicUrl: ApiPublicUrl) { }
    // medical-history.service.ts
    public medicalHistory: string = url + 'MedicalHistory/';
    public medicalHistoryPatient: string = this.medicalHistory + this.apiPublicUrl.PATIENT;
    public medicalHistoryupdate: string = this.medicalHistory + this.apiPublicUrl.UPDATE;
    public medicalHistoryPhoto: string = this.medicalHistory + this.apiPublicUrl.PHOTO;
}
