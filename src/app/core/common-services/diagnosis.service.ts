import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';


@Injectable()
export class DiagnosisService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }


  getAllDiagnosis() {
    console.log('--diagnosisService--getAllDiagnosis--start--');
    return this.httpservice.getAuth(this.entity.diagnosis);
  }

  getDiagnosis(id: String) {
    console.log('--diagnosisService--getDiagnosis--start--');
    return this.httpservice.getAuth(this.entity.diagnosis + id);
  }

  getDiagnosisByFilter(filter: any) {
    console.log('--diagnosisService--getDiagnosisByFilter--start--');
    let temp_filter = { filter: filter };
    // console.log ('filter', filter)
    return this.httpservice.postAuthParam(this.entity.diagnosisFilter, temp_filter);
  }

  getDiagnosisBySearch(filter: any) {
    console.log('--diagnosisService--getDiagnosisBySearch--start--');
    let temp_filter = { filter: filter };
    return this.httpservice.postAuthParam(this.entity.diagnosisSearch, temp_filter);
  }


  update(request: any) {
    console.log('--diagnosisService--update--start--');
    return this.httpservice.postAuthParam(this.entity.diagnosisupdate, request);
  }

  create(data: any) {
    console.log('--diagnosisService--create--start--');
    return this.httpservice.postAuthParam(this.entity.diagnosis, data);
  }

  createMany(data: any) {
    console.log('--diagnosisService--createMany--start--');
    return this.httpservice.postAuthParam(this.entity.diagnosisBulk, data);
  }

  delete(id: String) {
    console.log('--diagnosisService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.diagnosis+id);
  }


}