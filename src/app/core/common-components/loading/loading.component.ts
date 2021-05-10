import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AllServices } from '../../common-services';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit {
  data: any;
  categories: any;
  field: any;
  newCategory: any;
  selectedItems: any;
  option: any;
  ob: any;
  obSet: any;
  form: any;
  interventionProfile: any;
  activity: any;
  activityType: any;
  selectedActivityItems: any;
  type: any;
  showSave: any;
  profile: any;
  calculationObs: any;
  calculationOb: any;
  lab: any;
  image: any;
  orderMaster: any;
  fields: any;
  resource: any;
  patientListOb: any;
  patientListOptions: any;
  temp: any;
  options: any;
  singleSelection: any;
  report: any;
  medsClass: any;
  filter: any;
  loading: any;
  orderType: any;
  typeOptionList: any;
  service: any;
  visit: any;
  dataPatient: any;

  constructor(
    private allService: AllServices,
    private dialog: MatDialog,

  ) {
    if (!this.selectedItems)
      this.selectedItems = [];
    this.typeOptionList = ['lab', 'image', 'order', 'user', 'other']
  }


  ngOnInit() {
    this.filter = '';
    if (!this.categories)
      this.categories = [];
    this.service = { _id: "5e548890aa44f174335fbde5" };
    this.profile = { _id: "5e5440fc001d0872de703f37" };

  }


  updatePateint() {
    this.allService.loadPatientService.loadPatient().then((data: any) => {
      this.temp = data;

      for (let item of this.temp) {
        var email = item.patient.obs[0].value + 'vm@test.com'
        var password = item.patient.obs[0].value + 'vm';
        if (item.patient.obs.length > 6)
          var gender = item.patient.obs[5].value
        var credentials = {
          email: email,
          password: password,
          role: 'patient',
          gender: gender,
          profiles: [this.profile],
          serviceList: [this.service],
          name: item.patient.obs[0].value
        }

        this.allService.usersService.getByFilter({ name: item.patient.obs[0].value }).then((data: any) => {
          this.temp = data;
          if (this.temp.length == 0) {
            //this.createPatient(credentials,item);
            console.log('NNNNo existing patient', credentials)
          } else if (this.temp.length > 0) {

            console.log('existing patient')
            this.createVisit(this.temp[0], item);
          }
        })
      }
    })
  }

  loadPateint() {

    this.allService.loadPatientService.loadPatient().then((data: any) => {
      this.dataPatient = data;

      for (let item of this.dataPatient) {
        var email = item.patient.obs[0].value + 'vm@test.com'
        var password = item.patient.obs[0].value + 'vm'
        var credentials = {
          email: email,
          password: password,
          role: 'patient',
          //gender:item.patient.obs[5].values[0],
          profiles: [this.profile],
          serviceList: [this.service],
          name: item.patient.obs[0].value
        }

        this.allService.usersService.createUser(credentials).then((data: any) => {
          console.log('user created', data)
          this.temp = data;
          item.patientData = this.temp;
        });
      }
    })
  }

  getVisit() {
    for (let item of this.dataPatient) {
      var visit = {
        patientID: item.patientData._id,
        visitDate: new Date(),
        profile: this.profile,
        type: 'visit',
        enType: 'visit',
        providerID: 'system',
        createdBy: { _id: 'system' }

      }

      this.allService.visitsService.createVisit(visit).then((data: any) => {
        item.visit = data;
        console.log('visit created', this.visit)

      })
    }
  }

  getVisitData() {
    for (let item of this.dataPatient) {
      for (let ob of item.patient.obs) {
        this.createOb(ob, item.patientData, item.visit);
      }
      for (let ob of item.data.obs) {
        this.createOb(ob, item.patientData, item.visit);
      }
    }
  }

  createPatient(credentials: any, item: any) {

    this.allService.usersService.createUser(credentials).then((data: any) => {
      console.log('user created')
      this.temp = data;
      if (this.temp)
        this.createVisit(this.temp, item);
    })
  }

  createVisit(patient: any, item: any) {
    var visit = {
      patientID: patient._id,
      visitDate: new Date(),
      profiles: [this.profile],
      type: 'visit',
      enType: 'visit',
      providerID: 'system',
      createdBy: { _id: 'system' }

    }
    this.allService.visitsService.getVisitsByFilter({ 'type': 'visit', 'patientID': patient._id, 'profile._id': this.profile._id })
      .then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          this.allService.visitsService.createVisit(visit).then((data: any) => {
            this.visit = data;
            console.log('visit created')
            for (let ob of item.patient.obs) {
              this.saveOb(ob, patient, this.visit);
            }
            for (let ob of item.data.obs) {
              this.saveOb(ob, patient, this.visit);
            }


          })
        } else {
          console.log('visit exist')
          //for (let ob of item.patient.obs){
          //  this.saveOb(ob, patient, this.temp[0]);
          //  }
          for (let ob of item.data.obs) {
            this.saveOb(ob, patient, this.temp[0]);
          }
        }
      })
  }


  saveOb(ob: any, user: any, visit: any) {
    if (ob.value || ob.values.length > 0) {


      var visitID = visit._id;
      this.allService.datasService.getDatasByFilter2({
        patientID: user._id,
        obID: ob._id,
        visitID: visitID
      }).then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {

          this.allService.datasService.create({
            patientID: user._id,
            patientEmail: user.email,
            visitID: visitID,
            obID: ob._id,
            value: ob.value,
            values: ob.values
          }).then((data: any) => {
            console.log('visit data created');
          });
        } else {

          this.allService.datasService.update({
            _id: this.temp[0]._id,
            patientID: user._id,
            patientEmail: user.email,
            visitID: visitID,
            obID: ob._id,
            value: ob.value,
            values: ob.values
          }).then((data: any) => {
            console.log('visit data updated');
          });
        }
      })
    }
  }
  createOb(ob: any, user: any, visit: any) {
    this.allService.datasService.create({
      patientID: user._id,
      patientEmail: user.email,
      visitID: visit._id,
      obID: ob._id,
      value: ob.value,
      values: ob.values
    }).then((data: any) => {
      console.log('visit data created');
    });
  }


  search() {
    this.loading = true;

    if (this.option === 'lab') {

      this.allService.labItemsService.getByFilter({ $or: [{ 'label.ch': { "$regex": this.filter } }, { internalName: { "$regex": this.filter } }] }).then((data: any) => {

        this.categories = data;
        this.loading = false;
      })
    } else if (this.option === 'image') {

      this.allService.imageItemsService.getByFilter({ $or: [{ name: { "$regex": this.filter } }, { internalName: { "$regex": this.filter } }] }).then((data: any) => {

        this.categories = data;
        this.loading = false;
      })
    } else if (this.option === 'order') {

      this.allService.orderItemsService.getByFilter({ $or: [{ name: { "$regex": this.filter } }, { internalName: { "$regex": this.filter } }] }).then((data: any) => {
        this.categories = data;
        this.loading = false;
      })

    } else if (this.option === 'user') {

      this.allService.usersService.getByFilter({ $or: [{ name: { "$regex": this.filter } }] }).then((data: any) => {
        this.categories = data;
        this.loading = false;
      })

    } else {

      this.allService.categoryService.getCategoriesByFilter(
        { $or: [{ name: { "$regex": this.filter } }, { internalName: { "$regex": this.filter } }] }).then((data: any) => {
          this.categories = data;
          this.loading = false;
        })
    }
  }

  find(item: any, list: any) {
    if (list.length > 0) {
      for (let i of list) {
        if (i._id == item._id)
          return true;
      }
    }
    return false;
  }

  select(item: any) {
    console.log('item', item)

    if (!this.find(item, this.selectedItems)) {
      if (!item.field && this.option != 'user')
        item.field = this.option;

      this.selectedItems.push(item);
    }
  }

  deselect(item: any) {

    this.selectedItems.splice(this.selectedItems.indexOf(item), 1)
  }

  loadData() {
    console.log('selectedItems', this.selectedItems)

    for (let item of this.selectedItems) {
      if (item.filed == 'order') {
        this.allService.orderItemsService.getOrder(item._id).then((data: any) => {
          this.temp = data;
          if (!this.temp) {
            this.allService.orderItemsService.create(item).then((data: any) => {
              console.log('order created', item)
            })
          } else {
            this.allService.orderItemsService.update(item).then((data: any) => {
              console.log('order updated', item)
            })
          }
        })

      } else if (item.filed == 'lab') {
        this.allService.labItemsService.get(item._id).then((data: any) => {
          this.temp = data;
          if (!this.temp) {
            this.allService.labItemsService.create(item).then((data: any) => {
              console.log('lab created', item)
            })
          } else {
            this.allService.labItemsService.update(item).then((data: any) => {
              console.log('lab updated', item)
            })
          }
        })
      } else if (item.filed == 'image') {
        this.allService.imageItemsService.get(item._id).then((data: any) => {
          this.temp = data;
          if (!this.temp) {
            this.allService.imageItemsService.create(item).then((data: any) => {
              console.log('image created', item)
            })
          } else {
            this.allService.imageItemsService.update(item).then((data: any) => {
              console.log('image updated', item)
            })
          }
        })
      } else if (item.role) {
        this.allService.usersService.findUserById(item._id).then((data: any) => {
          this.temp = data;
          if (!this.temp) {
            this.allService.usersService.createUser(item).then((data: any) => {
              console.log('user created', item)
            })
          } else {
            this.allService.usersService.updateUser(item).then((data: any) => {
              console.log('user updated', item)
            })
          }
        })
      } else {

        this.allService.categoryService.getCategory(item._id).then((data: any) => {
          this.temp = data;
          if (!this.temp) {
            this.allService.categoryService.create(item).then((data: any) => {
              console.log('category created', item)
            })
          } else if (item.role) {
            this.allService.categoryService.update(item).then((data: any) => {
              console.log('category updated', item)
            })
          }
        })
      }
    }
  }
}

