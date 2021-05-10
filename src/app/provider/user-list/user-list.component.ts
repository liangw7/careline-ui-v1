
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { RegistryComponent } from '../../public/registry/registry.component';
import { AllServices } from '../../core/common-services';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  userType: any;
  registryUsers: any;
  formId: any;
  found: any;
  user: any;
  temp: any;
  typeList: any;
  forms: any;
  registryUser: any;
  newUser: any;
  loading: any;
  language: any;
  subscription: Subscription;

  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router) {

    this.language = this.storage.get('language')

    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;

      });
  }


  ngAfterViewInit() {

  }


  ngOnInit() {

    this.loading = true;
    this.user = this.storage.get('user')
    this.allService.categoryService.getCategoriesByFormType('user').then((data: any) => {
      this.loading = false;
      this.temp = data;
      this.typeList = this.temp;
      console.log('this.typeList', this.typeList)
    })
  }


  foundProfile(profile: any, profileList: any) {

    for (let itemProfile of profileList) {
      if (itemProfile._id == profile._id) {
        return true
      }
    }
    return false;
  }

  getType(type: any) {
    this.registryUsers = [];
    this.allService.usersService.getByFilter({ role: type }).then((data: any) => {
      console.log('user list', data)
      this.registryUsers = data;
      for (let user of this.registryUsers) {
        if (!user.status) {
          user.status = ''
        }
      }
      if (this.registryUsers)
        this.loading = false;
      console.log('this.registryUsers', this.registryUsers)
    }, (err: any) => {
      console.log("not allowed");
    });

  }


  getTypeName(type: any) {

    if (this.language == 'Chinese')
      return type.label.ch;
    else if (this.language == 'English')
      return type.label.en;
  }


  tabSelectionChanged(event: any) {

    let selectedTab = event.tab;

    if (selectedTab.textLabel == '系统管理' || selectedTab.textLabel == 'admin')
      this.getType('admin');
    else if (selectedTab.textLabel == '科室' ||
      this.language == 'English' && selectedTab.textLabel == 'service')
      this.getType('service');
    else if (selectedTab.textLabel == '医生' || selectedTab.textLabel == 'provider')
      this.getType('provider');
    else if (selectedTab.textLabel == '物理治疗师'
      || this.language == 'English' && selectedTab.textLabel == 'physicalTherapist')
      this.getType('physicalTherapist');
      else if (selectedTab.textLabel == '病案管理师'
      || this.language == 'English' && selectedTab.textLabel == 'caseManager')
      this.getType('caseManager');
    else if (selectedTab.textLabel == '市场运营员'
      || this.language == 'English' && selectedTab.textLabel == 'marketOperator')
      this.getType('marketOperator');
      else if (selectedTab.textLabel == '护士'
      || this.language == 'English' && selectedTab.textLabel == 'nurse')
      this.getType('nurse');
  }


  addUser(type: any) {

    const dialogRef = this.dialog.open(RegistryComponent, {
        width: '1200px',
        height: '800px',
        data: { 
          role: type.label.ch, 
          language: this.language, 
          popOut:true,
          adminRole:type.label.en
      //   typeList:this.typeList
            }
      });

      dialogRef.afterClosed().subscribe(
        (result) => {
        if (result) {
          console.log ('result', result)
          this.registryUsers.push(result);
        }
      });
    
  }


  getUser(type: any, user: any) {

    console.log('user before open', user)
    if (!user.profiles)
      user.profiles = [];
    
     const dialogRef = this.dialog.open(RegistryComponent, {
          width: '1200px',
          height: '800px',
          data: { role:type.label.ch,adminRole:type.label.en, user: user, language: this.language, popOut:true }
        });

        dialogRef.afterClosed().subscribe(
          (result) => {
          if (result) {
            console.log ('result', result)
            for (let user of this.registryUsers){
              if (user._id==result._id){
                user=result;
              }
            }
           
          }
        });
      
   
  }


  saveUserForm(result: any, user: any) {
    return new Promise((resolve, reject) => {
      console.log('forms in login-poster=============', result.forms)
      var total = 0;
      for (let item of result.forms) {
        for (let obSet of item.obSets) {

          for (let ob of obSet.obs) {
            total++;
            //   console.log ('ob.label',ob.label)
            if (ob.label.en == 'birthday')
              this.user.birthday = ob.value;
            else if (ob.label.en == 'name')
              this.user.name = ob.value;
            else if (ob.label.en == 'age')
              this.user.age = ob.value;
            else if (ob.label.en == 'gender' && ob.values && ob.values.length > 0)
              this.user.gender = ob.values[0].text;
            else if (ob.label.en == 'color' && ob.values && ob.values.length > 0)
              this.user.color = ob.values[0].text;
            else if (ob.label.en == 'ssn')
              this.user.ssn = ob.value;
            else if (ob.label.en == 'telephone')
              this.user.phone = ob.value;
            else if (ob.label.en == 'photo')
              this.user.photo = ob.value;
            else if (ob.label.en == 'title' && ob.values && ob.values.length > 0)
              this.user.title = ob.values[0].text;
            else if (ob.label.en == 'city' && ob.values && ob.values.length > 0)
              this.user.city = ob.values[0].text;

            else if (ob.label.en == 'specialty' && ob.values && ob.values.length > 0) {
              this.user.specialty = ob.values[0].text;
              var desc = ob.values[0].comments;
              if (!this.user.desc) {
                this.user.desc = desc;
              }
            } else if (ob.label.en == 'title description') {
              this.user.desc = ob.value;
              console.log('this.user.desc============', this.user.desc)
            } else if (ob.label.en == 'enTitle')
              this.user.enTile = ob.value;
          }

        }
      }
      if (user.role == 'service') {

        if (!user.profiles)
          user.profiles = [];
        if (!user.providers)
          user.providers = [];

        user.profiles = result.profiles;

        user.providers = result.providers;
        console.log('user.profiles======', user.profiles)
      }
      if (user.role == 'provider') {

        if (!user.profiles)
          user.profiles = [];


        user.profiles = result.profiles;


      } else if (user.role == 'market place') {

        if (!user.serviceList)
          user.serviceList = [];
        user.serviceList = result.serviceList;
        if (!user.marketList)
          user.marketList = [];
        user.marketList = result.marketList;

      }
      if (!user.introForms) {
        user.introForms = []
      }
      user.introForms = result.introForms;
      this.allService.usersService.updateUser(user).then((data: any) => {
        var indexOb = 0;

        for (let form of this.forms) {
          // var indexObSet=0;           
          for (let obSet of form.obSets) {

            for (let ob of obSet.obs) {
              //  if (ob.value||(ob.values&&ob.values.length>0)){

              this.saveObData(ob, user).then((data) => {
                indexOb++;
                if (indexOb == total) {
                  this.allService.alertDialogService.alert('save form done')
                  resolve(data);
                  reject(new Error('error'));
                }
              });
            }
          }
        }
      })
    })

  }


  saveObData(ob: any, user: any) {
    return new Promise((resolve, reject) => {
      ob.valueList = [];
      if (ob.type == 'list' && ob.values && ob.values.length > 0) {


        for (let value of ob.values) {
          ob.valueList.push(value.text)
        }

      }
      this.allService.datasService.getDatasByFilter2({ registryUserID: user._id, obID: ob._id }).then((data: any) => {
        this.temp = data;
        if (this.temp > 0) {
          this.allService.datasService.update({ _id: this.temp[0]._id, value: ob.value, values: ob.values }).then((data: any) => {
            resolve(data);
            reject(new Error('error'));
          })
        } else {
          this.allService.datasService.create({
            registryUserID: user._id,
            registryUserEmail: user.email,
            userID: this.user._id,
            userEmail: this.user.email,
            obID: ob._id,
            obName: ob.name,
            obType: ob.type,
            value: ob.value,
            values: ob.valueList
          }).then((data: any) => {
            resolve(data);
            reject(new Error('error'));
          })
        }
      })
    })

  }

  delete(user: any) {
    user.status = 'inactive'
    this.allService.usersService.updateUser(user).then((data: any) => {
      this.allService.alertDialogService.alert('user is deactivated');
    })
  }
  getWebSite(registryUser:any){
    var loc = location.href;
    console.log ('location', loc)

    if (registryUser.role=='service'){
      window.open('./service/' + registryUser._id,
      '',
      'scrollbars=1,height=500,width=1000,left=100,top=80');
    }
    else if (registryUser.role=='provider'){
      window.open('./provider/' + registryUser._id,
      '',
      'scrollbars=1,height=500,width=1000,left=100,top=80');
    }
   

  }

}
