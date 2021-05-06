import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiUrl, User } from 'src/app/core/models';
import { AllServices, WechatJssdkConfig } from 'src/app/core/common-services';
import { environment } from '../../../environments/environment';

const WechatJSSDK = require('wechat-jssdk');
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  service: any;
  profile: any;
  profileID: any;
  serviceID: any;
  temp: any;
  forms: any;
  newPatient: any;
  color: any;
  user: any;
  addPatient: any;
  timeOut: any;
  filter: any;
  photo: any;
  loading: any;
  formIDs: any;
  email: any;
  password: any;
  ssn: any;
  missing: any;
  educations: any;
  subscription: Subscription;
  language: any;
  provider: any;
  detailID: any;
  title: any;
  registryForm: any;
  educationForm: any;
  emBed: any;
  bigScreen: any;
  registry: any;
  profileActive: any;
  introActive: any;
  showScroll: boolean = false;
  selectedIndex: any;
  selectedProvider: any;
  formReady: any;
  profiles: any;
  showScrollHeight = 300;
  hideScrollHeight = 10;
  providers: any;
  intro: any;
  patient: any;
  registryForms: any;
  showSelfTest: any;
  screenSize: any
  appID: any;
  appSecrete: any;
  signature: any;
  image: any;
  desc: any;
  formEducation: any;
  expert: any
  education: any;
  formRegistry: any;
  selectedFrom: any;
  popOut: any;
  code: any;
  weChatAccess: any;
  access: any;
  shareProvider: any;
  hideEducation: any;
  scrollSize: any;
  option: any;
  screenWidth: any;
  showInstruction: any;
  role: any;
  consult: any;
  followup: any;
  isWeixin: any;
  //@ViewChild('template') template: FormComponent;

  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    private entity: ApiUrl,
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    //this.popOut=true;
    this.isWeixin = this.storage.get('isWeixin');
    this.bigScreen = this.storage.get('bigScreen');
    this.selectedIndex = 0;
    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (language: any) => {
        this.language = language;
      });
    this.subscription = allService.shareProviderService.dataSent$.subscribe(
      (shareProvider: any) => {
        this.shareProvider = shareProvider;
        console.log('this.shareProvider===========', this.shareProvider)
        if (this.shareProvider) {
          this.education = false;
          this.expert = true;
          this.registry = false;
        }
      });
    //this.sharedRoleService.sendUserRole("user role ytrrrrrrrr!!!!!!!!");
    if (!this.language) {
      this.language = "Chinese";
    }
    // this.getScreenSize();
    console.log('bigScreen', this.bigScreen)
    this.profileActive = true;
    // this.storage.set('bigScreen', this.bigScreen);
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.code = params['code'];
      this.profileID=params['profileID'];
    });

    if (!this.code) {
      this.detailID = this.route.snapshot.paramMap.get('serviceID');
      this.storage.set('detailID', this.detailID);
      if (!this.detailID) {
        this.detailID = this.storage.get('serviceID');
      }

      this.color = this.route.snapshot.paramMap.get('color');
      this.storage.set('color', this.color);

      this.photo = this.route.snapshot.paramMap.get('photo');
      this.storage.set('photo', this.photo);

      this.profileID = this.route.snapshot.paramMap.get('profileID');
      this.storage.set('profileID', this.profileID);
     

      this.hideEducation = this.route.snapshot.paramMap.get('hideEducation');
      this.storage.set('hideEducation', this.hideEducation);
    }

    if (this.bigScreen == 0 && this.code) {

      this.profileID = this.storage.get('profileID');
      this.color = this.storage.get('color');
      this.photo = this.storage.get('photo');
      this.detailID = this.storage.get('detailID');
      if (!this.detailID) {
        this.detailID = this.storage.get('serviceID');
      }
      // alert('got code111111111111'+this.code)
      // alert(' this.profileID11111111111 '+ this.profileID)
      // alert(' photo11111111111 '+ this.profileID)
    }
    this.image = this.entity.setFormUploadPhoto + String(this.photo) + '.png';
    //code
    //signature
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) {
      this.showScroll = true;
    }
    else if (this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight) {
      this.showScroll = false;
    }
  }


  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 7));
      }
    })();
  }

  goToHome() {
    this.storage.remove('role');
    this.storage.remove('color');
    this.storage.remove('profile')
    this.router.navigate(['/homepage/profile-intro'])
  }

  ngOnInit() {
    this.allService.categoryService.getCategory(this.profileID).then((data: any) => {
      this.temp = data;
      this.profile = this.temp;
      if (this.profile.desc && this.profile.desc.ageGroup == 'child') {
        this.role = 'child'
      } else {
        this.role = 'patient'
      }
      console.log('profile', this.profile)
      this.desc = this.profile.desc.patient;
      this.color = this.profile.desc.color;
      this.storage.set('role', this.role);
      this.storage.set('color', this.color);
      this.storage.set('profile', this.profile)
      console.log('this.profile', this.image, this.desc)
      for (let form of this.profile.forms) {
        if (form.formType == 'publish') {
          this.profile.publish = form;
        }
      }
    })
    this.user = this.storage.get('user');
    this.setUp();
  }


  setUp() {

    var loc = location.href;
    this.storage.set('location', loc);
    this.allService.sharedPageTypeService.sendPageType('patient');

    this.addPatient = true;
    this.loading = true;
    this.forms = [];
    this.educations = [];

    this.expert = false;
    this.missing = [];
    this.providers = [];
    this.getService();
    this.getDetail();

  }

  findSpecialist() {
    var temp: any[] = []

    for (let obSet of this.formRegistry.obSets) {
      for (let ob of obSet.obs) {
        if (ob.type == 'list' && ob.values) {
          for (let value of ob.values) {
            temp.push({ desc: { "$regex": value.text } })
          }
        } else if ((ob.type == 'string' || ob.type == 'text') && ob.value) {
          temp.push({ desc: { "$regex": ob.value } })
        }
      }
    }
    this.providers = [];
    if (temp.length > 0) {
      this.loading = true;
      this.allService.usersService.getWithDetailByFilter({ 'role': 'provider', '$or': temp }).then((data: any) => {
        console.log('temp', temp)
        console.log('this.providers', this.providers)
        this.loading = false;
        this.providers = data;
        this.expert = true;
        this.registry = false;
      })
    } else {
      this.loading = true;
      this.allService.usersService.getWithDetailByFilter({ 'role': 'provider' }).then((data: any) => {
        console.log('temp', temp)
        console.log('this.providers', this.providers)
        this.loading = false;
        this.providers = data;
        this.expert = true;
        this.registry = false;
      })
    }
  }


  getService() {

    console.log('got service')
    this.forms = [];
    this.educations = [];
    this.providers = [];

    // use ptofileID to get forms
    this.profiles = [{ _id: this.profileID }];

    this.loading = true;
    var formTypes = [];
    if (this.hideEducation != 'undefined') {
      formTypes = ['profile registry'];
    } else {
      formTypes = ['profile registry'];
    }
    this.allService.categoryService.getForm({
      profileIDs: [this.profileID],
      formTypes: formTypes
    }).then((data: any) => {

      this.temp = data;

      this.forms = this.temp;

      this.formReady = true;
      this.loading = false;
      console.log('get form', this.forms);
      var obIDs = [];
      for (let form of this.forms) {

        for (let obSet of form.obSets) {
          for (let ob of obSet.obs) {
            obIDs.push(ob._id)
          }
        }
      }
      this.allService.categoryService.getCategoriesByFilter({ '_id': { '$in': obIDs } }).then((data: any) => {
        this.temp = data;
        this.loading = false;
        for (let item of this.temp) {
          for (let form of this.forms) {
            for (let obSet of form.obSets) {
              for (let ob of obSet.obs) {
                if (ob._id == item._id) {
                  ob.education = item.education;
                  ob.options = [];
                  ob.options = item.options;
                  ob.formula = item.formula;
                }
              }
            }
          }
        }
        this.title = this.profile.label.ch;
        if (this.forms.length > 0) {
          this.title = this.title + '| ' + this.forms[0].label.ch;
        }
        if (this.isWeixin) {
          this.getSignature(this.desc, this.title, this.image)
        }
      })
    })
    //user detailIDto get user information
    console.log('this.detailID', this.detailID)
  }


  getSignature(desc: any, title: any, image: any) {
    var link = location.href.split('#')[0];
    var jsApiList: [] = [];
    return this.allService.wechatJssdkService.getSignature(desc, title, title, image, link, jsApiList, 0);
  }


  getSelectedProvider(provider: any) {
    this.selectedProvider = provider;
    console.log('this.selectedProvider', this.selectedProvider)
  }


  getDetail() {

    if (this.detailID != 'undefined') {
      this.loading = true;
      console.log('this.detailID-1', this.detailID)
      this.allService.usersService.getProviders({ serviceID: this.detailID }).then((data: any) => {
        this.temp = data;
        if (this.temp.length > 0) {
          this.service = this.temp[0];
          console.log('service', this.temp)
          this.loading = false;
        } else {
          //get provider
          this.allService.usersService.findUserById(this.detailID).then((data: any) => {
            this.temp = data;
            this.provider = this.temp;
            this.storage.set('provider', this.provider)
            this.title = this.profile.label.ch + ', ' + this.provider.name + ' ' + this.provider.title + ', 数基健康';
            this.titleService.setTitle(this.title);
            this.loading = false;
          })
        }
      })
    } else if (this.detailID == 'undefined') {
      console.log('this.detailID-2', this.detailID)
      console.log('this.profileID', this.profileID)
      this.allService.usersService.getWithDetailByFilter({ profiles: { '$elemMatch': { _id: this.profileID } }, role: 'provider', status: { '$in': ['1', '2'] } }).then((data: any) => {

        this.temp = data;
        this.providers = this.temp;
        this.loading = false;
        console.log(' this.providers', this.providers)
        this.storage.set('providers', this.providers)
      })
    }
    this.loading = false;
  }


  getUrl(photo: any) {
    // console.log ('service photo', this.photo)
    return this.allService.utilService.getImageUrl(String(photo));
  }


  select(form: any) {
    this.intro = false;
    for (let formItem of this.forms) {
      formItem.selected = false;
      if (form._id == formItem._id) {
        form.selected = true;
      }
    }

  }


  selectIntro() {
    for (let formItem of this.forms) {
      formItem.selected = false;
      this.intro = true;
    }

  }

  findPatientEducation(form: any, educations: any) {
    if (form && educations && educations.length > 0) {
      for (let education of educations) {
        if (form._id == education._id)
          return true;
      }
    }
    return false;
  }


  createVisit() {
    //if patient is registering a project
    if (this.provider)
      var providerID = this.provider._id
    var visit = {
      patientID: this.user._id,
      visitDate: new Date(),
      profile: this.profile,
      type: '注册',
      enType: 'registry',
      providerID: providerID,
      createdBy: { _id: this.user._id }

    }
    this.allService.visitsService.getVisitsByFilter({
      'type': '注册',
      'patientID': this.user._id,
      'profile._id': this.profile._id
    })
      .then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0 || this.profile._id == '5eadfc2f1b8c127fc1ce6a1b') {
          this.allService.visitsService.createVisit(visit).then((data: any) => {
            this.temp = data
            this.allService.formService.saveForms([this.formRegistry], this.temp[0], this.user).then((data: any) => {
              if (this.bigScreen == 1) {
                if (this.provider) {

                  if (this.option == 'schedule') {
                    this.router.navigate(['/provider-platform/provider/provider-schedule']);
                  }
                  else if (this.option == 'consult')
                    this.router.navigate(['/homepage/home/mail']);
                }
                else
                  this.router.navigate(['homepage/patient-visit', this.user._id, this.temp._id, this.profile._id, 'profile registry']);

              } else if (this.bigScreen == 0) {
                if (this.provider) {

                  this.router.navigate(['/provider-platform/patient/patient-story']);
                  if (this.option == 'schedule') {
                    this.storage.set('schedule', true);
                  }
                  else if (this.option == 'consult')
                    this.storage.set('consult', true);

                }
                else
                  this.router.navigate(['homepage/patient-visit', this.user._id, this.temp._id, this.profile._id, 'profile registry']);
              }
              this.createMessage(this.temp)
            })
            // this.saveForms(this.temp);
          })
        } else {
          this.allService.formService.saveForms([this.formRegistry], this.temp[0], this.user).then((data: any) => {
            if (this.bigScreen == 1) {
              if (this.provider) {

                if (this.option == 'schedule') {
                  this.router.navigate(['/provider-platform/provider/provider-schedule']);
                }
                else if (this.option == 'consult')
                  this.router.navigate(['/homepage/home/mail']);
              }
              else
                this.router.navigate(['homepage/patient-visit', this.user._id, this.temp._id, this.profile._id, 'profile registry']);

            } else if (this.bigScreen == 0) {
              if (this.provider) {

                this.router.navigate(['/provider-platform/patient/patient-story']);
                if (this.option == 'schedule') {
                  this.storage.set('schedule', true);
                } else if (this.option == 'consult')
                  this.storage.set('consult', true);

              } else
                this.router.navigate(['homepage/patient-visit', this.user._id, this.temp._id, this.profile._id, 'profile registry']);
            }
            // this.createMessage(this.temp)
          })
        }
      })
  }


  createMessage(visit: any) {
    //adde from patient
    var patientID = this.user._id;
    var providerID = this.selectedProvider._id;
    var mail = {
      contentList: [{ component: 'visit', visit: visit }],
      userID: this.user._id,
      patientID: patientID,
      providerID: providerID,
      status: 'active'
    }
    this.allService.mailService.create(mail).then((data: any) => {
      this.temp = data;
    })
  }


  saveForms(visit: any) {
    for (let item of this.forms) {

      for (let obSet of item.obSets) {

        for (let ob of obSet.obs) {
          if (obSet.field == 'problem') {
            this.saveProblemObData(ob, obSet);

          } else if (obSet.field == 'medication') {
            console.log('save meds')
            this.saveMedicationObData(ob, obSet);

          } else {
            this.savePatientProfileObData(ob, visit);
            this.saveProblem(ob);
            this.saveMedication(ob)
          }
        }
      }
    }
  }


  savePatientProfileObData(ob: any, visit: any) {

    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {

        ob.valueList.push(value.text)

      }

    }

    if (ob.value || ob.valueList.length > 0) {
      console.log('ob-2', ob);
      let params: any = {
        patientID: this.patient._id,
        patientEmail: this.patient.email,
        obID: ob._id,
        obName: ob.name,
        obType: ob.type,
        value: ob.value,
        values: ob.valueList
      }
      if (ob.context == 'visit') {
        var visitID = visit._id;
        params.visitID = visitID;
        this.allService.datasService.create(params).then((data: any) => {
          console.log('profile data created', data);
        });
      } else if (ob.context == 'patient') {
        this.allService.datasService.getDatasByFilter2({
          patientID: this.patient._id,
          obID: ob._id,
        }).then((data: any) => {
          this.temp = data;

          if (this.temp.length == 0) {
            this.allService.datasService.create(params).then((data: any) => {
              console.log('profile data created', data);
            });
          }
          else {
            params._id = this.temp[0]._id;
            this.allService.datasService.update(params).then((data: any) => {
              console.log('profile data updated', data);
            });
          }
        });
      }
    }
  }


  saveProblemObData(ob: any, obSet: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }
    if (obSet.obs.indexOf(ob) == 0) {
      this.allService.problemService.getProblemByFilter({
        patientID: this.newPatient._id,
        problemItemID: obSet._id
      }).then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          this.allService.problemService.create({
            patientID: this.patient._id,
            problemItemID: obSet._id,
            familyMember: 'self'
          }).then((data: any) => {
            console.log('problem created', data)
          });
        }
      })
    }
    if (ob.value || ob.valueList.length > 0) {
      this.allService.datasService.getDatasByFilter2({
        patientID: this.patient._id,
        problemItemID: obSet._id,
        obID: ob._id,
      }).then((data: any) => {
        this.temp = data;
        let params: any = {
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          problemItemID: obSet._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          familyMember: 'self',
          values: ob.valueList
        };
        if (this.temp.length == 0) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('problem data created', data);
          });
        } else {
          params._id = this.temp[0]._id;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('problem data updated', data);
          });
        }
      });
    }
  }


  saveMedicationObData(ob: any, obSet: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        ob.valueList.push(value.text)
      }
    }

    if (obSet.obs.indexOf(ob) == 0) {
      this.allService.medsService.getMedsByFilter({
        patientID: this.newPatient._id,
        medicationItemID: obSet._id
      }).then((data: any) => {
        this.temp = data;
        if (this.temp.length == 0) {
          this.allService.medsService.create({
            patientID: this.patient._id,
            medicationItemID: obSet._id
          }).then((data: any) => {
            console.log('medication created', data)
          });
        }
      })
    }
    if (ob.value || ob.valueList.length > 0) {
      this.allService.datasService.getDatasByFilter2({
        patientID: this.patient._id,
        medicationItemID: obSet._id,
        obID: ob._id,
      }).then((data: any) => {
        this.temp = data;
        let params: any = {
          patientID: this.patient._id,
          patientEmail: this.patient.email,
          medicationItemID: obSet._id,
          obID: ob._id,
          obName: ob.name,
          source: 'patient',
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length == 0) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('medication data created', data);
          });
        } else {
          params._id = this.temp[0]._id;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('medication data updated', data);
          });
        }
      })
    }
  }


  saveProblem(ob: any) {

    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value.problems && value.problems.length > 0) {
          if (value.comments == 'family') {
            var familyMember = value.text;
          } else {
            familyMember = 'self';
          }
          for (let problem of value.problems) {
            this.allService.problemService.getProblemByFilter({
              patientID: this.patient._id,
              problemItemID: problem._id,
              familyMember: familyMember,
            }).then((data: any) => {
              this.temp = data;
              if (this.temp.length == 0) {
                this.allService.problemService.create({
                  patientID: this.patient._id,
                  problemItemID: problem._id,
                  familyMember: familyMember,
                }).then((data: any) => {
                  console.log('probem created', data)
                });
              }
            });
          }
        }
      }
    }
  }


  saveMedication(ob: any) {

    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value.medications && value.medications.length > 0) {
          for (let medication of value.medications) {
            // this.getMedicationInfor(medication,ob,form)
            this.allService.medsService.getMedsByFilter({
              patientID: this.patient._id,
              medicationItemID: medication._id
            }).then((data: any) => {
              this.temp = data;
              if (this.temp.length == 0) {
                this.allService.medsService.create({
                  patientID: this.patient._id,
                  medicationItemID: medication._id
                }).then((data: any) => {
                  console.log('medication created', data)
                });
              }
            });
          }
        }
      }
    }
  }


  find(item: any, list: any) {
    if (list.length > 0) {
      for (let i of list) {
        if (i._id == item._id) {
          return true;
        }
      }
    }
    return false;
  }


  gotoExpert() {

    this.checkForm();
    if (this.missing.length == 0) {
      this.scrollToTop();
      this.introActive = true;
      this.profileActive = false;
      this.getDetail();
    }
  }

  checkForm() {
    this.missing = [];
    //for (let form of this.forms){
    //if (form.formType=='education'){
    // this.educations.push({_id:form._id, label:form.label,image:form.image,formType:form.formType})
    // }
    //}
    for (let item of this.forms) {
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

          if (ob.values && ob.values.length > 0) {
            for (let value of ob.values) {
              if (value.profiles && value.profiles.length > 0) {
                for (let profile of value.profiles) {
                  if (!this.find(profile, this.profiles))
                    this.profiles.push({ _id: profile._id });
                }
              }
              if (value.forms && value.forms.length > 0) {
                for (let form of value.forms) {
                  if (!this.find(form, this.educations))
                    this.educations.push({ _id: form._id, label: form.label, formType: form.formType, image: form.image });
                }
              }
            }
          }
        }
      }
    }
    if (this.missing.length > 0) {
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

   //   const dialogRef = this.dialog.open(MessageBoxComponent,
    //    dialogConfig);

    }
    console.log('this.educations', this.educations)
  }


  findProfile(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true
      }
    }
    return false;
  }


  receiveMessage($event: any) {
    // alert($event);
    // if ($event=='submit'){
    //  this.submit();
    //}
    if ($event == 'popOut') {
      // alert("got pop")
      this.popOut = false;
    }
    if ($event.submit == 'schedule') {
      this.option = 'schedule';
      this.storage.set('option', this.option)
      this.selectedProvider = $event.provider;
      this.submit();
    } else if ($event.submit == 'consult') {
      this.option = 'consult';
      this.storage.set('option', this.option)
      this.selectedProvider = $event.provider;
      this.submit();
    } else if ($event == 'expert') {
      this.expert = true;
      this.registry = false;
    }
  }


  goToProviderList() {
    this.storage.set('consult', true);
    this.router.navigate(['/homepage/login-poster'])
  }

  submit() {
    //set up submit role
    //this.selectedProvider=this.storage.get('selectedProvider')
    this.checkForm();
    if (this.missing == 0) {
      //alert('got here check form')
      if (this.service) {
        var service = this.service;
      }
      if (!this.selectedProvider && this.provider) {
        this.selectedProvider = this.provider;
      }
      this.user = this.storage.get('user');
      console.log('user============', this.user)

      if (this.user) {
        this.save();
      } else {
        this.storage.set('provider', this.selectedProvider);
        this.storage.set('profiles', this.profiles);
        this.storage.set('profile', this.profile);
        this.storage.set('educations', this.educations);
        this.storage.set('service', service);
        this.storage.set('forms', this.forms);
        this.storage.set('consult', this.consult);
        this.storage.set('followup', this.followup);

        this.isWeixin = this.storage.get('isWeixin');
        if (this.isWeixin) {
          window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
        } else {
          // 在已经登录情况下,根据用户角色重定向到登录页面
          let userBindInfo = new User;
          if (this.selectedProvider) {
            userBindInfo.providers = this.selectedProvider;
          }
          if (this.profile) {
            userBindInfo.profiles = this.profile;
          }
          if (this.educations) {
            userBindInfo.educations = this.educations;
          }
          if (this.service) {
            userBindInfo.service = this.service;
          }
          let userType = NaN;
          if (this.role == 'patient' || this.role == 'child') {
            userType = 0;
          } else if (this.role == 'provider') {
            userType = 1;
          }
          this.router.navigate(['/public-platform/homepage/login'], {
            queryParams: {
              userType: userType,
              userBindInfo: userBindInfo
            }
          })
        }
      }
    }
  }

  breakLines(str: any) {
    var temp = [];
    temp = str.split('/n');
    return temp;
  }

  /**
   * 判断当天用户是否是医护工作者
   */
  userRoleIsInRoleList(user: any) {
    let flag = false;
    for (let index = 0; index < environment.healthCareWorkerRoles.length; index++) {
      const role = environment.healthCareWorkerRoles[index];
      if (user.role == role) {
        flag = true;
      }
    }
    return flag;
  }


  providerRegister() {
    this.user = this.storage.get('user');
    if (this.user) {
      if (this.userRoleIsInRoleList(this.user)) {
        // 如果是医护工作者,直接绑定即可
        if (this.profile) {
          this.user.profiles.push(this.profile);
          this.allService.usersService.updateUser(this.user).then((res: any) => {
            this.loading = false;
            this.router.navigate(['provider-platform/provider/provider-folder']);
          }, (err: any) => {
            this.allService.alertDialogService.warn('加盟失败,请再次尝试!');
            this.loading = false;
          });;//running behind

        }
      } else {
        // 如果不是医护工作者,不需要绑定
        this.allService.alertDialogService.warn('只有医护工作者才可以加盟,您当前账号非医护工作者!')
      }
    } else {
      var role = 'provider';
      this.profiles = [this.profile];
      this.storage.set('profiles', this.profiles);
      this.storage.set('role', role);
      this.isWeixin = this.storage.get('isWeixin');
      if (this.isWeixin) {
        window.location.href = this.wechatJssdkConfig.wxAuthUrl0;
      } else {
        // 在已经登录情况下,根据用户角色重定向到登录页面
        let userBindInfo = new User;
        if (this.profile) {
          userBindInfo.profiles = this.profiles;
        }
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: 1,
            userBindInfo: userBindInfo
          }
        })
      }
    }
  }


  save() {
    this.loading = true;
    if (!this.user.providers) {
      this.user.providers = [];
    }
    if (this.selectedProvider && !this.find(this.selectedProvider, this.user.providers)) {
      this.user.providers.push(this.selectedProvider);
    }
    if (!this.user.serviceList) {
      this.user.serviceList = [];
    }
    if (this.selectedProvider && this.selectedProvider.service) {
      this.serviceID = this.selectedProvider.service._id;
      if (!this.find(this.selectedProvider.service, this.user.serviceList)) {
        this.user.serviceList.push({ _id: this.serviceID });
      }
    }
    if (!this.user.profiles)
      this.user.profiles = [];
    for (let profile of this.profiles) {
      if (!this.find(profile, this.user.profiles)) {
        this.user.profiles.push(profile);
      }
    }

    if (!this.user.educations)
      this.user.educations = [];
    for (let education of this.educations) {
      if (!this.find(education, this.user.educations)) {
        this.user.educations.push(education);
      }
    }

    console.log('this.patient', this.user)
    this.allService.usersService.updateUser(this.user).then((data: any) => {
      this.temp = data;
      this.user = this.temp;
      this.loading = false;
      this.allService.alertDialogService.alert('您的帐号已加入新项: ' + this.profile.label.ch)
      console.log('user updated:', this.user)
      this.storage.set('user', this.user);
      this.storage.set('patient', this.user);
      console.log('new patient', this.user);
      let queryParams = {
        myOrder: false,
        myProviders: false,
        searchProviders: false,
        profileProvider: true
      }
      this.router.navigate(['/provider-platform/patient/provider-list'], {
        queryParams
      })

      // this.createVisit();
    })
  }


  getProblemInfor(problem: any, ob: any, form: any) {
    for (let obSet of form.obSets) {
      if (problem._id == obSet.problemID) {
        ob.infor = obSet;
      }
    }
  }


  getMedicationInfor(medication: any, ob: any, form: any) {
    for (let obSet of form.obSets) {
      if (medication._id == obSet.medicationID) {
        ob.infor = obSet;
      }
    }
  }


  close() {
    this.router.navigate(['/homepage/introduction']);
  }


  gotoPublish() {

  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  hasProfile(account: any) {
    for (let profile of account.profiles) {
      //alert('profile'+profile._id)
      //alert('this.profileID'+this.profileID)
      if (profile._id == this.profileID) {
        return true;
      }
    }
    return false;
  }

}
