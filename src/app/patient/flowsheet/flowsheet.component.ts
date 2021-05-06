import {
    Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter,AfterViewInit
  } from '@angular/core';
  import { Router, ActivatedRoute } from '@angular/router';
  import { AllServices } from '../../core/common-services';
  import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
  import { DomSanitizer } from '@angular/platform-browser';
  import { ObSetComponent } from '../../core/common-components/ob-set/ob-set.component';
  import { Subscription } from 'rxjs';
  import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
  import { environment } from '../../../environments/environment';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { visitAll } from '@angular/compiler';
  var URL: string = environment.apiUrl + 'upload/';
  
  @Component({
    selector: 'flowsheet',
    templateUrl: './flowsheet.component.html',
    styleUrls: ['./flowsheet.component.scss']
  })
  export class FlowsheetComponent implements OnInit, OnChanges, AfterViewInit {
    temp: any;
    profiles: any;
    user: any;
    color: any;
    subscription: any;
    bigScreen: any;
    selectedProfile: any;
    showFiles = true;
    growthChartObs: any;
    loading: any;
    showGrowthChart: any;
    obWeight: any;
    obHeight: any;
    selectedOb: any;
    obIDs:any;
    limit:any;
    timeList:any;
    clinicalForms:any;
    formIDs:any;
    visits: any;
    visitType:any;
    valueList:any;

    @Input() noteType: any;
    @Input() homeNote: any;
    @Input() visitNote: any;
    @Input() addNote: any;
    @Input() profile: any;
    @Input() patient: any;
    @Input() forms:any;
    @Input() language: any;
    @Input() selectedObSet: any;
    @Input() dataViewerType: any;
    @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();
  
  
    constructor(
      public allServices: AllServices,
      public router: Router,
      public route: ActivatedRoute,
      private dialog: MatDialog,
      public sanitizer: DomSanitizer,
      @Inject(SESSION_STORAGE) private storage: StorageService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
        this.bigScreen = this.storage.get('bigScreen')
    }
  
    ngAfterViewInit() {
    }
  
  
  
    ngOnInit() {
    
    }
    ngOnChanges() {

    this.setUp();
     
    }

    setUp(){
      console.log ('noteType=========', this.noteType)
      console.log ('got home notes==================111', this.homeNote)
      console.log ('got visit notes==================22222', this.visitNote)
      if (this.profile&&this.patient&&this.noteType){
        console.log ('this.profile*************', this.profile)
        this.getVisitsByProfile(this.profile, this.patient);
      }
      else if (this.patient&&this.noteType&&!this.profile){
    

        this.getVisitsByNoteType(this.noteType, this.patient);
      }
    }
    getVisitsByProfile(profile:any, patient:any){
        if (profile){
          this.allServices.visitsService.getVisitsByFilter({'profiles':{'$elemMatch':{_id:profile._id}},patientID:this.patient._id, type:'门诊'}).then((data)=>{
            this.visits=data;
            console.log ('visits*************', data)
            this.getReportByProfile(profile, patient);
            
          })
        }
       
      }
    getVisitsByNoteType(noteType:any, patient:any){

      console.log ('got home notes==================222')
        if (noteType=='nursing'){
          this.visitType='home nursing'
        }
        else if (noteType=='pt'){
          this.visitType='pt'
        }
        
        this.allServices.visitsService.getVisitsByFilter({'type':this.visitType,patientID:this.patient._id}).then((data)=>{
          this.visits=data;
          console.log ('visits*************', data)
          this.getReportByVisitType(patient);
          
        })

    }

  getReportByVisitType(patient:any){
    this.valueList=[];
     this.obIDs=[];
    this.allServices.categoryService.getInternalByFilter({formType:this.visitType}).then((data)=>{
      this.temp=data;
     
      this.formIDs=[];
      for (let item of this.temp){
        this.formIDs.push(item._id)
      }
      this.allServices.categoryService.getFormById({formIDs:this.formIDs}).then((data) => {
        this.clinicalForms = data;
      
       
        console.log ('this.clinicalForms==========', this.clinicalForms)
       
        for (let item of this.clinicalForms){
          for (let obSet of item.obSets){
            for (let ob of obSet.obs){
              this.obIDs.push(ob._id);
            }
          }
        }
        for (let visit of this.visits){
          visit.forms=[];
          for (let item of this.clinicalForms)
          visit.forms.push(item);
        }
        var filter={patientID: patient._id,
                    obID:{'$in':this.obIDs}};
      
          this.allServices.datasService.getDatasByFilter2(filter).then((data)=>{

            this.temp=data;
            this.valueList=this.temp;
          
            this.loading=false;
        
            for (let form of this.clinicalForms){
              for (let obSet of form.obSets){
                for(let ob of obSet.obs){
                  ob.visitList=[]
                  for (let visit of this.visits){
                    ob.visitList.push({visit:visit, value:'', values:[], dataID:'', visitID:visit._id})
                    for (let item of this.valueList){
                   
                      if ((!item.visitID||item.visitID==visit._id)&&item.obID==ob._id){
                        //visitID
                       
                        //value
                        ob.visitList[ob.visitList.length-1].value=item.value;
                        //id from data table
                        ob.visitList[ob.visitList.length-1].dataID=item._id;
                        //values
                        for (let value of item.values){
                          for (let option of ob.options){
                            if (option.text==value&&!this.findValue(option,  ob.visitList[ob.visitList.length-1].values)){
                              ob.visitList[ob.visitList.length-1].values.push(option);
                            }
                          }
                        }
                       
                      }
                   
                    }
                 
                  }
               
                }
              }
            }
            console.log ('this.visits', this.visits)
        })
      
      })
    })
   
      }

getReportByProfile(profile: any, patient:any) {
      
    this.valueList=[];
      // this.loading=true;
      profile.summary = [];
      this.formIDs=[];
      this.obIDs=[];
      this.loading=true;
      this.allServices.categoryService.getCategory(profile._id).then((data) => {
        this.temp = data;
      
          this.loading=false;
        
     
       
        profile.label = this.temp.label;
        profile.forms = this.temp.forms;
        profile.image = this.temp.image;
      
        for (let form of profile.forms) {
          if (form.formType == this.noteType) {
              this.formIDs.push(form._id)
            
          }
        }
        
            this.allServices.categoryService.getFormById({formIDs:this.formIDs}).then((data) => {
              this.clinicalForms = data;
            
             
              console.log ('this.clinicalForms==========', this.clinicalForms)
             
              for (let item of this.clinicalForms){
                for (let obSet of item.obSets){
                  for (let ob of obSet.obs){
                    this.obIDs.push(ob._id);
                  }
                }
              }
              for (let visit of this.visits){
                visit.forms=[];
                for (let form of this.clinicalForms)
                visit.forms.push(form);
                }
              var filter={patientID: patient._id,
                obID:{'$in':this.obIDs}};
            
                this.allServices.datasService.getDatasByFilter2(filter).then((data)=>{
                  this.temp=data;
                  this.valueList=this.temp;
                  this.loading=false;
                  for (let form of this.clinicalForms){
                    for (let obSet of form.obSets){
                      for(let ob of obSet.obs){
                        ob.visitList=[]
                        for (let visit of this.visits){
                          ob.visitList.push({visit:visit, value:'', values:[], dataID:''})
                          for (let item of this.valueList){
                         
                            if ((!item.visitID||item.visitID==visit._id)&&item.obID==ob._id){
                            
                              //value
                              ob.visitList[ob.visitList.length-1].value=item.value;
                              //id from data table
                              ob.visitList[ob.visitList.length-1].dataID=item._id;
                              //values
                              for (let value of item.values){
                                for (let option of ob.options){
                                  if (option.text==value&&!this.findValue(option,  ob.visitList[ob.visitList.length-1].values)){
                                    ob.visitList[ob.visitList.length-1].values.push(option);
                                  }
                                }
                              }
                            
                            }
                          }
                       
                        }
                     
                      }
                    }
                  }
             console.log ('this.visits', this.visits)
              })
            
            })   
          
    }) 
  }

  getObValue(visit:any, ob:any){
    
    for (let item of this.valueList){
      if (item.obID==ob._id&&item.visitID==visit._id){
        ob.value=item.value
      }
      else if (item.obID==ob._id&&!item.visitID){
        ob.value=item.value
      }
    }
    return ob.value;
  }

  getObValues(visit:any, ob:any){
   ob.values=[];
    for (let item of this.valueList){
      if (item.obID==ob._id&&item.visitID==visit._id){
        for (let option of ob.options){
          for (let value of item.values){
            if (option.text==value){
              if (!this.findValue(option, ob.values)){
                ob.values.push(option)
              }
            }
           }
          }
       
      }
      else if (item.obID==ob._id&&!item.visitID){
        for (let option of ob.options){
          for (let value of item.values){
            if (option.text==value){
              if (!this.findValue(option, ob.values)){
                ob.values.push(option)
              }
            }
           }
          }
       
      }
    }
    
    return ob.values;
  }

  
  findValue(option:any, values:any){
    if (values&&values.length>0){
      for (let value of values){
        if (value.text==option.text){
          return true
        }
      }
    }
  
   return false;
  }
  

  
getObSet(obSet: any, form: any, profile:any, visit:any) {
  console.log ('visit', visit._id)
  
 
   for (let ob of obSet.obs){
     for (let item of ob.visitList){
       if (item.visitID==visit._id){
        ob.value=item.value;
        ob.values=item.values;
        ob.dataID=item.dataID;
        ob.visitID=item.visitID;
       }
       else if (!item.visitID){
        ob.value=item.value;
        ob.values=item.values;
        ob.dataID=item.dataID;
       
       }
     }
    
 
   }

  

        const dialogConfig = new MatDialogConfig();
  
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        // this.bigScreen = this.storage.get('bigScreen')
        dialogConfig.data = {
          obSet: obSet,
          visit: visit,
          form: form,
          forms: [form],
          patient: this.patient,
          profile: profile,
          visitDate:visit.visitDate,
          language: this.language,
          bigScreen: this.bigScreen,
          popOut: true
        };
  
        if (this.bigScreen == 0) {
          dialogConfig.maxWidth = '100vw',
            dialogConfig.maxHeight = '100vh',
            dialogConfig.height = '100%',
            dialogConfig.width = '100%'
  
        } else if (this.bigScreen == 1) {
          dialogConfig.maxWidth = '70vw',
            dialogConfig.maxHeight = '80vh',
            dialogConfig.height = '80%',
            dialogConfig.width = '70%'
  
        }
  
        const dialogRef = this.dialog.open(ObSetComponent, dialogConfig);
          dialogRef.afterClosed().subscribe((result) => {
       
          if (result){
            for (let ob of result.obs){//from obSet component
                for (let item of ob.visitList){
                      if (item.visitID==visit._id){
                      item.value= ob.value;
                      item.values=[];
                      item.values= ob.values;
                      item.dataID= ob.dataID;
                    
                
                      }
                   
                    }
            }
            console.log ('result', result)
            console.log ('obSet', obSet)
          }
        }, (err: any) => {
          console.log(err);
        });
      
}
  
    }