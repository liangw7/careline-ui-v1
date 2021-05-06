import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class DeviceService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getPatients(url: any) {
    console.log('--deviceService--getPatients--start--');
    return this.httpservice.get(this.entity.getPatients);
  }

  getDevices(url: any) {
    console.log('--deviceService--getDevices--start--');
    return this.httpservice.get(this.entity.getDevices);
  }

  getUserData(url: any, userID: any) {
    console.log('--deviceService--getUserData--start--');
    var filter = { userID: userID }
    return this.httpservice.postParam(this.entity.deviceValueByDevice, filter);
  }

  getUserDataByDevice(url: any, userID: any, devices: any) {
    console.log('--deviceService--getUserDataByDevice--start--');
    var filter = { userID: userID, devices: devices }
    return this.httpservice.postParam(this.entity.deviceValueByDevice, filter);
  }

  getUserDataByDeviceByFilter(url: any, query: any) {
    console.log('--deviceService--getUserDataByDeviceByFilter--start--');
    var filter = { query: query }
    return this.httpservice.postParam(this.entity.deviceValueByDeviceByFilter, filter);
  }

  /**
   * 待确认...
   * @param filter 
   */
  getAxiData(filter: any) {
    return new Promise((resolve, reject) => {
      console.log('filter', filter)
      if (filter._id == "5f1e0f376d81581e258bc94a"
        || filter._id == "5f1c451ec557d313fdd06597") {
        this.getWeightAndTempFromSimpleDB(filter).then((data) => {
          resolve(data);
          reject();
        })
      }
      else if (filter._id == "5f1d43de8142d019598a0d9d"
        || filter._id == "5f1d43a58142d019598a0d9c"
        || filter._id == '5f1d442c8142d019598a0d9e') {
        this.getPressureAndSugarFromCombineDB(filter).then((data) => {
          resolve(data);
          reject();
        })
      }
    })

  }
  getWeightAndTempFromSimpleDB(filter: { profileUrl: String; }) {
    console.log('--deviceService--getWeightAndTempFromSimpleDB--start--');
    return this.httpservice.postAuthParam(this.entity.baseUrl + filter.profileUrl + this.entity.getSimpleDB, filter);
  }

  getPressureAndSugarFromCombineDB(filter: { profileUrl: String; }) {
    console.log('--deviceService--getPressureAndSugarFromCombineDB--start--');
    return this.httpservice.postAuthParam(this.entity.baseUrl + filter.profileUrl + this.entity.getCombineDB, filter);
  }

  getFatFromComplexDB(profileUrl: String, filter: any) {
    console.log('--deviceService--getFatFromComplexDB--start--');
    return this.httpservice.postAuthParam(this.entity.baseUrl + profileUrl + this.entity.getComplexDB, filter);
  }

}