import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const url: string = environment.apiUrl;

@Injectable()
export class ApiUrl {
    constructor() { }
    public FILTER: string = 'filter/';
    public UPDATE: string = 'update';
    public PATIENT: string = 'patient/';
    public VISIT: string = 'visit/';
    public BULK: string = 'bulk';
    public REGISTER: string = 'register/';
    public LOGIN: string = 'login';
    public CREATEMANY: string = 'createMany/';
    public PHOTO: string = 'photo/';

    public baseUrl: string = url;

    public auth: string = url + 'auth/';
    public checkAuthentication: string = this.auth + 'protected/';
    public register: string = this.auth + this.REGISTER;
    public registerFamliy: string = this.auth + 'registerFamliy/';
    public login: string = this.auth + this.LOGIN;
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
    public categoriesFilter: string = this.categories + this.FILTER;
    public update: string = this.categories + 'update';
    public bulk: string = this.categories + this.BULK;
    // datas.service.ts
    public datas: string = url + 'datas/';
    public createMany: string = this.datas + this.CREATEMANY;
    public dataFilter: string = this.datas + this.FILTER;
    public getPatientsByFilter: string = this.datas + 'getPatientsByFilter/';
    public datasGetReport: string = this.datas + 'getReport/';
    public getMultiReport: string = this.datas + 'getMultiReport/';
    public datasVisit: string = this.datas + this.VISIT;
    public patient: string = this.datas + this.PATIENT;
    public order: string = this.datas + 'order/';
    public ob: string = this.datas + 'ob/';
    public dataFollowup: string = this.datas + 'followup/';
    public datasupdate: string = this.datas + this.UPDATE;
    // device.service.ts
    public getPatients: string = url + 'AxiService/UserTable';
    public getDevices: string = url + 'AxiDB/AxiDevice';
    public deviceValueByDevice: string = url + 'AxiDB/deviceValueByDevice';
    public deviceValueByDeviceByFilter: string = url + 'AxiDB/deviceValueByDeviceByFilter';
    public getSimpleDB: string = 'getSimpleDB/';
    public getCombineDB: string = 'getCombineDB/';
    public getComplexDB: string = 'getComplexDB/';

    // diagnosis.service.ts
    public diagnosis: string = url + 'diagnosis/';
    public diagnosisFilter: string = this.diagnosis + this.FILTER;
    public diagnosisSearch: string = this.diagnosis + 'search/';
    public diagnosisupdate: string = this.diagnosis + this.UPDATE;
    public diagnosisBulk: string = this.diagnosis + this.BULK;

    // followups.service.ts
    public followups: string = url + 'followups/';
    public followupsPatient: string = this.followups + this.PATIENT;
    public followupsRequester: string = this.followups + 'requester/';
    public followupsProvider: string = this.followups + 'provider/';
    public followupsDate: string = this.followups + 'date/';
    public followupsupdate: string = this.followups + this.UPDATE;

    // images-items.service.ts
    public imagesItems: string = url + 'imageItem/';
    public imagesItemsFilter: string = this.imagesItems + this.FILTER;
    public imagesItemsupdate: string = this.imagesItems + this.UPDATE;

    // images.service.ts
    public images: string = url + 'images/';
    public imagesPatient: string = this.images + this.PATIENT;
    public imagesFilter: string = this.images + this.FILTER;
    public imagesVisit: string = this.images + this.VISIT;
    public imagesupdate: string = this.images + this.UPDATE;

    // invoice.service.ts
    public invoice: string = url + 'invoices/';
    public getInvoices: string = this.invoice + 'getInvoices/';
    public invoicePatient: string = this.invoice + this.PATIENT;
    public invoiceUpate: string = this.invoice + this.UPDATE;

    // lab-items.service.ts
    public labItems: string = url + 'labItem/';
    public labItemsFileter: string = this.labItems + this.FILTER;
    public labItemsupdate: string = this.labItems + this.UPDATE;

    // labs.service.ts
    public labs: string = url + 'labs/';
    public labsPatient: string = this.labs + this.PATIENT;
    public labsFilter: string = this.labs + this.FILTER;
    public labsVisit: string = this.labs + this.VISIT;
    public labsupdate: string = this.labs + this.UPDATE;

