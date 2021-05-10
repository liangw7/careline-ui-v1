import {
  Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef,
  HostListener
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices } from '../../core/common-services';
import { environment } from '../../../environments/environment';
import { MessageBoxComponent } from '../../core/common-components/message-box/message-box.component';
import { FamilyFormComponent } from 'src/app/core/common-components/family-form/family-form.component';
import { LoginComponent } from 'src/app/core/common-components/login/login.component';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() id: any;
  // 家庭成员管理展示
  @Output() showFamilyMembers: any;
  // 家庭成员详细信息弹窗
  alertFamilyMembers: any;
  // 家庭成员
  familyMembers: any;
  // 所有家庭成员,包括主账号
  allFamilyMembers: any;
  // 家庭成员关系码
  relationships: any;
  // 性别关系码
  genders: any;
  // 主账号
  mainUser: any;
  // 添加家庭成员,外部进入需要保存的内容
  userToProfile: any;
  obSets: any;
  obSetTemp: any;
  obTemp: any;
  name: any;
  form: any;
  source: any;
  temp: any;
  registryId: any;
  forms: any;
  user: any;
  selectedProfiles: any;
  showProfiles: any;
  newPatient: any;
  newPatients: any;
  selectedServices: any;
  color: any;
  educations: any;
  carePlans: any;
  loading: any;
  language: any;
  subscription: Subscription;
  filter: any;
  bigScreen: any;
  registryForms: any;
  screenSize: any;
  height: any;
  showProfile: any;
  showForm: any;
  showService: any;
  providers: any;
  emBed: any;
  option: any;
  profileForms: any;
  profiles: any;
  profileItems: any;
  selectedProfile: any;
  profileIDs: any;
  submit: any;
  @Input() patient: any;
  @Input() visit: any;
  @Output() sendSubmit = new EventEmitter();
  @Output() submitProfileForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() registryForm: EventEmitter<string> = new EventEmitter<string>();
  showResetPsd: any;
  step: any = -1;
  wapTabBoxShow: any = false;

  constructor(public allServices: AllServices,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

    this.option = this.storage.get('option');
    this.user = this.storage.get('user')
    console.log('user', this.user)
    this.bigScreen = this.storage.get('bigScreen')
    this.color = this.storage.get('color');
    this.language = this.storage.get('language');
    this.subscription = allServices.sharedDataService.dataSent$.subscribe(
      language => {
        this.language = language;
      });
    this.relationships = [
      {
        code: 1,
        value: '子女'
      },
      {
        code: 2,
        value: '父母'
      },
      {
        code: 3,
        value: '其他'
      },
    ];
    this.genders = [
      {
        code: 0,
        value: '男'
      },
      {
        code: 1,
        value: '女'
      }
    ];
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    this.screenSize = {
      height: screenHeight,
      width: screenWidth
    }
    console.log('this.screenSize', this.screenSize)
    if (this.user.role == 'patient')
      this.patient = this.storage.get('user')
    else
      this.patient = this.storage.get('patient')
    console.log('patient!!!!!!!', this.patient)
    if (screenWidth <= 992) {
      // this.bigScreen = 0;
      this.height = this.screenSize.height * 0.85
    } else {
      // this.bigScreen = 1;
      this.height = this.screenSize.height * 0.9
    }
  }

  setStep(index: number) {
    this.step = index;
    this.selectedProfile = this.patient.profiles[index];
    this.findVisit(this.patient.profiles[index])
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  ngOnInit() {
    this.getScreenSize();
    if (this.patient) {
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.patient = data;
        console.log('this.patient', this.patient)
        this.registryForms = []
        this.forms = [];
        this.selectedProfiles = [];
        this.selectedServices = [];
        this.profiles = [];
        this.profiles = this.patient.profiles;
        this.getRegistry();
      })
    }
    // 登录页面过来需要给新添加的家庭成员绑定项目等在此操作
    if (this.userToProfile) {
      this.view();
    }
  }


  ngOnChanges() {
    this.getScreenSize();
    if (this.patient) {
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.patient = data;
        console.log('this.patient', this.patient)
        this.registryForms = []
        this.forms = [];
        this.selectedProfiles = [];
        this.selectedServices = [];
        this.profiles = [];
        this.profiles = this.patient.profiles;
        this.getRegistry();
      })
    }
  }

  /*getRegistry(){
    this.showForm=true;
   // if (!this.registryForms){
  
    if (this.registryForms.length==0){
       for (let profile of this.patient.profiles){
        if (profile.forms){
          var found=false;
          for(let form of profile.forms){
            if (form.formType=='general registry'&&found==false){
              this.registryForms=[form];
              found=true;
            }
          }
          for (let form of this.registryForms){
            this.allServices.formService.getForm(form, this.patient, null, null).then((data)=>{
              this.emBed=true;
             
              for (let profile of this.patient.profiles){
  
                this.findVisit(profile);
              }
              this.selectedProfile=this.patient.profiles[0];
            })
          }
        }
     
       //   this.loading=false;
       
        }
      }
    }*/

  /**
   * 弹窗形式展示添加家庭成员
   * @param category 
   */
  view() {
    let data = {
      alertFamilyMembers: true,
      view: true,
      edit: false,
      userToProfile: '',
    }
    if (this.userToProfile) {
      data.userToProfile = this.userToProfile
    }
    let dialogConfig = new MatDialogConfig();
    // dialogConfig = {
    //   data: data,
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   height: '80%',
    //   width: '60%',
    //   autoFocus: true,
    //   disableClose: true
    // }

    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '92vw',
        dialogConfig.maxHeight = '95vh',
        dialogConfig.height = '95%',
        dialogConfig.width = '92%'
    } else if (this.bigScreen == 1) {
      dialogConfig.maxWidth = '90vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '80%',
        dialogConfig.width = '60%'
    }

    const dialogRef = this.dialog.open(FamilyFormComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getFamilyMembers();
    });
  }

  /**
   * 弹窗形式展示添加家庭成员
   * @param category 
   */
  viewLogin() {
    // this.logout();
    let dialogConfig = new MatDialogConfig();
    // dialogConfig = {
    //   data: { view: true, edit: false },
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   height: '80%',
    //   width: '60%',
    //   autoFocus: true,
    //   disableClose: true
    // }

    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '92vw',
        dialogConfig.maxHeight = '95vh',
        dialogConfig.height = '95%',
        dialogConfig.width = '92%'
    } else if (this.bigScreen == 1) {
      dialogConfig.maxWidth = '90vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '80%',
        dialogConfig.width = '60%'
    }

    const dialogRef = this.dialog.open(LoginComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.showForm = true;
      this.showFamilyMembers = false;
      this.getFamilyMembers();
      this.getRegistry();
    });
  }

  selectFamilyMembers() {
    this.user = this.storage.get('user');
    this.user.photo = this.allServices.utilService.getHttpUrl(this.user.photo);
    if (this.user.father_id) {
      this.getAllMembers();
    } else {
      this.getFamilyMembers();
    }
  }

  /**
   * 获取家庭成员信息
   */
  getFamilyMembers() {
    if (this.user && this.user.father_id) {
      this.getAllMembers();
    } else {
      if (this.user && this.user._id) {
        let params = {
          father_id: this.user._id
        }
        this.allServices.usersService.getUserByFatherId(params).then((data: any) => {
          if (data && data.code == 1) {
            this.familyMembers = data.data;
            console.log('familyMembers------', this.familyMembers);
            if (!this.familyMembers) {
              this.allServices.alertDialogService.warn('您还未添加家庭成员!');
            }
          } else {
            this.allServices.alertDialogService.warn(data.msg);
          }
        })
      }
    }
  }

  /**
   * 如果切换到家庭成员账号,查询所有家庭成员信息,包括主账号
   */
  getAllMembers() {
    this.user = this.storage.get('user');
    if (this.user && this.user.father_id) {
      this.allServices.usersService.findUserById(this.user.father_id).then((data: any) => {
        if (data) {
          this.mainUser = data;
          this.allFamilyMembers = data;
          let params = {
            father_id: this.user.father_id
          }
          this.allServices.usersService.getUserByFatherId(params).then((data1: any) => {
            if (data1 && data1.code == 1) {
              this.familyMembers = data1.data;
              if (Array.isArray(this.allFamilyMembers)) {
                this.allFamilyMembers.concat(data1.data);
              } else {
                let arrays: any[] = [];
                arrays.push(...data1.data);
                arrays.push(this.allFamilyMembers);
                this.allFamilyMembers = arrays;
              }
              console.log('allFamilyMembers------', this.allFamilyMembers);
            } else {
              this.allServices.alertDialogService.alert(data1.msg);
            }
          })
        } else {
          this.allServices.alertDialogService.alert(data.msg);
        }
      })
    }
  }


  /**
   * 根据性别码code获取性别名称
   * @param code 性别码
   * @returns 性别码对应名称
   */
  getGenderName(code: any) {
    return this.getNameByCode(this.genders, code);
  }

  /**
   * 根据家庭关系code码获取内容
   * @param code 家庭关系code码
   */
  getRelationshipName(code: any) {
    return this.getNameByCode(this.relationships, code);
  }

  /**
   * 根据码获取内容
   * @param arrays 码数组
   * @param code 码对应值
   * @returns 
   */
  getNameByCode(arrays: any, code: any) {
    for (let index = 0; index < arrays.length; index++) {
      const element = arrays[index];
      if (element.code = code) {
        return element.value;
      }
    }
    return '未知值';
  }


  /**
   * 删除家庭成员信息
   * @param member 家庭成员信息
   */
  deleteFamily(member: any) {
    if (this.user._id == member._id) {
      this.allServices.alertDialogService.alert('您已经切换到当前用户,不可以删除自己!');
      return;
    }
    // 弹窗提示用户是否在平台注册过
    let data = {
      title: '温馨提示', //标题  选填 默认值为提示
      content: '您确定要删除该角色?', //内容  必填 询问的内容
    }
    this.allServices.alertDialogService.confirm(data).subscribe(res => {
      if (res) {// 确定调用方法
        this.allServices.usersService.deleteUser(member._id).then((data: any) => {
          if (data) {
            this.allServices.alertDialogService.alert('删除' + member.name + '成功!');
            this.getFamilyMembers();
          } else {
            this.allServices.alertDialogService.alert('删除' + member.name + '失败!');
          }
        })
      } else {// 取消调用方法
        return;
      }
    });
  }


  /**
   * 模拟登陆
   * @param member 家庭成员信息
   */
  imitateLogin(member: any) {
    if (this.user._id == member._id) {
      this.allServices.alertDialogService.alert('您已经切换到当前用户,无需重复操作!');
      return;
    }

    let username = member.email;
    let password = member.email.split('@')[0];
    let credentials = {
      email: username,
      password: password,
      role: 'patient'
    };
    this.allServices.authService.login(credentials).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.user = this.storage.get('user');

      this.color = this.user.color;
      this.storage.set('color', this.color);

      this.storage.set('patient', this.user);
      this.patient = this.user;
      this.allServices.usersService.findUserById(this.user.father_id).then((data: any) => {
        // debugger;
        this.mainUser = data;
        this.showForm = true;
        this.showFamilyMembers = false;
        this.getAllMembers();
        this.sendSubjectMsg();
        this.getRegistry();
      })
    }, (err: any) => {
      console.log(err);
      console.log("Not already authorized");
      this.loading = false;
    });
  }


  sendSubjectMsg() {
    this.allServices.communicateService.sendLoginMsg(this.user);
  }


  logout() {
    this.allServices.authService.logout('/public-platform/homepage/main');
    this.user = undefined;
  }


  getRegistry() {
    this.user = this.storage.get('user');
    if (this.user.role == 'patient') {
      this.patient = this.storage.get('user');
    } else {
      this.patient = this.storage.get('patient');
    }
    this.showForm = true;
    // debugger;
    if (!this.registryForms) {
      this.registryForms = [];
    }
    // if (this.registryForms.length == 0) {
    this.allServices.categoryService.getCategoriesByFilter({ formType: 'general registry' }).then((data) => {
      this.registryForms = data;

      this.allServices.formService.getForm(this.registryForms[0], this.patient, null, null).then((data) => {
        this.emBed = true;
        if (this.patient.profiles) {
          this.selectedProfile = this.patient.profiles[0];
          console.log('this.selectedProfile=========', this.selectedProfile)
          for (let profile of this.patient.profiles) {

            this.findVisit(profile);
          }
        }

      })
    })
    // }
  }


  findVisit(profile: any) {

    this.allServices.visitsService.getVisitsByFilter({
      'patientID': this.patient._id,
      type: '注册',
      'profiles': { '$elemMatch': { _id: profile._id } }
    }).then((data) => {
      profile.visit = data;
      if (profile.visit) {
        if (profile.forms) {
          for (let form of profile.forms) {
            if (form.formType == 'profile registry' && (!form.obSets || (form.obSets && form.obSets.length == 0))) {
              this.loading = true;
              this.allServices.formService.getForm(form, this.patient, profile.visit, null).then((data) => {
                this.loading = false;
              });
            }
          }
        } else {
          this.allServices.categoryService.getCategory(profile._id).then((data) => {
            profile = data;
            for (let form of profile.forms) {
              if (form.formType == 'profile registry' && (!form.obSets || (form.obSets && form.obSets.length == 0))) {
                this.loading = true;
                this.allServices.formService.getForm(form, this.patient, profile.visit, null).then((data) => {
                  this.loading = false;
                });
              }
            }
          })
        }
      } else {
        //create visit
        //  this.loading=true;
        this.allServices.visitsService.createVisit({
          desc: { label: profile.label },
          profiles: [{
            _id: profile._id,
            forms: profile.forms,
            label: profile.label,
            profileType: 'profile registry'
          }],
          patientID: this.patient._id,
          provider: { _id: this.user._id, name: this.user.name, title: this.user.title },
          type: '注册'
        }).then((data) => {
          console.log('visit created=============', data)
          this.temp = data;
          profile.visit = { _id: this.temp._id }
          if (profile.forms) {
            for (let form of profile.forms) {
              if (form.formType == 'profile registry') {
                //  this.loading=true;
                this.allServices.formService.getForm(form, this.patient, profile.visit, null).then((data) => {
                  //    this.loading=false;
                });
              }
            }
          } else {
            this.allServices.categoryService.getCategory(profile._id).then((data) => {
              profile = data;
              for (let form of profile.forms) {
                if (form.formType == 'profile registry') {
                  //  this.loading=true;
                  this.allServices.formService.getForm(form, this.patient, profile.visit, null).then((data) => {
                    //    this.loading=false;
                  });
                }
              }
            })
          }
        })
      }
    })
  }


  addProfile() {
    this.profileItems = [];
    this.loading = true;
    this.allServices.categoryService.getProfiles().then((data) => {
      this.profileItems = data;
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // this.bigScreen = this.storage.get('bigScreen')
      dialogConfig.data = {
        profileItems: this.profileItems, profiles: this.patient.profiles
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
      const dialogRef = this.dialog.open(MessageBoxComponent,
        dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.allServices.visitsService.createVisit({
            desc: { label: result.profile.label },
            profiles: [{
              _id: result.profile._id,
              forms: result.profile.forms,
              label: result.profile.label,
              profileType: 'profile registry'
            }],
            patientID: this.patient._id,
            provider: { _id: this.user._id, name: this.user.name, title: this.user.title },
            type: '注册'
          }).then((data) => {
            console.log('visit created=============', data)
            this.temp = data;
            result.profile.visit = { _id: this.temp._id }
            this.profiles.push(result.profile);
            this.patient.profiles = this.profiles;

            this.selectedProfile = result.profile;
            this.allServices.usersService.updateUser({ _id: this.patient._id, profiles: this.profiles }).then((data) => {
              // this.getProfileForm(this.selectedProfile);
              for (let form of result.profile.forms) {
                if (form.formType == 'profile registry') {
                  //   this.loading=true; 
                  this.allServices.formService.getForm(form, this.patient, result.profile.visit, null).then((data) => {
                    this.loading = false;
                  });
                }
              }
            })
          })
        }
      })
    })
  }

  removeProfile(profile: any) {
    this.allServices.visitsService.getVisitsByFilter({
      'patientID': this.patient._id,
      type: '注册',
      '$or': [{
        'profiles': { '$elemMatch': { _id: profile._id } }
      },
      { 'profile._id': profile._id }]
    }).then((data) => {
      this.temp = data;
      console.log('visits!!!!!!', this.temp)
      if (this.temp.length > 0) {
        this.allServices.visitsService.delete(this.temp[0].id).then((data) => {
          console.log('visit deleted', profile.label.ch);
          //update patient
          for (let item of this.patient.profiles) {
            if (item._id == profile._id) {
              var index = this.patient.profiles.indexOf(item);
              this.patient.profiles.splice(index, 1);
              this.allServices.usersService
                .updateUser({ _id: this.patient._id, profiles: this.profiles })
                .then((data) => {
                  this.patient = data;
                  this.storage.set('patient', this.patient)
                })

            }
          }
        })
      }
    })

  }
  getLabel(profile: any) {
    if (profile) {
      if (this.language == 'Chinese') {
        return profile.label.ch
      } else if (this.language == 'English') {
        return profile.label.en
      }
    }
  }


  getProfileForm(profile: any) {
    this.allServices.visitsService.getVisitsByFilter({
      'patientID': this.patient._id,
      type: '注册',
      '$or': [{
        'profiles': { '$elemMatch': { _id: profile._id } }
      },
      { 'profile._id': profile._id }]
    }).then((data) => {
      this.temp = data;
      console.log('visits!!!!!!', this.temp)
      if (this.temp.length > 0) {
        this.visit = this.temp[0]
        console.log('profile', profile)
        for (let form of profile.forms) {
          if (form.formType == "profile registry") {
            console.log('this.form-1', form)
            var filter = {
              formIDs: [form._id],
              patientID: this.patient._id,
              visitID: this.visit._id,
              visitDate: this.visit.visitDate
            }
            this.allServices.categoryService.getFormById(filter).then((data) => {
              this.temp = data;
              form.obSets = [];
              form.obSets = this.temp[0].obSets;
              profile.selected = true;
              console.log('this.form-2', form)
            })
          }
        }
      } else {
        var visit = {
          patientID: this.patient._id,
          visitDate: new Date(),
          profiles: [profile],
          type: '注册',
          desc: { label: profile.label },
          enType: 'registry',
          createdBy: { _id: this.user._id, name: this.user.name, title: this.user.title }
        }
        this.allServices.visitsService.createVisit(visit).then((data) => {
          this.visit = data;
          console.log('visit create', this.visit);
          for (let form of profile.forms) {
            if (form.formType == "profile registry") {
              console.log('this.form-1', form)
              var filter = {
                formIDs: [form._id],
                patientID: this.patient._id,
                visitID: this.visit._id,
                visitDate: this.visit.visitDate
              }
              this.allServices.categoryService.getFormById(filter).then((data) => {
                this.temp = data;
                form.obSets = [];
                form.obSets = this.temp[0].obSets;
                profile.selected = true;
                console.log('this.form-2', form)
              })
            }
          }
        })
      }
    })
  }


  submitRegistry() {
    this.loading = true
    this.allServices.formService.saveForms(this.registryForms, null, this.patient).then((data) => {
      this.loading = false;
      this.allServices.alertDialogService.alert('提交成功')
    })
  }


  getProfile(profile: any) {
    console.log('profile=================', profile)
    this.loading = true;
    //'profiles':{'$elemMatch':{_id:profile._id}}
    this.allServices.visitsService.getVisitsByFilter({
      'patientID': this.patient._id,
      type: '注册',
      'profiles': { '$elemMatch': { _id: profile._id } }
    }).then((data) => {
      this.temp = data;
      console.log('visit', this.temp)
      if (this.temp.length > 0) {
        for (let item of this.temp) {
          if (item.profile && item.profile._id == profile._id) {
            profile.visit = item;
            this.filter = {
              profileIDs: [profile._id],
              visitID: item._id,
              formTypes: ['profile registry'],
              patientID: this.patient._id
            };
          } else if (item.profiles && item.profiles.length > 0) {
            for (let profileItem of item.profiles) {
              if (profileItem._id == profile._id) {
                profile.visit = item;
                this.filter = {
                  profileIDs: [profile._id],
                  visitID: item._id,
                  formTypes: ['profile registry'],
                  patientID: this.patient._id
                };
              }
            }
          }
        }
      } else {
        this.filter = {
          profileIDs: [profile._id],
          formTypes: ['profile registry'],
          patientID: this.patient._id
        };
      }

      profile.profileForms = [];
      this.loading = true;
      console.log('this.filter================', this.filter)
      /*this.dataService.getDatasByFilter2({patientID:this.patient._id}).then((data)=>{
      this.temp=data;
      console.log ('visit data', this.temp)
      })
      this.dataService.getData('5ec6dec2690219319c79251e').then((data)=>{
        this.temp=data;
        console.log ('temp data', this.temp)
      })*/
      this.allServices.categoryService.getForm(this.filter).then((data) => {
        console.log('get form', data);
        this.temp = data;
        profile.profileForms = this.temp;
        this.loading = false;
      })
    })
  }


  getProviders() {
    if (this.providers && this.providers.length == 0) {
      this.loading = true;
      this.allServices.usersService.findUserById(this.patient._id).then((data) => {
        this.temp = data;
        this.loading = false;
        if (this.temp.providers) {
          for (let provider of this.temp.providers) {
            // console.log ('provider-1', provider  )
            this.allServices.usersService.findUserById(provider._id).then((data) => {
              this.temp = data;
              // console.log ('provider-2',  this.temp  )
              if (this.temp)
                this.providers.push(this.temp)
              this.loading = false;
              // console.log (' this.providers',   this.providers  )
            })
          }
        }
      })
    }
    //}
  }


  getPatientProfiles() {
    if (this.profiles.length == 0) {
      var profileIDs = []
      for (let profile of this.patient.profiles) {
        profileIDs.push(profile._id)
      }
      this.allServices.categoryService.getCategoriesByFilter({ '_id': { '$in': profileIDs } }).then((data) => {
        this.temp = data;
        this.profiles = this.temp;
        // for (let profile of this.profiles){
        //  this.getProfileForm(profile)
        // }
        this.selectedProfile = this.profiles[0];
        console.log('this.patient.profiles', this.profiles)
      })
    }
  }


  getProfiles() {
    this.showProfile = true;
    // if (this.selectedProfiles.length==0){
    this.profileIDs = [];
    this.loading = true;
    this.allServices.usersService.findUserById(this.patient._id).then((data) => {
      this.temp = data;
      for (let profile of this.temp.profiles) {
        this.profileIDs.push(profile._id)
      }
      this.allServices.categoryService.getCategoriesByFilter({ _id: { $in: this.profileIDs } }).then((data) => {
        this.temp = data;
        this.selectedProfiles = this.temp;
        for (let profile of this.selectedProfiles) {
          this.getProfile(profile);
          //registry form
          // if (this.selectedProfiles.indexOf(profile)==0){
          //  this.getRegistry(profile);
          // }
          this.loading = false;
        }
      })
    })
    // }
  }


  follow() {
    this.patient.follow = true;
    this.allServices.usersService.updateUser(this.patient).then((data) => {
      window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MTYyODQ3MQ==#wechat_redirect"
    })
  }


  tabSelectionChanged(event: any) {
    // Get the selected tab
    let selectedTab = event.tab;
    for (let profile of this.selectedProfiles) {
      if (profile && (selectedTab.textLabel == profile.label.ch || selectedTab.textLabel == profile.label.en)) {

        this.getProfile(profile);
      }
    }
  }


  findService() {
    for (let service of this.selectedServices) {
      if (service._id == this.user.service._id)
        return this.selectedServices.indexOf(service)
    }
    return -1;
  }


  selectProfile(profile: any) {
    var index = this.find(profile, this.selectedProfiles)
    if (index == -1) {
      this.selectedProfiles.push(profile);
      if (profile.forms && profile.forms.length > 0) {
        for (let form of profile.forms) {
          if (form.formType == 'profile registry') {
            for (let formItem of this.forms) {
              if (form._id == formItem._id) {
                formItem.show = true;
                console.log('form', this.forms)
              }
            }
          }
        }
      }
    } else if (index > -1) {
      this.selectedProfiles.splice(index, 1)
      if (profile.forms && profile.forms.length > 0) {
        for (let form of profile.forms) {
          if (form.formType == 'profile registry') {
            for (let formItem of this.forms) {
              if (form._id == formItem._id) {
                formItem.show = false;
                console.log('form', this.forms)
              }
            }
          }
        }
      }
    }
  }


  find(item: any, List: any) {
    for (let i of List) {
      if (item._id == i._id)
        return List.indexOf(i);
    }
    return -1
  }


  closeForm() {
    var showProfile = false;
    if (this.option == 'consult')
      this.submit = { showProfile: false, showConsult: true, showSchedule: false };
    else if (this.option == 'schedule') {
      this.submit = { showProfile: false, showConsult: false, showSchedule: true };
    }
    this.sendSubmit.emit(this.submit);
  }


  getProblemInfor(problem: any, ob: any, form: any) {
    for (let obSet of form.obSet) {
      if (problem._id == obSet.problemID) {
        ob.infor = obSet;
      }
    }
  }


  getMedicationInfor(medication: any, ob: any, form: any) {
    for (let obSet of form.obSet) {
      if (medication._id == obSet.medicationID) {
        ob.infor = obSet;
      }
    }
  }
}




