import {
  Component, OnInit, Inject, Input, Output, OnChanges, EventEmitter, HostListener,
  ViewChild, ElementRef
} from '@angular/core';

import { ObComponent } from '../ob/ob.component';
//import { MessageBoxComponent } from '../message-box/message-box.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { AllServices } from 'src/app/core/common-services';

@Component({
  selector: 'app-ob-set',
  templateUrl: './ob-set.component.html',
  styleUrls: ['./ob-set.component.scss'],
  animations: [
    trigger('visibilityChanged',
      [
        state('left', style({ transform: 'translateY(1000px)' })),
        state('center', style({ transform: 'translateY(0px)' })),
        state('right', style({ transform: 'translateY(-1000px)' })),
        transition('left => center', animate('500ms ease-in-out')),
        transition('center => right', animate('500ms ease-in-out')),
        transition('right => left', animate('500ms ease-in-out')),
      ])
  ]
})
export class ObSetComponent implements OnInit, OnChanges {
  @ViewChild('obSetElem')
  obSetElem!: ElementRef;
  formType: any;
  @Input() form: any;
  id: any;
  @Input() ids: any;
  @Input() language: any;
  @Input() emBed: any;
  @Input() registry: any;
  obSets: any;
  obSetTemp: any;
  obTemp: any;
  name: any;
  currentState: any;
  temp: any;
  user: any;
  tempId: any;
  visitId: any;
  @Input() profile: any;
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
  test: any;
  set: any;
  changed: any;
  changeObs: any;
  missingCount: any;
  @Input() obSet: any;
  @Input() patient: any;
  nextSet: any;
  negative: any;
  currentOb: any;
  @Input() popOut: any;
  @Input() registryUser: any;
  @Input() source: any;

