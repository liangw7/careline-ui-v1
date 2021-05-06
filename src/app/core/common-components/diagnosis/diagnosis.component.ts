import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { AllServices } from '../../common-services';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';


@Component({
  selector: 'diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss']
  
})
export class DiagnosisComponent implements OnInit, OnChanges{
              categories: any;
              temp: any;
              field: any;
              showEn: any;
              icd:any;
              @Input() diagnosis: any;
              @Input() language: any;
              @Input() color: any;
              patient:any;
             
              diagnosisList: any;
              oriDiagnosis: any;
              diagnosisLevelTwoList: any;
              diagnosisLevelThreeList: any;
              diagnosisLevelFourList: any;
              selectedLevelOne: any;
              selectedLevelTwo: any;
              selectedLevelThree: any;
              showCh: any;
              loading: any;
              temp1: any;
              temp2: any;
              temp3: any;
              temp4: any;
              temp5: any;
              temp6: any;
              temp7: any;
              temp8: any;
              temp9: any;
             search:any;
              constructor(public allServices:AllServices,
              private dialog: MatDialog,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              public router: Router) { }

  ngOnInit() {
    this.patient=this.storage.get('patient');
  if (this.patient&&!this.patient.diagnosisList){
    this.patient.diagnosisList=[];
  }
   if (this.language&&this.language=='Chinese')
   this.showCh=true;
   this.icd=[];
  }

  ngOnChanges(){
    this.patient=this.storage.get('patient');
  if (this.patient&&!this.patient.diagnosisList){
    this.patient.diagnosisList=[];
  }
      if (this.diagnosis){
          this.showCh=true;
          this.loading=true;
    this.allServices.diagnosisService.getDiagnosisByFilter({SuperClass:[]}).then((data)=>{
        console.log ('diagnosis super class', data)
        this.oriDiagnosis=data;
       this.diagnosisList= this.oriDiagnosis;
       this.loading=false;
      })
    }
this.icd=[];
  }



