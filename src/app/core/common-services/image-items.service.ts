import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class ImageItemsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getAll() {
    console.log('--imageItemsService--getAll--start--');
    return this.httpservice.getAuth(this.entity.imagesItems);
  }

  get(id: String) {
    console.log('--imageItemsService--get--start--');
    return this.httpservice.getAuth(this.entity.imagesItems + id);
  }

  getByFilter(filter: any) {
    console.log('--imageItemsService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.imagesItemsFilter, filter);
  }

  update(request: any) {
    console.log('--imageItemsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.imagesItemsupdate, request);
  }

  create(data: any) {
    console.log('--imageItemsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.imagesItems, data);
  }

  delete(id: String) {
    console.log('--imageItemsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.imagesItems + id);
  }

}