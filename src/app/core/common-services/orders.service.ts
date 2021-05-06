import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class OrdersService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByPatient(patientID: any) {
    console.log('--ordersService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.ordersPatient, { patientID: patientID });
  }

  getByOrderType(patientID: any, orderType: any) {
    console.log('--ordersService--getByOrderType--start--');
    return this.httpservice.postAuthParam(this.entity.ordersType,
      { patientID: patientID, type: orderType });
  }

  getByFilter(filter: any) {
    console.log('--ordersService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.ordersFilter, filter);
  }

  getconsultsByService(filter: any) {
    console.log('--ordersService--getconsultsByService--start--');
    return this.httpservice.postAuthParam(this.entity.getconsultsByService, filter);
  }

  getConsults() {
    console.log('--ordersService--getConsults--start--');
    return this.httpservice.postAuthParam(this.entity.ordersType,{ type: 'consult' });
  }

  getByVisit(visitId: any) {
    console.log('--ordersService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.ordersVisit, { visitId: visitId });
  }

  update(orders: any) {
    console.log('--ordersService--update--start--');
    return this.httpservice.postAuthParam(this.entity.ordersupdate, orders);
  }

  getOrder(id: String) {
    console.log('--ordersService--getOrder--start--');
    return this.httpservice.getAuth(this.entity.orders + id);
  }

  create(orders: any) {
    console.log('--ordersService--create--start--');
    return this.httpservice.postAuthParam(this.entity.orders, orders);
  }

  delete(id: String) {
    console.log('--ordersService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.orders + id);
  }

}