  addDiagnosisTwo(){
this.loading=true;
    this.allServices.loadPatientService.loadIcd().then((data)=>{
         this.temp=data;
         var icdList=this.temp;
         for (let item of icdList){
           item._code=item._code.trim();
           if (item._code!=''){
           
          this.allServices.diagnosisService.getDiagnosisByFilter({'_code':item._code}).then((data)=>{
            this.temp=data;
           
         
            if (this.temp.length==0){
              this.allServices.diagnosisService.create(item).then((data)=>{
                this.temp=data;
                if (icdList.indexOf(item)==icdList.length-1){
                  this.loading=false;
                }
                
           })
          }
          else if (this.temp.length>0){
            item._id=this.temp[0]._id;
            this.allServices.diagnosisService.update(item).then((data)=>{
              this.temp=data;
              if (icdList.indexOf(item)==icdList.length-1){
                this.loading=false;
              }
          })
         
         }
   })
  }
}
})
}
addDiagnosisThree(){
  this.loading=true;
      this.allServices.loadPatientService.loadIcd().then((data)=>{
           this.temp=data;
           var icdList=this.temp;
           for (let item of icdList){
             item._code=item._code.trim();
             if (item._code!=''){
             
          
                this.allServices.diagnosisService.create(item).then((data)=>{
                  this.temp=data;
                  if (icdList.indexOf(item)==icdList.length-1){
                    this.loading=false;
                  }
                  
          
         
     })
    
  }
}
      })
    }
    addDiagnosis(){
      this.loading=true;
      this.allServices.loadPatientService.loadIcd().then((data)=>{
           this.temp=data;
           var icdList=this.temp;
           this.temp1=[];
           this.temp2=[];
           this.temp3=[];
           this.temp4=[];
           this.temp5=[];
           this.temp6=[];
           this.temp7=[];
           this.temp8=[];
           this.temp9=[];
           for (let item of icdList){
             if (icdList.indexOf(item)<icdList.length*1/9){
                this.temp1.push(item);
             }
             else if(icdList.indexOf(item)>=icdList.length*1/9
                 &&icdList.indexOf(item)<icdList.length*2/9){
                    this.temp2.push(item);
                 }
              else if(icdList.indexOf(item)>=icdList.length*2/9
                 &&icdList.indexOf(item)<icdList.length*3/9){
                    this.temp3.push(item);
                 }
                 else if(icdList.indexOf(item)>=icdList.length*3/9
                 &&icdList.indexOf(item)<icdList.length*4/9){
                    this.temp4.push(item);
                 }
                 else if(icdList.indexOf(item)>=icdList.length*4/9
                     &&icdList.indexOf(item)<icdList.length*5/9){
                        this.temp5.push(item);
                     }
                  else if(icdList.indexOf(item)>=icdList.length*5/9
                     &&icdList.indexOf(item)<icdList.length*6/9){
                        this.temp6.push(item);
                     }
                     else if(icdList.indexOf(item)>=icdList.length*6/9
                     &&icdList.indexOf(item)<icdList.length*7/9){
                        this.temp7.push(item);
                     }
                     else if(icdList.indexOf(item)>=icdList.length*7/9
                         &&icdList.indexOf(item)<icdList.length*8/9){
                            this.temp8.push(item);
                         }
                      else if(icdList.indexOf(item)>=icdList.length*8/9
                         &&icdList.indexOf(item)<icdList.length){
                            this.temp9.push(item);
                         }
           }
           this.allServices.diagnosisService.createMany(this.temp1).then((data)=>{
           this.allServices.diagnosisService.createMany(this.temp2).then((data)=>{
              this.allServices.diagnosisService.createMany(this.temp3).then((data)=>{
                this.allServices.diagnosisService.createMany(this.temp4).then((data)=>{
                  this.allServices.diagnosisService.createMany(this.temp5).then((data)=>{
                    this.allServices.diagnosisService.createMany(this.temp6).then((data)=>{
                      this.allServices.diagnosisService.createMany(this.temp7).then((data)=>{
                        this.allServices.diagnosisService.createMany(this.temp8).then((data)=>{
                          this.allServices.diagnosisService.createMany(this.temp9).then((data)=>{
              this.loading=false;
                  
              })
          
              })
     })
    })
          
  })
})
})
          
})
})
    
  })
}
    

  
   
updateDiagnosisOne(){
    this.temp1=[];
    this.temp2=[];
    this.temp3=[];
    this.temp4=[];
    this.temp5=[];
    this.temp6=[];
    this.temp7=[];
    this.temp8=[];
    this.temp9=[];
      var icdList=[];
 this.allServices.loadPatientService.loadIcdCh().then((data)=>{
      this.temp=data;
      icdList=this.temp;
      
      console.log ('icdList',icdList)
      for (let item of icdList){
        if (icdList.indexOf(item)<icdList.length*1/9){
            this.temp1.push(item);
        }
        else if(icdList.indexOf(item)>=icdList.length*1/9
            &&icdList.indexOf(item)<icdList.length*2/9){
                this.temp2.push(item);
            }
         else if(icdList.indexOf(item)>=icdList.length*2/9
            &&icdList.indexOf(item)<icdList.length*3/9){
                this.temp3.push(item);
            }
            else if(icdList.indexOf(item)>=icdList.length*3/9
            &&icdList.indexOf(item)<icdList.length*4/9){
                this.temp4.push(item);
            }
            else if(icdList.indexOf(item)>=icdList.length*4/9
                &&icdList.indexOf(item)<icdList.length*5/9){
                    this.temp5.push(item);
                }
             else if(icdList.indexOf(item)>=icdList.length*5/9
                &&icdList.indexOf(item)<icdList.length*6/9){
                    this.temp6.push(item);
                }
                else if(icdList.indexOf(item)>=icdList.length*6/9
                &&icdList.indexOf(item)<icdList.length*7/9){
                    this.temp7.push(item);
                }
                else if(icdList.indexOf(item)>=icdList.length*7/9
                    &&icdList.indexOf(item)<icdList.length*8/9){
                        this.temp8.push(item);
                    }
                 else if(icdList.indexOf(item)>=icdList.length*8/9
                    &&icdList.indexOf(item)<icdList.length){
                        this.temp9.push(item);
                    }
      }
     
      })
    
      this.updateItem(this.temp1);
      this.updateItem(this.temp2);
      this.updateItem(this.temp3);
      this.updateItem(this.temp4);
      this.updateItem(this.temp5);
      this.updateItem(this.temp6);
      this.updateItem(this.temp7);
      this.updateItem(this.temp8);
      this.updateItem(this.temp9);


 }


