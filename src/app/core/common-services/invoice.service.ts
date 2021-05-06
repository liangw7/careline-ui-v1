import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class InvoiceService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getByFilter(filter: any) {
    console.log('--invoiceService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.getInvoices, filter);
  }

  getByOrderId(orderId: String) {
    console.log('--invoiceService--getByOrderId--start--');
    return this.httpservice.getAuth(this.entity.invoice + orderId);
  }

  /**
   * 根据系统订单号获取订单信息
   * @param filter 
   * @returns 
   */
  getByOutTradeNo(orderId: String){
    console.log('--invoiceService--getByOutTradeMum--start--');
    return this.httpservice.getAuth(this.entity.invoice + orderId);
  }

  getByPatientId(patientId: String) {
    console.log('--invoiceService--getByPatientId--start--');
    return this.httpservice.getAuth(this.entity.invoicePatient + patientId);
  }

  update(request: any) {
    console.log('--invoiceService--update--start--');
    return this.httpservice.postAuthParam(this.entity.invoiceUpate, request);
  }

  create(data: any) {
    console.log('--invoiceService--create--start--');
    return this.httpservice.postAuthParam(this.entity.invoice, data);
  }

  delete(id: String) {
    console.log('--invoiceService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.invoice + id);
  }

}