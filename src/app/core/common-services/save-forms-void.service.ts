import { Component, OnInit, Injectable, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CategoryService } from './category.service';
import { DatasService } from './datas.service';
import { VisitsService } from './visits.service';
import { UsersService } from './users.service';
import { ProblemService } from './problems.service';
import { AuthService } from './auth.service';
import { ImagesService } from './images.service';
import { LabsService } from './labs.service';
import { MedsService } from './meds.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';



@Injectable()
export class FormService {
 temp: any;
 filter: any;
 loading: any;
 user:any;
 formFilter:any;
 patient:any;
 selectedPatients:any;
 dataObs:any;
 visitObIDs:any;
userObIDs:any;
 orderObIDs:any;
obDatas:any;
token:any;
 problems:any;
images:any;
 labs:any;
records:any;
medications:any;
educations:any;
profiles:any;
obs:any;
valueList:any;
 //user:any;
 constructor(

    public categoryService: CategoryService,
    public dataService: DatasService,
    public VisitService: VisitsService,
    public problemService: ProblemService,
    public medsService: MedsService,
    public imageService: ImagesService,
    public labService: LabsService,
    public userService: UsersService,
    public router: Router,
    public auth:AuthService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.user = this.storage.get('user');
    this.patient = this.storage.get('patient');
    this.selectedPatients = this.storage.get('selectedPatients');
  }
saveForms(forms:any,visit:any,user:any ){    
    return new Promise((resolve, reject) => {
        console.log ('save forms', forms)
        var total=0;
        if (forms){
            for (let item of forms)  {
                for (let obSet of item.obSets){
              
                    for (let ob of obSet.obs){
                    
                    total++;
                      if (ob.label.en=='birthday'&&ob.value){
                        user.birthday=ob.value;
                        }
                        
                else  if (ob.label.en=='name'&&ob.value){
                    user.name=ob.value;
                      }
                    
                else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
                    for (let value of ob.values){
                        if (value&&value.text){
                            user.gender=value.text;
                        }
                    }
                      }
                      
                else if (ob.label.en=='ssn'&&ob.value){
                    user.ssn=ob.value;
                      }
                        
                else if (ob.label.en=='phone'&&ob.value){
                    user.phone=ob.value;
                        
                      }
                      
                else if (ob.label.en=='photo'&&ob.value){
                    user.photo=ob.value;  
                      
                      }
                      
                else if (ob.label.en=='city'&&ob.value){
                    user.city=ob.value;  
                      
                      }   
                else if (ob.label.en=='device registry ID'&&ob.value){
                        user.deviceUserID=ob.value;  
                    //    alert('got device id')
                          }    
                else if (ob.label.en=='age formula'&&ob.value){
                  //alert('ob.label.en'+ob.label.en)
                  user.ageObj={number:ob.value,uom:ob.uom};
                       
                      }
                
                             
                             
                    }
                  }
                
                }
            
            
            
            console.log ('user :',user)
            this.loading=true;
            this.userService.updateUser(user).then((data)=>{  
              
              
              if (user.role!='user')
              this.storage.set('user', user)
              else
              this.storage.set('user', user)
              // var indexForm=0;
              var indexOb=0;
                for (let form of forms)  {
                   // var indexObSet=0;           
                for (let obSet of form.obSets){
                   
                for (let ob of obSet.obs){ 
              //  if (ob.value||(ob.values&&ob.values.length>0)){
                if (ob.changed){
                    ob.changed=false;
                if (obSet.field=='problem'){
                this.saveProblemObData(ob, obSet,user ).then((data)=>{
                    indexOb++;
                             
                                        if (indexOb==total){
                                          // alert('save form done')
                                          this.loading=false;
                                            resolve(data);
                                            reject(new Error('error'));
                                        }
                                
                });
                
                }
                else if (obSet.field=='medication'){
                    console.log ('save meds')
                    this.saveMedicationObData(ob, obSet,user ).then((data)=>{
                        indexOb++;
                             
                        if (indexOb==total){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    })
                
                }
                
                else{
                  
                    this.savePatientProfileObData(ob, visit, user ).then((data)=>{
                      //  alert('saved profile ob'+ob.label.ch);
                        //console.log ('ob data', data)
                        if (ob.context=='image'){
                            this.updateImage(ob,user).then((data)=>{
                                indexOb++;
                             
                                if (indexOb==total){
                                    this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                                
                            })
                        }
                        else if (ob.context=='record'){
                            this.updateRecord(ob, user).then((data)=>{
                              //  alert('got record')
                                indexOb++;
                             
                                if (indexOb==total){
                                    this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                            
                        })
                        }
                        else if (ob.context=='lab'){
                            this.updateLab(ob,user).then((data)=>{
                                
                                indexOb++;
                             
                                if (indexOb==total){
                                    this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                            
                        })
        
                        }
                        else{
                        this.saveProblem(ob,user).then((data)=>{
                          //  alert('saved ob problem')
                            this.saveMedication(ob,user  ).then((data)=>{
                                indexOb++;
                             
                                if (indexOb==total){
                                    this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                       /* if (forms.indexOf(form)==forms.length-1){
                            if (form.obSets.indexOf(obSet)==form.obSets.length-1){
                                if (obSet.obs.indexOf(ob)==obSet.obs.length-1){
                                    alert('save form done')
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                            }
                        }*/
                            })
                        });
                    }
                    });
                   
                   
                }
                }
                else{
                    indexOb++;
                             
                    if (indexOb==total){
                        this.loading=false;
                        resolve(data);
                        reject(new Error('error'));
                    }
                }
                }
            }
            }
            })
        }
   else{
    this.loading=false;
    resolve('resolved');
    reject(new Error('error'));
   }
})
}
saveOrderForms(forms:any,order:any,visit:any,user:any ){    
    return new Promise((resolve, reject) => {
        console.log ('save forms', forms)
        var total=0;
        if (forms){
            console.log ('user :',user)
            this.loading=true;
            var indexOb=0;
                for (let form of forms)  {
                   // var indexObSet=0;           
                for (let obSet of form.obSets){
                   
                for (let ob of obSet.obs){ 
               if (ob.value||(ob.values&&ob.values.length>0)){
                  this.saveOrderObData (ob, order, visit, user).then((data)=>{
                    this.loading=false;
                    indexOb++;
                             
                    if (indexOb==total){
                      // alert('save form done')
                      this.loading=false;
                        resolve(data);
                        reject(new Error('error'));
                    }
                
                    
                    });
               
                }
            }
            }
            }
            
        }
   else{
    this.loading=false;
    resolve('resolved');
    reject(new Error('error'));
   }
})
}

saveObSet(obSet:any,visit:any,user:any ){ 
    
    return new Promise((resolve, reject) => {
        var total=0;
        for (let ob of obSet.obs){
        //    alert('got here 2'+ob.label.en)
            total++;
       if (ob.label.en=='birthday'&&ob.value){
                user.birthday=ob.value;
                }
                
        else  if (ob.label.en=='name'&&ob.value){
            user.name=ob.value;
              }
            
        else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
            for (let value of ob.values){
                if (value&&value.text){
                    user.gender=value.text;
                }
            }
              }
              
        else if (ob.label.en=='ssn'&&ob.value){
            user.ssn=ob.value;
              }
                
        else if (ob.label.en=='phone'&&ob.value){
            user.phone=ob.value;
                
              }
              
        else if (ob.label.en=='photo'&&ob.value){
            user.photo=ob.value;  
              
              }
              
        else if (ob.label.en=='city'&&ob.value){
            user.city=ob.value;  
              
              }      
        else if (ob.label.en=='age formula'&&ob.value){
          //alert('ob.label.en'+ob.label.en)
          var age=this.getAge(ob);
          user.ageObj={number:age.number,uom:age.uom};
               
              }
        else if (ob.label.en=='device registry ID'&&ob.value){
        user.deviceUserID=ob.value;  
       // alert('got device id')
            }
                     
                     
            }
      
//    console.log ('user :',user)
    this.loading=true;
    this.userService.updateUser(user).then((data)=>{  
      //  alert('got here user updated')
        if (user.role!='user')
        this.storage.set('user', user)
        else
        this.storage.set('user', user)
      
      // var indexForm=0;
      var indexOb=0;
       for (let ob of obSet.obs){ 
      if (ob.changed){
        ob.changed=false;
      //  if (ob.value||(ob.values&&ob.values.length>0)){
        if (obSet.field=='problem'){
        this.saveProblemObData(ob, obSet,user ).then((data)=>{
            indexOb++;
          //  alert('got here user data updated')
                                if (indexOb==total){
                                  //  alert('save form done')
                                    this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                        
        });
        
        }
        else if (obSet.field=='medication'){
            console.log ('save meds')
            this.saveMedicationObData(ob, obSet,user ).then((data)=>{
                indexOb++;
                     
                if (indexOb==total){
                  //  alert('save form done')
                    this.loading=false;
                    resolve(data);
                    reject(new Error('error'));
                }
            })
        
        }
        
        else{
          //  alert('got here 1')
            this.savePatientProfileObData(ob, visit, user ).then((data)=>{
                //alert('saved profile ob'+ob.label.ch);
                //console.log ('ob data', data)
                if (ob.context=='image'){
                    this.updateImage(ob,user).then((data)=>{
                        indexOb++;
                     
                        if (indexOb==total){
                           // alert('save form done')
                           this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                        
                    })
                }
                else if (ob.context=='record'){
                    this.updateRecord(ob, user).then((data)=>{
                        //alert('got record')
                        indexOb++;
                     
                        if (indexOb==total){
                           // alert('save form done')
                           this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    
                })
                }
                else if (ob.context=='lab'){
                    this.updateLab(ob,user).then((data)=>{
                        
                        indexOb++;
                     
                        if (indexOb==total){
                           // alert('save form done')
                           this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    
                })

                }
                else{
                this.saveProblem(ob,user).then((data)=>{
                   // alert('saved ob problem')
                    this.saveMedication(ob,user  ).then((data)=>{
                        indexOb++;
                     
                        if (indexOb==total){
                           // alert('save form done')
                           this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
               /* if (forms.indexOf(form)==forms.length-1){
                    if (form.obSets.indexOf(obSet)==form.obSets.length-1){
                        if (obSet.obs.indexOf(ob)==obSet.obs.length-1){
                            alert('save form done')
                            resolve(data);
                            reject(new Error('error'));
                        }
                    }
                }*/
                    })
                });
            }
            });
           
           
        }
        }
        else{
            indexOb++;
                     
            if (indexOb==total){
                this.loading=false;
                resolve(data);
                reject(new Error('error'));
            }
        }
        }
    
        })
    })
}
saveProfileObSet(obSet:any,visit:any,user:any ){   
    return new Promise((resolve, reject) => {
    var total=0;
    total=obSet.obs.length;
    this.loading=true;

      // var indexForm=0;
      var indexOb=0;
     for (let ob of obSet.obs){ 
        // alert('ob'+ob.label.ch)
    //  if (ob.changed){
    //    ob.changed=false;
      //  if (ob.value||(ob.values&&ob.values.length>0)){
          this.savePatientProfileObData(ob, visit, user ).then((data)=>{
              //  alert('saved profile ob'+ob.label.ch);
                //console.log ('ob data', data)
                if (ob.context=='image'){
                    this.updateImage(ob,user).then((data)=>{
                        indexOb++;
                     
                        if (indexOb==total){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                        
                    })
                }
                else if (ob.context=='record'){
                    this.updateRecord(ob, user).then((data)=>{
                        //alert('got record')
                        indexOb++;
                     
                        if (indexOb==total){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    
                })
                }
                else if (ob.context=='lab'){
                    this.updateLab(ob,user).then((data)=>{
                        
                        indexOb++;
                     
                        if (indexOb==total){
                            this.loading=false;// alert('save form done')
                            resolve(data);
                            reject(new Error('error'));
                        }
                    
                })

                }
                else{
               // alert('context'+ob.context)
                this.saveProblem(ob,user).then((data)=>{
                   // alert('saved ob problem')
                    this.saveMedication(ob,user  ).then((data)=>{
                        indexOb++;
                       // alert('index'+indexOb+ob.label.ch)  
                        if (indexOb==total){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
               /* if (forms.indexOf(form)==forms.length-1){
                    if (form.obSets.indexOf(obSet)==form.obSets.length-1){
                        if (obSet.obs.indexOf(ob)==obSet.obs.length-1){
                            alert('save form done')
                            resolve(data);
                            reject(new Error('error'));
                        }
                    }
                }*/
                    })
                });
            }
            });
           
           
        
  //      }
     /* else{
            indexOb++;
           // alert('index'+indexOb+ob.label.ch)      
            if (indexOb==total){
               this.loading=false;
                resolve('resolved');
                reject(new Error('error'));
            }
        }*/
        }
     })
    
}
saveProblemObSet(obSet:any,user:any ){   
    return new Promise((resolve, reject) => {
    var total=0;
    total=obSet.obs.length;
    this.loading=true;
    //save problem first
    this.problemService.getProblemByFilter({
        patientID: user._id, 
        problemItemID:obSet._id}).then((data)=>{
      this.temp=data;
        if (this.temp.length==0){
            this.problemService.create({
                patientID: user._id, 
                problemItemID:obSet._id,
                familyMember: 'self'
            }).then((data)=>{
                var indexOb=0;
                for (let ob of obSet.obs){ 
                 if (ob.changed){
                   ob.changed=false;
                 //  if (ob.value||(ob.values&&ob.values.length>0)){
                  
                   this.saveProblemObData(ob, obSet,user ).then((data)=>{
                       indexOb++;
                      
                                
                                           if (indexOb==total){
                                             //  alert('save form done')
                                             this.loading=false;
                                               resolve(data);
                                               reject(new Error('error'));
                                           }
                                   
                   });
                   
                   }
                 else{
                       indexOb++;
                                
                       if (indexOb==total){
                          // alert('save form done')
                           resolve('resolved');
                           reject(new Error('error'));
                       }
                   }
                   }
            });
      }
      else{
        var indexOb=0;
        for (let ob of obSet.obs){ 
         if (ob.changed){
           ob.changed=false;
         //  if (ob.value||(ob.values&&ob.values.length>0)){
          
           this.saveProblemObData(ob, obSet,user ).then((data)=>{
               indexOb++;
              
                        
                                   if (indexOb==total){
                                     //  alert('save form done')
                                     this.loading=false;
                                       resolve(data);
                                       reject(new Error('error'));
                                   }
                           
           });
           
           }
         else{
               indexOb++;
                        
               if (indexOb==total){
                this.loading=false;
                   resolve('resolved');
                   reject(new Error('error'));
               }
           }
           }
      }
     
     })
    })
    
}
saveMedicationObSet(obSet:any,user:any ){   
    return new Promise((resolve, reject) => {
    var total=0;
    total=obSet.obs.length;
    this.loading=true;

    this.medsService.getMedsByFilter({patientID: user._id, 
        medicationItemID:obSet._id}).then((data)=>{
            this.temp=data;
        if (this.temp.length==0){
                    this.medsService.create({
                        patientID: user._id, 
                        medicationItemID:obSet._id
                    }).then((data)=>{
        
                    var indexOb=0;
                    for (let ob of obSet.obs){ 
                    if (ob.changed){
                        ob.changed=false;
                    //  if (ob.value||(ob.values&&ob.values.length>0)){
                    
                        
                            console.log ('save meds')
                            this.saveMedicationObData(ob, obSet,user ).then((data)=>{
                                indexOb++;
                                    
                                if (indexOb==total){
                                //  alert('save form done')
                                this.loading=false;
                                    resolve(data);
                                    reject(new Error('error'));
                                }
                            })
                        
                            
                        }
                    else{
                            indexOb++;
                                    
                            if (indexOb==total){
                            // alert('save form done')
                                resolve('resolved');
                                reject(new Error('error'));
                            }
                        }
                        }
                    })
                }
        else{
            var indexOb=0;
            for (let ob of obSet.obs){ 
            if (ob.changed){
                ob.changed=false;
            //  if (ob.value||(ob.values&&ob.values.length>0)){
            
                
                    console.log ('save meds')
                    this.saveMedicationObData(ob, obSet,user ).then((data)=>{
                        indexOb++;
                            
                        if (indexOb==total){
                        //  alert('save form done')
                        this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    })
                
                    
                }
                else{
                    indexOb++;
                            
                    if (indexOb==total){
                        this.loading=false;
                        resolve('resolved');
                        reject(new Error('error'));
                    }
                }
            }
        }
    })
})
}
saveOrderObData (ob:any, order:any, visit:any, user:any){
    return new Promise((resolve, reject) => {
    ob.valueList=[];
    if (ob.values&&ob.values.length>0){
      for (let value of ob.values){
        if (value&&value.text)
        ob.valueList.push(value.text)
      }
    }
    
      this.dataService.getDatasByFilter2({userID:user._id, orderID: order._id,obID: ob._id}).then((obData)=>{
        this.temp=obData;
        console.log ('obData',obData);
        if (this.temp.length>0){
    
        ob.dataID=this.temp[0]._id;
      this.dataService.update({
                    _id: ob.dataID,
                    orderID: order._id,
                    patientID: user._id, 
                    userEmail:user.email,
                    visitID: visit._id,
                    obID: ob._id,
                    obName: ob.name,
                    obType: ob.type,
                    value:ob.value,
                    values: ob.valueList}).then((data)=>{
                      console.log ('updated data', data);
                      resolve(data);
                      reject(new Error('error'))
                    });
                    }
        else if ((ob.values&&ob.values.length>0)||ob.value){
            this.dataService.create({
              orderID: order._id,
              patientID: user._id, 
              userEmail: user.email,
              visitID: visit._id,
              obID: ob._id,
              obName: ob.name,
                obType: ob.type,
              value:ob.value,
              values: ob.valueList}).then((data)=>{
                console.log ('created data', data);
                resolve(data);
                reject(new Error('error'))
              });
          }
        });
    })
    }

         
savePatientProfileObData (ob:any, visit:any, user:any ){
return new Promise((resolve, reject) => {
        ob.valueList=[];
        if (ob.values&&ob.values.length>0){
            ob.valueList=ob.values
           // for (let value of ob.values){

           // ob.valueList.push(value.text);
        //   ob.valueList.push({text:value.text, comments:value.comments,number:value.number, from:value.from, to:value.to});
       // ob.valueList.push(value)
            
           // }
            
        }

     
        //    console.log ('ob-form-save',ob)
         if (!ob.context||ob.context=='visit'||ob.context=='image'||ob.context=='lab'||ob.context=='record'){
                var visitID=visit._id;
                this.dataService.getDatasByFilter2({
                patientID: user._id, 
                obID: ob._id,
                visitID:visitID
                }).then((data)=>{
                    this.temp=data;
            if (this.temp.length==0){
                this.dataService.create({
                patientID: user._id, 
                userEmail: user.email,
                visitID:visitID,
                obID: ob._id,
                obName: ob.name,
                obType: ob.type,
                value:ob.value,
                values: ob.valueList}).then((data)=>{
                   console.log ('profile data created', data);
                            this.loading=false;
                             resolve(data);
                            reject(new Error('error'));
                        
                    });
                    }
                    else{
                    this.dataService.update({
                        _id:this.temp[0]._id,
                        patientID: user._id, 
                        userEmail: user.email,
                        visitID:visitID,
                        obID: ob._id,
                        obName: ob.name,
                        obType: ob.type,
                        value:ob.value,
                        values: ob.valueList}).then((data)=>{
                           console.log ('profile data updated', data);
                            
                              this.loading=false;
                                     resolve(data);
                                    reject(new Error('error'));
                                
                        });
                    }
                })
            }
        else if (ob.context=='patient'){
            this.dataService.getDatasByFilter2({
            patientID: user._id, 
            obID: ob._id,
            }).then((data)=>{
                this.temp=data;
                if (this.temp.length==0){
                    this.dataService.create({
                    patientID: user._id, 
                    userEmail: user.email,
                        obID: ob._id,
                        obName: ob.name,
                        obType: ob.type,
                        value:ob.value,
                        uom:ob.uom,
                        values: ob.valueList}).then((data)=>{
                        console.log ('user data created', data);
                        this.loading=false;
                        resolve(data);
                        reject(new Error('error'));
                        });
                }
                else{
                    this.dataService.update({
                    _id:this.temp[0]._id,
                    patientID: user._id, 
                    userEmail: user.email,
                        obID: ob._id,
                        obName: ob.name,
                        obType: ob.type,
                        value:ob.value,
                        uom:ob.uom,
                        values: ob.valueList}).then((data)=>{
                        console.log ('user data updated', data);
                        this.loading=false;
                        resolve(data);
                        reject(new Error('error'));
                        });
                }
            });
            }
   
})
}

saveProblemObData (ob:any, obSet:any, user:any){
        return new Promise((resolve, reject) => {
        ob.valueList=[];
        if (ob.values&&ob.values.length>0){
            ob.valueList=ob.values
          //  for (let value of ob.values){
         //   ob.valueList.push(value.text);
        // ob.valueList.push({text:value.text, comments:value.comments,number:value.number, from:value.from, to:value.to});
       
          //  }
        }
        this.dataService.getDatasByFilter2({
        patientID: user._id, 
        problemItemID: obSet._id,
        obID: ob._id,
        }).then((data)=>{
            this.temp=data;
            if (this.temp.length==0){
            this.dataService.create({
                patientID: user._id, 
                userEmail: user.email,
                problemItemID: obSet._id,
                obID: ob._id,
                obName: ob.name,
                obType: ob.type,
                value:ob.value,
                familyMember:'self',
                values: ob.valueList}).then((data)=>{
                    console.log ('problem data created', data);
                    this.loading=false;
                    resolve(data);
                    reject(new Error('error'));
                    });
            }
            else{
            this.dataService.update({
                _id:this.temp[0]._id,
                patientID: user._id, 
                userEmail: user.email,
                problemItemID: obSet._id,
                obID: ob._id,
                obName: ob.name,
                obType: ob.type,
                value:ob.value,
                familyMember:'self',
                values: ob.valueList}).then((data)=>{
                    console.log ('problem data updated', data);
                    this.loading=false;
                    resolve(data);
                    reject(new Error('error'))
                    });
                }
            });


        })
}
    
saveMedicationObData (ob:any, obSet:any,user:any){
    return new Promise((resolve, reject) => {
        ob.valueList=[];
        if (ob.values&&ob.values.length>0){
            ob.valueList=ob.values
          //  for (let value of ob.values){
           // ob.valueList.push(value.text);
          // ob.valueList.push({text:value.text, comments:value.comments,number:value.number, from:value.from, to:value.to});
       
          //  }
        }
        this.dataService.getDatasByFilter2({
                    patientID: user._id, 
                    medicationItemID: obSet._id,
                    obID: ob._id,
                }).then((data)=>{
                    this.temp=data;
                    if (this.temp.length==0){
                    this.dataService.create({
                        patientID: user._id, 
                        userEmail: user.email,
                        medicationItemID: obSet._id,
                        obID: ob._id,
                        obName: ob.name,
                        source: 'user',
                            obType: ob.type,
                        value:ob.value,
                        values: ob.valueList}).then((data)=>{
                            console.log ('medication data created', data);
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'))
                            });
                    }
                    else{
                    this.dataService.update({
                        _id:this.temp[0]._id,
                        patientID: user._id, 
                        userEmail: user.email,
                        medicationItemID: obSet._id,
                        obID: ob._id,
                        obName: ob.name,
                        source: 'user',
                            obType: ob.type,
                        value:ob.value,
                        values: ob.valueList}).then((data)=>{
                            console.log ('medication data updated', data);
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'))
                            });
                    }
                })
        });
        }
saveProblem(ob:any, user:any){
    return new Promise((resolve, reject) => {
            if (ob.values&&ob.values.length>0){
                for (let value of ob.values){
                if (value.problems&&value.problems.length>0){
                    if (value.comments=='family'){
                    var familyMember=value.text;
                    }
                    else{
                    familyMember='self';
                    }
                    var index=0;
                    for (let problem of value.problems){
                    
                    // this.getProblemInfor(problem,ob,form);
                    this.problemService.getProblemByFilter({
                    patientID: user._id, 
                    problemItemID:problem._id, 
                    familyMember: familyMember,
                    }).then((data)=>{
                    this.temp=data;
                    if (this.temp.length==0){
                    this.problemService.create({
                        patientID: user._id, 
                        problemItemID:problem._id, 
                        familyMember: familyMember,
                    }).then((data)=>{
                        console.log ('probem created', data)
                        index++;
                        if (index==value.problems.length){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    });
                    }
                    });
                        
                            
                        
                    }
                }
                else{
                  //  alert('no problem')
                    this.loading=false;
                    resolve(ob);
                    reject(new Error('error'));
                }
                }
            }
            else{
                this.loading=false;
                resolve(ob);
                reject(new Error('error'));
            }
        })
            }
saveMedication(ob:any,user:any){
    return new Promise((resolve, reject) => {
            if (ob.values&&ob.values.length>0){
                for (let value of ob.values){
                if (value.medications&&value.medications.length>0){
                    var index=0;
                    for (let medication of value.medications){
                    // this.getMedicationInfor(medication,ob,form)
                    this.medsService.getMedsByFilter({
                    patientID: user._id, 
                    medicationItemID:medication._id
                    }).then((data)=>{
                    this.temp=data;
                    if (this.temp.length==0){
                    this.medsService.create({
                        patientID: user._id, 
                        medicationItemID:medication._id
                    }).then((data)=>{
                        index++;
                        console.log ('medication created', data)
                        if (index==value.problems.length){
                            this.loading=false;
                            resolve(data);
                            reject(new Error('error'));
                        }
                    });
                    }
                    });
        }
                }
                else{
                  //  alert('no meds')
                    this.loading=false;
                    resolve(ob);
                    reject(new Error('error'));
                }
}
}  
else{
    this.loading=false;
    resolve(ob);
    reject(new Error('error'));
}
    })
}
updateImage(ob:any,user:any){
    return new Promise((resolve, reject) => {
    if (ob.value){
      var image={_id:ob.value, obID:ob._id, userID:user._id,uploaded:'true'}
      this.imageService.update(image).then((data)=>{
        console.log ('image=========', data);
        this.loading=false;
        resolve(data);
        reject(new Error('error'));
      });
    }
    else{
        resolve(ob);
        reject(new Error('error'));
    }
})
  }
updateImages(images:any){
    return new Promise((resolve, reject) => {
        var index=0;
        if (images.length>0){
         for (let image of images){
          this.imageService.update(image).then((data)=>{
            console.log ('image=========', data);
            this.loading=false;
            index++;
            if (index==images.length){
                resolve(data);
                reject(new Error('error'));
            }
          
          });
        }
    }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }
    })
}

updateLabs(labs:any){
    return new Promise((resolve, reject) => {
        var index=0;
        if (labs.length>0){
         for (let lab of labs){
          this.labService.update(lab).then((data)=>{
            console.log ('image=========', data);
            this.loading=false;
            index++;
            if (index==labs.length){
                resolve(data);
                reject(new Error('error'));
            }
          
          });
        }
    }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }
    })
}
  
updateRecords(records:any){
    return new Promise((resolve, reject) => {
        var index=0;
        if (records.length>0){
         for (let record of records){
          this.labService.update(record).then((data)=>{
            console.log ('image=========', data);
            this.loading=false;
            index++;
            if (index==records.length){
                resolve(data);
                reject(new Error('error'));
            }
          
          });
        }
    }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }
    })
}
updateRecord(ob:any,user:any){
    return new Promise((resolve, reject) => {
    if (ob.value){

      var record={_id:ob.value, obID:ob._id, userID:user._id, about:'medical file',uploaded:'true'}
      this.imageService.update(record).then((data)=>{
        console.log ('record==========', data);
        this.loading=false;
        resolve(data);
        reject(new Error('error'));
      })
    }
    else{
        resolve(ob);
        reject(new Error('error'));
    }
})
  }
updateLab(ob:any,user:any){
    return new Promise((resolve, reject) => {
    if (ob.value){
      var lab={_id:ob.value, obID:ob._id, userID:user._id,uploaded:'true'}
      this.labService.update(lab).then((data)=>{
        console.log ('lab', data)
        this.loading=false;
        resolve(data);
        reject(new Error('error'));
      })
    }
    else{
        resolve(ob);
        reject(new Error('error'));
    }
})
  }          
findItem(item:any, list:any){
for (let i of list){
    if (i._id==item._id){
    return true
    }
}
return false;
}
getAge(ob:any){
    
    var value=ob.value/365.25;
    var uom='';
      if (value >2){
          value = Math.floor(value);
           uom='y'
        }
        else if (value <=2){
         
          value=value*12;
          console.log ('value',value)
          if (value>1){
            value = Math.floor(value);
            uom='m'
          }
              
          else{
                value=Math.floor(value*30);
                uom='d'
              }
        }
   return {number:value,uom:uom};
  }
  getForm(form:any,user:any,visit:any, order:any){
    
    return new Promise((resolve, reject) => {
       // alert('get form')
    if (!form.obSets)
        form.obSets=[];
   
    if (user&&visit){
      this.formFilter={
        formIDs: [form._id], 
        patientID: user._id, 
        visitID: visit._id,
       visitDate:visit.visitDate,
        procedureDate: form.procedureDate
       }
    }
    else if (user&&!visit){
      this.formFilter={
        formIDs: [form._id], 
        patientID: user._id, 
       
     
       }
    }
    else{
     this.formFilter={
        formIDs: [form._id]
      }
    }
    

    this.categoryService.getFormById(this.formFilter).then((data)=>{

      this.temp=data;
      console.log ('form from service=====', this.temp)
    if (this.temp.length>0){
      form.obSets =this.temp[0].obSets;
      
      form.name= this.temp[0].name;

      form.label=this.temp[0].label;
      form.formType=this.temp[0].formType;
      form.formStyle=this.temp[0].formStyle;
      form.followupType=this.temp[0].followupType;
      form.image=this.temp[0].image;
      form.createdAt=this.temp[0].createdAt;
      form.createdBy=this.temp[0].createdBy;
    form.counter=this.temp[0].counter;
      this.visitObIDs=[];
      this.userObIDs=[];
      this.orderObIDs=[];
      var instructionObIDs=[];
      for (let obSet of form.obSets){
        for (let ob of obSet.obs){
            if (ob.type=='instruction'){
            instructionObIDs.push(ob._id);
        }
           
        if (!ob.context||ob.context=='visit'
        ||ob.context=='image'||ob.context=='lab'||ob.context=='record'){
         
            this.visitObIDs.push(ob._id);
        }
        else if (ob.context=='patient'){
            this.userObIDs.push(ob._id)

        }
        else if (ob.context=='order'){
            this.orderObIDs.push(ob._id)
  
          }
        }
        }
      //  console.log ('visitObIDs',visitObIDs)
         this.getInstruction(instructionObIDs, form).then((data)=>{
             if (user){
                this.getvisitData(this.visitObIDs,form, user, visit).then((data)=>{
                    
                    this.getOrderData(this.orderObIDs,form, user, order).then((data)=>{
                        console.log ('orderObIDs',this.orderObIDs);
                        this.getPatientData(this.userObIDs,form, user).then((data)=>{
                    //    alert('end of form')
                      resolve(data);
                      reject(new Error('error'));
                    })
                  })
                })
             }
             else{
                resolve('resolved');
                reject(new Error('error'));
             }
     
    })
      }
      else{
         // alert('no form')
        resolve('resolved');
        reject(new Error('error'));
      }
     })
    })
  }
  getInstruction(obIDs:any, form:any){
    return new Promise((resolve, reject) => {
        if (obIDs.length>0){
      this.categoryService.getCategoriesByFilter({'_id':{'$in':obIDs}}).then((data)=>{
        this.temp=data;
        for (let item of this.temp){
            for (let obSet of form.obSets){
                for (let ob of obSet.obs){
                    if (item._id==ob._id){
                        ob.education=item.education;
                        ob.image=item.image;
                    }
                }
            }
        }
        resolve('resolved');
        reject(new Error('error')); 

      })
    }
    else{
        resolve('resolved');
        reject(new Error('error')); 
    }
    })

  }
  getOrderData(obIDs:any, form:any, user:any,order:any){
    return new Promise((resolve, reject) => {
        
        if (order){
            var orderID=order._id
        }
        
    if (obIDs.length>0){
        if (order){
      var visitFilter={
        patientID:user._id,
        orderID:orderID,
        obID:{'$in':obIDs}
      }
      this.dataService.getDatasByFilter2(visitFilter).then((data)=>{
        this.temp=data;
        this.loading=false;
       
      //  console.log ('ob order values ', this.temp)
       
        for (let obSet of form.obSets){
         
            for (let ob of obSet.obs){
              
             for (let item of this.temp){
                 
                 if (ob._id==item.obID&&orderID==item.orderID){
                   
                   

                        ob.value=item.value;
                        ob.values=[];
                      
                        if (item.values){
                         for (let value of item.values){  
                             if (value&&value.text){
                                 ob.values.push(value)
                             }
                             else if (value&&!value.text){
                                 for (let option of ob.options){
                               
                                     if(option.text==value){
                                         ob.values.push(option)
                                     }
                                 }
                             }
                         }
                     }
                     if (ob.type=='calculation'){
                        obSet.values=[];
                        obSet.values=ob.values
                        
                        
                    }
                        ob.dataID=item._id;
                    
                  
                 }
               }
            }
                
                    
            }
            resolve('resolved');
            reject(new Error('error'));
          })
        }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }

    }
    else{

      resolve('resolved');
      reject(new Error('error'));
    }
  })
  }
  getvisitData(obIDs:any, form:any, user:any,visit:any){
    return new Promise((resolve, reject) => {
        if (visit){
            var visitID=visit._id;
        }
       
        
    if (obIDs.length>0){
        if (visit){
      var visitFilter={
        patientID:user._id,
        visitID:visitID,
        obID:{'$in':obIDs}
      }
      this.dataService.getDatasByFilter2(visitFilter).then((data)=>{
        this.temp=data;
        this.loading=false;
       
       // console.log ('ob visit values ', this.temp)
       
        for (let obSet of form.obSets){
         
            for (let ob of obSet.obs){
              
             
           //  console.log ('ob',ob.label.ch, ob.context)
            
              for (let item of this.temp){
                 
                 if (ob._id==item.obID&&visitID==item.visitID){
                   
                    if (!ob.context||ob.context=='visit'
                    ||ob.context=='image'||ob.context=='lab'||ob.context=='record'){

                           ob.dataID=item._id;
                           ob.value=item.value;
                           ob.values=[];
                           if (item.values){
                            for (let value of item.values){  
                                if (value&&value.text){
                                    ob.values.push(value)
                                }
                                else if (value&&!value.text){
                                    for (let option of ob.options){
                                  
                                        if(option.text==value){
                                            ob.values.push(option)
                                        }
                                    }
                                }
                            }
                        }
                        if (ob.type=='calculation'){
                            obSet.values=[];
                            obSet.values=ob.values
                            
                            
                        }
                        }
                    }
                    } 
            }
        }
                
                    
            
            resolve('resolved');
            reject(new Error('error'));
          })
        }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }

    }
    else{

      resolve('resolved');
      reject(new Error('error'));
    }
  })
  }
  getPatientData(obIDs:any, form:any,user:any){
    
    return new Promise((resolve, reject) => {
    if (obIDs.length>0){
 
      var userFilter={
        patientID:user._id,
        obID:{'$in':obIDs}
      }
      this.dataService.getDatasByFilter2(userFilter).then((data)=>{
        this.temp=data;
       console.log ('patient data values', this.temp)
       
       
        for (let obSet of form.obSets){
         
            for (let ob of obSet.obs){
              for (let item of this.temp){
                 if (ob._id==item.obID){
                          if (ob.context=='problem'&&item.problemItemID==obSet._id){
                            ob.value=item.value;
                            ob.values=[];
                            if (item.values){
                             for (let value of item.values){  
                                 if (value&&value.text){
                                     ob.values.push(value)
                                 }
                                 else if (value&&!value.text){
                                     for (let option of ob.options){
                                   
                                         if(option.text==value){
                                             ob.values.push(option)
                                         }
                                     }
                                 }
                             }
                         }
                            ob.dataID=item._id;
                          }
                          else if  (ob.context=='medication'&&item.medicationItemID==obSet._id){
                            ob.value=item.value;
                            ob.values=[];
                            if (item.values){
                             for (let value of item.values){  
                                 if (value&&value.text){
                                     ob.values.push(value)
                                 }
                                 else if (value&&!value.text){
                                     for (let option of ob.options){
                                   
                                         if(option.text==value){
                                             ob.values.push(option)
                                         }
                                     }
                                 }
                             }
                         }
                            ob.dataID=item._id;
                          }
                          else if (ob.context=='patient'){
                            ob.value=item.value;
                            ob.values=[];
                            if (item.values){
                             for (let value of item.values){  
                                 if (value&&value.text){
                                     ob.values.push(value)
                                 }
                                 else if (value&&!value.text){
                                     for (let option of ob.options){
                                   
                                         if(option.text==value){
                                             ob.values.push(option)
                                         }
                                     }
                                 }
                             }
                         }
                            ob.dataID=item._id;
                          }
                       //   console.log ('ob before save=========',ob.label.ch, ob.changed,ob.context,ob.dataID)
                      }
                    }
                    if (ob.type=='calculation'){
                        obSet.values=[];
                        obSet.values=ob.values
                        
                        
                    }
                  }
                
                    
            }
           
            resolve(data);
            reject(new Error('error'));
          })


    }
    else{
       
      resolve('resolved');
      reject(new Error('error'));
    }
  })
  }

bulkSaveObSet(obSet:any,user:any,visit:any,order:any,changeObs:any){
    return new Promise((resolve, reject) => {
        console.log ('obSet', obSet)
    this.obDatas=[];
    var obs=[];
    this.problems=[];
    this.images=[];
    this.labs=[];
    this.records=[];
    this.medications=[];
    this.educations=[];
    this.profiles=[];
    if (visit){
        var visitID=visit._id;
    }
    if (order){
        var orderID=order._id;
    }
   for (let ob of obSet.obs){
    console.log ('changeObs',changeObs)
    if (ob.changed||(changeObs&&changeObs.indexOf(ob._id)>-1)){
    console.log ('ob.changed==========', ob.label.ch, ob.changed)
  //  if (ob.changed){ 
     ob.changed=false;
     var valueList=[];
     if (ob.values){
        for (let  value of ob.values){
            if (value&&value.text)
            valueList.push(value.text);
         }
     }
   
    //   alert('got here')
        if (!ob.dataID){
            if (ob.context=='order'){
                obs.push({
                    obID:ob._id,
                    patientID:user._id,
                    visitID:visit._id,
                    orderID:orderID,
                    value:ob.value,
                    values:valueList,
                    createdBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='problem'){
                obs.push({
                    obID:ob._id,
                    patientID:user._id,
                    problemItemID:obSet._id,
                    value:ob.value,
                    values:valueList,
                    createdBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='medication'){
                obs.push({
                    obID:ob._id,
                    patientID:user._id,
                    medicationItemID:obSet._id,
                    value:ob.value,
                    values:valueList,
                    createdBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='patient'){
                console.log ('add user ob========= no value', ob.dataID)
                obs.push({
                    obID:ob._id,
                    patientID:user._id,
                    value:ob.value,
                    values:valueList,
                    createdBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else{
               
                    obs.push({
                        obID:ob._id,
                        patientID:user._id,
                        visitID:visitID,
                        value:ob.value,
                        values:valueList,
                        createdBy:{
                            _id:this.user._id,
                            name:this.user.name,
                            title:this.user.title
    
                        }
                    })
                
            }
            
        }
        else {
            console.log ('add user ob========= has value!!!', ob.dataID)
         
             if (ob.context=='order'){
                this.obDatas.push({
                    _id:ob.dataID,
                    obID:ob._id,
                    patientID:user._id,
                    visitID:visit._id,
                    orderID:orderID,
                    value:ob.value,
                    values:valueList,
                    modifiedBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='problem'){
                this.obDatas.push({
                    _id:ob.dataID,
                    obID:ob._id,
                    patientID:user._id,
                    problemItemID:obSet._id,
                    value:ob.value,
                    values:valueList,
                    modifiedBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='medication'){
                this.obDatas.push({
                    _id:ob.dataID,
                    obID:ob._id,
                    patientID:user._id,
                    medicationItemID:obSet._id,
                    value:ob.value,
                    values:valueList,
                    modifiedBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else if (ob.context=='patient'){
                this.obDatas.push({
                    _id:ob.dataID,
                    obID:ob._id,
                    patientID:user._id,
                    value:ob.value,
                    values:valueList,
                    modifiedBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
            else {
                this.obDatas.push({
                    _id:ob.dataID,
                    obID:ob._id,
                    patientID:user._id,
                    visitID:visitID,
                    value:ob.value,
                    values:valueList,
                    modifiedBy:{
                        _id:this.user._id,
                        name:this.user.name,
                        title:this.user.title

                    }
                })
            }
         
            
        }
   if (ob.context=='image'){
    this.images.push({_id:ob.value, 
                obID:ob._id, 
                userID:user._id,
                uploaded:'true'

            })
        }
 else if (ob.context=='lab'){
    this.labs.push({_id:ob.value, 
                obID:ob._id, 
                userID:user._id,
                uploaded:'true'

            })
        }
 else if (ob.context=='record'){
    this.records.push({_id:ob.value, 
                obID:ob._id, 
                userID:user._id,
                uploaded:'true'

            })
        }
        //process value
  if (ob.values&&ob.values.length>0){
    for (let value of ob.values){
        if (value&&value.problems){
            if (value.comments=='family'){
                var familyMember=value.text;
                }
            else{
                familyMember='self';
                }
            for (let problem of value.problems){
                this.problems.push({
                    patientID:user._id,
                    problemItemID:problem._id,
                    problemItem:problem,
                    familyMember:familyMember,
                    label:problem.label
                })
            }
         
        }
        if (value&&value.medications){
            for (let medication of value.medications){
                this.medications.push({
                    userID:user._id,
                    medicationitemID:medication._id,
                    medicationItem:medication,
                    label:medication.label,
                    status:'active'
                })
            }
            
        }
        if (value&&value.forms){
            for (let form of value.forms){
                if (form.formType=='education')
                this.educations.push(form)
            }
         }
        if (value&&value.profiles){
            for (let profile of value.profiles){
               
                  user.profiles.push(profile)
            }
         }
      } 
    }
        
   }
    
  }
this.insertObs(obs).then((data)=>{
    this.updateObs(this.obDatas).then((data)=>{
        this.updateProblems(this.problems,user).then((data)=>{
            this.updateMedications(this.medications,user).then((data)=>{
                this.updateImages(this.images).then((data)=>{
                    this.updateLabs(this.labs).then((data)=>{
                        this.updateRecords(this.records).then((data)=>{
                            this.updatePatient(this.educations,this.profiles,user).then((data)=>{
                                if (obSet.registry){
                                    this.updatePatientRegistry(obSet, user,changeObs).then((data)=>{
                                        resolve('resolved');
                                        reject(new Error('error'));
                                    })
                                }
                                else{
                                    resolve('resolved');
                                    reject(new Error('error'));
                                }
                    
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

insertObs(obs:any){

    return new Promise((resolve, reject) => {
        console.log ('obs to created value for', obs)
    if (obs.length>0){
        //insert many
        this.dataService.createMany(obs).then((data)=>{
            console.log ('bulk data created', data );

            resolve(data);
            reject(new Error('error'));
        })
    }
    else {
        resolve('resolved');
        reject(new Error('error'));
    }
})
}
updateObs(obs:any){
    console.log ('ob to update',obs)
    return new Promise((resolve, reject) => {
    if (obs.length>0){
        var obTotal=0;
        for (let ob of obs){
            this.dataService.update(ob).then((data)=>{
                console.log ('ob updated=========',data)
                    obTotal++;
                    if (obTotal==obs.length){
                        resolve('resolved');
                        reject(new Error('error'));
                    }
            })
        }
    }
    else{
        resolve('resolved');
        reject(new Error('error'));
    }
})
}
updateProblems(problems:any,user:any){

    console.log ('problems', problems)
    return new Promise((resolve, reject) => {
        if (problems.length>0){
    this.problemService.getProblemByFilter({patientID:user._id}).then((data)=>{
        this.temp=data;
        var newProblems=[];
        for (let problem of problems){
            if (!this.findProblem(problem, this.temp)){
                newProblems.push(problem);
            }
        }

        console.log ('newProblems', newProblems)
                if (newProblems.length>0){
                    this.problemService.createMany(newProblems).then((data)=>{
                        
                        resolve('resolved');
                        reject(new Error('error'));
                    },
                    (err) => {
                        console.log('error creating problem:',err)
                        resolve('resolved');
                        reject(new Error('error'));

                        });
                }
                else{
                    resolve('resolved');
                    reject(new Error('error'));
                }
            
         
        
    
    })
}
else{
    resolve('resolved');
    reject(new Error('error'));

}
})
    

}
updateMedications(medications:any, user:any){
    console.log ('medications taken==========', medications)
    return new Promise((resolve, reject) => {
        if (medications.length>0){
    this.medsService.getMedsByFilter({userID:user._id}).then((data)=>{
        this.temp=data;
        console.log ('medications taken form database==========', this.temp)
        var newMedications=[];
        for (let medication of medications){
            if (!this.findMedicationItem(medication, this.temp)){
                newMedications.push(medication);
            }
        }

                if (newMedications.length>0){
                    this.medsService.createMany(newMedications).then((data)=>{
                        console.log ('meds created', data)
                        resolve('resolved');
                        reject(new Error('error'));
                    })
                }
                else{
                    resolve('resolved');
                    reject(new Error('error'));
                }
            
        
    })
}
else{
    resolve('resolved');
    reject(new Error('error'));

}
})
}
updatePatientRegistry(obSet:any, user:any,changeObs:any){
    return new Promise((resolve, reject) => {
        var change=0;
        for (let ob of obSet.obs){
        if (ob.changed||(changeObs&&changeObs.indexOf(ob._id)>-1)){
            
              if (ob.label.en=='birthday'&&ob.value){
                user.birthday=ob.value;
                change++;
                }
                
        else  if (ob.label.en=='name'&&ob.value){
            user.name=ob.value;
            change++;
              }
            
        else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
            user.gender=ob.values[0].text;
            change++;
              }
              
        else if (ob.label.en=='ssn'&&ob.value){
            user.ssn=ob.value;
            change++;
              }
                
        else if (ob.label.en=='phone'&&ob.value){
            user.phone=ob.value;
            change++;
                
              }
              
        else if (ob.label.en=='photo'&&ob.value){
            user.photo=ob.value;  
            change++;
              
              }
              
        else if (ob.label.en=='city'&&ob.value){
            user.city=ob.value;  
            change++;
              
              }   
        else if (ob.label.en=='device registry ID'&&ob.value){
                user.deviceUserID=ob.value; 
                change++; 
            //    alert('got device id')
                  }    
        else if (ob.label.en=='age formula'&&ob.value){
          //alert('ob.label.en'+ob.label.en)
          user.ageObj={number:ob.value,uom:ob.uom};
          change++;
               
              }
            }
        }
        if (change>0)
        {
        this.userService.updateUser({'_id':user._id,
                                    name:user.name,
                                    birthday:user.birthday,
                                    gender:user.gender,
                                    photo:user.photo,
                                    deviceUserID:user.deviceUserID,
                                    phone:user.phone,
                                    ssn:user.ssn,
                                    city:user.city})
                                    .then((data)=>{
                                        if (user._id==this.patient._id){
                                            this.storage.set('patient',user)
                                        }
                                        for (let patient of this.selectedPatients){
                                            if (patient._id==user._id){
                                                patient=user;
                                                this.storage.set('selectedPatients', this.selectedPatients)
                                            }
                                        }
                                        resolve('resolved');
                                        reject(new Error('error'));
                                    })
                                }
                                else{
                                    resolve('resolved');
                                    reject(new Error('error'));
                                }
    })
}
updatePatient(educations:any,profiles:any,user:any){
    return new Promise((resolve, reject) => {
if (educations.length==0&&profiles.length==0){
    resolve('resolved');
    reject(new Error('error'));
}
else if (educations.length>0&&profiles.length>0){
if (!user.educations)
    user.educations=[];
var userEducations=user.educations;
if (!user.profiles)
    user.profiles=[];

var userProfiles=user.profiles;
for (let educationItem of educations){
        if (!this.findItem(educationItem,userEducations)){
        user.educations.push(educationItem)
        }
}
for (let profileItem of profiles){
    if (!this.findItem(profileItem,userProfiles)){
    user.profiles.push(profileItem)
    }
}
this.userService.updateUser({'_id':user._id,
'educations':user.educations, 
'profiles':user.profiles}).then((data)=>{
    resolve('resolved');
    reject(new Error('error'));
  })
}
else if (educations.length>0&&profiles.length==0){
    if (!user.educations)
        user.educations=[];
    var userEducations=user.educations;
    
    for (let educationItem of educations){
            if (!this.findItem(educationItem,userEducations)){
            user.educations.push(educationItem)
            }
    }
    
    this.userService.updateUser({'_id':user._id,
    'educations':user.educations}).then((data)=>{
        resolve('resolved');
        reject(new Error('error'));
      })
    }
else if (educations.length==0&&profiles.length>0){
    if (!user.profiles)
    user.profiles=[];

    var userProfiles=user.profiles;

for (let profileItem of profiles){
    if (!this.findItem(profileItem,userProfiles)){
    user.profiles.push(profileItem)
    }
}
        this.userService.updateUser({'_id':user._id,
        'profiles':user.profiles}).then((data)=>{
            resolve('resolved');
            reject(new Error('error'));
          })
        }
})
}

findProblem(problem:any, problems:any){

    for (let item of problems){
        if (problem.problemItemID==item.problemItemID
            &&problem.familyMember==item.familyMember){
                return true;
            }
    }
return false;
}
findMedicationItem(medication:any, medications:any){
    for (let item of medications){
        if (medication.medicationItemID==item.medicationItemID){
                return true;
            }
    }
return false;

}

saveUserForm(form:any,user:any){
    return new Promise((resolve, reject) => {
    this.obs=[];
    this.dataObs=[];
    this.valueList=[];
    console.log ('form.obSets[0].changeObs',form.obSets[0].changeObs);
    if (user._id){
        this.updateUser(form.obSets[0], user).then((data)=>{
            this.temp=data;
            user=this.temp;
            for (let ob of form.obSets[0].obs){
                if (ob.values){
                    this.valueList=[];
                    for (let  value of ob.values){
                        if(value&&value.text)
                        this.valueList.push(value.text);
                     }
                 }
                
                console.log ('ob', ob.label.ch,ob.changed)
                if (ob.changed||(form.obSets[0].changeObs&&form.obSets[0].changeObs.indexOf(ob._id)>-1)){
              //  if (ob.changed){
                    ob.changed=false;
                    if (!ob.dataID){
                        this.obs.push({
                            obID:ob._id,
                            registryUserID:user._id,
                            value:ob.value,
                            values:this.valueList
                        })
                    }
                    else{
                        this.dataObs.push({
                            _id:ob.dataID,
                            obID:ob._id,
                            registryUserID:user._id,
                            value:ob.value,
                            values:this.valueList
                        })
                    }
            }
        
        }
     
            this.createUserObValue(this.obs).then((data)=>{
                this.updateUserObValue(this.dataObs).then((data)=>{
                
                    resolve(user);
                    reject(new Error('error'));
                })
            })
           
        })
    }
    else{
        this.createUser(form.obSets[0], user).then((data)=>{
           
            this.temp=data;
            user=this.temp;
            console.log 
            for (let ob of form.obSets[0].obs){
                if (ob.values){
                    this.valueList=[];
                    for (let  value of ob.values){
                        if (value&&value.text)
                        this.valueList.push(value.text);
                     }
                 }
                console.log ('ob', ob.label.ch,ob.changed)
                if (user._id){
                if (ob.changed||(form.obSets[0].changeObs&&form.obSets[0].changeObs.indexOf(ob._id)>-1)){
              //  if (ob.changed){
                    ob.changed=false;
                  
                        this.obs.push({
                            obID:ob._id,
                            registryUserID:user._id,
                            value:ob.value,
                            values:this.valueList
                        })
                    
                  
             }
            }
            }
            this.createUserObValue(this.obs).then((data)=>{
                    resolve(user);
                    reject(new Error('error'));
               
            })
       
        })
    }
  
})
}

createUserObValue(obs:any){
    return new Promise((resolve, reject) => {
        console.log ('obs to be created', obs)
        if (obs.length>0){
            this.dataService.createMany(obs).then((data)=>{
                resolve('resolved');
                reject(new Error('error'));
            })
        }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }
    })
}
updateUserObValue(obs:any){
    return new Promise((resolve, reject) => {
       
        var count=0;
        if (obs.length>0){
           
           for (let ob of obs){
                this.dataService.update(ob).then((data)=>{
                
                    count++;
                    if (count==obs.length){
                        resolve('resolved');
                        reject(new Error('error')); 
                    }
                   
                })
           }
        }
        else{
            resolve('resolved');
            reject(new Error('error'));
        }
    })
}
updateUser(obSet:any, user:any){
    return new Promise((resolve, reject) => {
        
        for (let ob of obSet.obs){
      //  if (ob.changed||(obSet.changeObs&&obSet.changeObs.indexOf(ob._id)>-1)){
            
              if (ob.label.en=='birthday'&&ob.value){
                user.birthday=ob.value;
                
                }
                
        else  if (ob.label.en=='name'&&ob.value){
            user.name=ob.value;
            
              }
            
        else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
            for (let value of ob.values){
                if (value&&value.text){
                    user.gender=value.text;
                }
            }
           
            
              }
              
        else if (ob.label.en=='ssn'&&ob.value){
            user.ssn=ob.value;
            
              }
                
        else if (ob.label.en=='phone'&&ob.value){
            user.phone=ob.value;
            
                
              }
              
        else if (ob.label.en=='photo'&&ob.value){
            user.photo=ob.value;  
            
              
              }
              
        else if (ob.label.en=='city'&&ob.value){
            user.city=ob.value;  
            
              
              }   
        else if (ob.label.en=='title'&&ob.value){
                user.title=ob.value; 
                
            //    alert('got device id')
                  }    
        else if (ob.label.en=='specialty'&&ob.value){
          //alert('ob.label.en'+ob.label.en)
          user.specialty=ob.value; 
        
               
              }
     //       }
        }
        
        this.userService.updateUser(user).then((data)=>{
                                        resolve(data);
                                        reject(new Error('error'));
                                    })
                                
                              
    })

}
createUser(obSet:any, user:any){
    return new Promise((resolve, reject) => {
        
        for (let ob of obSet.obs){
      //  if (ob.changed||(obSet.changeObs&&obSet.changeObs.indexOf(ob._id)>-1)){
            
        if (ob.label.en=='birthday'&&ob.value){
                user.birthday=ob.value;
                
                }
                
        else  if (ob.label.en=='name'&&ob.value){
            user.name=ob.value;
            
              }
            
        else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
            for (let value of ob.values){
                if (value&&value.text){
                    user.gender=value.text;
                }
            }
           
            
            
              }
              
        else if (ob.label.en=='ssn'&&ob.value){
            user.ssn=ob.value;
            
              }
                
        else if (ob.label.en=='phone'&&ob.value){
            user.phone=ob.value;
            
                
              }
              
        else if (ob.label.en=='photo'&&ob.value){
            user.photo=ob.value;  
            
              
              }
              
        else if (ob.label.en=='city'&&ob.value){
            user.city=ob.value;  
            
              
              }   
        else if (ob.label.en=='title'&&ob.value){
                user.title=ob.value; 
                
            //    alert('got device id')
                  }    
        else if (ob.label.en=='specialty'&&ob.value){
          //alert('ob.label.en'+ob.label.en)
          user.specialty=ob.value; 
        
               
              }
     //       }
        }
        user.password='1a2b3c';
        user.email=user.name+'@db.com';
        this.userService.createUser(user).then((data)=>{
            console.log ('created user', data)
            resolve(data);
            reject(new Error('error'));
                                    })
                                
                              
    })

}
registryUser(obSet:any, user:any){
    return new Promise((resolve, reject) => {
        
        for (let ob of obSet.obs){
      //  if (ob.changed||(obSet.changeObs&&obSet.changeObs.indexOf(ob._id)>-1)){
            
        if (ob.label.en=='birthday'&&ob.value){
                user.birthday=ob.value;
                
                }
                
        else  if (ob.label.en=='name'&&ob.value){
            user.name=ob.value;
            
              }
            
        else if (ob.label.en=='gender'&&ob.values&&ob.values.length>0){
            for (let value of ob.values){
                if (value&&value.text){
                    user.gender=value.text;
                }
            }
            
              }
              
        else if (ob.label.en=='ssn'&&ob.value){
            user.ssn=ob.value;
            
              }
                
        else if (ob.label.en=='phone'&&ob.value){
            user.phone=ob.value;
            
                
              }
              
        else if (ob.label.en=='photo'&&ob.value){
            user.photo=ob.value;  
            
              
              }
              
        else if (ob.label.en=='city'&&ob.value){
            user.city=ob.value;  
            
              
              }   
        else if (ob.label.en=='title'&&ob.value){
                user.title=ob.value; 
                
            //    alert('got device id')
                  }    
        else if (ob.label.en=='specialty'&&ob.value){
          //alert('ob.label.en'+ob.label.en)
          user.specialty=ob.value; 
        
               
              }
     //       }
        }
        if (!user.password){
            user.password='1a2b3c';
        }
         
          if (!user.email){
            user.email=user.name+'@db.com';
          }
     
        this.auth.createAccount(user).then((data)=>{
            console.log ('created account', data);
            this.temp=data;
            this.token=this.temp.token;
            this.storage.set('token', this.token)
            resolve(data);
            reject(new Error('error'));
                                    })
                                
                              
    })

}
registryUserForm(form:any,user:any){
    return new Promise((resolve, reject) => {
    this.obs=[];
    this.dataObs=[];
    this.valueList=[];
  
   
        this.registryUser(form.obSets[0], user).then((data)=>{
           
            this.temp=data;
            user=this.temp.user;
            console.log 
            for (let ob of form.obSets[0].obs){
                if (ob.values){
                    this.valueList=[];
                    for (let  value of ob.values){
                        if (value&&value.text)
                        this.valueList.push(value.text);
                     }
                 }
           
                if (user._id){
                if (ob.changed||(form.obSets[0].changeObs&&form.obSets[0].changeObs.indexOf(ob._id)>-1)){
              //  if (ob.changed){
                    ob.changed=false;
                 
                        this.obs.push({
                            obID:ob._id,
                            registryUserID:user._id,
                            value:ob.value,
                            values:ob.values
                        })
                    
                 
                }
              }
            }
         
           if (this.token){
            this.createUserObValue(this.obs).then((data)=>{
                resolve(user);
              reject(new Error('error'));
         
          })
           }
           
        
        })
    
  
})
}
registryPatientForm(form:any,user:any){
    return new Promise((resolve, reject) => {
    this.obs=[];
    this.dataObs=[];
    this.valueList=[];
   
    
   
        this.registryUser(form.obSets[0], user).then((data)=>{
           
            this.temp=data;
            user=this.temp.user;
          
            for (let ob of form.obSets[0].obs){
                if (ob.values){
                    this.valueList=[];
                    for (let  value of ob.values){
                        if (value&&value.text)
                        this.valueList.push(value.text);
                     }
                 }
               
                if (user._id){
                if (ob.changed||(form.obSets[0].changeObs&&form.obSets[0].changeObs.indexOf(ob._id)>-1)){
              //  if (ob.changed){
                    ob.changed=false;
                  
                        this.obs.push({
                            obID:ob._id,
                            patientID:user._id,
                            value:ob.value,
                            values:this.valueList
                        })
                    
                 
            }
                }
            }
            if (this.token){
                this.createUserObValue(this.obs).then((data)=>{
                    resolve(user);
                  reject(new Error('error'));
             
              })
               }
        
        })
    
  
})
}
}