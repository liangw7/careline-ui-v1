import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { AllServices } from '../../common-services';

@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, OnChanges {
  data: any;
  missing: any;
  @Input() color: any;
  @Input() message: any;
  link: any;
  selectedPatients: any;
  @Input() patient: any;
  visitRecord: any;
  @Input() forms: any;
  @Input() visit: any;
  orders: any;
  problems: any;
  medications: any;
  temp: any;
  labSets: any;
  loading: any;
  selectRole: any;
  numberOfAccount: any;
  language: any;
  roleOptions: any;
  users: any;
  educationObs: any;
  @Input() printRecord: any;
  style: any;
  labs: any;
  ob: any;
  show: any;
  profiles: any;
  profileItems: any;
  growthChartObs: any;
  reportFromChat: any;
  medicalProblems: any;//'内科病史:';
  surgicalProblems: any;//'\n'+'外科史:';
  socialProblems: any;//'\n'+'社会史:';
  familyProblems: any;//'\n'+'家庭史:';
  userRegistry: any;
  registryForms: any;
  provider: any;
  patientList: any;
  selected: any;
  bigScreen:any;

  constructor(
    private allService: AllServices,
    public router: Router,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialogRef: MatDialogRef<MessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public param: any) {
    if (param) {

      this.data = param;
      this.selected = this.data.selected;
      this.missing = this.data.missing;
      this.color = this.data.color;
      this.message = this.data.message;
      this.patient = this.data.patient;
      this.ob = this.data.ob;
      this.show = this.data.show;
      this.registryForms = [];
      this.registryForms = this.data.registryForms;
      this.forms = [];
      this.forms = this.data.forms;
      console.log('this.forms-in message box', this.registryForms)
      this.userRegistry = this.data.userRegistry;
      this.visit = this.data.visit;
      this.profiles = this.data.profiles;
      this.profileItems = this.data.profileItems;
      this.educationObs = this.data.educationObs;
      this.users = this.data.users;
      this.language = this.data.language;
      this.reportFromChat = this.data.reportFromChat;
      this.provider = this.data.provider;
      this.patientList = this.data.patientList;
      this.link = this.data.link;
      this.bigScreen = this.storage.get('bigScreen')
    }

    this.style = 'report'
    // this.users=this.data.users

    console.log(' this.profiles', this.profiles)
    if (this.users)
      this.numberOfAccount = this.users.length

    if (!this.language) {
      this.language = this.storage.get('language')
    }

    console.log('language', this.language)
  }

  ngOnInit() {
    console.log('ok-init--1', this.registryForms)
    // if (this.link){
    //  window.open(this.link)
    // }
    if (this.patient && this.visit) {
      console.log('ok-init--2')
      console.log('this.forms-in init message box===============', this.forms)
      this.visitRecord = true;
      if (this.pedsPatient()) {

        this.growthChartObs = []
        this.allService.categoryService.getCategoriesByFilter({ 'formType': 'growth chart' }).then((data: any) => {
          this.temp = data;
          this.allService.categoryService.getFormById({ 'formIDs': [this.temp[0]._id] }).then((data: any) => {
            console.log('growthChartforms', data)
            this.temp = data;
            this.growthChartObs = this.temp[0].obSets[0].obs;
            this.getForms().then((data) => {

              this.getRecord();
            });
          })
        })
      } else {
        this.getForms().then((data) => {

          this.getRecord();
        });
      }

    }

  }


  getLink(link: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  getPhoto(user: any) {
    return this.allService.utilService.getHttpUrl(user.photo);
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        console.log('got here')
        return true;
      }

    }
    return false;
  }


  ngOnChanges() {
    console.log('ok-change--1')
    if (this.patient && this.visit) {
      console.log('ok-change--2')
      this.visitRecord = true;
      if (this.pedsPatient()) {

        this.growthChartObs = []
        this.allService.categoryService.getCategoriesByFilter({ 'formType': 'growth chart' }).then((data: any) => {
          this.temp = data;
          this.allService.categoryService.getFormById({ 'formIDs': [this.temp[0]._id] }).then((data: any) => {
            console.log('growthChartforms', data)
            this.temp = data;

            this.growthChartObs = this.temp[0].obSets[0].obs;
            this.getForms().then((data) => {

              this.getRecord();
            });
          })
        })
      } else {
        this.getForms().then((data) => {

          this.getRecord();
        });
      }
    }
  }


  pedsPatient() {
    if (this.patient.ageObj) {
      if (this.patient.ageObj.uom == 'd' || this.patient.ageObj.uom == 'm') {
        return true;
      } else if (this.patient.ageObj.uom == 'y' && this.patient.ageObj.number < 18) {
        return true
      } else if (this.patient.age) {
        return false;
      } else
        return false;
    }
    else
      return false;


  }


  getEducations() {
    var obIDs = [];
    for (let ob of this.educationObs) {
      obIDs.push(ob._id)
    }
    this.allService.categoryService.getCategoriesByFilter({ '_id': { '$in': obIDs } }).then((data: any) => {
      this.temp = data;
      this.educationObs = this.temp;
      console.log('education', this.educationObs)
    })
  }


  breakLines(str: any) {
    var temp = [];
    if (str)
      temp = str.split('/n');
    return temp;
  }


  getRecord_old() {

    this.visitRecord = '现病史/体检:';
    setTimeout(() => {
      for (let form of this.forms) {
        if (form.obSets) {
          for (let obSet of form.obSets) {
            this.visitRecord = this.visitRecord + '\n' + obSet.label.ch
            for (let ob of obSet.obs) {
              var result = this.recordOb(ob);
              this.visitRecord = this.visitRecord + result;

            }
          }
        }
      }
    }, 300);
    //GET problem history

    this.allService.problemService.getPatientProblems({ patientID: this.patient._id }).then((data: any) => {
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
      //get medication history
      this.allService.medsService.getPatientMedications({ patientID: this.patient._id }).then((data: any) => {

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
        this.allService.usersService.getlabItems({ patientID: this.patient._id }).then((data: any) => {

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
          this.allService.ordersService.getByFilter({ visitID: this.visit._id }).then((data: any) => {
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
        })
      })
    })
  }


  getRecord() {

    this.allService.problemService.getPatientProblems({ patientID: this.patient._id }).then((data: any) => {
      //  this.problemService.getProblemByFilter({patientID:this.patient._id}).then((data)=>{
      console.log('problems', data)
      this.problems = data;
      this.medicalProblems = [];//'内科病史:';
      this.surgicalProblems = [];//'\n'+'外科史:';
      this.socialProblems = [];//'\n'+'社会史:';
      this.familyProblems = [];//'\n'+'家庭史:';
      for (let problem of this.problems) {

        if (problem.familyMember == 'self' || problem.familyMembers == undefined) {
          if (problem.problemType == 'medical') {
            this.medicalProblems.push(problem)

          } else if (problem.problemType == 'surgical') {
            this.surgicalProblems.push(problem)//'\n'+'外科史:';

          } else if (problem.problemType == 'social') {

            this.socialProblems.push(problem)
          }
        } else {

          this.familyProblems.push(problem)

        }
      }

      //get medication history
      this.allService.medsService.getPatientMedications({ patientID: this.patient._id }).then((data: any) => {

        this.medications = data;
        this.labSets = [];
        this.labs = [];
        this.allService.usersService.getlabItems({ patientID: this.patient._id }).then((data: any) => {

          this.temp = data;
          this.labSets = this.temp;
          this.loading = false;
          console.log('labs', this.labSets)
          for (let labSet of this.labSets) {
            for (let lab of labSet.labs) {
              for (let value of lab.valueSet) {
                if (value != null) {
                  this.labs.push(value)
                }
              }
            }
          }

          this.allService.ordersService.getByFilter({ visitID: this.visit._id }).then((data: any) => {
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
        })
      })
    })
  }


  getForms() {
    return new Promise((resolve, reject) => {
      for (let form of this.forms) {

        if (!form.obSets) {
          this.getForm(form).then((data) => {
            if (this.forms.indexOf(form) == this.forms.length - 1) {
              resolve(data);
              reject(new Error('error'));
            }
          });
        } else {
          if (this.forms.indexOf(form) == this.forms.length - 1) {
            // resolve();
            reject(new Error('error'));
          }
        }
      }
    })
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
      this.allService.categoryService.getFormById(filter).then((data: any) => {

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
    } else if (ob.value && ob.values) {
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

  findPatient(patient: any, patients: any) {
    for (let item of patients) {
      if (item._id == patient._id)
        return true;
    }
    return false;
  }
  print() {
    //let printContents = document.getElementById('print').innerHTML;
    //let originalContents = document.body.innerHTML;

    //document.body.innerHTML = originalContents;

    // window.print();

    // document.body.innerHTML = originalContents;
    const printContent = document.getElementById("print");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    if (WindowPrt && printContent) {
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }
  }


  close() {
    this.dialogRef.close();
  }


  consult() {
    this.dialogRef.close({ consult: true });
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
  }

  getValue(user: any) {
    this.dialogRef.close({ user: user });
  }


  getImage(ob: any) {

    // console.log ('this.ob.value',this.ob.value)
    //if (this.ob.value)
    if (ob.image)
      return this.allService.utilService.getImageUrl(String(ob.image));
    //console.log ('url',this.url)
    else
      return null;
  }


  select(profile: any) {
    if (!this.find(profile, this.profiles))
      this.dialogRef.close({ profile: profile });
  }


  submit() {
    this.dialogRef.close({ forms: this.registryForms });
  }


  goToHome() {
    this.router.navigate(['/homepage'])
  }


  goToRegistry() {

    var myDiv = document.getElementById('registry');
    console.log('myDiv obSet=================', myDiv)
    if (myDiv)
      myDiv.scrollIntoView(false);
      this.allService.categoryService.getCategoriesByFilter({ formType: 'general registry' }).then((data: any) => {
      this.registryForms = data;
      this.loading = true;;
      this.allService.formService.getForm(this.registryForms[0], null, null, null).then((data: any) => {
        this.loading = false;
      })
    })
  }
}
