import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class VisitsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getOneVisit(filter: any) {
    console.log('--visitsService--getOneVisit--start--');
    return this.httpservice.postAuthParam(this.entity.getOneVisit, filter);
  }

  getVisits() {
    console.log('--visitsService--getVisits--start--');
    return this.httpservice.getAuth(this.entity.visit);
  }

  getVisitsByPatient(patientID: any) {
    console.log('--visitsService--getVisitsByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.visitPatient, { patientID: patientID });
  }
  /**
   * 待确认url是否准确,与getVisitsByPatient路径相同
   * @param patientID 
   * @param profile 
   */
  getVisitsByProfile(patientID: any, profile: any) {
    console.log('--visitsService--getVisitsByProfile--start--');
    return this.httpservice.postAuthParam(this.entity.visitPatient,
      { patientID: patientID, profileID: profile._id });
  }

  getfollowupsByDate(filter: any) {
    console.log('--visitsService--getfollowupsByDate--start--');
    return this.httpservice.postAuthParam(this.entity.getfollowupsByDate, filter);
  }

  getMonthlyVisitsByProvider(filter: any) {
    console.log('--visitsService--getMonthlyVisitsByProvider--start--');
    return this.httpservice.postAuthParam(this.entity.getMonthlyVisitsByProvider, filter);
  }

  getVisitsByFilter(filter: any) {
    console.log('--visitsService--getVisitsByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.visitFilter, filter);
  }

  getVisitListByFilter(filter: any) {
    console.log('--visitsService--getVisitListByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.getVisitListByFilter, filter);
  }

  getMonthlyVisits(filter: any) {
    console.log('--visitsService--getMonthlyVisits--start--');
    return this.httpservice.postAuthParam(this.entity.monthlyVisits, filter);
  }

  getVisitsByOrder(orderID: any) {
    console.log('--visitsService--getVisitsByOrder--start--');
    return this.httpservice.postAuthParam(this.entity.visitPatient, { orderID: orderID });
  }

  getVisitsByRequester(requesterID: any) {
    console.log('--visitsService--getVisitsByRequester--start--');
    return this.httpservice.getAuth(this.entity.visitRequester + requesterID);
  }

  getVisitsByProvider(filter: any) {
    console.log('--visitsService--getVisitsByProvider--start--');
    return this.httpservice.postAuthParam(this.entity.visitProvider, filter);
  }

  update(request: any) {
    console.log('--visitsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.visitupdate, request);
  }

  updateVisit(request: any) {
    console.log('--visitsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.visitupdate, request);
  }

  createVisit(Visit: any) {
    console.log('--visitsService--createVisit--start--');
    return this.httpservice.postAuthParam(this.entity.visit, Visit);
  }

  delete(id: any) {
    console.log('--visitsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.visit + id);
  }

}