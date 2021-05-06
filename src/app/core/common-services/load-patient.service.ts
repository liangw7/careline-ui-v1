import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()

export class LoadPatientService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  loadASQ() {
    console.log('--loadPatientService--loadASQ--start--');
    return this.httpservice.get(this.entity.obUrl);
  }

  loadPatient() {
    console.log('--loadPatientService--loadPatient--start--');
    return this.httpservice.get(this.entity.patientUrl);
  }


  loadIcdCh() {
    console.log('--loadPatientService--loadIcdCh--start--');
    return this.httpservice.get(this.entity.icdChUrl);
  }

  loadIcd() {
    console.log('--loadPatientService--loadIcd--start--');
    return this.httpservice.get(this.entity.icdUrl);
  }
}