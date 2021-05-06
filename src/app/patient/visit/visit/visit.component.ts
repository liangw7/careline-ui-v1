import { Component, OnInit, OnChanges, Inject, Input, HostListener, AfterViewInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AllServices } from '../../../core/common-services';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageBoxComponent } from '../../../core/common-components/message-box/message-box.component';
import { AllergyComponent } from '../../allergy/allergy.component';
import { OrderComposeComponent } from '../order-compose/order-compose.component';

@Component({
  selector: 'visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit, AfterViewInit {
  temp: any;
  screening: any;
  allergy: any;
  formId: any;
  allergyFormId: any;
  screeningFormId: any;
  problemFormId: any;
  problemFormIds: any;
  problemForms: any;
  orderList: any;
  pathwayFormId: any;
  patient: any;
  provider: any;
  problemId: any;
  activities: any;
  visit_activities: any;
  visit: any;
  diseaseManagement: any;
  screeningProblem: any;
  allergyProblem: any;
  mode: any;
  temp_activity: any;
  pathway: any;
  followUps: any;
  followUp: any;
  problems: any;
  orders: any;
  labs: any;
  images: any;
  profile: any;
  visitPathways: any;
  visitProblems: any;
  tem: any;
  ids: any;
  forms: any;
  hasData: any;
  labForm: any;
  order: any;
  profileId: any;
  formIds: any;
  form: any;
  name: any;
  obSets: any;
  obSetTemp: any;
  obTemp: any;
  screeningFormIds: any;
  screeningForms: any;
  pathwayForms: any;
  formRecource: any;
  resourceProfile: any;
  resourceScreening: any;
  resourceProblem: any;
  resourcePathway: any;
  note: any;
  screeningForm: any;
  screeningObSets: any;
  profiles: any;
  consults: any;
  //orderID: any;
  callIndex: any;
  user: any;
  color: any;
  currentHistory: any;
  evaluation: any;
  treatment: any;
  diagnosis: any;
  visitSummary: any;
  recList: any;
  selectedIndex: any;
  change: any;
  screeningChange: any;
  noteChange: any;
  filter: any;
  familyMemberList: any;
  loading: any;
  current: any;
  lab: any;
  image: any;
  healthHistory: any;
  medicationHistory: any;
  historyPatient: any;
  labPatient: any;
  printPatient: any;
  medicationPatient: any;
  problemPatient: any;
  visitDate: any;
  selectedForm: any;
  orderView: any;
  recView: any;
  index: any;
  screeningList: any;
  language: any;
  procedureDate: any;
  record: any;
  visitRecord: any;
  labSets: any;
  medications: any;
  bigScreen: any;
  formType: any;
  orderTypes: any;
  status: any;
  missing: any;
  message: any;
  imagePatient: any;
  medsPatient: any;


  constructor(
    public allServices: AllServices,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<VisitComponent>,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.user = this.storage.get('user')
    if (this.user.role == 'patient')
      this.patient = this.storage.get('patient');
    this.bigScreen = this.storage.get('bigScreen');
    this.language = data.language;
    // this.storage.set('patient', this.patient);
    //this.patient =  this.storage.get('patient');
    console.log('this.patient', this.patient)
    this.provider = data.provider;
    if (!this.patient)
      this.patient = data.patient;
    this.visit = data.visit;
    //  this.profileId=this.visit.profile._id;
    this.profiles = this.patient.profiles;
    this.resourceProfile = 'profile'
    this.resourceScreening = 'screening'
    this.resourceProblem = 'problem'
    this.resourcePathway = 'pathway'
    this.color = this.storage.get('color')
    this.user = this.storage.get('user')
    this.status = 'active'
    //   this.initScreening();
    // get allergy form
    /*this.allServices.ordersService.getByFilter({patientID:this.patient._id}).then((data) => {
         this.temp=data;
         this.orders= this.temp;;
         console.log ('orders',this.orders)
         this.consults=[];
         for (let order of this.orders){
           if (order.orderType=='consult')
             this.consults.push(order);
         }
   }, (err) => {
       console.log("not allowed");
   });
   
   this.labService.getByVisit(this.visit._id).then((data) => {
   
     this.labs= data;
   
    
   }, (err) => {
   console.log("not allowed");
   });
   
   this.imageService.getByVisit(this.visit._id).then((data) => {
   
     this.images= data;
   
    
   }, (err) => {
   console.log("not allowed");
   });*/

    //get order types
    this.orderTypes = [];
    this.allServices.categoryService.getCategoriesByFilter({ 'label.en': 'order type' }).then((data) => {
      this.temp = data;
      if (this.temp.length > 0) {
        for (let option of this.temp[0].options) {
          this.orderTypes.push(option);
        }
      }
    })
  }


  ngAfterViewInit() {
    //  this.loading=false;
  }


  stopLoading(event: any) {
    //   this.loading=false;
  }
  //   {


  ngOnInit() {
    this.familyMemberList = [];
    this.currentHistory = true;
    this.evaluation = false;
    this.treatment = false;
    this.visitSummary = false;
    this.diagnosis = false;
    this.orderView = false; this.recView = true;
    this.current = true;
    this.callIndex = 0;
    this.recList = [];
    this.screeningList = [];
    this.getFormType();
    //get note ready!!!
    this.initNote();
    /* this.allServices.categoryService.getCategory('5cb9e911cc096e2e750a7e3f').then((data)=>{
       this.temp=data;
       this.familyMemberList=this.temp.options;
     })*/
    this.allServices.usersService.findUserById(this.patient._id).then((data) => {
      this.temp = data;
      this.patient = this.temp;
    })
  }


  closeForm() {
    this.dialogRef.close();
    /*  this.loading=true;
        this.visit.modifiedBy={_id:this.user._id, name:this.user.name,title:this.user.title }
        console.log ('visit', this.visit)
         this.allServices.visitsService.Update(this.visit).then((data)=>{
           this.loading=false;
           console.log ('visit updated!')
          
         })
*/
    // this.allServices.visitsService.Update(this.visit).then((data)=>{
    //  
    // })
  }


  selectionChange(event: any) {
    // Get the selected tab
    let selectedTab = event.selectedStep.label;
    //alert(selectedTab )
    if (selectedTab == '临床决策') {
      this.getEval();
    } else if (selectedTab == '医嘱') {
      this.getMedicationOrder();

    } else if (selectedTab == '就诊报告') {
      this.printPatient = this.patient;
      this.message = this.visit.profiles[0].label.ch + '就诊报告';
    }
  }


  getLabel(form: any) {
    if (this.language == 'Chinese') {
      return form.label.ch;
    } else if (this.language == 'English') {
      return form.label.en;
    }
  }


  onFormChanged($event: any) {
  }


  orderSelectionChanged(event: any) {
    let selectedTab = event.tab;
    for (let orderType of this.orderTypes) {
      if (orderType.enText == selectedTab.textLabel) {
        this.allServices.ordersService.getByFilter({ type: orderType.text, patientID: this.patient._id }).then((data) => {
          this.temp = data;
          this.orders = this.temp;
        })
      }
    }
  }


  getMedicationOrder() {
    this.allServices.ordersService.getByFilter({ type: 'medication', patientID: this.patient._id }).then((data) => {
      this.temp = data;
      this.orders = this.temp;
      console.log(' this.orders', this.orders)
    })
  }


  discontinue(order: any) {
    order.status = 'discontinued'
    this.allServices.ordersService.update(order);
  }


  complete(order: any) {
    order.status = 'completed'
    this.allServices.ordersService.update(order);
  }


  delete(order: any) {
    this.allServices.ordersService.delete(order._id).then((data) => {
      for (let orderItem of this.orders) {
        if (order._id == orderItem._id) {
          var index = this.orders.indexOf(orderItem);
          this.orders.splice(index, 1)
        }
      }
    })
  }


  print() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    console.log('this.visit.profiles', this.visit.profiles)
    dialogConfig.data = {
      'message': this.visit.profiles[0].label.ch + '就诊报告',
      'forms': this.forms,
      'visit': this.visit,
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
    const dialogRef = this.dialog.open(MessageBoxComponent,
      dialogConfig);
    //  window.print();
  }


  getRecord() {
    this.visitRecord = '现病史/体检:';
    for (let form of this.forms) {
      for (let obSet of form.obSets) {
        this.visitRecord = this.visitRecord + '\n' + obSet.label.ch
        for (let ob of obSet.obs) {
          var result = this.recordOb(ob);
          this.visitRecord = this.visitRecord + result;
        }
      }
    }
    //get order order
    this.allServices.ordersService.getByFilter({ visitID: this.visit._id }).then((data) => {
      this.temp = data;
      this.orders = this.temp;
      console.log('orders', this.orders)
      this.visitRecord = this.visitRecord + '\n' + '\n' + '医嘱:' + '\n';
      for (let order of this.orders) {
        if (!order.label)
          order.label = { ch: order.desc }
        this.visitRecord = this.visitRecord + order.label.ch;
        if (order.infor) {
          for (let obSet of order.infor.obSets) {
            for (let ob of obSet.obs) {
              this.visitRecord = this.visitRecord + this.recordOb(ob);
            }
          }
        }
        this.visitRecord = this.visitRecord + '\n';
      }
    })
    //get lab result
    this.allServices.usersService.getlabItems({ patientID: this.patient._id }).then((data) => {
      this.temp = data;
      this.labSets = this.temp;
      this.loading = false;
      console.log('labs', this.labSets)
      this.visitRecord = this.visitRecord + '\n' + '\n' + '实验结果:' + '\n'
      for (let labSet of this.labSets) {
        for (let lab of labSet.labs) {
          if (lab.timeStamps.length > 0) {
            this.visitRecord = this.visitRecord + lab.label.ch + ': ';

            for (let time of lab.timeStamps) {
              var index = lab.timeStamps.indexOf(time);
              var labTime = new Date(time);
              var year = labTime.getFullYear();
              var month = labTime.getMonth();
              var date = labTime.getDate();
              this.visitRecord = this.visitRecord + ' ' + year + '/' + month + '/' + date + ': ' + lab.valueSet[index];
            }
            this.visitRecord = this.visitRecord + '\n';
          }
        }
      }
    })
    //GET problem history
    this.allServices.problemService.getPatientProblems({ patientID: this.patient._id }).then((data) => {
      //  this.problemService.getProblemByFilter({patientID:this.patient._id}).then((data)=>{
      console.log('problems', data)
      this.problems = data;
      var medicalProblems = '内科病史:';
      var surgicalProblems = '\n' + '外科史:';
      var socialProblems = '\n' + '社会史:';
      var familyProblems = '\n' + '家庭史:';
      for (let problem of this.problems) {
        if (problem.familyMember == 'self' || problem.familyMembers == undefined) {
          if (problem.problemType == 'medical') {
            medicalProblems = medicalProblems + problem.label.ch + ', ';
            for (let ob of problem.obs) {
              medicalProblems = medicalProblems + this.recordOb(ob);
            }
          } else if (problem.problemType == 'surgical') {
            surgicalProblems = surgicalProblems + problem.label.ch + ', ';
            for (let ob of problem.obs) {
              surgicalProblems = surgicalProblems + this.recordOb(ob);
            }
          } else if (problem.problemType == 'social') {

            socialProblems = socialProblems + problem.label.ch + ', ';
            for (let ob of problem.obs) {
              socialProblems = socialProblems + this.recordOb(ob);
            }
          }
        } else {
          familyProblems = familyProblems + problem.label.ch + ': ';
          for (let member of problem.familyMembers) {
            familyProblems = familyProblems + member.ch + ', '
          }
          familyProblems = familyProblems + '; ';
        }
      }
      this.visitRecord = this.visitRecord + '\n' + '\n';
      this.visitRecord = this.visitRecord + '病史:' + '\n';
      this.visitRecord = this.visitRecord + medicalProblems;
      this.visitRecord = this.visitRecord + surgicalProblems;
      this.visitRecord = this.visitRecord + socialProblems;
      this.visitRecord = this.visitRecord + familyProblems;
    })
    //get medication history
    this.allServices.medsService.getPatientMedications({ patientID: this.patient._id }).then((data) => {
      console.log('medications', data)
      this.medications = data;
      this.visitRecord = this.visitRecord + '\n' + '\n';
      this.visitRecord = this.visitRecord + '用药史:' + '\n';
      for (let medication of this.medications) {
        this.visitRecord = this.visitRecord + medication.label.ch;
        for (let ob of medication.obs) {
          this.visitRecord = this.visitRecord + this.recordOb(ob);
        }
        this.visitRecord = this.visitRecord + '\n';
      }
    })
  }


  recordOb(ob: any) {
    var record = '';
    if (!ob.label)
      ob.label = { ch: ob.name }
    if (ob.value && ob.values)
      record = record + '. ' + ob.label.ch + ': ' + ob.value + ', ';
    else if (ob.values && !ob.value) {
      for (let value of ob.values) {
        if (value != null)
          record = record + '. ' + ob.label.ch + ': ' + value.text + ', ';
      }
    }
    else if (ob.value && ob.values) {
      record = record + '. ' + ob.label.ch + ': ' + ob.value + ', ';
      for (let value of ob.values) {
        if (value != null)
          record = record + ': ' + value.text + ', ';
      }
      record = record + '\n'
    }
    console.log('record-2', record)
    return record
  }


  updateVisit(value: any) {
    this.visit.visitDate = value;
    this.visit.profile = { _id: this.visit.profile._id, label: this.visit.profile.label, visitType: this.visit.profile.visitType }
    this.allServices.visitsService.update(this.visit).then((data) => {
      this.temp = data;
      this.visit = this.temp;
      console.log('visit date updated', this.temp);
      this.initNote();
    })

  }


  updatePatient(value: any) {
    this.procedureDate = value;
    for (let profile of this.patient.profiles) {
      if (profile._id == this.visit.profile._id) {
        profile.procedureDate = this.procedureDate;
      }
    }
    this.allServices.usersService.updateUser(this.patient).then((data) => {
      this.temp = data;
      this.patient = this.temp;
      console.log('patient updated', this.temp);
      this.initNote();

    })
  }


  findFamilyMember(value: any) {
    for (let familyMember of this.familyMemberList) {
      if (familyMember.text == value.text)
        return true;
    }
    return false;
  }


  initNote() {
    console.log('this.procedureDate', this.procedureDate)
    var formIDs = [];
    this.forms = [];
    var profileIDs = [];
    console.log('visit date', this.visit.visitDate);
    profileIDs = this.visit.desc.profileIDs;
    console.log('this.visit.desc.profileIDs', this.visit.desc.profileIDs)
    for (let profile of this.patient.profiles) {
      if (profileIDs.indexOf(profile._id) > -1) {
        this.allServices.categoryService.getCategory(profile._id).then((data) => {
          this.temp = data;
          console.log('profile', this.temp)
          profile.forms = [];
          profile.forms = this.temp.forms;
          profile.desc = this.temp.desc;
          var birthday = new Date(this.patient.birthday);
          var timeDiff = Math.abs(Date.now() - birthday.getTime());
          timeDiff = timeDiff / (1000 * 3600 * 24);
          console.log('timeDiff', timeDiff)

          for (let item of profile.forms) {
            console.log('formType ====', this.formType);
            console.log('item.formType====', item.formType);
            if (item.formType == this.formType) {
              console.log('formType ', this.formType);
              if (!this.find(item, this.forms)) {
                this.forms.push(item)
                item.selected = true;
                this.allServices.formService.getForm(item, this.patient, this.visit, null).then((data) => {
                  //for (let obSet of item.obSets){
                  //   this.getSetValue(obSet)
                  // }
                })
              }
            }
            // if (item.formType == 'lab') {
            //  if (!this.find(item, this.forms))
            //    this.forms.push(item);
            // }
          }
          if (profile.desc.ageOptions) {
            for (let option of profile.desc.ageOptions) {
              if (timeDiff >= option.from && timeDiff < option.to) {
                for (let form of option.forms) {
                  this.forms.push(form);
                }
              }
            }
          }
          console.log('this.forms', this.forms)
        })
      }
      //   }
      console.log('forms', this.forms)
      //  if (this.forms.length>0){
      //  this.forms[0].selected=true;
      //  this.getForm(this.forms[0]);
      //}
    }
    this.forms.push({ formType: 'lab', label: { ch: '实验室报告', en: 'lab' }, selected: true });
    // this.forms.push({ formType: 'problem', label: { ch: '健康史', en: 'problem' }, selected: true });
    //  this.forms.push({ formType: 'medication', label: { ch: '用药史', en: 'medication' }, selected: true });
    this.forms.push({ formType: 'image', label: { ch: '影像学报告', en: 'image' }, selected: true });
    this.forms.push({ formType: 'problem', label: { ch: '健康史', en: 'problem' }, selected: true });
    this.forms.push({ formType: 'medication', label: { ch: '用药史', en: 'medication' }, selected: true });
  }


  getProcedureDate(profile: any) {
    for (let patientProfile of this.patient.profiles) {
      if (profile._id == patientProfile._id) {
        return patientProfile.procedureDate;
      }
    }
  }


  getFormType() {
    if (this.visit.type == '注册' || this.visit.type == 'profile registry') {
      this.formType = 'profile registry'
    }
    else if (this.visit.type = '门诊' || this.visit.type == 'visit') {
      this.formType = 'visit'
    }
    else this.formType = this.visit.type;
  }


  getSetValue(obSet: any) {
    var infor = '';
    for (let ob of obSet.obs) {
      if (ob.type == 'calculation') {
        if (ob.value) {
          obSet.value = ob.value
        }
        if (ob.values) {
          obSet.values = ob.values;

        }
      }
    }
  }


  formChanged(form: any) {
    for (let formItem of this.forms) {
      // if (form.selected)
      //     this.save([form]);
      formItem.selected = false;
      if (form._id) {
        if (form._id == formItem._id) {
          formItem.selected = true;

        }
      } else if (form.formType == formItem.formType) {
        formItem.selected = true;
        if (form.formType == 'image') {
          this.imagePatient = this.patient;
        } else if (form.formType == 'problem') {
          this.problemPatient = this.patient;
        } else if (form.formType == 'medication') {
          this.medicationPatient = this.patient;
        }
        else if (form.formType == 'lab') {
          this.labPatient = this.patient;
        }
        // if (!formItem.obSets){
        //   console.log ('form got',form)
        //   this.getForm(formItem);
        // }
      }
    }
  }


  getForm(form: any) {
    return new Promise((resolve, reject) => {
      form.obSets = [];
      this.loading = true;
      var filter = {
        formIDs: [form._id],
        patientID: this.patient._id,
        visitID: this.visit._id,
        visitDate: this.visit.visitDate,
        procedureDate: form.procedureDate
      }
      this.loading = true;
      this.allServices.categoryService.getFormById(filter).then((data) => {
        this.temp = data;
        console.log('form', this.temp)
        this.loading = false;
        if (this.temp.length > 0) {
          form.obSets = this.temp[0].obSets;
          form.name = this.temp[0].name;
          form.label = this.temp[0].label;
          form.formType = this.temp[0].formType;
          form.formStyle = this.temp[0].formStyle;
          //   if (!this.find(form, this.forms)){
          //    this.forms.push(form)
          // }
          console.log('form', form)
          resolve(data);
          reject(new Error('error'));
        }
      })
    })
  }


  getScreening() {
    for (let form of this.forms) {
      if (form.selected)
        this.save([form])
    }
  }


  tabSelectionChanged(event: any) {
    // Get the selected tab
    let selectedTab = event.tab;
    this.forms = [];
    this.formIds = [];
    if (selectedTab.textLabel == this.visit.profile.name) {
      this.formRecource = 'profile'
    } else if (selectedTab.textLabel == '慢病筛查') {
      this.formRecource = 'screening'
    }
    console.log('this.formRecource', this.formRecource)
  }


  finditem(item: any, items: any) {
    for (let t of items) {
      if (t._id === item._id)
        return true;
    }
    return false;
  }


  findItem(item: any, obSet: any) {
    for (let ob of obSet.obs) {
      if (item._id == ob._id && ob.values) {
        item.values = [];
        item.values = ob.values;
      }
    }
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (item._id == i._id)
        return true;
    }
    return false;
  }


  selectAllOrders(value: any) {
    if (value.orders) {
      for (let order of value.orders) {
        this.checkOrder(order, value);
      }
    }
  }


  checkOrder(order: any, value: any) {
    console.log('value', value)
    //order.selected=!order.selected;
    if (order.valid == true || order.valid == false) {
      order.valid = undefined;
    } else if (order.valid == undefined) {
      this.loading = true;
      order.emBed = true;
      order.noTitle = true;
      order.patientAllergyList = [];
      order.patientStopList = [];
      order.readyList = [];
      order.patientConflictingProblems = [];
      order.patientConflictingOrders = [];
      order.patientDuplicationList = [];
      order.ConflictingList = [];
      this.allServices.orderItemsService.getOrder(order._id).then((data) => {
        this.temp = data;
        order.forms = this.temp.forms;
        order.orderType = this.temp.orderType;
        order.label = this.temp.label;
        order.allergyList = this.temp.allergyList;
        order.coOrders = this.temp.coOrders;
        order.conflictingOrders = this.temp.conflictingOrders;
        order.conflictingProblems = this.temp.conflictingProblems;
        order.educations = this.temp.educations;
        order.images = this.temp.images;
        order.items = this.temp.items;
        order.medsClass = this.temp.medsClass;
        order.medicationName = this.temp.medicationName;
        console.log('order', order)
        this.validateAllergy(order);
        this.validateRequiredItems(order);
        this.validateDuplications(order);
        this.validateDuplicationsFromList(order, value)
        this.validateConflictingProblems(order);
        this.validateConflictingOrders(order);
        this.validateConflictingOrdersFromList(order, value);
        setTimeout(() => {
          console.log('order.valid', order.valid)
          if (order.valid == false) {
            order.selected = false;
            this.loading = false;
          } else if (order.valid == true) {
            order.selected = true;
            var formIDs = [];
            for (let form of order.forms) {
              formIDs.push(form._id);
            }
            this.allServices.categoryService.getFormById({ formIDs: formIDs }).then((data) => {
              this.temp = data;
              order.forms = this.temp;
              console.log('order.forms-2', order.forms);
              this.loading = false;
            })
          }
        }, 300);
        console.log('order.selected', order.selected)
      })
      if (order.orderType == 'consult') {
        order.serviceList = [];
        this.allServices.usersService.getByFilter({ specialty: order.specialty }).then((data) => {
          this.temp = data;
          order.serviceList = this.temp;
        })
      }
    }
  }

  /* validateAllergy(order){
     if ( order.allergyList){
     for (let allergy of  order.allergyList){
       for (let allergyItem of this.patient.allergyList){
         if (allergy.name==allergyItem.name){
           order.patientAllergyList.push(allergy);
           order.valid=false;
           this.loading=false;
         }
       }
     }
     }
     if (order.valid==undefined){
       order.valid=true;
     }
   }*/


  validateAllergy(order: any) {
    if (this.patient.allergyList && this.patient.allergyList.length > 0) {
      for (let allergyItem of this.patient.allergyList) {
        if (order.medicationName == allergyItem.allergy) {
          order.patientAllergyList.push(allergyItem.allergy);
          order.valid = false;
          this.loading = false;
        }
      }
      if (order.valid == undefined) {
        order.valid = true;
      }
    }
  }


  validateRequiredItems(order: any) {
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
              order.valid = false;
              this.loading = false;
            } else {

              if (item.value) {
                for (let value of item.values) {

                  item.warning = value.warning;
                  item.stop = value.stop;
                  if (item.stop) {
                    order.patientStopList.push(item);
                    item.stopSign = '数据不支持'
                    order.valid = false;
                    this.loading = false;
                  }
                }
              } else if (item.values.length > 0) {
                for (let value of item.values) {
                  item.warning = value.warning;
                  item.stop = value.stop;
                  if (item.stop) {
                    order.patientStopList.push(item);
                    item.stopSign = '数据不支持'
                    order.valid = false;
                    this.loading = false;
                  }
                }
              }
            }
          }
        }
        if (order.valid == undefined) {
          order.valid = true;
        }
      })
    }
  }


  validateConflictingOrdersFromList(order: any, value: any) {
    if (order.conflictingOrders && order.conflictingOrders.length > 0) {
      for (let valueItem of this.recList) {
        for (let orderItem of valueItem.orders) {
          if (value.instruction != valueItem.instruction && orderItem.valid == true) {
            for (let conflictingOrder of order.conflictingOrders) {
              if (conflictingOrder._id == orderItem._id) {
                console.log('orderItem', orderItem)
                order.valid = false;
                order.ConflictingList.push(orderItem);
              }
            }
          }
        }
      }
      if (order.valid == undefined) {
        order.valid = true;
      }
      this.loading = false;
    }
  }


  validateDuplicationsFromList(order: any, value: any) {
    for (let valueItem of this.recList) {
      for (let orderItem of valueItem.orders) {
        if (value.instruction != valueItem.instruction
          && orderItem._id == order._id
          && orderItem.valid == true) {
          console.log('orderItem', orderItem)
          order.valid = false;
          order.readyList.push(orderItem);
        }
        if (
          orderItem.label.ch != order.label.ch
          && orderItem.valid == true
          && orderItem.medsClass
          && orderItem.medsClass.levelThree
          && order.medsClass
          && order.medsClass.levelThree) {
          if (order.medsClass.levelThree.text == orderItem.medsClass.levelThree.text) {
            order.valid = false;
            order.readyList.push(orderItem);
            console.log('duplicated-2!!!!!', order.readyList)
          }
        }
      }
    }
    if (order.valid == undefined) {
      order.valid = true;
    }
    this.loading = false;
  }
  /*  validateDuplications(order){
      this.loading=true;
      this.allServices.orderItemsService.checkDuplication({orderID:order._id, 
                                              visitDate:this.visit.visitDate,
                                              patientID:this.patient._id}).then((data)=>{
        this.temp=data;
        console.log ('duplication*******', this.temp)
        if (this.temp.length>0){
        
            order.patientDuplicationList=[];
            for (let item of this.temp){
              if (item.activeOrders&&item.activeOrders.length>0){
                order.patientDuplicationList.push(item.orderItems);
                console.log ('order.patientDuplicationList*****************',order.patientDuplicationList)
                order.valid=false;
                this.loading=false;
              }
            }
        
          console.log ('order.patientDuplicationList', order.label.ch, order.patientDuplicationList)
        
        
         
        }
         if (order.valid==undefined){
          order.valid=true;
        }
      })
  
      
  
    }*/


  validateDuplications(order: any) {
    if (order.medsClass && order.medsClass.levelThree) {
      this.allServices.orderItemsService.getByFilter({ 'medsClass.levelThree.text': order.medsClass.levelThree.text }).then((data) => {
        this.temp = data;
        console.log('has medclass', order.label.ch, this.temp)
        var orderIDs = [];
        for (let item of this.temp) {
          orderIDs.push(item._id);
        }
        this.allServices.ordersService.getByFilter({
          orderItemID: { $in: orderIDs },
          status: 'active',
          patientID: this.patient._id,
        }).then((data) => {
          this.temp = data;
          if (this.temp.length > 0) {
            order.patientDuplicationList = this.temp;
            console.log('order.patientDuplicationList', order.label.ch, order.patientDuplicationList)
            order.valid = false;
            this.loading = false;
          }
          if (order.valid == undefined) {
            order.valid = true;
          }
        })
      })
    } else {
      /* console.log ('has no medclass', order.label.ch)
       this.allServices.orderItemsService.checkDuplication({orderID:order._id,
                                     status:'active',
                                     visitDate:this.visit.visitDate,
                                     patientID: this.patient._id, }).then ((data)=>{
         this.temp=data;
        
         console.log ('this.visit.visitDate***************',this.visit.visitDate)
         console.log ('check duplication***************',this.temp)
         if (this.temp.length>0){
           console.log (' this.temp[0].createdAt***************',this.temp[0].createdAt)
           console.log (' this.temp[0].validDays***************',this.temp[0].validDays)
          order.patientDuplicationList=this.temp[0].activeOrders;
          console.log ('order.patientDuplicationList-2', order.label.ch, order.patientDuplicationList)
             order.valid=false;
          this.loading=false;
         }
         if (order.valid==undefined){
           order.valid=true;
         }
       })*/
      this.allServices.ordersService.getByFilter({
        orderItemID: order._id,
        status: 'active',
        patientID: this.patient._id,
      }).then((data) => {
        this.temp = data;
        if (this.temp.length > 0) {
          order.patientDuplicationList = this.temp;
          console.log('order.patientDuplicationList', order.label.ch, order.patientDuplicationList)
          order.valid = false;
          this.loading = false;
        }
        if (order.valid == undefined) {
          order.valid = true;
        }
      })
    }
  }


  validateConflictingProblems(order: any) {
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
          order.valid = false;
        this.loading = false;
        if (order.valid == undefined) {
          order.valid = true;
        }
      })
    }
  }


  validateConflictingOrders(order: any) {
    if (order.conflictingOrders && order.conflictingOrders.length > 0) {
      var orderIDs = [];
      for (let orderItem of order.conflictingOrders) {
        orderIDs.push(orderItem._id)
      }
      this.allServices.ordersService.getByFilter({ orderItemID: { $in: orderIDs }, status: 'active', patientID: this.patient._id }).then((data) => {
        this.temp = data;
        order.patientConflictingOrders = this.temp;
        console.log(' this.conflictingOrders', order.conflictingOrders)
        if (order.patientConflictingOrders.length > 0)
          order.valid = false;
        this.loading = false;
        if (order.valid == undefined) {
          order.valid = true;
        }
      })
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
    if (ob.context == 'patient') {
      this.allServices.datasService.getDatasByPatient(this.patient._id, ob._id).then((obData) => {
        this.temp = obData;
        //  console.log ('patient obData',obData);
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          this.allServices.datasService.update({
            _id: ob.dataID,

            patientID: this.patient._id,
            patientEmail: this.patient.email,
            //  visitID: this.visit._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('update patient data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allServices.datasService.create({
            patientID: this.patient._id,
            patientEmail: this.patient.email,
            //   visitID: this.visit._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('create patient data', data);
          });
        }
      });
    } else {
      this.allServices.datasService.getDatasByVisit(this.visit._id, ob._id).then((obData) => {
        this.temp = obData;
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          this.allServices.datasService.update({
            _id: ob.dataID,
            patientID: this.patient._id,
            patientEmail: this.patient.email,
            visitID: this.visit._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('updated visit data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allServices.datasService.create({
            patientID: this.patient._id,
            patientEmail: this.patient.email,
            visitID: this.visit._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
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
    this.allServices.datasService.getDatasByFilter2({ patientID: this.patient._id, orderID: order._id, obID: ob._id }).then((obData) => {
      this.temp = obData;
      console.log('obData', obData);
      if (this.temp.length > 0) {
        ob.dataID = this.temp[0]._id;
        this.allServices.datasService.update({
          _id: ob.dataID,
          orderID: order._id,
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          visitID: this.visit._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          console.log('updated data', data);
        });
      } else if ((ob.values && ob.values.length > 0) || ob.value) {
        this.allServices.datasService.create({
          orderID: order._id,
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          visitID: this.visit._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
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
    this.allServices.datasService.getDatasByFilter2
      ({ patientID: this.patient._id, problemItemID: obSet._id, obID: ob._id, familyMember: 'self' }).then((obData) => {
        this.temp = obData;
        console.log('obData', obData);
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          this.allServices.datasService.update({
            _id: ob.dataID,
            problemItemID: obSet._id,
            familyMember: 'self',
            patientID: this.patient._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('updated data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allServices.datasService.create({
            patientID: this.patient._id,
            problemItemID: obSet._id,
            familyMember: 'self',
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('created data', data);
          });
        }
      });
    //update problem with infor from obSet

    /* this.allServices.problemService.getProblemByFilter
         ({patientID: this.patient._id, problemItemID: obSet.problemID, familyMember: 'self'}).then((data)=>{
           this.temp=data;
           if (this.temp.length>0){
             this.temp.infor=obSet;
             this.allServices.problemService.Update(this.temp).then((data)=>{
               console.log ('problem updated', data)
             })

           }
         })*/
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
    this.allServices.datasService.getDatasByFilter2
      ({ patientID: this.patient._id, problemItemID: obSet._id, obID: ob._id }).then((obData) => {
        this.temp = obData;
        console.log('obData', obData);
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          this.allServices.datasService.update({
            _id: ob.dataID,
            medicationItemID: obSet._id,
            patientID: this.patient._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('updated med data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allServices.datasService.create({
            patientID: this.patient._id,
            medicationItemID: obSet._id,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data) => {
            console.log('created meds data', data);
          });
        }
      });
    //update problem with infor from obSet

    /* this.allServices.medsService.getMedsByFilter
         ({patientID: this.patient._id, medicationItemID: obSet.medicationID}).then((data)=>{
           this.temp=data;
           if (this.temp.length>0){
             this.temp.infor=obSet;
             this.allServices.medsService.update(this.temp).then((data)=>{
               console.log ('problem updated', data)
             })
 
           }
         })*/
  }


  getAllergy() {
    const dialogRef = this.dialog.open(AllergyComponent, {
      width: '70%',
      height: '80%',
      data: { allergyList: this.patient.allergyList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patient.allergyList = [];
        this.patient.allergyList = result;
        console.log('patient before updat allergy', this.patient)
        this.allServices.usersService.updateUser(this.patient).then((data) => {
          this.patient = data;
          console.log('patient updated', data)
          //update storage
          this.storage.set('patient', this.patient);
        })
      }
    });
  }


  saveOrderForm(form: any, order: any) {
    return new Promise((resolve, reject) => {
      var count = 0
      for (let obSet of form.obSets) {
        this.allServices.formService.bulkSaveObSet(obSet, this.patient, this.visit, order, obSet.changeObs).then((data) => {
          count++;
          if (count == form.obSets.length) {
            resolve(data);
            reject(new Error('error'));
          }
        })
      }
    })
  }


  addOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 'visit': this.visit };
    dialogConfig.maxWidth = '70vw',
    dialogConfig.maxHeight = '80vh',
    dialogConfig.height = '80%',
    dialogConfig.width = '70%'
    const dialogRef = this.dialog.open(OrderComposeComponent,
      dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.allServices.ordersService.create(result.newOrder).then((data) => {
          this.temp = data;
          this.orders.push(this.temp);
          var count = 0;
          for (let form of result.forms) {
            this.saveOrderForm(form, this.temp).then((data) => {
              count++;
              if (count == result.forms.length) {
                if (result.educations && result.educations.length > 0) {
                  var educations = [];
                  if (!this.patient.educations) {
                    educations = result.educations;
                  } else {
                    for (let education of result.educations) {
                      if (!this.find(education, educations)) {
                        educations.push(education)
                      }
                    }
                  }
                  this.allServices.usersService.updateUser({ _id: this.patient._id, education: educations }).then((data) => {
                    this.temp = data;
                    console.log('education add', data)
                    this.storage.set('patient', this.temp)
                  })
                }
              }
            })
          }
        });
      }
    })
  }


  getOrder(order: any) {
    // this.allServices.orderItemsService.getOrder(order.orderItemID).then((data)=>{
    //  this.temp=data;
    //  order.specialty=this.temp.specialty;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 'visit': this.visit, 'order': order };
    const dialogRef = this.dialog.open(OrderComposeComponent,
      dialogConfig);
  }


  close(form: any) {
    this.dialogRef.close();
  }


  findValueItem(value: any, recList: any) {
    for (let item of recList) {
      if (item.instruction == value.instruction)
        return true;
    }
    return false;
  }


  getEval() {

    /* if (!this.procedureDate){
   
       if (this.language=='English')
          var alertMessage="treatment start date";
       else if (this.language=='Chinese')
           alertMessage="治疗/手术时间";
      var missing = [alertMessage];  
         const dialogConfig = new MatDialogConfig();
   
          // dialogConfig.disableClose = true;
           dialogConfig.autoFocus = true;
          
            dialogConfig.data =  {'missing': missing,'message': '以下信息需完成', 
            'color': 'blue'};
            dialogConfig.position={top: '5%', left:'60%'};
         
           const dialogRef = this.dialog.open(MessageBoxComponent,
               dialogConfig);
   }
   else{*/
    this.submit(this.forms);
    //}
  }


  save(forms: any) {
    var alertMessage = '';
    if (!this.procedureDate) {
      if (this.language == 'English')
        alertMessage = "treatment start date";
      else if (this.language == 'Chinese')
        alertMessage = "治疗/手术时间";
      var missing = [alertMessage];
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        'missing': missing, 'message': '以下信息需完成',
        'color': 'blue'
      };
      dialogConfig.position = { top: '5%', left: '60%' };
      const dialogRef = this.dialog.open(MessageBoxComponent,
        dialogConfig);
    } else {
      this.submit(forms);
      this.dialogRef.close();
    }
  }


  submit(forms: any) {
    if (forms && forms.length > 0) {
      for (let form of forms) {
        if (form.obSets) {
          for (let obSet of form.obSets) {
            for (let ob of obSet.obs) {
              if (!form.emBed && ob.values && ob.values.length > 0) {
                this.loading = true;
                for (let value of ob.values) {
                  if (value) {
                    if (value.profiles && value.profiles.length > 0
                      || value.orders && value.orders.length > 0
                      || value.educations && value.educations.length > 0
                      || value.forms && value.forms.length > 0
                      || value.carePlans && value.carePlans.length > 0) {

                      value.instruction = ob.label.ch + ': ' + value.text;

                      if (!this.findValueItem(value, this.recList))

                        this.recList.push(value);
                    }
                  }
                }
              } else if (form.emBed) {
                this.loading = true;
                for (let value of ob.values) {

                  if (value) {
                    if (value.profiles && value.profiles.length > 0
                      || value.orders && value.orders.length > 0
                      || value.educations && value.educations.length > 0
                      || value.forms && value.forms.length > 0
                      || value.carePlans && value.carePlans.length > 0) {
                      value.instruction = ob.label.ch + ': ' + value.text;
                      if (!this.findValueItem(value, this.recList))
                        this.recList.push(value);
                    }
                    //add problems into problem database
                    if (value.problems && value.problems.length > 0) {
                      //find out  if value is family member 
                      if (value.comments == 'family') {
                        var familyMember = value.text;
                      }
                      else
                        familyMember = 'self'
                      for (let problem of value.problems) {
                        this.allServices.problemService.getProblemByFilter
                          ({ patientID: this.patient._id, problemItemID: problem._id, familyMember: familyMember }).then((data) => {
                            this.temp = data;
                            if (this.temp.length == 0) {
                              this.allServices.problemService.create({
                                patientID: this.patient._id,
                                problemItemID: problem._id,
                                familyMember: familyMember,
                                name: problem.name
                              }).then((data) => {
                                console.log('problem created', data)
                              })
                            }
                          })
                      }
                    }
                    if (value.medications && value.medications.length > 0) {
                      for (let medication of value.medications) {
                        this.allServices.medsService.getMedsByFilter
                          ({ patientID: this.patient._id, medicationItemID: medication._id }).then((data) => {
                            this.temp = data;
                            if (this.temp.length == 0) {
                              this.allServices.medsService.create({
                                patientID: this.patient._id,
                                medicationItemID: medication._id,
                                name: medication.name
                              }).then((data) => {
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
                  else {
                    this.saveObData(ob)
                  }
                }
                //     }
              }
            }
          }
        }
      }
      this.saveVisit();
    }
  }


  saveVisit() {
    // setTimeout(() => {
    if (!this.visit.providerID)
      this.visit.providerID = this.user._id;
    this.visit.type = '门诊';
    this.visit.enType = 'office visit';
    var serviceName = '';
    var serviceEnName = '';
    if (this.user.service) {
      serviceName = this.user.service.name;
      serviceEnName = this.user.service.enName;
    }
    this.visit.modifiedBy = {
      _id: this.user._id,
      name: this.user.name,
      enName: this.user.enName,
      title: this.user.title,
      enTitle: this.user.enTitle,
      service: serviceName,
      enService: serviceEnName,
      specialty: this.user.specialty
    }
    this.allServices.visitsService.update(this.visit).then((data) => {
      console.log('visit updated', data)
      this.loading = false;
      //alert('提交完毕')
    });
    //},50);
  }


  onTabChanged(event: any) {

    let selectedTab = event.tab;
    if (selectedTab.textLabel == 'evaluation')
      this.selectedIndex = 0;
  }


  findById(id: any, list: any) {
    for (let item of list) {
      if (id == item._id)
        return list.indexOf(item)
    }
    return -1;
  }


  findForm(form: any, list: any) {
    for (let item of list) {
      if (item._id == form._id)
        return true;
    }
    return false;
  }


  findChange(forms: any) {
    console.log('forms', forms)
    if (forms && forms.length > 0) {
      for (let form of forms) {
        if (form.obSets && form.obSets.length > 0) {
          for (let obSet of form.obSets) {
            if (obSet.obs && obSet.obs.length > 0) {
              for (let ob of obSet.obs) {
                if (ob.changed)
                  return true;
              }
            }
          }
        }
      }
    }
    return false;
  }


  findOrder(orderItem: any, orderList: any) {
    for (let item of orderList) {
      if (orderItem._id == item.orderItemID)
        return true;
    }
    return false;
  }


  findProblem(problemItem: any, problemList: any) {
    for (let item of problemList) {
      if (problemItem._id == item.problemItemID)
        return true;
    }
    return false;
  }


  findMedication(medicationItem: any, medicationList: any) {
    for (let item of medicationList) {
      if (medicationItem._id == item.medicationItemID)
        return true;
    }
    return false;
  }


  checkForm(order: any) {
    if (!this.missing)
      this.missing = [];
    for (let item of order.forms) {
      for (let obSet of item.obSets) {
        for (let ob of obSet.obs) {
          if (ob.type != 'instruction') {
            if (ob.required && ob.type != 'list') {
              if (ob.label && (!ob.value || ob.value == ''))
                this.missing.push(ob.label.ch);
              else if (ob.name && (!ob.value || ob.value == ''))
                this.missing.push(ob.name);
            }
            else if (ob.required && ob.type == 'list') {
              if (ob.label && (!ob.values || (ob.values && ob.values.length == 0)))
                this.missing.push(ob.label.ch);
              else if (ob.name && (!ob.values || (ob.values && ob.values.length == 0)))
                this.missing.push(ob.name);
            }
          } else {
            if (ob.addsIn && !ob.show) {
              this.missing.push(ob.name);
            }
          }
          console.log('ob -1', ob)
        }
      }
    }
  }


  saveOrder(order: any) {
    console.log('order', order)
    if (order.valid) {
      for (let form of order.forms) {
        if (form.formType == 'order')
          var infor = form;
      }
      if (order.label && order.label.ch)
        var desc = order.label.ch;
      else
        var desc = order.internalName;
      if (order.serviceID)
        console.log('service', order.serviceID)

      var newOrder = {
        desc: desc,
        patientID: this.patient._id,
        type: order.orderType,
        serviceID: order.serviceID,
        infor: infor,
        visitID: this.visit._id,
        orderItemID: order._id,
        providerID: this.user._id,
        status: 'active',
        createdBy: { _id: this.user._id, name: this.user.name, title: this.user.title }
      };
      if (order.educations) {
        if (!this.patient.educations) {
          this.patient.educations = [];
          this.patient.educations = order.educations;
        } else {
          for (let education of order.educations) {
            if (!this.find(education, this.patient.educations)) {
              this.patient.educations.push(education)
            }
          }
        }

      }
      console.log('newOrder', newOrder);
      this.allServices.ordersService.create(newOrder).then((data) => {
        this.temp = data;
        if (!this.orders) {
          this.orders = [];
        }
        this.orders.push(this.temp);
        this.allServices.alertDialogService.alert(desc + ' created');
        var count = 0;
        for (let form of order.forms) {
          this.saveOrderForm(form, this.temp).then((data) => {
            count++
            if (count == order.forms.length) {
              if (order.educations) {
                this.allServices.usersService.updateUser({ _id: this.patient._id, educations: this.patient.educations }).then((data) => {
                  this.temp = data;
                  console.log('education add', data)
                  this.storage.set('patient', this.temp)
                  order.valid = undefined;
                })
              } else {
                order.valid = undefined;
              }
            }
          })
        }
      });
    }
  }


  readyToSumbit() {
    for (let value of this.recList) {
      for (let order of value.orders) {
        if (order.valid) {
          return true;
        }
      }
    }
    return false;
  }


  submitRec() {
    // this.updateCarePlans();
    for (let value of this.recList) {
      this.updateProfiles(value);
      this.updateEducations(value);
      this.updateFollowups(value);
      for (let order of value.orders) {
        if (order.valid == true)
          this.checkForm(order);
      }
    }
    this.loading = true;
    this.allServices.usersService.updateUser(this.patient).then((data) => {
      this.storage.set('patient', this.patient);
      this.loading = false;
    })
    if (this.missing && this.missing.length > 0) {
      // alert ("please enter the following field:"+this.missing)
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { 'missing': this.missing, 'message': '以下信息需完成', 'color': this.color };
      if (this.bigScreen == 1) {
        dialogConfig.position = { top: '5%', left: '60%' };
      } else {
        dialogConfig.position = { top: '10%', left: '5%' };
      }
      const dialogRef = this.dialog.open(MessageBoxComponent,
        dialogConfig);
    } else if (this.missing && this.missing.length == 0) {
      for (let value of this.recList) {
        for (let order of value.orders) {
          if (order.valid) {
            this.saveOrder(order);
          }
        }
      }
      this.treatment = false;
      this.orderList = true;
      this.evaluation = false;
      this.currentHistory = false;
      this.visitSummary = false;
      this.diagnosis = false;
      this.record = false;
      this.getMedicationOrder();
    }
    this.missing = [];
  }


  updateProfiles(value: any) {
    //  for (let value of this.recList ){
    if (value.profiles) {
      for (let profile of value.profiles) {
        if (!this.patient.profiles)
          this.patient.profiles = [];
        if (!this.find(profile, this.patient.profiles))
          this.patient.profiles.push({ _id: profile._id, name: profile.name })
      }
    }
    // }
  }


  updateEducations(value: any) {
    // for (let value of this.recList ){
    if (value.forms) {
      for (let form of value.forms) {
        if (form.formType == 'education') {
          if (!this.patient.educations)
            this.patient.educations = [];
          if (!this.find(form, this.patient.educations))
            this.patient.educations.splice(0, 0, { _id: form._id, label: form.label })
        }
      }
    }
    // }
  }


  updateFollowups(value: any) {
    // for (let value of this.recList ){
    if (value.forms) {
      for (let form of value.forms) {
        if (form.formType == 'followup') {
          if (!this.patient.followups)
            this.patient.followups = [];
          if (!this.find(form, this.patient.followups))
            this.patient.followups.splice(0, 0, { _id: form._id, label: form.label })
        }
      }
    }
    //  }
  }


  updateCarePlans() {
    for (let value of this.recList) {
      if (value.carePlans) {
        for (let carePlan of value.carePlans) {
          if (!this.patient.carePlans)
            this.patient.carePlans = [];
          if (!this.find(carePlan, this.patient.carePlans))
            this.patient.educations.push({ _id: carePlan._id, name: carePlan.name })
        }
      }
    }
  }
}
