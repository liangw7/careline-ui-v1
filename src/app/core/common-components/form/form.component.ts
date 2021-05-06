import {
  Component, OnInit, Inject, Input, Output, OnChanges, EventEmitter, HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { ObComponent } from '../ob/ob.component';
import { ObSetComponent } from '../ob-set/ob-set.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { AllServices } from '../../common-services';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges {

  formType: any;
  form: any;
  id: any;
  @Input() ids: any;
  @Input() language: any;
  @Input() emBed: any;
  @Input() registry: any;
  @Input() profile: any;
  @Input() showInstruction: any;
  @Input() hideLabel:any;

  obSets: any;
  obSet: any;
  obSetTemp: any;
  obTemp: any;
  name: any;
  dataFilter: any;
  temp: any;
  user: any;
  tempId: any;
  visitId: any;
  // order: any;

  foods: any;
  cars: any;
  schedule: any;
  followup: any;
  showCh: any;
  filter: any;
  loadingDone: any;
  bigScreen: any;
  registryRole: any;
  startTab: any;
  showScroll: any;
  showScrollHeight = 300;
  hideScrollHeight = 10;
  screenSize: any;
  lastObSet: any;
  selectedIndex: any;
  chooseProvider: any;
  providers: any;
  selectedObSet: any;
  age: any;
  formFilter: any;
  currentForm: any;
  @Input() popOut: any;
  @Input() emBedSet: any;
  @Input() registryUser: any;
  @Input() source: any;
  @Input() viewOnly: any;
  @Input() forms: any;
  @Input() obs: any;
  @Input() editUser: any;
  @Input() addPatient: any;
  @Input() service: any;
  @Input() visit: any;
  @Input() formResource: any;
  @Input() patient: any;
  @Input() medication: any;
  @Input() problem: any;
  @Input() style: any;
  @Input() order: any;
  @Input() timeOut: any;
  @Input() photo: any;
  @Input() color: any;
  @Input() loading: any;
  @Input() procedureDate: any;
  @Input() visitDate: any;
  @Input() visitRecord: any;
  @Input() noTitle: any;
  @Output() messageEvent = new EventEmitter<String>();
  @Output() submitProfileForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitOb: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitScreeningForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitProblemForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitPathwayForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitUserRegistryForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();
  provider: any;
  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FormComponent>,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.user = this.storage.get('user')
    if (!this.color)
      this.color = this.storage.get('color')
    this.bigScreen = this.storage.get('bigScreen');
    this.screenSize = this.storage.get('screenSize');
    console.log('forms-0===============', this.forms)
    if (!this.forms)
      this.forms = data.forms;
    console.log('emBed===============', this.emBed)

  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?: any) {

  //   var screenWidth = window.innerWidth;
  //   var screenHeight = window.innerHeight;
  //   this.screenSize = {
  //     height: screenHeight,
  //     width: screenWidth
  //   }
  //   console.log('this.screenSize', this.screenSize)
  //   if (screenWidth <= 992)
  //     this.bigScreen = 0;
  //   else
  //     this.bigScreen = 1;
  // }

  ngOnInit() {
    //  ngAfterViewInit() {
    //if (!this.screenSize)
    if (!this.visitDate) {
      this.visitDate = new Date();
    }
    // this.getScreenSize();
    this.startTab = true;
    console.log('this.emBed', this.emBed)
    if (this.patient) {

      if (!this.user) {
        this.viewOnly = true;
      }
    }
    this.showCh = true;
    if (this.photo) {

      this.photo = this.allService.utilService.getImageUrl(String(this.photo));

    }

    console.log('forms-init==============', this.forms)

    if (this.forms) {

    }
  }



  ngOnChanges() {
    //  ngAfterViewInit() {
    //if (!this.screenSize)
    // this.getScreenSize();
    this.startTab = true;
    console.log('this.emBed', this.emBed)
    if (this.patient) {

      if (!this.user) {
        this.viewOnly = true;
      }

    }
    this.showCh = true;
    if (this.photo) {

      this.photo = this.allService.utilService.getImageUrl(String(this.photo));

    }

    console.log('forms-onchange===========', this.forms)

    if (this.forms) {
      if (this.bigScreen == 0 && this.popOut) {
        if (this.forms)
          this.getObSet(this.forms[0].obSets[0], this.forms[0])
      }
    }
  }


  getSetValue(obSet: any) {
    var infor = '';
    for (let ob of obSet.obs) {
      if (ob.type == 'calculation') {
        if (ob.value) {
          infor = ob.value
        }
        if (ob.values) {
          for (let value of ob.values) {
            if (value && value.text) {
              infor = infor + value.text
            }
          }
        }

      }
    }
    return infor;
  }


  receiveMessage($event: any) {
    if ($event) {
      //if (!this.emBedSet)
      this.getObSet(this.form.obSets[$event], this.form);
    }
  }


  getForm(form: any) {

    return new Promise((resolve, reject) => {
      if (!form.obSets)
        form.obSets = [];
      this.loading = true;
      if (this.patient && this.visit) {
        this.formFilter = {
          formIDs: [form._id],
          patientID: this.patient._id,
          visitID: this.visit._id,
          visitDate: this.visit.visitDate,
          procedureDate: form.procedureDate
        }
      } else if (this.patient && !this.visit) {
        this.formFilter = {
          formIDs: [form._id],
          patientID: this.patient._id,


        }
      } else {
        this.formFilter = {
          formIDs: [form._id]
        }
      }

      this.loading = true;
      // alert('getting form')
      this.allService.categoryService.getFormById(this.formFilter).then((data: any) => {

        this.temp = data;

        this.loading = false;
        if (this.temp.length > 0) {
          form.obSets = this.temp[0].obSets;

          form.name = this.temp[0].name;

          form.label = this.temp[0].label;
          form.formType = this.temp[0].formType;
          form.formStyle = this.temp[0].formStyle;

          var visitObIDs = [];
          var patientObIDs: any[] = [];
          for (let obSet of form.obSets) {
            for (let ob of obSet.obs) {
              if (!ob.context || ob.context == 'visit' || ob.context == 'order') {
                visitObIDs.push(ob._id)
              } else {
                patientObIDs.push(ob._id)
              }
              this.getvisitData(visitObIDs, form).then((data) => {
                this.getPatientData(patientObIDs, form).then((data) => {
                  this.allService.alertDialogService.alert('got form')
                })
              })
            }
          }
        }
      })
    })
  }


  getvisitData(obIDs: any, form: any) {
    return new Promise((resolve, reject) => {
      if (obIDs.length > 0) {
        var visitFilter = {
          patientID: this.patient._id,
          visitID: this.visit._id,
          obID: { '$in': obIDs }
        }
        this.allService.datasService.getDatasByFilter2(visitFilter).then((data: any) => {
          this.temp = data;
          this.loading = false;

          //console.log ('ob values', this.temp)

          for (let obSet of form.obSets) {

            for (let ob of obSet.obs) {

              for (let item of this.temp) {
                if (ob._id == item.obID) {

                  ob.value = item.value;
                  ob.values = [];
                  ob.values = item.values;
                  ob.dataID = item._id;
                }
              }
            }
          }
        })
      } else {
        // resolve();
        reject(new Error('error'));
      }
    })
  }


  getPatientData(obIDs: any, form: any) {
    return new Promise((resolve, reject) => {
      if (obIDs.length > 0) {
        var patientFilter = {
          patientID: this.patient._id,
          obID: { '$in': obIDs }
        }
        this.allService.datasService.getDatasByFilter2(patientFilter).then((data: any) => {
          this.temp = data;
          this.loading = false;

          //console.log ('ob values', this.temp)

          for (let obSet of form.obSets) {
            for (let ob of obSet.obs) {
              for (let item of this.temp) {
                if (ob._id == item.obID) {
                  ob.value = item.value;
                  ob.values = [];
                  ob.values = item.values;
                  ob.dataID = item._id;
                }
              }
            }
          }

        })
      } else {
        // resolve();
        reject(new Error('error'));
      }
    })
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.pageYOffset || document.documentElement.scrollTop
      || document.body.scrollTop) > this.showScrollHeight) {
      this.showScroll = true;
    } else if (this.showScroll && (window.pageYOffset || document.documentElement.scrollTop
      || document.body.scrollTop) < this.hideScrollHeight) {
      this.showScroll = false;
    }
  }


  getIndex(item: any) {
    if (item.index > 0)
      return item.index + 1;
    else
      return 1;
  }


  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 6));
      }
    })();
  }


  selectValue($event: any, ob: any) {
    for (let option of ob.options) {
      if ($event.value == option.text)
        ob.values[0] = option;
    }

  }


  showCalculation(ob: any, obSet: any) {

    if (ob.type == 'calculation' && ob.calculationItems) {
      for (let item of ob.calculationItems) {
        for (let obItem of obSet.obs) {
          if (item._id == obItem._id
            && obItem.values
            && obItem.values.length == 0
            && !obItem.addsIn) {

            ob.values = [];
            ob.number = null;
          }
        }
      }

    }
  }


  getAge(ob: any) {
    if (ob.label.en == 'age formula') {

      var value = ob.value / 365.25;
      var uom = '';
      if (value > 2) {
        value = Math.floor(value);
        uom = 'y'
      } else if (value <= 2) {

        value = value * 12;
        console.log('value', value)
        if (value > 1) {
          value = Math.floor(value);
          uom = 'm'
        } else {
          value = Math.floor(value * 30);
          uom = 'd'
        }
      }
      return { number: value, uom: uom };
    }else{
      return { number: '', uom: '' };
    }
  }


  calculationValue(obSet: any) {

    var hasValue = 0;
    for (let ob of obSet.obs) {
      // console.log ('ob.name',ob.label.ch)
      // console.log ('ob.values',ob.values)

      if (ob.type != 'calculation' && !ob.addsIn && ob.values && ob.values.length > 0)
        hasValue = hasValue + 1;
    }
    //   console.log ('obSet.obs.length', obSet.obs.length)
    if (hasValue == 0)
      return false;
    else
      return true;
  }

  getUom(ob: any) {
    if (this.language == 'Chinese') {
      if (ob.uom == 'y') {
        return '岁'
      }
      if (ob.uom == 'm') {
        return '月'
      }
      if (ob.uom == 'd') {
        return '天'
      }
      else return ob.uom
    }
    else return ob.uom
  }


  breakLines(str: any) {
    var temp = [];
    //temp=str.match(/\n/g);
    temp = str.split(/\n/g);
    // console.log('temp===========',temp)
    // temp=str.split('/n');
    return temp;
  }


  showObSet(obSet: any, form: any) {

    if (!obSet.addsIn) {
      return 0;
    }
    var index = 1;
    for (let obSetItem of form.obSets) {
      index++;
      if (!obSetItem.obs)
        obSetItem.obs = [];
      for (let obItem of obSetItem.obs) {
        if (obItem.values && obItem.values.length > 0) {
          for (let value of obItem.values) {
            if (value && value.items) {
              for (let item of value.items) {
                //  console.log ('obSet=======added from form before',obSet)
                //   console.log ('item=======added from form before',item)
                if (item._id == obSet._id) {
                  //    console.log ('obSet=======added from form after',obSet)
                  return 100 * index;
                }
              }
            }
          }
        }
      }
    }
    return 0;
  }


  findProvider() {
    this.chooseProvider = true;
    alert('chooseProvider' + this.chooseProvider)
    this.allService.shareProviderService.sendShareProvider(this.chooseProvider);
    this.messageEvent.emit("choose provider");
  }


  showOb(ob: any, obSet: any) {
    if (obSet && obSet.image) {
      obSet.imageUrl = this.allService.utilService.getImageUrl(String(obSet.image));
    }
    if (ob.image) {
      ob.imageUrl = this.allService.utilService.getImageUrl(String(ob.image));
    }
    if (ob.type == 'image')
      ob.url = this.allService.utilService.getImageUrl(String(ob.value));

    if (obSet) {
      if (!obSet.obs)
        obSet.obs = [];
      this.showCalculation(ob, obSet);
      //if ((ob.value||ob.value!='')||(ob.values&&ob.values.length>0)){
      for (let obItem of obSet.obs) {
        if (obItem.show || !obItem.addsIn) {
          if (obItem.values && obItem.values.length > 0) {
            for (let value of obItem.values) {
              if (value && value.items) {
                for (let item of value.items) {
                  if (item._id == ob._id) {
                    ob.show = true;
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }


  tabSelectionChanged(event: any, form: any) {
    let selectedTab = event.tab;
    for (let obSet of form.obSets) {
      if (obSet.label.ch == selectedTab.textLabel || obSet.label.en == selectedTab.textLabel) {
        this.lastObSet = 'lastObSet'
        this.messageEvent.emit(this.lastObSet);
        console.log('this.lastObSet sent', this.lastObSet)
      } else {
        this.lastObSet = ''
        this.messageEvent.emit(this.lastObSet);
      }
    }
  }


  getLastObSet(form: any) {

    if (this.selectedIndex == form.obSets.length - 1) {
      this.lastObSet = 'lastObSet'
      this.messageEvent.emit(this.lastObSet);
      console.log('this.lastObSet sent', this.lastObSet)
    } else {
      this.lastObSet = ''
      this.messageEvent.emit(this.lastObSet);
    }
  }


  getTarget(obSet: any, form: any) {

    // var elmnt = document.getElementById(id);
    // elmnt.scrollIntoView(true); 
    // obSet.selected=1;
    for (let obSetItem of form.obSets) {
      obSetItem.selected = false;
      //  if (obSetItem.name==obSet.name)
      //  obSetItem.selected=true;
    }
    obSet.selected = true;
  }


  getAll(form: any) {

    for (let obSetItem of form.obSets) {
      obSetItem.selected = true;
    }
  }


  saveObData(ob: any) {
    console.log('save ob', ob)
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value)
          ob.valueList.push(value.text)
      }
    }

    if (ob.context == 'patient' && this.patient) {

      this.allService.datasService.getDatasByPatient(this.patient._id, ob._id).then((obData: any) => {
        this.temp = obData;
        //  console.log ('patient obData',obData);
        let params: any = {
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          //   visitID: this.visit._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length > 0) {

          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('update patient data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('create patient data', data);
          });
        }
      });
    } else {

      this.allService.datasService.getDatasByVisit(this.visit._id, ob._id).then((obData: any) => {
        this.temp = obData;
        let params: any = {
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          visitID: this.visit._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length > 0) {

          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('updated visit data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('create visit data', data);
          });
        }
      });
    }
  }


  saveOrderObData(ob: any, order: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value)
          ob.valueList.push(value.text)
      }
    }

    this.allService.datasService.getDatasByFilter2({ patientID: this.patient._id, orderID: order._id, obID: ob._id }).then((obData: any) => {
      this.temp = obData;
      console.log('obData', obData);
      let params: any = {
        orderID: order._id,
        patientID: this.patient._id,
        patientEmail: this.patient.email,
        visitID: this.visit._id,
        obID: ob._id,
        obName: ob.name,
        obType: ob.type,
        value: ob.value,
        values: ob.valueList
      };
      if (this.temp.length > 0) {

        ob.dataID = this.temp[0]._id;
        params._id = ob.dataID;
        this.allService.datasService.update(params).then((data: any) => {
          console.log('updated data', data);
        });
      } else if ((ob.values && ob.values.length > 0) || ob.value) {
        this.allService.datasService.create(params).then((data: any) => {
          console.log('created data', data);
        });
      }
    });
  }


  saveProblemObData(ob: any, obSet: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value)
          ob.valueList.push(value.text)
      }
    }

    // problemID is equvelant to problemItemID
    this.allService.datasService.getDatasByFilter2
      ({ patientID: this.patient._id, problemItemID: obSet._id, obID: ob._id, familyMember: 'self' }).then((obData: any) => {
        this.temp = obData;
        console.log('obData', obData);
        let params: any = {
          patientID: this.patient._id,
          problemItemID: obSet._id,
          familyMember: 'self',
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length > 0) {

          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('updated data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('created data', data);
          });
        }
      });
  }


  saveMedicationObData(ob: any, obSet: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value)
          ob.valueList.push(value.text)
      }
    }

    // problemID is equvelant to problemItemID
    this.allService.datasService.getDatasByFilter2
      ({ patientID: this.patient._id, problemItemID: obSet._id, obID: ob._id }).then((obData: any) => {
        this.temp = obData;
        console.log('obData', obData);
        let params: any = {
          patientID: this.patient._id,
          medicationItemID: obSet._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }
        if (this.temp.length > 0) {

          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('updated med data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('created meds data', data);
          });
        }
      });
  }


  saveAfterClose(ob: any, obSet: any, form: any) {
    if (ob.values//&&form.formType!='profile registry'
      && form.formType != 'user'
      && form.formType != 'schedule') {

      for (let value of ob.values) {

        if (value) {
          if (value.problems && value.problems.length > 0) {
            //find out  if value is family member 
            if (value.comments == 'family') {
              var familyMember = value.text;
            }
            else
              familyMember = 'self'

            for (let problem of value.problems) {

              this.allService.problemService.getProblemByFilter
                ({ patientID: this.patient._id, problemItemID: problem._id, familyMember: familyMember }).then((data: any) => {

                  this.temp = data;
                  if (this.temp.length == 0) {
                    this.allService.problemService.create({
                      patientID: this.patient._id,
                      problemItemID: problem._id,
                      familyMember: familyMember,
                      name: problem.name
                    }).then((data: any) => {
                      console.log('problem created', data)
                    })
                  }
                })
            }
          }
          if (value.medications && value.medications.length > 0) {

            for (let medication of value.medications) {

              this.allService.medsService.getMedsByFilter
                ({ patientID: this.patient._id, medicationItemID: medication._id }).then((data: any) => {

                  this.temp = data;
                  if (this.temp.length == 0) {
                    this.allService.medsService.create({
                      patientID: this.patient._id,
                      medicationItemID: medication._id,
                      name: medication.name
                    }).then((data: any) => {
                      console.log('medication created', data)
                    })

                  } else {
                    console.log('medication exists', data)
                  }
                })
            }
          }
        }
      }

      //save values/value into database, save problem and medication history into database
      //    if ((ob.values&&ob.values.length>0)||ob.value){
      var valueList = [];
      for (let value of ob.values) {
        if (value) {
          valueList.push(value.text)
        }

      }
      ob.valueList = valueList;
      if (ob.value || (ob.values && ob.values.length > 0)) {
        if (obSet.field == 'problem')
          this.saveProblemObData(ob, obSet)
        else if (obSet.filed == 'medication')
          this.saveMedicationObData(ob, obSet)
        else if (form.formType == 'order info') {
          this.saveOrderObData(ob, this.order)
        } else {
          this.saveObData(ob)
        }
      }
    }
  }


  getUrl(item: any) {
    // console.log ('service photo', this.photo)
    if (item)
      return this.allService.utilService.getImageUrl(String(item.photo));
    else
      return null;
  }

  findProviders(profile: any) {
    console.log('got profile==========', profile)
    if (profile) {
      this.allService.usersService.getByFilter({ 'profiles': { '$elemMatch': { '_id': profile._id } }, 'role': 'provider' }).then((data: any) => {

        this.temp = data;
        this.providers = [];
        this.providers = this.temp;
        console.log('providers======', this.providers)
      })
    }
  }


  getOb(ob: any, obSet: any, form: any) {

    var index = obSet.obs.indexOf(ob);
    var setIndex = form.obSets.indexOf(obSet)

    if (!this.emBed) {
      if (!form.visitRecord) {
        form.visitRecord = '';
      }
      if (!obSet.addsIn || this.showObSet(obSet, form)) {
        if (!ob.addsIn || ob.show) {

          const dialogConfig = new MatDialogConfig();

          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          // this.bigScreen = this.storage.get('bigScreen')
          dialogConfig.data = {
            ob: ob,
            obSet: obSet,
            obSets: form.obSets,
            registryUser: this.registryUser,
            visit: this.visit,
            order: this.order,
            form: form,
            patient: this.patient,
            profile: this.profile,
            source: this.source,
            procedureDate: this.procedureDate,
            visitDate: this.visitDate,
            language: this.language,
            bigScreen: this.bigScreen,
            viewOnly: this.viewOnly
          };

          if (this.bigScreen == 0) {
            dialogConfig.maxWidth = '92vw',
          dialogConfig.maxHeight = '95vh',
          dialogConfig.height = '92%',
          dialogConfig.width = '95%'

          }

          const dialogRef = this.dialog.open(ObComponent,
            dialogConfig);

          dialogRef.afterClosed().subscribe((result: any) => {

            if (result) {

              ob = result;

              if (ob.type == 'image')
                ob.url = this.allService.utilService.getImageUrl(String(ob.value));
              else if (ob.type == 'calculation' && ob.value) {
                this.messageEvent.emit('submit')
              }
              if (result.next == true) {
                console.log('index', index)
                console.log('obSet.obs.length', obSet.obs.length)
                if (index < obSet.obs.length - 1) {
                  index++;
                  ob = obSet.obs[index];
                  this.getOb(ob, obSet, form);
                } else if (index == obSet.obs.length - 1) {

                  index = 0;
                  setIndex++;
                  console.log('setIndex', setIndex)
                  if (setIndex < form.obSets.length) {
                    obSet = form.obSets[setIndex];
                    ob = obSet.obs[0];
                    console.log('next ob', ob)
                    this.getOb(ob, obSet, form);
                  }
                }
              } else if (result.expert == true) {
                this.messageEvent.emit('expert')
              }
            }
          });
        } else if (ob.addsIn && !ob.show) {
          if (index < obSet.obs.length - 1) {
            index++;
            ob = obSet.obs[index];
            this.getOb(ob, obSet, form);
          } else if (index == obSet.obs.length - 1) {
            index = 0;
            setIndex++;
            if (setIndex < form.obSets.length) {
              obSet = form.obSets[setIndex];
              ob = obSet.obs[0];
              this.getOb(ob, obSet, form);
            }
          }
        }
      } else if (obSet.addsIn && !this.showObSet(obSet, form)) {
        index = 0;
        setIndex++;
        console.log('setIndex', setIndex)
        if (setIndex < form.obSets.length) {
          obSet = form.obSets[setIndex];
          ob = obSet.obs[0];
          console.log('next ob', ob)
          this.getOb(ob, obSet, form);
        }
      }
    }
  }


  getObSet(obSet: any, form: any) {

    var setIndex = form.obSets.indexOf(obSet)

    if (!this.emBed) {
      if (!form.visitRecord) {
        form.visitRecord = '';
      }
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // this.bigScreen = this.storage.get('bigScreen')
      dialogConfig.data = {
        obSet: obSet,
        registryUser: this.registryUser,
        visit: this.visit,
        order: this.order,
        form: form,
        forms: this.forms,
        patient: this.patient,
        profile: this.profile,
        source: this.source,
        procedureDate: this.procedureDate,
        visitDate: this.visitDate,
        language: this.language,
        bigScreen: this.bigScreen,
        registry: this.registry,
        popOut: true
      };

      if (this.bigScreen == 0) {
        dialogConfig.maxWidth = '92vw',
          dialogConfig.maxHeight = '95vh',
          dialogConfig.height = '92%',
          dialogConfig.width = '95%'

      } else if (this.bigScreen == 1) {
        dialogConfig.maxWidth = '70vw',
          dialogConfig.maxHeight = '80vh',
          dialogConfig.height = '80%',
          dialogConfig.width = '70%'

      }

      const dialogRef = this.dialog.open(ObSetComponent,
        dialogConfig);
      dialogRef.afterClosed().subscribe((result: { index: string | number; end: any; }) => {
        this.popOut = false;
        this.messageEvent.emit('popOut')
        if (result) {
          console.log('form after change=====================', form)
          if (result.index) {
            this.getObSet(form.obSets[result.index], form)
          }
          if (result.end) {
            var myDiv = document.getElementById('result');
            console.log('myDiv obSet=================', myDiv)
            if (myDiv)
              myDiv.scrollIntoView(false);
          }
        }
      }, (err: any) => {
        console.log(err);
      });
    }
  }


  hasResult() {
    if (this.forms) {
      for (let form of this.forms) {
        if (form.obSets && form.obSets.length > 0) {
          for (let obSet of form.obSets) {
            if (obSet.values) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }


  geMappingObValue(ob: any, obSet: any) {
    for (let obItem of obSet.obs) {
      if (ob.mappingOb._id == obItem._id) {
        if (this.visitDate - this.procedureDate <= obItem.frameDays + obItem.searchDays
          && this.visitDate - this.procedureDate >= obItem.frameDays - obItem.searchDays)
          obItem.value = ob.value;
        obItem.values = [];
        if (ob.values && ob.values.length > 0) {
          obItem.values = ob.values;
        } else {

          for (let option of obItem.options) {
            if (obItem.value >= option.form && obItem.value < option.to) {
              obItem.values = [option];
            }
          }
        }
      }
    }
  }


  addObSet(obSet: any, form: any) {

    // add by duplication first
    const index2 = this.forms.indexOf(form);
    var newObSet: any;
    newObSet = {
      _id: obSet._id,
      name: obSet.name,
      obs: [],
      field: obSet.field,
      show: obSet.show,
      addMoreThanOnce: obSet.addMoreThanOnce
    };

    for (let ob of obSet.obs) {
      console.log(' ob', ob)
      let temp = {
        _id: ob._id,
        name: ob.name,
        show: ob.show,

        type: ob.type,

      };
      newObSet.obs.push(temp);
    }

    newObSet.added = true;

    console.log('newObSet', newObSet);

    const index1 = form.obSets.indexOf(obSet)
    form.obSets.splice(index1 + 1, 0, newObSet);
  }

  save() {
    console.log('this.forms', this.forms);
    this.dialogRef.close(this.forms);
  }

  showTab(obSet: any, form: any) {
    this.startTab = false;
    for (let obSetItem of form.obSets) {
      obSetItem.show = false;
    }
    obSet.show = true;
  }


  submit(result: any) {
    //  console.log ('this.submitProfileForm',this.submitProfileForm.observers.length)
    //  console.log ('this.submitScreeningForm',this.submitScreeningForm.observers.length)
    if (this.submitProfileForm.observers.length > 0)
      this.submitProfileForm.emit(result);

    if (this.submitScreeningForm.observers.length > 0)
      this.submitScreeningForm.emit(result);


    if (this.submitUserRegistryForm.observers.length > 0)
      this.submitUserRegistryForm.emit(result);
  }


  close() {
    this.dialogRef.close();
  }
}