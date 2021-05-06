import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class MedsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByPatient(patientID: any) {
    console.log('--medsService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.medsPatient, { patientID: patientID });
  }

  update(meds: any) {
    console.log('--medsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.medsupdate, meds);
  }

  getMedsByFilter(filter: any) {
    console.log('--medsService--getMedsByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.medsFilter, filter);
  }

  createMany(filter: any[]) {
    console.log('--medsService--createMany--start--');
    return this.httpservice.postAuthParam(this.entity.medscreateMany, filter);
  }

  getPatientMedications(filter: any) {
    console.log('--medsService--getPatientMedications--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientMedications, filter);
  }

  create(meds: any) {
    console.log('--medsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.meds, meds);
  }

  delete(id: String) {
    console.log('--medsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.meds + id);
  }

}