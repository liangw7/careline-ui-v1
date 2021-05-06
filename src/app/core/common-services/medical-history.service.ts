import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class MedicalHistoryService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByPatient(patientID: any, type: any) {
    console.log('--loadPatientService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.medicalHistoryPatient,
      { patientID: patientID, type: type });
  }

  update(history: any) {
    console.log('--loadPatientService--update--start--');
    return this.httpservice.postAuthParam(this.entity.medicalHistoryupdate, history);
  }

  create(history: any) {
    console.log('--loadPatientService--create--start--');
    return this.httpservice.postAuthParam(this.entity.medicalHistory, history);
  }

  upload(history: any) {
    console.log('--loadPatientService--upload--start--');
    return this.httpservice.postAuthParam(this.entity.medicalHistoryPhoto, history);
  }

  delete(id: String) {
    console.log('--loadPatientService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.medicalHistory + id);
  }

  deletePhoto(id: String) {
    console.log('--loadPatientService--deletePhoto--start--');
    return this.httpservice.deleteAuth(this.entity.medicalHistoryPhoto + id);
  }
}