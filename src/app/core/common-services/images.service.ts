import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class ImagesService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }


  getByPatient(patientID: any) {
    console.log('--imagesService--getByPatient--start--');
    return this.httpservice.postAuthParam(this.entity.imagesPatient, { patientID: patientID });
  }

  getByFilter(filter: any) {
    console.log('--imagesService--getByFilter--start--');
    return this.httpservice.postAuthParam(this.entity.imagesFilter, filter);
  }

  getByVisit(visitId: any) {
    console.log('--imagesService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.imagesVisit, { visitId: visitId });
  }

  update(images: any) {
    console.log('--imagesService--getByVisit--start--');
    return this.httpservice.postAuthParam(this.entity.imagesupdate, images);
  }

  create(images: any) {
    console.log('--imagesService--create--start--');
    return this.httpservice.postAuthParam(this.entity.images, images);
  }

  delete(id: String) {
    console.log('--imagesService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.images + id);

  }
}