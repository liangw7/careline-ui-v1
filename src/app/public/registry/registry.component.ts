import {
  Component, OnInit, Inject, HostListener, AfterViewInit, OnDestroy
} from '@angular/core';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from 'src/app/core/common-services';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Data, User } from 'src/app/core/models';

@Component({
  selector: 'registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit, AfterViewInit, OnDestroy {
  marketList: any;
  temp: any;
  providerList: any;
  newPatient: any;
  service: any;
  profile: any;
  selectedIndex: any;
  registryList: any;
  user: any;
  photoList: any;
  loading: any;
  language: any;
  loginType: any;
  subscription: Subscription;
  screenWidth: any;
  bigScreen: any;
  registryForms: any
  email: any;
  password: any;
  patient: any;
  phone: any;
  popOut:any;
  types:any;
  role:any;
  typeList:any;
  filter:any;
  userType:any;
  forms:any;
  adminRole:any;
 registry:any;
  registryUser:any;// = new User();
  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    public dialogRef: MatDialogRef<RegistryComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.getScreenSize();
    console.log('this.screenWidth', this.screenWidth)
    console.log('this.bigScreen', this.bigScreen)
    this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;
      });
    if (data){
      console.log ('data', data)
      this.popOut=data.popOut;
      this.role=data.role;
      this.registryUser=data.user;
      this.adminRole=data.adminRole;
    }
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
    
      this.userType = params['userType'];
      this.registry=params['registryUser'];
      
      console.log('this.userType', this.userType);
    
    });
  }
 ngOnInit() {
  if (this.registry){
    this.phone = this.registry.phone;
    this.email = this.registry.email;
    this.password = this.registry.password;
   }
    if (this.userType==0){
      this.getForm('general registry');
    }
    else {
      if (this.adminRole){
        this.getForm(this.adminRole);
      }
      else{
        this.getUserTypes();
      }
      
    }
 
   
  }
onOptionChange($event:any){
  this.adminRole=$event.value
    this.getForm(this.adminRole);
  }