    // load-patient.service.ts
    public patientUrl: string = "assets/load-patient.json";
    public icdChUrl: string = "assets/icd-ch.json";
    public icdUrl: string = "assets/load-icd.json";
    public obUrl: string = 'assets/load-ASQ.json';

    // mails.service.ts
    public mails: string = url + 'mail/';
    public mailsMessage: string = this.mails + 'message/';
    public mailsMessageLink: string = this.mails + 'messageLink/';
    public mailsFilter: string = this.mails + this.FILTER;
    public getPatientMails: string = this.mails + 'getPatientMails/';
    public mailsupdate: string = this.mails + this.UPDATE;

    // medical-history.service.ts
    public medicalHistory: string = url + 'MedicalHistory/';
    public medicalHistoryPatient: string = this.medicalHistory + this.PATIENT;
    public medicalHistoryupdate: string = this.medicalHistory + this.UPDATE;
    public medicalHistoryPhoto: string = this.medicalHistory + this.PHOTO;

    // meds.service.ts
    public meds: string = url + 'meds/';
    public medsPatient: string = this.meds + this.PATIENT;
    public medsupdate: string = this.meds + this.UPDATE;
    public medsFilter: string = this.meds + this.FILTER;
    public medscreateMany: string = this.meds + this.CREATEMANY;
    public getPatientMedications: string = this.meds + 'getPatientMedications/';

    // notes.service.ts
    public notes: string = url + 'notes/';
    public notesPatient: string = this.notes + this.PATIENT;
    public notesVisit: string = this.notes + this.VISIT;
    public notesupdate: string = this.notes + this.UPDATE;
    public notesPhoto: string = this.notes + this.PHOTO;

    // order-items.service.ts
    public orderItems: string = url + 'orderItem/';
    public getMedicationForm: string = this.orderItems + 'getMedicationForm/';
    public getMedications: string = this.orderItems + 'getMedications/';
    public checkDuplication: string = this.orderItems + 'checkDuplication/';
    public getItems: string = this.orderItems + 'getItems/';
    public orderItemsFilter: string = this.orderItems + this.FILTER;
    public searchByFilter: string = this.orderItems + 'searchByFilter/';
    public orderItemsupdate: string = this.orderItems + this.UPDATE;

    // orders.service.ts
    public orders: string = url + 'orders/';
    public ordersPatient: string = this.orders + this.PATIENT;
    public ordersType: string = this.orders + 'type/';
    public ordersFilter: string = this.orders + this.FILTER;
    public getconsultsByService: string = this.orders + 'getconsultsByService/';
    public ordersVisit: string = this.orders + this.VISIT;
    public ordersupdate: string = this.orders + this.UPDATE;

    // pathway.service.ts
    public pathway: string = url + 'pathway/';
    public pathwayPatient: string = this.pathway + this.PATIENT;
    public pathwayRequester: string = this.pathway + 'requester/';
    public pathwayProvider: string = this.pathway + 'provider/';
    public pathwayVisit: string = this.pathway + this.VISIT;
    public pathwayupdate: string = this.pathway + this.UPDATE;

    // payment.service.ts
    public payment: string = url + 'wx/';
    public downloadBill: string = this.payment + 'downloadBill/';
    public getPayParams: string = this.payment + 'getPayParams/';
    public transfers: string = this.payment + 'transfers/';
    public refund: string = this.payment + 'refund/';
    public createInvoice: string = this.payment + 'createInvoice/';
    public updateInvoice: string = this.payment + 'updateInvoice/';
    public unifiedOrderNative: string = this.payment + 'unifiedOrderNative/';
    public unifiedOrder: string = this.payment + 'unifiedOrder/';
    public orderQuery: string = this.payment + 'orderQuery/';
    public orderRefundQuery: string = this.payment + 'refundQuery/'

    // problems.service.ts
    public problem: string = url + 'problem/';
    public problemFilter: string = this.problem + this.FILTER;
    public problemcreateMany: string = this.problem + 'createMany/';
    public getPatientProblems: string = this.problem + 'getPatientProblems/';
    public getProblems: string = this.problem + 'getProblems/';
    public problemupdate: string = this.problem + this.UPDATE;

    // reports.service.ts
    public reports: string = url + 'reports/';
    public reportsFilter: string = this.reports + this.FILTER;
    public reportsupdate: string = this.reports + this.UPDATE;

