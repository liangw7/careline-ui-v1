import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class LabsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByPatient(patientID: any) {
    console.log('--labsService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.labsPatient, { patientID: patientID });
  }

  getByFilter(filter: any) {
    console.log('--labsService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.labsFilter, filter);
  }

  getByVisit(visitId: any) {
    console.log('--labsService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.labsVisit, { visitId: visitId });
  }

  update(labs: any) {
    console.log('--labsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.labsupdate, labs);
  }

  create(labs: any) {
    console.log('--labsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.labs, labs);
  }

  delete(id: String) {
    console.log('--labsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.labs + id);
  }

}