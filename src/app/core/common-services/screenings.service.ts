import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class ScreeningService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByPatient(patientID: any, type: any) {
    console.log('--screeningService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.screeningPatient,
      { patientID: patientID, type: type });
  }

  getByVisit(visitID: any) {
    console.log('--screeningService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.screeningVisit, { visitID: visitID });
  }

  update(screening: any) {
    console.log('--screeningService--update--start--');
    return this.httpservice.postAuthParam(this.entity.screeningupdate, screening);
  }

  create(screening: any) {
    console.log('--screeningService--create--start--');
    return this.httpservice.postAuthParam(this.entity.screening, screening);
  }

  upload(screening: any) {
    console.log('--screeningService--upload--start--');
    return this.httpservice.postAuthParam(this.entity.screeningPhoto, screening);
  }

  delete(id: String) {
    console.log('--screeningService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.screening + id);
  }

  deletePhoto(id: String) {
    console.log('--screeningService--deletePhoto--start--');
    return this.httpservice.deleteAuth(this.entity.screeningPhoto + id);
  }
}