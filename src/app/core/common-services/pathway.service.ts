import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class PathwayService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getPathway() {
    console.log('--pathwayService--getPathway--start--');
    return this.httpservice.getAuth(this.entity.pathway);
  }

  getPathwayByPatient(patientID: String) {
    console.log('--pathwayService--getPathwayByPatient--start--');
    return this.httpservice.getAuth(this.entity.pathwayPatient + patientID);
  }

  getPathwayByRequester(requesterID: String) {
    console.log('--pathwayService--getPathwayByRequester--start--');
    return this.httpservice.getAuth(this.entity.pathwayRequester + requesterID);
  }

  getPathwayByProvider(providerID: String) {
    console.log('--pathwayService--getPathwayByProvider--start--');
    return this.httpservice.getAuth(this.entity.pathwayProvider + providerID);
  }

  getPathwayByVisit(visitID: any, problemID: any) {
    console.log('--pathwayService--getPathwayByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.pathwayVisit, 
      { visitID: visitID, problemID: problemID });
  }

  update(Pathway: any) {
    console.log('--pathwayService--update--start--');
    return this.httpservice.postAuthParam(this.entity.pathwayupdate, Pathway);
  }

  createPathway(Pathway: any) {
    console.log('--pathwayService--createPathway--start--');
    return this.httpservice.postAuthParam(this.entity.pathway, Pathway);
  }

  delete(id: String) {
    console.log('--pathwayService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.pathway + id);
  }

}