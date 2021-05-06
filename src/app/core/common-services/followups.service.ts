import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class FollowupsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getFollowups() {
    console.log('--followupsService--getFollowups--start--');
    return this.httpservice.getAuth(this.entity.followups);
  }

  getFollowupsByPatient(patientID: any) {
    console.log('--followupsService--getFollowupsByPatient--start--');
    return this.httpservice.getAuth(this.entity.followupsPatient);
  }

  getFollowupsByRequester(requesterID: any) {
    console.log('--followupsService--getFollowupsByRequester--start--');
    return this.httpservice.getAuth(this.entity.followupsRequester);
  }

  getFollowupsByProvider(providerID: any) {
    console.log('--followupsService--getFollowupsByProvider--start--');
    return this.httpservice.getAuth(this.entity.followupsProvider);
  }

  getFollowupsByDate(patientID: any, day: { getDate: () => any; getMonth: () => any; getFullYear: () => any; }) {
    console.log('--followupsService--getFollowupsByDate--start--');
    var date = day.getDate();
    var month = day.getMonth();
    var year = day.getFullYear();
    return this.httpservice.postAuthParam(this.entity.followupsDate,
      { 'patientID': patientID, 'date': date, 'month': month, 'year': year });
  }

  updateFollowup(request: any) {
    console.log('--followupsService--updateFollowup--start--');
    return this.httpservice.postAuthParam(this.entity.followupsupdate, request);
  }

  createFollowup(Followup: any) {
    console.log('--followupsService--createFollowup--start--');
    return this.httpservice.postAuthParam(this.entity.followups, Followup);
  }

  delete(id: String) {
    console.log('--followupsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.followups + id);
  }
}