    // screenings.service.ts
    public screening: string = url + 'screening/';
    public screeningPatient: string = this.screening + this.PATIENT;
    public screeningVisit: string = this.screening + this.VISIT;
    public screeningupdate: string = this.screening + this.UPDATE;
    public screeningPhoto: string = this.screening + this.PHOTO;

    // upload.service.ts
    public upload: string = url + 'uploadData/';
    public uploadFilter: string = this.upload + this.FILTER;
    public uploadupdate: string = this.upload + this.UPDATE;

    // users.service.ts
    public users: string = url + 'users/';
    public signature: string = this.users + 'signature/';
    public wechat: string = this.users + 'wechat/';
    public wechatUserInfor: string = this.users + 'wechatUserInfor/';
    public wechatLink: string = this.users + 'wechatLink/';
    public getProviderMails: string = this.users + 'getProviderMails/';
    public getVisitsByProvider: string = this.users + 'getVisitsByProvider/';
    public getVisitsBySelectedProvider: string = this.users + 'getVisitsBySelectedProvider/';
    public getPatientMailsFromProviders: string = this.users + 'getPatientMailsFromProviders/';
    public usersGetPatientMails: string = this.users + 'getPatientMails/';
    public usersSignature: string = this.users + 'signature/';
    public usersFilter: string = this.users + this.FILTER;
    public getUserProfiles: string = this.users + 'getUserProfiles/';
    public usersGetlabItems: string = this.users + 'getlabItems/';
    public getProviders: string = this.users + 'getProviders/';
    public usersCount: string = this.users + 'count/';
    public dailyPatients: string = this.users + 'dailyPatients/';
    public monthlyPatients: string = this.users + 'monthlyPatients/';
    public getMonthlyPatientsByProvider: string = this.users + 'getMonthlyPatientsByProvider/';
    public getCountByService: string = this.users + 'getCountByService/';
    public usersRole: string = this.users + 'role/';
    public usersMail: string = this.users + 'email/';
    public usersProfile: string = this.users + 'profile/';
    public getWithDetailByFilter: string = this.users + 'getWithDetailByFilter/';
    public getPatientsByProfile: string = this.users + 'getPatientsByProfile/';
    public getProfilePhoto: string = this.users + 'getProfilePhoto/';
    public usersupdate: string = this.users + this.UPDATE;
    public usersPhone: string = this.users + 'phone/';
    public getUsersByPhone: string = this.users+ 'getUsersByPhone/';
    public updateUserPassword: string = this.users + 'updateUserPassword/';
    public checkUserPassword: string = this.users + 'checkUserPassword/';
    public getUserByFatherId: string = this.users + 'getUserByFatherId/';
    public checkEmailIsInUse: string = this.users + 'checkEmailIsInUse/';

    // visits.service.ts
    public visit: string = url + 'visits/';
    public getOneVisit: string = this.visit + 'getOneVisit/';
    public visitPatient: string = this.visit + this.PATIENT;
    public getfollowupsByDate: string = this.visit + 'getfollowupsByDate/';
    public getMonthlyVisitsByProvider: string = this.visit + 'getMonthlyVisitsByProvider/';
    public visitFilter: string = this.visit + this.FILTER;
    public getVisitsForProviderList: string = this.visit + 'getVisitsForProviderList/';
    public getVisitListByFilter: string = this.visit + 'getVisitListByFilter/';
    public monthlyVisits: string = this.visit + 'monthlyVisits/';
    public visitRequester: string = this.visit + 'requester/';
    public visitProvider: string = this.visit + 'provider/';
    public visitupdate: string = this.visit + this.UPDATE;
    public updateVisit: string = this.visit + 'updateVisit/';

    // set-forms.service.ts
    public setFormUpload: string = url + 'upload/';
    public setFormUploadPhoto: string = this.setFormUpload + 'photo-';

    // short-message.service.ts
    public shortMessge: string = url + 'shortMessage';
    public sendShortMessageForLogin: string = this.shortMessge + '/sendShortMessageForLogin';
    public sendShortMessageForReset: string = this.shortMessge + '/sendShortMessageForReset';
    public checkShortMessage: string = this.shortMessge + '/checkShortMessage';
    public sendShortMessageNotification: string = this.shortMessge + '/sendShortMessageNotification';
}