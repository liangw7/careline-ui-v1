import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class OrderItemsService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getAll() {
    console.log('--orderItemsService--getAll--start--');
    return this.httpservice.getAuth(this.entity.orderItems);
  }

  getMedicationForm(filter: any) {
    console.log('--orderItemsService--getMedicationForm--start--');
    return this.httpservice.postAuthParam(this.entity.getMedicationForm, filter);
  }

  getMedications() {
    console.log('--orderItemsService--getMedications--start--');
    return this.httpservice.postAuth(this.entity.getMedications);
  }

  checkDuplication(filter: any) {
    console.log('--orderItemsService--checkDuplication--start--');
    return this.httpservice.postAuthParam(this.entity.checkDuplication, filter);
  }

  getItems(filter: any) {
    console.log('--orderItemsService--getItems--start--');
    return this.httpservice.postAuthParam(this.entity.getItems, filter);
  }

  getOrder(id: String) {
    console.log('--orderItemsService--getOrder--start--');
    return this.httpservice.getAuth(this.entity.orderItems + id);
  }

  getByFilter(filter: any) {
    console.log('--orderItemsService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.orderItemsFilter, filter);
  }

  searchByFilter(filter: any) {
    console.log('--orderItemsService--searchByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.searchByFilter, filter);
  }

  update(request: any) {
    console.log('--orderItemsService--update--start--');
    return this.httpservice.postAuthParam(this.entity.orderItemsupdate, request); 
  }

  create(data: any) {
    console.log('--orderItemsService--create--start--');
    return this.httpservice.postAuthParam(this.entity.orderItems, data);
  }

  delete(id: String) {
    console.log('--orderItemsService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.orderItems + id);
  }

}