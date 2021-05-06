import {
  Component, OnInit, Inject, Input, OnChanges
} from '@angular/core';
import { ObComponent } from '../../core/common-components/ob/ob.component';
import { ObSetComponent } from '../../core/common-components/ob-set/ob-set.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from '../../core/common-services';

@Component({
  selector: 'problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, OnChanges {
  temp: any;
  visits: any;
  @Input() patient: any;
  problems: any;
  @Input() problemItems: any;
  @Input() search: any;
  @Input() language: any;
  @Input() viewOnly: any;
  visit: any;
  user: any;
  //problems: any;
  medicalProblems: any;
  surgicalProblems: any;
  familyProblems: any;
  socialProblems: any;
  developmentProblems: any;
  problem: any;
  color: any;
  medicalProblemItems: any;
  showProblemItems: any;
  loading: any;
  selectedProblemItem: any;
  familyMember: any;
  filter: any;
  familyMembers: any;
  bigScreen: any;
  showMedicalProblem: any;
  showSurgicalProblem: any;
  showFamilyProblem: any;
  showSocialProblem: any;
  obSets: any


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router,
    public route: ActivatedRoute,
    public allServices: AllServices,
    private dialog: MatDialog,
  ) {

    this.user = this.storage.get('user');
    if (!this.user) {
      this.viewOnly = true;
    }
    else if (!this.patient && this.user.role == 'patient')
      this.patient = this.storage.get('patient');
    this.color = this.storage.get('color');
    if (!this.language)
      this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
  }

  
  getproblems() {
    this.obSets = [];
    this.medicalProblems = [];
    this.surgicalProblems = [];
    this.familyProblems = [];
    this.socialProblems = [];
    this.familyMembers = [
      { ch: '(外)祖父母', en: 'grand parents' },
      { ch: '父/母', en: 'parents' },
      { ch: '兄弟姐妹', en: 'sibling' },
      { ch: '子女', en: 'children' },
      { ch: '(外）孙子/女', en: 'grand children' },
    ];
    console.log('this.patient', this.patient)
    /*  this.allServices.problemService.getProblemByFilter({patientID:this.patient._id}).then((data)=>{
        this.temp=data;
        for (let item of this.temp){
          this.allServices.problemService.Delete(item._id).then((data)=>{
            console.log ('delete', item)
          })
        }
      })*/
    this.loading = true;
    //  this.allServices.problemService.getPatientProblems({patientID:this.patient._id}).then((data)=>{
    this.allServices.problemService.getProblemByFilter({ patientID: this.patient._id }).then((data) => {
      console.log('problems', data)
      this.problems = data;
      this.loading = false;
      var obIDs = [];
      for (let problem of this.problems) {
        if (problem.problemItem && problem.problemItem.obs) {
          for (let ob of problem.problemItem.obs) {
            obIDs.push(ob._id);
          }
        }
      }
      console.log('obIDs', obIDs)
      this.allServices.datasService.getDatasByFilter2(
        { patientID: this.patient._id, obID: { '$in': obIDs } }).then((data) => {
          this.temp = data;
          for (let item of this.temp) {
            for (let problem of this.problems) {
              if (problem.problemItem) {
                for (let ob of problem.problemItem.obs) {
                  if (item.obID == ob._id && item.problemItemID == problem.problemItemID) {
                    ob.dataID = item._idl
                    ob.value = item.value;
                    ob.values = [];
                    for (let value of item.values) {
                      if (value && value.text) {
                        ob.values.push(value)
                      } else if (value && !value.text) {
                        for (let option of ob.options) {
                          if (option.text == value) {
                            ob.values.push(option)
                          }
                        }
                      }
                    }
                    // ob.values=item.values;
                  }
                }
              }
            }
          }
          for (let problem of this.problems) {
            if (problem.problemItem) {
              if (problem.familyMember == 'self' || problem.familyMembers == undefined) {
                if (problem.problemItem.problemType == 'medical') {
                  this.medicalProblems.push(problem);
                  console.log('this.medicalProblems', this.medicalProblems)
                } else if (problem.problemItem.problemType == 'surgical') {
                  this.surgicalProblems.push(problem);
                } else if (problem.problemItem.problemType == 'social') {
                  this.socialProblems.push(problem);
                }
              } else {

                problem.showFamilyMembers = [];
                for (let member of this.familyMembers) {
                  if (problem.familyMembers && this.findMember(problem, member)) {
                    problem.showFamilyMembers.push(true);
                  }  else {
                    problem.showFamilyMembers.push(false);
                  }
                }
                this.familyProblems.push(problem);
              }
            }
          }
        })
    })
  }

  
  ngOnInit() {
  }


  ngOnChanges() {
    console.log('change*******************')
    if (this.patient)
      this.getproblems();
  }

  getLabel(label: any, language: any) {
    if (language == 'English' && label == '内科史'){ 
      return 'Medical History'
    }else if (language == 'Chinese' && label == '内科史'){
      return label;
    }else if (language == 'English' && label == '手术史') {
      return 'Surgical History'
    } else if (language == 'Chinese' && label == '手术史')
      return label;
    else if (language == 'English' && label == '家庭史') {
      return 'Family History'
    } else if (language == 'Chinese' && label == '家庭史') {
      return label;
    } else if (language == 'English' && label == '社会史')  {
      return 'Social History'
    }else if (language == 'Chinese' && label == '社会史')  {
      return label;
    }
  }

  searchProblemItem(value: any, search: any) {
    if (!value) {
      value = '';
    }
    if (search == 'family')
      var problemType = { $in: ['medical', 'surgical'] }
    else
      problemType = search;
    this.loading = true;
    this.allServices.categoryService.getCategoriesByFilter(
      { $or: [{ name: { "$regex": value } }, { internalName: { "$regex": value } }], field: 'problem', problemType: problemType }).then((data) => {
        this.problemItems = data;
        console.log('this.problemItems===========', this.problemItems)
        this.loading = false;
        this.showProblemItems = true;
      })
  }


  selectProblem(problemItem: any, problems: any) {
    this.selectedProblemItem = problemItem;
    this.showProblemItems = false;
    this.loading = true;
    if (!this.findItem(this.selectedProblemItem, problems)) {
      var familyMember = 'self'
      this.allServices.problemService.create({
        patientID: this.patient._id,
        problemItemID: this.selectedProblemItem._id,
        problemItem: {
          obs: this.selectedProblemItem.obs,
          problemType: this.selectedProblemItem.problemType
        },
        label: this.selectedProblemItem.label,
        familyMember: familyMember
      }).then((data) => {
        this.temp = data;
        problems.push(this.temp);
        this.loading = false;
        this.getObSet(this.temp, this.problems)
        console.log('new problem================', this.temp)
      })
    }
  }


  addPrimaryProblem(problemItem: any, problems: any) {
    if (problemItem.primary == true) {
      problemItem.primary = false;
      this.patient.primaryProblem = null;
      this.allServices.problemService.update(problemItem).then((data) => {
        console.log('problem updated', data)
        this.loading = true;
        this.allServices.usersService.updateUser(this.patient).then((data) => {
          console.log('patient updated', data);
          this.loading = false;
        })
      })
    } else {
      for (let problem of problems) {
        if (problem.primary == true && problem._id != problemItem._id) {
          problem.primary = false;
          this.allServices.problemService.update(problem).then((data) => {
            console.log('problem updated', data);
            this.patient.primaryProblem = null;
            this.loading = true;
            this.allServices.usersService.updateUser(this.patient).then((data) => {
              console.log('patient updated', data);
              this.loading = false;
            })
          })
        }
      }
      problemItem.primary = true;
      this.patient.primaryProblem = problemItem;
      this.allServices.problemService.update(problemItem).then((data) => {
        console.log('problem updated', data)
        this.loading = true;
        this.allServices.usersService.updateUser(this.patient).then((data) => {
          console.log('patient updated', data);
          this.loading = false;
        })
      })
    }
  }


  selectFamilyProblem(problemItem: any, problems: any) {
    this.selectedProblemItem = problemItem;
    this.showProblemItems = false;
    if (!this.findItem(this.selectedProblemItem, problems)) {
      this.allServices.problemService.create({
        patientID: this.patient._id,
        problemItemID: this.selectedProblemItem._id,
        familyMembers: [],
        problemType: 'family',
        label: this.selectedProblemItem.label,
      }).then((data) => {
        console.log('family history created', data)
        this.temp = data;
        this.temp.obs = [];
        this.allServices.categoryService.getProblemForm({ problemID: problemItem._id }).then((data) => {
          this.temp.obs = data;
          this.temp.familyMembers = [];
          this.temp.showFamilyMembers = [];
          for (let member of this.familyMembers) {
            if (this.findMember(this.temp, member))
              this.temp.showFamilyMembers.push(true);
            else
              this.temp.showFamilyMembers.push(false);
          }
          console.log('new problem', this.temp)
          problems.push(this.temp);
        });
      })
    }
  }


  setMemberProblem(member: any, problem: any) {
    problem.showFamilyMembers[this.familyMembers.indexOf(member)] = true;
  }


  removeMemberProblem(member: any, problem: any) {
    if (!this.findMember(problem, member))
      problem.showFamilyMembers[this.familyMembers.indexOf(member)] = false;
  }


  findMember(problem: any, member: any) {
    if (problem.familyMembers) {
      for (let item of problem.familyMembers) {
        if (item.ch == member.ch)
          return true;
      }
    }
    return false;
  }


  editFamily(problem: any, member: any) {
    if (!problem.familyMembers)
      problem.familyMembers = [];
    if (!this.findMember(problem, member)) {
      console.log('problem.familyMembers-1', problem.familyMembers)
      problem.familyMembers.push(member);
    } else {
      problem.familyMembers.splice(problem.familyMembers.indexOf(member), 1);
    }
    //update problem
    console.log('problem.familyMembers-2', problem.familyMembers)
    this.allServices.problemService.update(problem).then((data) => {
      console.log('updated problem family', data)
    })
  }


  addProblemObData(familyMember: any) {
    for (let ob of this.selectedProblemItem.obs) {
      ob.valueList = [];
      if (ob.values && ob.values.length > 0) {
        console.log('ob.values', ob.values)
        for (let value of ob.values) {
          ob.valueList.push(value.text)
        }
      }
      if (ob.value || ob.valueList.length > 0) {
        this.allServices.datasService.create({
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          problemItemID: this.selectedProblemItem._id,
          obID: ob._id,
          obName: ob.name,
          source: 'patient',
          obType: ob.type,
          value: ob.value,
          familyMember: familyMember,
          values: ob.valueList
        }).then((data) => {
          console.log('profile created', data);
        });
      }
    }
  }


  findItem(problemItem: any, problems: any) {
    for (let problem of problems) {
      if (problem.problemItemID == problemItem._id)
        return true;
    }
    return false;
  }


  addProblem(problems: any) {
    var familyMember = ''
    if (!this.findItem(this.selectedProblemItem, problems)) {
      if (this.search != 'family')
        familyMember = 'self'
      else if (this.search == 'family')
        familyMember = this.familyMember;
      this.allServices.problemService.create({
        patientID: this.patient._id,
        problemItemID: this.selectedProblemItem._id,
        problemItem: { obs: this.selectedProblemItem.obs },
        familyMember: familyMember,
        label: this.selectedProblemItem.label,
        name: this.selectedProblemItem.name,
      }).then((data) => {
        this.temp = data;
        this.temp.obs = [];
        this.temp.obs = this.selectedProblemItem.obs,
          console.log('probem created', data);
        this.addProblemObData(familyMember);
        problems.push(this.temp);
        if (this.search != 'family')
          this.getObSet(this.temp, this.problems)
      });
    }
  }

  /*delete(problem, problems){
    this.allServices.problemService.Delete(problem._id).then((data)=>{
      problems.splice(problems.indexOf(problem),1)
      alert('deleted')
      this.allServices.datasService.getDatasByFilter2({patientID:this.patient._id, problemID:problem._id}).then((data)=>{
        this.temp=data;
        if (this.temp.length>0){
          for (let item of this.temp){
            this.allServices.datasService.Delete(item._id).then((data)=>{
                console.log ('deleted', data)
            })
          }
        }
      })
    })
  }*/


  getOb(ob: any, problem: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      ob: ob,
      obSet: problem,
    };
    console.log('ob', ob)
    const dialogRef = this.dialog.open(ObComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ob = result;
        this.saveObData(ob, problem);
      }
    });
  }


  getObSet(problem: any, problems: any) {
    var temp = [];
    for (let item of problems) {
      if (item.problemItem) {
        var obSet = {
          label: item.label,
          _id: item.problemItemID,
          obs: item.problemItem.obs,
          field: 'problem',
        };
        temp.push(obSet)
      }
    }
    const dialogConfig = new MatDialogConfig();
    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '100vh',
        dialogConfig.height = '100%',
        dialogConfig.width = '100%'
    }
    if (this.bigScreen == 1) {
      dialogConfig.maxWidth = '80vw',
        dialogConfig.maxHeight = '80vh',
        dialogConfig.height = '80%',
        dialogConfig.width = '80%'
    }
    dialogConfig.data = {
      obSet: {
        label: problem.label,
        _id: problem.problemItemID,
        obs: problem.problemItem.obs,
        field: 'problem'
      },
      form: { obSets: temp },
      patient: this.patient
    };
    console.log('obSet data============', dialogConfig.data)
    const dialogRef = this.dialog.open(ObSetComponent,
      dialogConfig);
  }


  /*addProblem(type) {
  
    var infor={ status:'',
                startDate:'',
                resolveDate:''};
        var data={ type:type, patient:this.patient, mode:'add'};
   
    const dialogRef = this.dialog.open(AddProblemComponent, {
      width: '1200px',
      height: '1000px',
      data: data
    });
  
    dialogRef.afterClosed().subscribe(result => {
     if (result){
  console.log ('result', result)
      for (let form of result.forms){
        for (let obSet of form.obSets){
          for (let ob of obSet.obs){
            if (ob._id=='5c9a38f79e904c07f87dc2ca'&&ob.valueList&&ob.valueList.length>0)//start time
            infor.status=ob.valueList[0];
          else  if (ob._id=='5c9a385e9e904c07f87dc2c8')
            infor.startDate=ob.value;
          else if (ob._id=='5c9a38889e904c07f87dc2c9')
            infor.resolveDate=ob.value;
  
  
          }
        }
      }
     
  
      console.log ('result', result)
          this.problem={
            patientID:this.patient._id,
            problemItemID:result._id,
            role: type,
            name:result.name,
            infor: infor,
            familyMember: result.familyMember
          };
     
     this.allServices.problemService.getProblemByFilter({patientID:this.patient._id, problemItemID:result._id, familyMember:result.familyMember}).then((data)=>{
       this.temp=data;
       console.log ('data', data)
       if (this.temp.length==0){
        this.allServices.problemService.Create(this.problem).then((data)=>{
          this.temp=data;
          if (type=='medical')
            this.medicalProblems.push(this.temp);
          else if (type=='surgical')
            this.surgicalProblems.push(this.temp);
          else if (type=='social')
            this.socialProblems.push(this.temp);
          else if(type=='family')
            this.familyProblems.push(this.temp);
          else if (type=='development')
            this.developmentProblems.push(this.temp);
  
            for (let form of result.forms){
              for (let obSet of form.obSets){
                for (let ob of obSet.obs){
                  this.saveObData (ob,this.temp)
                }
              }
            }
          alert('problem created!')
          console.log ('problem created', data)
      })
    }
      else{
        alert('problem exists, cannot be added!please go ahead and update the existing problem')
      
       }
     })
       
     }
    
    });
  }*/


  saveObData(ob: any, problem: any) {
    if (!ob.valueList && ob.type == 'list' && ob.values && ob.values.length > 0) {
      ob.valueList = [];
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    console.log('added problem', problem)
    if (problem.problemType == 'family') {
      this.filter = {
        obID: ob._id,
        problemItemID: problem.problemItemID,
        patientID: this.patient._id,
        familyMember: problem.familyMember
      };
    } else {
      this.filter = {
        obID: ob._id,
        problemItemID: problem.problemItemID,
        patientID: this.patient._id
      };
    }
    this.allServices.datasService.getDatasByFilter2(this.filter).then((obData) => {
      this.temp = obData;
      console.log('visit obData', obData);
      if (this.temp.length > 0) {
        ob.dataID = this.temp[0]._id;
        this.allServices.datasService.update({
          _id: ob.dataID,
          patientID: this.patient._id,
          problemItemID: problem.problemItemID,
          familyMember: problem.familyMember,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          console.log('problem data updated', data);
        });
      } else {
        this.allServices.datasService.create({
          patientID: this.patient._id,
          problemItemID: problem.problemItemID,
          familyMember: problem.familyMember,
          userID: this.user._id,
          userEmail: this.user.email,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        }).then((data) => {
          console.log('problem data created', data);
        })
      }
    });
  }


  delete(problem: any, problems: any) {
    this.allServices.problemService.delete(problem._id).then((data) => {
      for (let ob of problem.problemItem.obs) {
        this.filter = {
          obID: ob._id,
          problemItemID: problem.problemItemID,
          patientID: this.patient._id
        }
        this.allServices.datasService.getDatasByFilter2(this.filter).then((data) => {
          this.temp = data;
          if (this.temp.length > 0) {
            for (let item of this.temp) {
              this.allServices.datasService.delete(item._id).then((data) => {
                console.log('deleted', data)
              })
            }
          }
        })
      }
      var index = problems.indexOf(problem);
      problems.splice(index, 1);
    })
  }


  deleteFamily(problem: any, problems: any) {
    this.allServices.problemService.delete(problem._id).then((data) => {
      var index = problems.indexOf(problem);
      problems.splice(index, 1);
    })
  }
}



