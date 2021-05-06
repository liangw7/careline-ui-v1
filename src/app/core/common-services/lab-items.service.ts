import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class LabItemsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getAll() {
    console.log('--labItemsService--getAll--start--');
    return this.httpservice.getAuth(this.entity.labItems);
  }

  get(id: String) {
    console.log('--labItemsService--get--start--');
    return this.httpservice.getAuth(this.entity.labItems + id);
  }

  getByFilter(filter: any) {
    console.log('--labItemsService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.labItemsFileter, filter);
  }

  update(request: any) {
    console.log('--labItemsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.labItemsupdate, request);
  }

  create(data: any) {
    console.log('--labItemsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.labItems, data);
  }

  delete(id: String) {
    console.log('--labItemsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.labItems + id);
  }

}