 updateDiagnosis(){
 
  
 this.allServices.loadPatientService.loadIcdCh().then((data)=>{
      this.temp=data;
      this.temp;
      this.changeList(this.temp)
      
      var temp1=[];
      var temp2=[];
      var temp3=[];
      var temp4=[];
      var temp5=[];
      var temp6=[];
      var temp7=[];
      var temp8=[];
      var temp9=[];
      console.log ('this.icd',this.icd)
      for (let item of this.icd){
        if (this.icd.indexOf(item)<this.icd.length*1/9){
         temp1.push(item);
        }
        else if(this.icd.indexOf(item)>=this.icd.length*1/9
            &&this.icd.indexOf(item)<this.icd.length*2/9){
             temp2.push(item);
            }
         else if(this.icd.indexOf(item)>=this.icd.length*2/9
            &&this.icd.indexOf(item)<this.icd.length*3/9){
             temp3.push(item);
            }
            else if(this.icd.indexOf(item)>=this.icd.length*3/9
            &&this.icd.indexOf(item)<this.icd.length*4/9){
             temp4.push(item);
            }
            else if(this.icd.indexOf(item)>=this.icd.length*4/9
                &&this.icd.indexOf(item)<this.icd.length*5/9){
                 temp5.push(item);
                }
             else if(this.icd.indexOf(item)>=this.icd.length*5/9
                &&this.icd.indexOf(item)<this.icd.length*6/9){
                 temp6.push(item);
                }
                else if(this.icd.indexOf(item)>=this.icd.length*6/9
                &&this.icd.indexOf(item)<this.icd.length*7/9){
                 temp7.push(item);
                }
                else if(this.icd.indexOf(item)>=this.icd.length*7/9
                    &&this.icd.indexOf(item)<this.icd.length*8/9){
                     temp8.push(item);
                    }
                 else if(this.icd.indexOf(item)>=this.icd.length*8/9
                    &&this.icd.indexOf(item)<this.icd.length){
                     temp9.push(item);
                    }
      }
      this.updateItem(temp1);
      this.updateItem(temp2);
      this.updateItem(temp3);
      this.updateItem(temp4);
      this.updateItem(temp5);
      this.updateItem(temp6);
      this.updateItem(temp7);
      this.updateItem(temp8);
      this.updateItem(temp9);

     
      })
    
     


 }  

