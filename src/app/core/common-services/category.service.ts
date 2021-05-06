import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';

@Injectable()
export class CategoryService {

  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  getCategory(id: String) {
    console.log('--categoryService--getCategory--start--');
   // return this.httpservice.getAuth(this.entity.categories + id);
   return this.httpservice.get(this.entity.categories + id);
  }

  getlabItems(filter: any) {
    console.log('--categoryService--getlabItems--start--');
    return this.httpservice.getAuth(this.entity.getlabItems + filter);
  }

  getCategories() {
    console.log('--categoryService--getCategories--start--');
    return this.httpservice.getAuth(this.entity.categories);
  }

  getForm(filter: any) {
    console.log('--categoryService--getForm--start--');
    return this.httpservice.post(this.entity.getForm, filter);
  }

  getProblemForm(filter: any) {
    console.log('--categoryService--getProblemForm--start--');
    return this.httpservice.postAuthParam(this.entity.getProblemForm, filter);
  }

  getSummary(filter: any) {
    console.log('--categoryService--getSummary--start--');
    return this.httpservice.postAuthParam(this.entity.getSummary, filter);
  }

  getReport(filter: any) {
    console.log('--categoryService--getReport--start--');
    return this.httpservice.postAuthParam(this.entity.getReport, filter);
  }


  getUserForm(filter: any) {
    console.log('--categoryService--getUserForm--start--');
    return this.httpservice.postAuthParam(this.entity.getUserForm, filter);
  }

  getFormById(filter: any) {
    console.log('--categoryService--getFormById--start--');
    // return this.httpservice.postAuthParam(this.entity.getFormById, filter);
    return this.httpservice.post(this.entity.getFormById, filter);
  }

  getOrderMasters() {
    console.log('--categoryService--getOrderMasters--start--');
    let field = { 'field': 'order', 'isOrderMaster': true };
    return this.httpservice.postAuthParam(this.entity.orderMaster, field);
  }

  getCategoriesByField(field: String) {
    console.log('--categoryService--getCategoriesByField--start--');
    return this.httpservice.post(this.entity.field , field);
  }

  getProfiles() {
    console.log('--categoryService--getProfiles--start--');
    return this.httpservice.postAuth(this.entity.profiles);
  }

  getCategoriesByActivityType(activityType: any) {
    console.log('--categoryService--getCategoriesByActivityType--start--');
    return this.httpservice.getAuth(this.entity.activityType);
  }

  getCategoriesByFormType(formType: String) {
    console.log('--categoryService--getCategoriesByFormType--start--');
    return this.httpservice.getAuth(this.entity.formType + formType);
  }

  getCategoriesByFields(fields: any) {
    console.log('--categoryService--getCategoriesByFields--start--');
    return this.httpservice.postAuthParam(this.entity.fields, fields);
  }

  getInternalByFilter(filter: any) {
    console.log('--categoryService--getInternalByFilter--start--');
  //  return this.httpservice.postAuthParam(this.entity.internalFilter, filter);
  return this.httpservice.post(this.entity.internalFilter, filter);
  }

  getCategoriesByFilter(filter: any) {
    console.log('--categoryService--getCategoriesByFilter--start--');
    // return this.httpservice.postAuthParam(this.entity.categoriesFilter, filter);
    return this.httpservice.post(this.entity.categoriesFilter, filter);
  }

  update(category: any) {
    console.log('--categoryService--update--start--');
    console.log('before query request', category)
    // return this.httpservice.postAuthParam(this.entity.update, category);
    return this.httpservice.post(this.entity.update, category);
  }

  create(category: any) {
    console.log('--categoryService--create--start--');
    return this.httpservice.postAuthParam(this.entity.categories, category);
  }

  createMany(data: any) {
    console.log('--categoryService--createMany--start--');
    return this.httpservice.postAuthParam(this.entity.bulk, data);
  }
  delete(id: String) {
    console.log('--categoryService--delete--start--');
    return this.httpservice.deleteAuth(this.entity.categories + id);
  }
}