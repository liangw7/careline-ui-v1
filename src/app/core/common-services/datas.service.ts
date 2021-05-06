import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class DatasService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  createMany(filter: any) {
    console.log('--datasService--createMany--start--');
    return this.httpservice.postAuthParam(this.entity.createMany, filter);
  }

  createObs(filter: any) {
    console.log('--datasService--createMany--start--');
    return this.httpservice.postParam(this.entity.createMany, filter);
  }

  getDatas() {
    console.log('--datasService--getDatas--start--');
    return this.httpservice.getAuth(this.entity.datas);
  }



  getData(id: String) {
    console.log('--datasService--getDatas--start--');
    return this.httpservice.getAuth(this.entity.datas + id);
  }

  getDatasByFilter(item: any) {
    console.log('--datasService--getDatasByFilter--start--');
    var filter = { "obID": item.obID, "values": item.values };
    // let temp_filter = { filter: filter };
    return this.httpservice.postAuthParam(this.entity.dataFilter, filter);
    // console.log ('filter', filter)
  }

  getPatientsByFilter(filter: any) {
    console.log('--datasService--getPatientsByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientsByFilter, filter);
  }

  getReport(filter: any) {
    console.log('--datasService--getReport--start--');
    return this.httpservice.postAuthParam(this.entity.datasGetReport, filter);
    // console.log ('filter', filter);
  }

  getMultiReport(filter: any) {
    console.log('--datasService--getMultiReport--start--');
    return this.httpservice.postAuthParam(this.entity.getMultiReport, filter);
  }


  getDatasByFilter2(filter: any) {
    console.log('--datasService--getDatasByFilter2--start--');
    return this.httpservice.postAuthParam(this.entity.dataFilter, filter);
    // console.log ('filter', filter);patient
  }

  getDatasByVisit(visitID: any, obID: any) {
    console.log('--datasService--getDatasByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.datasVisit, { visitID: visitID, obID: obID });
  }

  getDatasByPatient(patientID: any, obID: any) {
    console.log('--datasService--getDatasByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.patient, { patientID: patientID, obID: obID });
  }

  getDatasByOrder(orderID: any, obID: any) {
    console.log('--datasService--getDatasByOrder--start--');
    return this.httpservice.postAuthParam(this.entity.order, { orderID: orderID, obID: obID });
  }

  getDatasByUser(userID: any, obID: any) {
    console.log('--datasService--getDatasByUser--start--');
    return this.httpservice.postAuthParam(this.entity.patient, { userID: userID, obID: obID });
  }

  getDatasByOb(obID: any) {
    console.log('--datasService--getDatasByOb--start--');
    return this.httpservice.postAuthParam(this.entity.ob, { obID: obID });
  }

  getDatasByProfile(patientID: any, obID: any) {
    console.log('--datasService--getDatasByProfile--start--');
    return this.httpservice.postAuthParam(this.entity.patient, { patientID: patientID, obID: obID, source: 'patient' });
  }

  getDatasByFollowup(followupID: any, obID: any) {
    console.log('--datasService--getDatasByFollowup--start--');
    return this.httpservice.postAuthParam(this.entity.dataFollowup, { followupID: followupID, obID: obID });
  }

  update(request: any) {
    console.log('--datasService--update--start--');
    return this.httpservice.postAuthParam(this.entity.datasupdate, request);
  }

  create(data: any) {
    console.log('--datasService--create--start--');
    return this.httpservice.postAuthParam(this.entity.datas, data);
  }

  delete(id: String) {
    console.log('--datasService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.datas + id);
  }

}