  @Input() forms: any;
  @Input() obs: any;
  @Input() editUser: any;
  @Input() addPatient: any;
  @Input() service: any;
  @Input() visit: any;
  @Input() formResource: any;
  @Input() emBedSet: any;
  @Input() medication: any;
  @Input() problem: any;
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
    private dialogRef: MatDialogRef<ObSetComponent>,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.user = this.storage.get('user')
    if (!this.color)
      this.color = this.storage.get('color')
    this.bigScreen = this.storage.get('bigScreen');
    this.screenSize = this.storage.get('screenSize');
    this.language = this.storage.get('language');
    console.log('data', data)
    if (data.form)
      this.form = data.form;
    if (data.forms)
      this.forms = data.forms;
    if (data.obSet)
      this.obSet = data.obSet;
    console.log('this.obSet', this.obSet)
    if (data.registryUser)
      this.registryUser = data.registryUser
    if (data.visit)
      this.visit = data.visit
    if (data.order)
      this.order = data.order
    if (data.patient)
      this.patient = data.patient
    if (data.profile)
      this.profile = data.profile
    if (data.source)
      this.source = data.source
    if (data.procedureDate)
      this.procedureDate = data.procedureDate
    if (data.visitDate)
      this.visitDate = data.visitDate
    if (data.registry)
      this.registry = data.registry;
    console.log('form', this.form)
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
    this.setUp();
  }


  ngOnChanges() {
    this.setUp();
  }


  setUp() {
    //if (!this.screenSize)
    this.currentOb = 0;
    this.set = this.obSet._id;
    // this.getScreenSize();
    this.startTab = true;
    console.log('this.emBed', this.emBed)
    this.getNext(this.obSet);
    this.obSet.registry = this.registry;
    this.showCh = true;
    this.getSetValue();
    if (this.photo) {
      this.photo = this.allService.utilService.getImageUrl(String(this.photo));
    }

    if (this.forms) {
      for (let form of this.forms) {
         if (form.obSets&&form.obSets.length>0){
          form.selectedObSet = form.obSets[0];
         }
       
      }

      if (this.popOut && (this.forms[0].formType == 'followup' || this.forms[0].formType == 'profile registry')) {
        setTimeout(() => {

          this.getOb(this.forms[0].obSets[0].obs[0], this.forms[0].obSets[0], this.forms[0]);
        }, 100);
      }
    }
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


  showSet() {
    if (this.form && this.form.obSets) {
      if (this.obSet) {
        if (this.form.obSets.indexOf(this.obSet) < this.form.obSets.length - 1) {
          if (this.nextSet) {
            return true;
          }
        }
        else if (this.form.obSets.indexOf(this.obSet) == this.form.obSets.length - 1) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }


  getSetValue() {
    if (this.obSet.obs) {
      for (let ob of this.obSet.obs) {
        if (ob.type == 'calculation') {
          if (ob.value) {
            this.obSet.value = ob.value
          }
          if (ob.values) {
            this.obSet.values = ob.values
          }

        }
      }
    }
  }

  setChanged() {
    var result = false;
    for (let ob of this.obSet.obs) {
      if (ob.changed) {
        this.obSet.changed = true;
        result = true;
      }

    }
    this.obSet.changed = false;
    // if (result==true)
    // alert(result)
    return result;
  }


  getNegative() {
    this.negative = true;
    for (let ob of this.obSet.obs) {
      ob.changed = true;
      ob.values = [ob.options[0]];
    }
  }


  cancelNegative() {
    this.negative = false;
    for (let ob of this.obSet.obs) {
      ob.changed = true;
      ob.values = [];
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
      // ob.image=URL+'photo-'+String(ob.image)+'.png';

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
        };
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
            bigScreen: this.bigScreen
          };

          if (this.bigScreen == 0) {
            dialogConfig.maxWidth = '100vw',
              dialogConfig.maxHeight = '100vh',
              dialogConfig.height = '100%',
              dialogConfig.width = '100%'
          }

          const dialogRef = this.dialog.open(ObComponent,
            dialogConfig);

          dialogRef.afterClosed().subscribe((result: { next: boolean; }) => {

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

  getObSet(obSet: any) {
    console.log('obSet', obSet)
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { obSet: obSet, visit: this.visit, patient: this.patient };

    const dialogRef = this.dialog.open(ObComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('data', result)
        obSet = result;
      }
    });
  }

  missing() {
    this.missingCount = 0;
    // console.log('this.obSet========', this.obSet)
    for (let ob of this.obSet.obs) {
      if (ob.required) {
        // console.log('ob==========', ob)
        if (ob.options && ob.options.length > 0) {
          if (!ob.values || ob.values.length == 0) {
            ob.missing = true;
            this.missingCount++;
          }

        } else {
          if (!ob.value) {
            ob.missing = true;
            this.missingCount++;
          }
        }
      }
    }
  }


  follow() {
    window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MTYyODQ3MQ==#wechat_redirect"
  }


  save() {
    this.missing();
    // alert('missing'+this.missingCount)
    if (this.missingCount == 0) {
      if (this.patient) {
        this.loading = true;

        this.allService.formService.bulkSaveObSet(this.obSet, this.patient, this.visit, this.order, this.obSet.changeObs).then((data: any) => {
          this.loading = false;
          this.changed = false;
          if (this.form.formType == 'general registry') {
            this.loading = true
            
            this.allService.formService.updatePatientRegistry(this.obSet, this.patient, this.obSet.changeObs).then((data: any) => {
              this.loading = false;
            })
          }
          if (!this.emBedSet)
            // this.close();
            this.dialogRef.close(this.obSet);
        })
      } else {
        this.dialogRef.close(this.obSet);
      }
    }
  }


  saveAndNext() {
    if (this.changed && this.patient) {
      // alert('got here')
      this.loading = true;
      this.allService.formService.bulkSaveObSet(this.obSet, this.patient, this.visit, this.order, this.obSet.changeObs).then((data: any) => {
        this.loading = false;
        this.next();
      })
    } else {
      this.next();
    }
  }

  next2() {
    console.log('this.form', this.form)
    for (let obSet of this.form.obSets) {
      if (this.obSet._id == obSet._id) {
        var index = this.form.obSets.indexOf(obSet);
      }
    }
    if (index + 1 <= this.form.obSets.length) {

      //  this.getNext(this.obSet);
      this.obSet = this.form.obSets[index + 1];
      // this.obSet=this.nextSet;
      this.getNext(this.obSet);

    }
    console.log('this.obSet', this.obSet)
    //  this.dialogRef.close();
  }

  next() {
    this.getNext(this.obSet);

    this.obSet = this.nextSet;
    this.set = this.obSet._id;
    this.getNext(this.obSet);
    this.scrollToTop();
    //var myDiv = document.getElementById(this.set).children[0];
    //if (myDiv)
    //myDiv.scrollIntoView(false);
  }


  showObSet(obSet: any, form: any) {
    if (!obSet.addsIn) {
      return true;
    }

    for (let obSetItem of form.obSets) {

      if (!obSetItem.obs)
        obSetItem.obs = [];
      for (let obItem of obSetItem.obs) {
        if (obItem.values && obItem.values.length > 0) {
          for (let value of obItem.values) {
            if (value && value.items) {
              for (let item of value.items) {
                if (item._id == obSet._id) {

                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }


  getNext(set: any) {
    console.log ('form=============1', this.form)
    if (this.form && this.form.obSets) {
      console.log ('form=============2', this.form)
      for (let obSet of this.form.obSets) {
        if (set._id == obSet._id) {
          console.log('index-1', index)

          var index = this.form.obSets.indexOf(obSet);
          index++;
          console.log('index-2', index)
          if (index < this.form.obSets.length) {
            console.log('next set', this.form.obSets[index])
            if (this.showObSet(this.form.obSets[index], this.form)) {
              this.nextSet = this.form.obSets[index];
              console.log('this.nextSet', this.nextSet)
            } else {
              this.getNext(this.form.obSets[index])
            }

          } else {
            this.nextSet = null;
          }
        }
      }
    }
  }


  changeCenter() {
    //   alert('this.currentState---1'+this.currentState)
    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'left')
      this.currentState = 'center'
    //  alert('this.currentState---2'+this.currentState)

  }


  changeRight() {
    // alert('this.currentState---1'+this.currentState)
    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'center') {
      this.currentState = 'right';
      this.currentState = 'left';
    }
    //  alert('this.currentState---2'+this.currentState)
  }


  changeLeft() {
    // alert('this.currentState---1'+this.currentState)

    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'right') {
      this.currentState = 'left';
    }
    //  alert('this.currentState---2'+this.currentState)
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
    console.log('this.obSets at close=================', this.form.obSets)
    this.dialogRef.close({ end: true });
  }

  receiveOb($event: any) {
    if ($event) {
      this.currentOb = $event;
      this.changed = true;
      //alert('this.currentOb'+this.currentOb.label.ch)
    }
  }


  getEducation() {

    var obIDs = [];
    var educationObs = [];
    for (let ob of this.obSet.desc.educationObs) {
      obIDs.push(ob._id)
    }
    this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': obIDs } }).then((data: any) => {
      this.temp = data;
      educationObs = this.temp;
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = {
        'message': this.obSet.label.ch,
        'educationObs': educationObs,
        'patient': this.patient,
        'color': 'blue'
      };
      // this.bigScreen = this.storage.get('bigScreen')
      // if (this.bigScreen==0){
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '100vh',
        dialogConfig.height = '100%',
        dialogConfig.width = '100%'
      //}
      // dialogConfig.position={top: '5%', left:'60%'};
     // const dialogRef = this.dialog.open(MessageBoxComponent,
     //   dialogConfig);
      //  window.print();
    })
  }


  goToNext() {
    this.dialogRef.close({ index: this.obSet.index + 1 })
  }


  receiveMessage($event: any) {
   
    this.changed = true;
    if ($event >= 200) {
      this.currentOb = $event;
      console.log('index now======', this.currentOb - 200)

    } else if ($event == 'add form') {
      // alert($event)
      // this.messageEvent.emit(this.obSet.index+1)
      this.dialogRef.close({ index: this.obSet.index + 1 })
      //   this.nextSet=this.form.obSets[this.obSet.index+1];
      //  console.log ('this.obSet',this.obSet)
      //  if (this.obSet)
      //  this.getNext(this.obSet);
    } else if ($event < this.obSet.obs.length) {
      this.changed = true;
      if (this.obSet._id) {
        var myDiv = this.obSetElem.nativeElement.children[$event];
        console.log ('myDiv', myDiv)
        if (myDiv)
          myDiv.scrollIntoView(false);
      }
    }
  }


  breakLines(str: any) {
    var temp = [];
    //temp=str.match(/\n/g);
    temp = str.split(/\n/g);
    // console.log('temp===========',temp)
    // temp=str.split('/n');
    return temp;
  }
}