getUserTypes(){
  this.typeList=[];
  this.allService.categoryService.getCategoriesByFilter({ 'formType': 'user' }).then((data: any) => {
    this.temp = data;
    this.typeList = this.temp;
    for (let item of this.typeList){
      if (item.label.en=='service'){
        var index=this.typeList.indexOf(item);
        this.typeList.splice(index,1)
      }
    }
    console.log ('types', this.types)

  })
}
  createUser() {
    debugger;
    let obs = this.registryForms[0].obSets[0].obs;
    if (obs[0].value) {
      let name = obs[0].value;
      this.registryUser.name = name;
    }else{
      this.allService.alertDialogService.warn('请填写姓名');
      return;
    }
    if (obs[1].values) {
      let gender = obs[1].values[0].text;
      this.registryUser.gender = gender;
    }else{
      this.allService.alertDialogService.warn('请选择性别');
      return;
    }
    if (obs[2].value) {
      let birthday = obs[2].value;
      this.registryUser.birthday = birthday;
    }else{
      this.allService.alertDialogService.warn('请选择生日');
      return;
    }
    if (obs[3].values) {
      let city = obs[3].values[0].text;
      this.registryUser.city = city;
    }else{
      this.allService.alertDialogService.warn('请选择城市');
      return;
    }
    console.log(this.registryUser);
    this.registerPatient();
  }


  ngAfterViewInit() {

  }

  getUrl(market: any) {
    return this.allService.utilService.getImageUrl(String(market.photo));
  }

  registryService(service: any, profile: any) {
    this.service = this.storage.set('service', service)
    this.profile = this.storage.set('profile', profile)
    this.router.navigate(['/homepage/registry']);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


  registerPatient() {
    debugger;
    this.registryUser.email = this.email;
    this.registryUser.password = this.password;
    this.registryUser.phone = this.phone;
    this.registryUser.role = 'patient';
    // this.registryUser.profiles = this.registryForms;


    this.allService.authService.createAccount(this.registryUser).then((res: any) => {
      this.temp = res;
      this.storage.set('bigScreen', this.bigScreen);

      console.log("Already authorized", res);

      this.user = this.storage.get('user');

      this.patient = this.user;
      this.storage.set('patient', this.temp.user);
      this.storage.set('user', this.temp.user);
      var obs: any[] = [];
      var dataObs: any = [];
      return new Promise((resolve, reject) => {
        for (let ob of this.registryForms[0].obSets[0].obs) {
          console.log('ob', ob.label.ch, ob.changed)
          if (ob.changed || (this.registryForms[0].obSets[0].changeObs && this.registryForms[0].obSets[0].changeObs.indexOf(ob._id) > -1)) {
            //  if (ob.changed){
            var model: any = {
              obID: ob._id,
              registryUserID: this.user._id,
              patientID: this.user._id,
              value: ob.value,
              values: ob.values
            }
            ob.changed = false;
            if (!ob.dataID) {
              obs.push(model)
            } else {
              dataObs.push(model)
            }
          }
        }
        this.createUserObValue(obs).then(() => {
          this.updateUserObValue(dataObs).then(() => {
            this.router.navigate(['/provider-platform/patient/profile']);
            resolve('resolved');
            console.log('--formService--saveUserForm--end--');
            reject(new Error('error'));
          })
        })
      })
    })
  }


  createUserObValue(obs: any) {
    console.log('--formService--createUserObValue--start--');
    return new Promise((resolve, reject) => {
      console.log('obs to be created', obs)
      if (obs.length > 0) {
        this.allService.datasService.createObs(obs).then(() => {
          resolve('resolved');
          console.log('--formService--createUserObValue--end--');
          reject(new Error('error'));
        })
      } else {
        resolve('resolved');
        console.log('--formService--createUserObValue--end--');
        reject(new Error('error'));
      }
    })
  }


  updateUserObValue(obs: any) {
    console.log('--formService--updateUserObValue--start--');
    return new Promise((resolve, reject) => {
      console.log('obs to be updated', obs)
      var count = 0;
      if (obs.length > 0) {
        for (let ob of obs) {
          this.allService.datasService.update(ob).then(() => {
            count++;
            if (count == ob.length) {
              resolve('resolved');
              console.log('--formService--updateUserObValue--end--');
              reject(new Error('error'));
            }
          })
        }
      } else {
        resolve('resolved');
        console.log('--formService--updateUserObValue--end--');
        reject(new Error('error'));
      }
    })
  }


  getForm(name:any) {
    this.forms = [];
    this.loading = true;
     if (this.userType==0){
      this.filter={ 'formType':name}
     }
     else{
      this.filter={ 'label.en':name}
     }
    
    
    this.allService.categoryService.getCategoriesByFilter(this.filter).then((data) => {
      this.forms = data;
      console.log('registry forms=========', this.forms);
      console.log('user=========', this.registryUser);
      if (!this.registryUser){
        this.allService.formService.getForm(this.forms[0], null, null, null).then((data) => {
          this.loading = false;
        })
      }
      else{
        this.allService.categoryService.getFormById({formIDs:[this.forms[0]._id]}).then((data)=>{
          // this.categoryService.getUserForm({formIDs:[type._id], userID:user._id}).then((data)=>{
             this.loading=false;
             this.forms=data;
             var obIDs=[]
             for (let form of this.forms){
               for (let obSet of form.obSets){
                 for (let ob of obSet.obs){
                     obIDs.push(ob._id)
                 }
               }
             }
             this.allService.datasService.getDatasByFilter2({obID:{'$in':obIDs},registryUserID:this.registryUser._id}).then((data)=>{
               this.temp=data;
               console.log ('user data', this.temp)
               for (let item of this.temp){
               for (let form of this.forms){
                 for (let obSet of form.obSets){
                   for (let ob of obSet.obs){
                     
                         if (ob._id==item.obID){
                           ob.dataID=item._id;
                           ob.value=item.value;
                           ob.values=item.values;
                         }
                     }
                       
                   }
                 }
               }
          
           })
         })
      }
    
    })
  }
  close(){
    this.dialogRef.close();
  }

  save(){
    this.loading=true;
    //create/update clinical user
    
    if (!this.userType){
      
      if (!this.registryUser){
        this.registryUser = {role:this.adminRole}
      }
       
      this.allService.formService.saveUserForm(this.forms[0],this.registryUser).then((data)=>{
        this.loading=false;
        this.registryUser=data;
        this.dialogRef.close(this.registryUser);
        })
    }
  
 // if there is usertype, it means this page is from public platform
    else{
     
      if (this.userType==0){
        this.registryUser={role:'patient'};
       }
       //create clinical user
       else if (this.userType==1){
        this.registryUser={role:this.adminRole};
       }
      //create patient
        this.registryUser.phone=this.storage.get('phone');
        this.registryUser.email=this.storage.get('email');
        this.registryUser.password=this.storage.get('password');
        
        if (this.userType==0){
          this.allService.formService.registryPatientForm(this.forms[0],this.registryUser).
          then((data)=>{
           this.registryUser=data;
           this.storage.set('user', this.registryUser);
           
             this.router.navigate(['provider-platform/patient/patient-story']);
           
       
          })
        }
        else{
          this.allService.formService.registryUserForm(this.forms[0],this.registryUser).
          then((data)=>{
           this.registryUser=data;
           this.storage.set('user', this.registryUser);
         
             this.router.navigate(['provider-platform/provider/dashboard']);
           
          })
        }
   
    }
   
  }
}
