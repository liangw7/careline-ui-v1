import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class ProblemService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getAllProblem() {
    console.log('--problemService--getAllProblem--start--');
    return this.httpservice.getAuth(this.entity.problem);
  }

  getProblem(id: String) {
    console.log('--problemService--getProblem--start--');
    return this.httpservice.getAuth(this.entity.problem + id);
  }

  getProblemByFilter(filter: any) {
    console.log('--problemService--getProblemByFilter--start--');
    let temp_filter = { filter: filter };
    return this.httpservice.postAuthParam(this.entity.problemFilter, temp_filter);
  }

  createMany(filter: any[]) {
    console.log('--problemService--createMany--start--');
    return this.httpservice.postAuthParam(this.entity.problemcreateMany, filter);
  }

  getPatientProblems(filter: any) {
    console.log('--problemService--getPatientProblems--start--');
    return this.httpservice.postAuthParam(this.entity.getPatientProblems, filter);
  }

  getProblems(filter: any) {
    console.log('--problemService--getProblems--start--');
    return this.httpservice.postAuthParam(this.entity.getProblems, filter);
  }

  update(request: any) {
    console.log('--problemService--update--start--');
    return this.httpservice.postAuthParam(this.entity.problemupdate, request);
  }

  create(data: any) {
    console.log('--problemService--create--start--');
    return this.httpservice.postAuthParam(this.entity.problem, data);
  }

  delete(id: String) {
    console.log('--problemService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.problem + id);
  }

}