
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { UserRegistryComponent } from '../user-registry/user-registry.component';
import { AllServices } from '../../common-services';

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
    else if (selectedTab.textLabel == '医护' || selectedTab.textLabel == 'provider')
      this.getType('provider');
    else if (selectedTab.textLabel == '市场'
      || this.language == 'English' && selectedTab.textLabel == 'market place')
      this.getType('market place');
    else if (selectedTab.textLabel == '市场管理'
      || this.language == 'English' && selectedTab.textLabel == 'market')
      this.getType('market');
  }


  addUser(type: any) {

    this.allService.categoryService.getUserForm({ formIDs: [type._id] }).then((data: any) => {
      this.forms = data;
      console.log('new user form', this.forms)


      const dialogRef = this.dialog.open(UserRegistryComponent, {
        width: '1200px',
        height: '800px',
        data: { forms: this.forms, role: type.label.en, language: this.language }
      });

      dialogRef.afterClosed().subscribe((result: { forms: any[]; profiles: any; serviceList: any; marketList: any; providers: any; }) => {
        if (result) {
          for (let form of result.forms) {
            for (let obSet of form.obSets) {
              for (let ob of obSet.obs) {
                if (ob.label.en == 'email') {
                  var email = ob.value;
                }
                else if (ob.label.en == 'password') {
                  var password = ob.value;
                }
              }
            }
          }
          this.allService.usersService.createUser({ email: email, password: password }).then((data: any) => {
            this.temp = data;
            console.log('user created!');
            this.newUser.email = this.temp.email;
            this.newUser.password = this.temp.password;
            this.newUser._id = this.temp._id;
            this.newUser.profiles = result.profiles;
            this.newUser.serviceList = result.serviceList;
            this.newUser.marketList = result.marketList;
            this.newUser.providers = result.providers;

            this.allService.formService.saveUserForm(result.forms[0], this.newUser).then((data: any) => {
              this.allService.alertDialogService.alert('patient updated')
            })
          })
        }
      });
    })
  }


  getUser(type: any, user: any) {

    console.log('user before open', user)
    if (!user.profiles)
      user.profiles = [];
    this.loading = true;
    this.allService.categoryService.getFormById({ formIDs: [type._id] }).then((data: any) => {
      // this.categoryService.getUserForm({formIDs:[type._id], userID:user._id}).then((data)=>{
      this.loading = false;
      this.forms = data;
      var obIDs = []
      for (let form of this.forms) {
        for (let obSet of form.obSets) {
          for (let ob of obSet.obs) {
            obIDs.push(ob._id)
          }
        }
      }
      this.allService.datasService.getDatasByFilter2({ obID: { '$in': obIDs }, registryUserID: user._id }).then((data: any) => {
        this.temp = data;
        console.log('user data', this.temp)
        for (let item of this.temp) {
          for (let form of this.forms) {
            for (let obSet of form.obSets) {
              for (let ob of obSet.obs) {

                if (ob._id == item.obID) {
                  ob.dataID = item._id;
                  ob.value = item.value;
                  ob.values = item.values;
                }
              }

            }
          }
        }

        console.log('forms', this.forms)

        const dialogRef = this.dialog.open(UserRegistryComponent, {
          width: '1200px',
          height: '800px',
          data: { forms: this.forms, user: user, language: this.language }
        });

        dialogRef.afterClosed().subscribe((result: { profiles: any; serviceList: any; marketList: any; providers: any; forms: any[]; }) => {
          console.log('result', result)
          if (result) {
            user.profiles = result.profiles;
            user.serviceList = result.serviceList;
            user.marketList = result.marketList;
            user.providers = result.providers;


            this.allService.formService.saveUserForm(result.forms[0], user).then((data: any) => {
              this.allService.alertDialogService.alert('user updated');
            })
          }
        })
      })
    })
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

}
