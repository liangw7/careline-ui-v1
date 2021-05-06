import { Component, OnInit, OnChanges, Inject, Input, HostListener } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AllServices } from '../../../core/common-services';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'order-compose',
  templateUrl: './order-compose.component.html',
  styleUrls: ['./order-compose.component.scss']
})
export class OrderComposeComponent implements OnInit {
  @Input() order: any;
  @Input() selectedOrder: any;
  forms: any;
  temp: any;
  patient: any;
  filter: any;
  visit: any;
  items: any;
  allergyList: any;
  labs: any;
  images: any;
  coOrders: any;
  requiredList: any;
  stopList: any;
  warningList: any;
  search: any;
  orders: any;
  showTable: any;
  color: any;
  showList: any;
  conflictingProblems: any;
  conflictingOrders: any;
  duplicationList: any;
  isValid: any;
  user: any;
  educations: any;
  desc: any;
  serviceList: any;
  serviceID: any;
  orderFilter: any;
  showConsult: any;
  selectedPatients: any;
  title: any;
  emBed: any;
  loading: any;
  language: any;


  constructor(
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    public router: Router,
    public dialogRef: MatDialogRef<OrderComposeComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data && data.order) //order
      this.order = data.order;
    console.log('order', this.order)
    if (data && data.visit)
      this.visit = data.visit;
    if (data && data.selectedOrder) //orderItem
      this.selectedOrder = data.selectedOrder;
    this.patient = this.storage.get('patient');
    if (!this.patient) {
      this.allServices.usersService.findUserById(this.order.patientID).then((data) => {
        this.temp = data;
        this.patient = this.temp;
      })
    }
    this.color = this.storage.get('color');
    this.user = this.storage.get('user');
    if (data.source == 'consult')
      this.showConsult = true;
    else
      this.showConsult = false;
  }


  ngOnInit() {
    this.labs = [];
    this.images = [];
    this.coOrders = [];
    this.forms = [];
    this.emBed = true;
    this.language = this.storage.get('language')
    if (this.order) {
      console.log('this.order', this.order)
      this.getForms();
      this.title = this.order.desc;
      if (this.order.serviceID) {
        this.allServices.usersService.findUserById(this.order.serviceID).then((data) => {
          this.temp = data;
          this.serviceID = this.temp._id;
        });
      }
      if (this.order.type == 'consult') {
        this.allServices.usersService.getByFilter({ specialty: this.order.specialty }).then((data) => {
          this.temp = data;
          this.serviceList = this.temp;
        })
      }
    }
  }


  getForms() {
    //this.loading=true;
    this.allServices.orderItemsService.getOrder(this.order.orderItemID).then((data) => {
      this.temp = data;
      this.forms = this.temp.forms;
      this.order.specialty = this.temp.specialty;
      for (let form of this.forms) {
        this.allServices.formService.getForm(form, this.patient, this.visit, this.order).then((data) => {
          console.log('order form============', form)
        })
      }
    })
  }


  searchOrder(value: any) {
    console.log('value serach', value)
    this.loading = true;
    this.allServices.orderItemsService.searchByFilter({ $or: [{ name: { "$regex": value } }, { internalName: { "$regex": value } }] }).then((data) => {
      this.temp = data;
      this.loading = false;
      console.log('orders', this.temp)
      this.orders = this.temp;
      this.showList = true;
    })
  }


  validate(selectedOrder: any) {
    this.allServices.orderItemsService.getOrder(selectedOrder._id).then((data) => {
      this.selectedOrder = data;
      console.log('this.selectedOrder================', this.selectedOrder)
      this.title = selectedOrder.label.ch;
      this.selectedOrder.isValid = true;
      this.selectedOrder.patientAllergyList = [];
      this.selectedOrder.patientStopList = [];
      this.selectedOrder.patientConflictingProblems = [];
      this.selectedOrder.patientConflictingOrders = [];
      this.selectedOrder.patientDuplicationList = [];
      console.log('this.selectedOrder', this.selectedOrder)
      this.showList = false;
      if (!this.order) {
        this.validateAllergy(this.selectedOrder).then((data) => {
          console.log('this.selectedOrder.isValid-allery', this.selectedOrder.isValid)
          this.validateRequiredItems(this.selectedOrder).then((data) => {
            console.log('this.selectedOrder.isValid-required-item', this.selectedOrder.isValid)
            this.validateDuplications(this.selectedOrder).then((data) => {
              console.log('this.selectedOrder.isValid-duplication', this.selectedOrder.isValid)
              this.validateConflictingProblems(this.selectedOrder).then((data) => {
                console.log('this.selectedOrder.isValid-confilcting-problem', this.selectedOrder.isValid)
                this.validateConflictingOrders(this.selectedOrder).then((data) => {
                  console.log('this.selectedOrder.isValid-confilcting-order', this.selectedOrder.isValid)
                  console.log('this.selectedOrder.forms', this.selectedOrder.forms)
                  if (this.selectedOrder.isValid) {
                    for (let form of this.selectedOrder.forms) {
                      this.allServices.formService.getForm(form, this.patient, this.visit, null)
                    }
                  }
                });
              })
            });
          })
        });
      }
    })

    //if validation is ok

    /* if ( order.isValid){
     
       var formIDs=[];
       for (let form of  this.selectedOrder.forms){
       formIDs.push(form._id)
     }
   
     
       this.orderFilter={
         patientID: this.patient._id,
         visitID: this.visit._id,
         formIDs:formIDs
        
       
     }
      // this.setFormService.setForm(this.selectedOrder.forms,this.patient,null,this.visit,null,null);
      console.log ('this.orderFilter',this.orderFilter)
      this.categoryService.getFormById(this.orderFilter).then((data)=>{
        console.log ('order.forms',data)
        this.forms=data;
      })
      if (order.type=='consult'){
        this.userService.getByFilter({specialty:order.specialty}).then((data)=>{
          this.temp=data;
          this.serviceList=this.temp;
        })
   
      }
       }*/
  }
  /*  validateAllergy(order){
      if ( order.allergyList){
      for (let allergy of  order.allergyList){
        for (let allergyItem of this.patient.allergyList){
          if (allergy._id==allergyItem._id){
            order.patientAllergyList.push(allergy);
            order.isValid=false;
  
          }
        }
      }
      }
    }*/


  validateAllergy(order: any) {
    return new Promise((resolve, reject) => {
      if (this.patient.allergyList && this.patient.allergyList.length > 0) {
        for (let allergyItem of this.patient.allergyList) {
          if (order.medicationName == allergyItem.allergy) {
            order.patientAllergyList.push(allergyItem.allergy);
            order.isValid = false;
            this.loading = false;
          }
        }
        console.log('allergy list', order.patientAllergyList)
        resolve(order);
        reject(new Error('error'));
      } else {
        console.log('no  allergy')
        resolve(order);
        reject(new Error('error'));
      }
    })
  }


  validateRequiredItems(order: any) {
    return new Promise((resolve, reject) => {
      if (order.items) {
        var filter = {
          patientID: this.patient._id,
          orderItemID: order._id,
          visitDate: new Date(),
          visitID: this.visit._id
        };
        this.allServices.orderItemsService.getItems(filter).then((data) => {
          this.temp = data;
          console.log('order item', this.temp)
          if (this.temp.length > 0) {
            order.items = this.temp[0].items;
            for (let item of order.items) {
              if (item.values.length == 0 && item.value == '') {
                item.stop = true;
                item.stopSign = '数据缺失'
                order.patientStopList.push(item);
                order.isValid = false;
              } else {
                if (item.value) {
                  for (let value of item.values) {
                    item.warning = value.warning;
                    item.stop = value.stop;
                    if (item.stop) {
                      order.patientStopList.push(item);
                      item.stopSign = '数据不支持'
                      order.isValid = false;
                    }
                  }
                } else if (item.values.length > 0) {
                  for (let value of item.values) {
                    item.warning = value.warning;
                    item.stop = value.stop;
                    if (item.stop) {
                      order.patientStopList.push(item);
                      item.stopSign = '数据不支持'
                      order.isValid = false;
                      resolve(order);
                      reject(new Error('error'));
                    }
                  }
                } else {
                  resolve(order);
                  reject(new Error('error'));
                }
              }
            }
            resolve(order);
            reject(new Error('error'));
          } else {
            resolve(order);
            reject(new Error('error'));
          }
        })
      } else {
        resolve(order);
        reject(new Error('error'));
      }
    })
  }


  validateDuplications(order: any) {
    return new Promise((resolve, reject) => {
      if (order.medsClass && order.medsClass.threeLevel) {
        this.allServices.orderItemsService.getByFilter({ 'medsClass.threeLevel.text': order.medsClass.threeLevel.text }).then((data) => {
          this.temp = data;
          var orderIDs = [];
          for (let item of this.temp) {
            orderIDs.push(item._id);
          }
          this.allServices.ordersService.getByFilter({ orderItemID: { $in: orderIDs }, status: 'active', patientID: this.patient._id, }).then((data) => {
            this.temp = data;
            if (this.temp.length > 0) {

              order.patientDuplicationList = this.temp;
              order.isValid = false;
              resolve(order);
              reject(new Error('error'));
            } else {
              resolve(order);
              reject(new Error('error'));
            }
          })
        })
      } else {
        this.allServices.orderItemsService.checkDuplication({
          orderID: order._id,
          visitDate: this.visit.visitDate,
          status: 'active',
          patientID: this.patient._id,
        }).then((data) => {
          this.temp = data;
          if (this.temp.length > 0) {
            console.log('duplicated', this.temp[0].activeOrders)
            if (this.temp[0].activeOrders.length > 0) {
              order.patientDuplicationList = this.temp[0].activeOrders;
              order.isValid = false;
            }
            resolve(order);
            reject(new Error('error'));
          } else {
            resolve(order);
            reject(new Error('error'));
          }
        })
      }
    })
  }


  validateConflictingProblems(order: any) {
    return new Promise((resolve, reject) => {
      if (order.conflictingProblems && order.conflictingProblems.length > 0) {
        var problemIDs = [];
        for (let problem of order.conflictingProblems) {
          problemIDs.push(problem._id)
        }
        console.log('problemIDs', problemIDs)
        this.allServices.problemService.getProblemByFilter({ patientID: this.patient._id, problemItemID: { $in: problemIDs }, familyMember: 'self' }).then((data) => {
          this.temp = data;
          console.log('this.temp', this.temp)
          order.patientConflictingProblems = this.temp;
          if (order.patientConflictingProblems.length > 0)
            order.isValid = false;
          resolve(order);
          reject(new Error('error'));
        })
      } else {
        resolve(order);
        reject(new Error('error'));
      }
    })
  }


  validateConflictingOrders(order: any) {
    return new Promise((resolve, reject) => {
      if (order.conflictingOrders && order.conflictingOrders.length > 0) {
        var orderIDs = [];
        for (let orderItem of order.conflictingOrders) {
          orderIDs.push(orderItem._id)
        }
        this.allServices.ordersService.getByFilter({ orderItemID: { $in: orderIDs }, status: 'active', patientID: this.patient._id }).then((data) => {
          this.temp = data;
          order.patientConflictingOrders = this.temp;
          console.log(' order.patientConflictingOrders', order.patientConflictingOrders)
          if (order.patientConflictingOrders.length > 0)
            order.isValid = false;
          resolve(order);
          reject(new Error('error'));
        })
      } else {
        resolve(order);
        reject(new Error('error'));
      }
    })
  }


  save() {
    for (let form of this.selectedOrder.forms) {
      if (form.formType == 'order')
        var infor = form;
    }
    if (this.selectedOrder.label && this.selectedOrder.label.ch)
      this.desc = this.selectedOrder.label.ch;
    else
      this.desc = this.selectedOrder.internalName;
    if (this.serviceID)
      console.log('service', this.serviceID)
    var serviceID = this.serviceID;
    var newOrder = {
      desc: this.desc,
      patientID: this.patient._id,
      type: this.selectedOrder.orderType,
      serviceID: serviceID,
      infor: infor,
      visitID: this.visit._id,
      orderItemID: this.selectedOrder._id,
      providerID: this.user._id,
      status: 'active',
      createdBy: { _id: this.user._id, name: this.user.name, title: this.user.title }
    };
    console.log('newOrder', newOrder)
    this.dialogRef.close({ newOrder: newOrder, forms: this.selectedOrder.forms, educations: this.selectedOrder.educations });
  }


  getPatient() {
    this.dialogRef.close();
    this.selectedPatients = this.storage.get('selectedPatients');
    if (!this.selectedPatients)
      this.selectedPatients = [];
    if (!this.findPatient(this.patient, this.selectedPatients))
      this.selectedPatients.splice(0, 0, this.patient)
    this.storage.set('selectedPatients', this.selectedPatients);
    this.router.navigate(['/home/selected-patients']);
    //        })
  }


  findPatient(patient: any, patients: any) {
    for (let item of patients) {
      if (item._id == patient._id)
        return true;
    }
    return false;
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id)
        return true;
    }
    return false;
  }


  close() {
    this.dialogRef.close();
  }
}
