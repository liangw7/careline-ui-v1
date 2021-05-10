import {
  Component, OnInit, Inject, Input, OnChanges
} from '@angular/core';
import { ObComponent } from '../../core/common-components/ob/ob.component';
import { ObSetComponent } from '../../core/common-components/ob-set/ob-set.component';
import { AllServices } from '../../core/common-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss']
})
export class MedicationComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  @Input() language: any;
  @Input() viewOnly: any;
  visit: any;
  user: any;
  medications: any;
  medication: any;
  medicationItems: any;
  color: any;
  selectedMedicationItem: any;
  showItems: any;
  loading: any;
  search: any;
  bigScreen: any;
  vaccines: any;
  timeList: any;
  showDate: any;
  selectedVaccine: any;
  selectedTimeItem: any;
  vaccineDate: any;
  shotVaccines: any;
  showVaccine: any;
  medicationActive:any;
  immunizationActive: any;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    private dialog: MatDialog
  ) {

    this.bigScreen = this.storage.get('bigScreen')
    this.medicationActive = true;
    this.immunizationActive = false;
    this.timeList = [{ time: '出生', number: 0 },
    { time: '1月', number: 1 },
    { time: '2月', number: 2 },
    { time: '4月', number: 4 },
    { time: '6月', number: 6 },
    { time: '12月', number: 12 },
    { time: '15月', number: 15 },
    { time: '18月', number: 18 },
    { time: '19-23月', number: 19 },
    { time: '2-3岁', number: 24 },
    { time: '4-6岁', number: 48 }]
    this.user = this.storage.get('user');
    if (!this.user) {
      this.viewOnly = true;
    }
    else if (!this.patient && this.user.role == 'patient')
      this.patient = this.storage.get('user')
    this.color = this.storage.get('color');
    if (!this.language)
      this.language = this.storage.get('language')
  }


  ngOnInit() {
    // this.bigScreen = this.storage.get('bigScreen')
    this.medicationItems = [];
    this.medications = [];
    this.loading = true
    if (this.patient) {
      this.getPatientAge();
      //  this.allServices.medsService.getPatientMedications({'patientID':this.patient._id}).then((data)=>{
      this.getMedications();
    }
  }


  ngOnChanges() {
    // this.bigScreen = this.storage.get('bigScreen')
    this.medicationItems = [];
    this.medications = [];
    this.loading = true
    if (this.patient) {
      this.getPatientAge();
      //  this.allServices.medsService.getPatientMedications({'patientID':this.patient._id}).then((data)=>{
      this.getMedications();
    }
  }


  getMedications() {
    this.allServices.medsService.getByPatient(this.patient._id).then((data) => {
      this.medications = data;
      console.log('medicaions', this.medications)
      this.loading = false;
      var obIDs = [];
      for (let medication of this.medications) {
        if (medication.medicationItem.obs) {
          for (let ob of medication.medicationItem.obs) {
            obIDs.push(ob._id);
          }
        }
      }
      this.allServices.datasService.getDatasByFilter2(
        { patientID: this.patient._id, obID: { '$in': obIDs } }).then((data) => {
          this.temp = data;
          for (let item of this.temp) {
            for (let medication of this.medications) {
              for (let ob of medication.medicationItem.obs) {
                if (item.obID == ob._id && item.medicationItemID == medication.medicationItem._id) {
                  ob.value = item.value;
                  ob.values = [];
                  ob.values = item.values;
                  ob.dataID = item._id;
                }
              }
            }
          }
          this.getVaccines();
        })
    })
  }


  searchMeds(value: any) {
    if (!value)
      value = '';
    this.loading = true;
    this.allServices.orderItemsService.searchByFilter(
      { $or: [{ name: { "$regex": value } }, { internalName: { "$regex": value } }], orderType: 'medication' }).then((data) => {
        this.medicationItems = data;
        this.loading = false;
      })
  }


  select(medicationItem: any) {
    this.showItems = false;
    this.selectedMedicationItem = medicationItem;
    if (this.selectedMedicationItem.label)
      var name = this.selectedMedicationItem.label.ch;
    if (!this.findItem(this.selectedMedicationItem, this.medications)) {

      this.allServices.medsService.create({
        patientID: this.patient._id,
        medicationItemID: this.selectedMedicationItem._id,
        medicationItem: this.selectedMedicationItem,
        label: this.selectedMedicationItem.label,
        name: name,
        status: 'active'
      }).then((data) => {
        this.temp = data;
        this.medications.push(this.temp);
        this.getObSet(this.temp, this.medications)
      })
    }
  }


  findItem(medicationItem: any, medications: any) {
    for (let medication of medications) {
      if (medication.medicationItemID == medicationItem._id)
        return true;
    }
    return false;
  }

  
  getObSet(medication: any, medications: any) {
    var temp = [];
    for (let item of medications) {
      var obSet = {
        label: item.label,
        _id: item.medicationItemID,
        obs: item.medicationItem.obs,
        field: 'medication',
        index: medications.indexOf(item)
      };
      temp.push(obSet)
    }
    const dialogConfig = new MatDialogConfig();
    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '92vw',
        dialogConfig.maxHeight = '95vh',
        dialogConfig.height = '95%',
        dialogConfig.width = '92%'
    }
    if (this.bigScreen == 1) {
      dialogConfig.maxWidth = '80vw',
        dialogConfig.maxHeight = '80vh',
        dialogConfig.height = '80%',
        dialogConfig.width = '80%'
    }
    dialogConfig.data = {
      obSet: {
        label: medication.label,
        _id: medication.medicationItemID,
        obs: medication.medicationItem.obs,
        field: 'medication',
        index: medications.indexOf(medication)
      },
      form: { obSets: temp },
      patient: this.patient
    };
    console.log('data', dialogConfig.data)
    const dialogRef = this.dialog.open(ObSetComponent,
      dialogConfig);
  }


  discontinue(medication: any) {
    medication.status = 'discontinued'
    this.allServices.medsService.update(medication).then((data) => {
      console.log('meds updated', data)
    });
  }


  recordVaccine(vaccine: any, timeItem: any) {
    if ((timeItem.number == 0 && this.patient.ageObj.uom == 'd') ||
      (this.patient.ageObj.number >= timeItem.number && this.patient.ageObj.uom == 'm'))
      if (this.hasDose(vaccine, timeItem)) {
        this.showDate = true;
        this.selectedVaccine = vaccine;
        this.selectedTimeItem = timeItem;
        this.vaccineDate = this.hasDate(vaccine, timeItem);
        console.log('this.vaccineDate', this.vaccineDate)
      }
  }


  getVaccines() {
    this.vaccines = [];
    this.shotVaccines = [];
    this.allServices.orderItemsService.getByFilter({ orderType: 'immunization' }).then((data) => {
      this.vaccines = data;
      var vaccineIDs = [];
      for (let vaccine of this.vaccines) {
        vaccineIDs.push(vaccine._id)
      }
      this.allServices.ordersService.getByFilter({ orderItemID: { "$in": vaccineIDs } }).then((data) => {
        console.log('vaccine order', data)
        this.temp = data;
        this.shotVaccines = this.temp;
        for (let shotVaccine of this.shotVaccines) {
          for (let vaccine of this.vaccines) {
            if (vaccine._id == shotVaccine.orderItemID) {
              for (let option of vaccine.options) {
                if (!option.count)
                  option.count = 0;
                if (shotVaccine.startMonth == option.from && option.count == 0) {
                  option.date = shotVaccine.visitDate;
                  option.count++;
                }
              }
            }
          }
        }
        console.log('vaccines', this.vaccines)
      })
    })
  }


  getVaccineTime(vaccine: any, timeItem: any) {
    for (let shotVaccine of this.shotVaccines) {
      if (vaccine._id == shotVaccine.orderitemID && timeItem.number == shotVaccine.startMonth) {
        for (let option of vaccine.options) {
          if (shotVaccine.startMonth == option.form) {
            option.date = shotVaccine.visitDate;
          }
        }

      }
    }
  }


  getPatientAge() {
    this.patient.ageObj = { number: null, uom: null }
    console.log('this.patient.birthday', this.patient.birthday)
    var timeDiff = Math.abs(Date.now() - (new Date(this.patient.birthday)).getTime());
    console.log('timeDiff', timeDiff)
    var value = timeDiff / (1000 * 3600 * 24) / 365.25;
    if (value > 2) {
      this.patient.ageObj.number = Math.floor(value);
      this.patient.ageObj.uom = 'y'
    } else if (value <= 2) {
      value = value * 12;
      if (value > 1) {
        this.patient.ageObj.number = Math.floor(value);
        this.patient.ageObj.uom = 'm'
      } else {
        this.patient.ageObj.number = Math.floor(value * 30);
        this.patient.ageObj.uom = 'd'
      }
    }
    console.log('tis.patient.ageObj', this.patient.ageObj)
  }


  saveVaccine(vaccine: any, timeItem: any) {
    this.allServices.ordersService.getByFilter({
      orderItemID: vaccine._id,
      startMonth: timeItem.number,
      patientID: this.patient._id
    }).then((data) => {
      this.temp = data;
      if (this.temp.length == 0) {
        this.allServices.ordersService.create({
          orderItemID: vaccine._id,
          startMonth: timeItem.number,
          createdBy: { _id: this.user._id, name: this.user.name, role: this.user.role },
          patientID: this.patient._id,
          visitDate: new Date(this.vaccineDate)
        }).then((data) => {
          this.temp = data;
          console.log('created vaccine', this.temp)
          for (let option of vaccine.options) {
            if (option.from == this.temp.startMonth) {
              option.date = this.temp.visitDate
            }
          }
          this.showDate = false;
        })
      } else {
        this.allServices.ordersService.update({
          _id: this.temp[0],
          orderItemID: vaccine._id,
          startMonth: timeItem.number,
          createdBy: { _id: this.user._id, name: this.user.name, role: this.user.role },
          patientID: this.patient._id,
          visitDate: this.vaccineDate
        }).then((data) => {
          this.temp = data;
          console.log('updated vaccine', this.temp)
          for (let option of vaccine.options) {
            if (option.from == this.temp.startMonth) {
              option.date = this.temp.visitDate
            }
          }
          this.showDate = false;
        })
      }
    })
  }


  hasDose(vaccine: any, timeItem: any) {
    for (let option of vaccine.options) {
      if (timeItem) {
        if (option.from == timeItem.number) {
          return "dose";
        }
        if (option.to == timeItem.number) {
          return "y";
        }
      }
    }
    return null;
  }


  hasDate(vaccine: any, timeItem: any) {
    for (let option of vaccine.options) {
      if (option.from == timeItem.number && option.date) {
        //console.log ('option date', option.date)
        return option.date;
      }
    }
    return null;
  }


  getOb(ob: any, medication: any) {
    console.log('medication', medication)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    console.log('this.visit', this.visit)
    if (medication.label) {
      dialogConfig.data = {
        ob: ob,
        obSet: { label: medication.label, obs: medication.obs, _id: medication.medicationItemID },
        patient: this.patient
        //medicationItemID:medication.medicationItemID
      };
    } else if (medication.name) {
      dialogConfig.data = {
        ob: ob,
        obSet: { label: { ch: medication.name, en: medication.name }, obs: medication.obs, _id: medication.medicationItemID },
        patient: this.patient
        //medicationItemID:medication.medicationItemID
      };
    }
    console.log('ob', ob)
    const dialogRef = this.dialog.open(ObComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob = result;
        this.saveObData(ob, medication);
      }
    });
  }


  saveObData(ob: any, medication: any) {
    if (!ob.valueList && ob.type == 'list' && ob.values && ob.values.length > 0) {
      ob.valueList = [];
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    var filter = {
      obID: ob._id,
      medicationItemID: medication.medicationItemID,
      patientID: this.patient._id
    };
    this.allServices.datasService.getDatasByFilter2(filter).then((obData) => {
      this.temp = obData;
      console.log('visit obData', obData);
      if (this.temp.length > 0) {
        ob.dataID = this.temp[0]._id;
        this.allServices.datasService.update({
          _id: ob.dataID,
          patientID: this.patient._id,
          medicationItemID: medication.medicationItemID,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          console.log('medication data updated', data);
        });
      } else {
        this.allServices.datasService.create({
          patientID: this.patient._id,
          medicationItemID: medication.medicationItemID,

          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          console.log('medication data created', data);
        })
      }
    });
  }


  delete(medication: any, medications: any) {
    this.loading = true;
    this.allServices.medsService.delete(medication._id).then((data) => {
      console.log('deleted', data)
      if (medication.obs) {
        for (let ob of medication.medicationItem.obs) {
          var filter = {
            obID: ob._id,
            medicationItemID: medication.medicationItemID,
            patientID: this.patient._id

          }
          this.allServices.datasService.getDatasByFilter2(filter).then((data) => {
            this.temp = data;
            if (this.temp.length > 0) {
              for (let item of this.temp) {
                this.allServices.datasService.delete(item._id).then((data) => {
                  console.log('deleted', data)
                })
              }
            }
          })
          this.loading = false;
        }
      }
      var index = medications.indexOf(medication);
      medications.splice(index, 1);
      this.loading = false;
    })
  }
}
