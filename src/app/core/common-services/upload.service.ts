import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class UploadService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getAll() {
    console.log('--uploadService--getAll--start--');
    return this.httpservice.getAuth(this.entity.upload);
  }

  get(id: any) {
    console.log('--uploadService--get--start--');
    return this.httpservice.getAuth(this.entity.upload + id);
  }

  getByFilter(filter: any) {
    console.log('--uploadService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.uploadFilter, filter);
  }

  update(request: any) {
    console.log('--uploadService--update--start--');
    return this.httpservice.postAuthParam(this.entity.uploadupdate, request);
  }

  create(data: any) {
    console.log('--uploadService--create--start--');
    return this.httpservice.postAuthParam(this.entity.upload, data);
  }

  delete(id: any) {
    console.log('--uploadService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.upload + id);
  }

}