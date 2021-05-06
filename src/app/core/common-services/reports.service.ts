import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class ReportsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getReports() {
    console.log('--reportsService--getReports--start--');
    return this.httpservice.getAuth(this.entity.reports);
  }

  getReport(id: String) {
    console.log('--reportsService--getReport--start--');
    return this.httpservice.getAuth(this.entity.reports + id);
  }

  getReportsByFilter(filter: any) {
    console.log('--reportsService--getReportsByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.reportsFilter, filter);
  }

  update(request: any) {
    console.log('--reportsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.reportsupdate, request);
  }

  create(Report: any) {
    console.log('--reportsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.reports, Report);
  }

  delete(id: String) {
    console.log('--reportsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.reports + id);
  }

}