 changeList(list:any){
   for (let item of list){  
     if (item.children!=undefined){
       this.changeList(item.children)
       this.icd.push({value:item.value,label:item.label})
     }
     else{

       this.icd.push(item)
     }
   }
  // console.log ('this.icd',this.icd)
 }
 updateItem(list:any){
  this.loading=true;
  for (let item of list){
    item.value=item.value.trim();
    if (item.value!=''){
    
   this.allServices.diagnosisService.getDiagnosisByFilter({'_code':item.value}).then((data)=>{
     this.temp=data;
     console.log ('this.temp',this.temp)
  
     if (this.temp.length>0){
       if ( this.temp[0].chRubric.length>0&&this.temp[0].chRubric[0].label){
        this.temp[0].chRubric.splice(0,1);
        this.temp[0].chRubric.push({Label:{__Text:item.label}});
       }
       if ( this.temp[0].chRubric.length>0&&this.temp[0].chRubric[0].Label&&this.temp[0].chRubric[0].Label.__text){
        this.temp[0].chRubric.splice(0,1);
        this.temp[0].chRubric.push({Label:{__Text:item.label}});
       }
       else if (this.temp[0].chRubric.length==0){
        this.temp[0].chRubric.push({Label:{__Text:item.label}});
       }
  
   
 
  //  this.temp[0].chLabel=item.label;
 
      this.allServices.diagnosisService.update(this.temp[0]).then((data)=>{
     
    // console.log ('item updated',data)
     this.loading=false;
     })
    }
   
})
}
  }
}
clearSearch(event:any){
  this.diagnosisList=[];
  this.diagnosisLevelTwoList=[];
  this.diagnosisLevelThreeList=[];
  this.diagnosisLevelFourList=[];
  if (!event.target.value||event.target.value==''||event.target.value==null){
    this.diagnosisList= this.oriDiagnosis;
   }
}

addToDiagnosis(diagnosis:any){


  if (this.patient&&this.patient.diagnosisList&&!this.findDiagnosis(diagnosis)){
    this.patient.diagnosisList.push(diagnosis)
  }
}

findDiagnosis(diagnosis:any){
  if (this.patient&&this.patient.diagnosisList){
    for (let item of this.patient.diagnosisList){
      if (item._code==diagnosis._code){
        return true;
      }
    }
  }
 
  return false;
}
  searchDiagnosis(value:any){
    console.log ('value',value)
    this.diagnosisList=[];
      this.diagnosisLevelTwoList=[];
      this.diagnosisLevelThreeList=[];
      this.diagnosisLevelFourList=[];
     if (!value||value==''||value==null){
      this.diagnosisList= this.oriDiagnosis;
     }
     else {
       console.log ('value',value)
       this.loading=true;
      this.allServices.diagnosisService.getDiagnosisBySearch({'search':value}).then((data)=>{
            this.temp=data;
           
            if ( this.temp.length==0){
              this.diagnosisList= this.oriDiagnosis;
            }
           
            else {
              for (let item of this.temp){
                if (item.SuperClass.length==0){
                  this.diagnosisList.push(item)
                }
                else if (item._code.indexOf('-')>-1){
                  this.diagnosisLevelTwoList.push(item)
                }
                else if (item._code.indexOf('.')>-1){
                  this.diagnosisLevelFourList.push(item)
                }
                else {
                  this.diagnosisLevelThreeList.push(item)
                }
              }
this.loading=false;
            }
      })
    }
    }

    getLevelTwoClass(diagnosis:any){
     
        this.selectedLevelOne=diagnosis;
        this.selectedLevelTwo=null;
        this.diagnosisLevelThreeList=[];
        this.diagnosisLevelFourList=[];
        var codeList=[];
        for (let item of diagnosis.SubClass){
          codeList.push(item._code);
        }
        this.allServices.diagnosisService.getDiagnosisByFilter({'_code':{$in:codeList}}).then((data)=>{
          this.diagnosisLevelTwoList= data;
          console.log ('icd-10',this.diagnosisLevelTwoList)
    })
      
     
    }

    getLevelThreeClass(diagnosis:any){
     
        this.selectedLevelTwo=diagnosis;
        this.diagnosisLevelFourList=[];
        var codeList=[];
        for (let item of diagnosis.SubClass){
          codeList.push(item._code);
        }
        this.allServices.diagnosisService.getDiagnosisByFilter({'_code':{$in:codeList}}).then((data)=>{
          this.diagnosisLevelThreeList= data;
          console.log ('icd-10',this.diagnosisLevelThreeList)
    })
      
  
    }
    getLevelFourClass(diagnosis:any){
      
        this.selectedLevelThree=diagnosis;
        var codeList=[];
        for (let item of diagnosis.SubClass){
          codeList.push(item._code);
        }
        this.allServices.diagnosisService.getDiagnosisByFilter({'_code':{$in:codeList}}).then((data)=>{
          this.diagnosisLevelFourList= data;
          console.log ('icd-10',this.diagnosisLevelFourList)
    })
      
    
    }


}
