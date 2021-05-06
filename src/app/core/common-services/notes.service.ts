import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class NoteService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }


  getByPatient(patientID: any, type: any) {
    console.log('--medsService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.notesPatient,
      { patientID: patientID, type: type });
  }

  getByVisit(visitID: any) {
    console.log('--medsService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.notesVisit, { visitID: visitID });
  }

  update(note: any) {
    console.log('--medsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.notesupdate, note);
  }

  create(note: any) {
    console.log('--medsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.notes, note);
  }

  upload(note: any) {
    console.log('--medsService--upload--start--');
    return this.httpservice.postAuthParam(this.entity.notesPhoto, note);
  }

  delete(id: String) {
    console.log('--medsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.notes + id);
  }

  deletePhoto(id: String) {
    console.log('--medsService--deletePhoto--start--');
    return this.httpservice.deleteAuth(this.entity.notesPhoto + id);
  }
}