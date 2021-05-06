import {
  Component, OnInit, Inject, ViewChild, Input, OnChanges,
  AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../../core/common-services';

@Component({
  selector: 'profile-patient-list',
  templateUrl: './profile-patient-list.component.html',
  styleUrls: ['./profile-patient-list.component.scss']
})
export class ProfilePatientListComponent implements OnInit, OnChanges, AfterContentInit {
  patients: any;
  selectedPatient: any;
  formId: any;
  temp: any;
  patientLists: any;
  filters: any;
  patientList: any;
  selectedObs: any;
  report: any;
  isReport: any;
  emailList: any;
  filterIndex: any;
  profiles: any;
  consultProfiles: any;
  searchProfile: any;
  search: any;
  originalProfiles: any;
  selectedProfile: any;
  selectedPatientList: any;
  selectedPatients: any;
  selectedIndex: any;
  chart: any;
  profilePatients: any;
  allPatients: any;
  devicePatients: any;
  device: any;
  userIdList: any;
  deviceFilterPatients: any;
  limit: any;
  @Input() profile: any;
  @Input() profileID: any;
  @Input() language: any;
  @Input() loading: any;
  @Input() service: any;
  @Input() user: any;
  @Input() group: any;
  @Input() showChart: any;
  @Input() showFilter: any;
  @Input() content: any;
  loadingDone: any;
  color: any;
  temp1: any;
  idList: any;
  totalPatients: any;
  listItem: any;
  userIDList: any;
  bigScreen: any;
  obValues:any;
  selectedOb: any;
  @Output() stopLoading: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    public allServices: AllServices,
    private dialog: MatDialog,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.bigScreen = this.storage.get('bigScreen')
    //this.getReport(this.profile);
  }


  ngOnInit() {
    console.log('selected profile.patientLists', this.profile.patientLists)
   // this.profile.showList = true;
    this.service = this.user.service;
    this.color = this.storage.get('color')
    
    console.log ('content==========', this.content)
     if (this.content=='list'){
      if (this.profile.patientLists && this.profile.patientLists.length > 0) {
        console.log('ok1', this.profile)
        this.initFilter();
      } 
     }
     else{
       this.getReport(this.profile);
     }
   
  }


  ngAfterContentInit() {
  }


  ngOnChanges() {
    console.log('selected profile.patientLists', this.profile.patientLists)
  //  this.profile.showList = true;
    this.service = this.user.service;
    this.color = this.storage.get('color')
    this.profile.list = false;
    console.log ('content==========', this.content)
    if (this.content=='list'){
      if (this.profile.patientLists && this.profile.patientLists.length > 0) {
        console.log('ok1', this.profile)
        this.initFilter();
      } 
     }
     else{
       this.getReport(this.profile);
     }
  }


  initFilter() {
    console.log('this.profile.showList', this.profile.showList)
    if (this.profile.patientLists) {
      if (this.bigScreen == 1) {

        this.selectedPatientList = this.profile.patientLists[0];
        this.getPatientsByFilter(this.selectedPatientList);
        
      }
    }
  }

  onOptionChange($event:any){
    
   
    if (this.profile.patientLists) {
  
      for (let patientList of this.profile.patientLists) {
      
        if ( (patientList.label && patientList.label.ch == $event.value)) {
          this.getPatientsByFilter(patientList);
          this.selectedPatientList = patientList;
        }
      }
    }
    }

  initProfile() {
    this.profilePatients = true;
  }


  initAllPatients() {
    this.allPatients = true;
    // console.log ('ok',  this.allPatients)
    // if (this.user.role!='provider')
    this.getTotalPatients();
  }


  getObSetLabel(language: any, obSet: any) {
    if (language == 'Chinese') {
      if (obSet.label)
        return obSet.label.ch;
      else if (!obSet.label)
        return obSet.name;
    } else if (language == 'English')
      if (obSet.label)
        return obSet.label.en;
      else if (!obSet.label)
        return obSet.name;
  }


  getDevicePatients() {
    this.device = true;
    this.allServices.deviceService.getPatients(this.profile.profileUrl.deviceUrl).then((data) => {
      console.log('device patient', data)
      this.devicePatients = [];
      this.temp = data;
      this.devicePatients = this.temp.data;
    })
  }


  getReport(profile: any) {
    profile.chart = true;
    console.log('ok-1', profile)
    profile.isReport = true;
    if (profile.forms && profile.forms.length > 0) {
      //console.log ('ok-2',profile.forms)
      for (let form of profile.forms) {
        if (form.formType == 'report' && !profile.report)
          profile.report = form;
      }
      // console.log ('profile.report.obSets',profile.report.obSets)
      if (profile.report && !profile.report.obSets) {
        console.log('ok-3')
        this.allServices.categoryService.getCategory(profile.report._id).then((data) => {
          this.temp = data;
          profile.report.obSets = [];
          profile.report.obSets = this.temp.obSets;
          for (let obSet of profile.report.obSets) {
            this.allServices.categoryService.getCategory(obSet._id).then((data) => {
              this.temp = data;
              obSet.obs = [];
              obSet.obs = this.temp.obs;
              if (obSet.obs.length > 0) {
                this.selectedOb = obSet.obs[0];
              }
            })
          }
          //    console.log ('this.report',profile.report)
        })
      }
    }
  }


  getTotalPatients() {
    this.loading = true;
    // if (this.user.role=='provider'){
    //  if (this.service&&this.group=='teamPatients'){
    // this.userService.getPatientsByProfileService(this.profile, this.service).then((data)=>{
    this.allServices.usersService.getPatientsByProfile({ profileID: this.profile._id }).then((data) => {
      this.temp = data;
      console.log ('all patients', this.temp)
      this.profile.patients = this.temp;
      this.profile.totalPatients = [];
      this.profile.totalPatients = this.temp;
      this.loading = false;
    })
    //  }
    /*  else if (this.group=='myPatients'){
       this.userService.getByFilter({profiles:{'$elemMatch':{_id:this.profile._id}},
                                     providers:{'$elemMatch':{_id:this.user._id} },
                                     role:'patient'
                                    }).then((data)=>{
         this.temp=data;
         this.profile.patients=this.temp;
         this.profile.totalPatients=[];
         this.profile.totalPatients=this.temp;
         this.loading=false;
        })
   
      }*/
    // }
    /* else {
      this.userService.getPatientsByProfile(this.profile).then((data)=>{
        this.temp=data;
        this.profile.patients=this.temp;
        this.profile.totalPatients=[];
        this.profile.totalPatients=this.temp;
        this.loading=false;
       })
     }*/
  }



  getPatientByProfile(event: any) {
    var target = event.tab;
    for (let consultProfile of this.consultProfiles) {
      if (consultProfile.name == target.textLabel) {
        this.getListByProfile(consultProfile, this.profile)
      }
    }
  }


  getDeviceFilterList(patientList: any) {
    if (this.profile.profileUrl) {
      this.loading = true;
      this.allServices.deviceService.getPatients(this.profile.profileUrl.deviceUrl).then((data) => {
        this.userIDList = [];
        this.temp = data;
        for (let item of this.temp.data) {
          this.userIDList.push(item.userID);
        }
        this.allServices.categoryService.getCategory(patientList._id).then((data) => {
          this.temp = data;
          patientList.obs = [];
          patientList.obs = this.temp.obs;
          var query = '';
          for (let userID of this.userIDList) {
            var index = this.userIDList.indexOf(userID);
            var query = query + " (select  deviceID, deviceValue, time, '"
              + userID
              + "' as userID  from "
              + userID;
            for (let ob of patientList.obs) {
              if (patientList.obs.indexOf(ob) == 0) {
                query = query + " where deviceID in ("
                  + this.getDeviceID(ob.devices) + " ) ";
              } else if (patientList.obs.indexOf(ob) > 0) {
                query = query + " or deviceID in ("
                  + this.getDeviceID(ob.devices) + " ) ";
              }
            }
            // +"and charindex(';',deviceValue) =0 "
            query = query + " group  BY deviceID )";
            if (index != this.userIDList.length - 1) {
              query = query + " union all "
            }
          }
          this.allServices.deviceService.getUserDataByDeviceByFilter(this.profile.profileUrl.deviceUrl, query).then((data) => {
            //  console.log ('device data', data);
            this.temp = data;
            this.loading = false;
            //  this.profile.patients=this.temp.data;
            for (let ob of patientList.obs) {
              ob.users = [];
              for (let device of ob.devices) {
                device.users = [];
                for (let item of this.temp.data) {
                  if (item.deviceID == device.ID) {
                    var numbers = [];
                    numbers = item.deviceValue.split(';');
                    for (let option of ob.options) {
                      var value = Number(numbers[device.location]);
                      if (value >= option.from && value < option.to) {
                        item.deviceValue = value;
                        item.name = ob.label.ch;
                        device.users.push(item);
                      }
                    }
                  }
                }
                this.combineUsers(device.users, ob.users)
              }
              this.shareUsers(ob.users);
            }
            var userIDs = [];
            console.log('this.devicePatients', this.devicePatients)
            for (let user of this.devicePatients) {
              userIDs.push(user.userID);
            }
            this.deviceFilterPatients = [];
            this.allServices.usersService.getByFilter({ deviceUserID: { $in: userIDs } }).then((data) => {
              this.temp = data;
              console.log('patients', this.temp)
              this.deviceFilterPatients = this.temp;
              //map with device value
              for (let patient of this.deviceFilterPatients) {
                for (let item of this.devicePatients) {
                  if (patient.deviceUserID == item.userID) {
                    patient.devices = [];
                    console.log('item.devices', item.devices)
                    patient.devices = item.devices;
                  }
                }
              }
              if (this.profile.patients.length == 0)
                this.profile.patients = this.deviceFilterPatients;
              else {
                var tempList = this.profile.patients;
                this.profile.patients = [];

                for (let item of tempList) {
                  if (this.findPatient(item, this.deviceFilterPatients))
                    this.profile.patients.push(item);
                }
              }
              this.loading = false;
              console.log('this.profile.ptients', this.profile.patients)
            })
          })
        })
      })
    }
  }


  getPatientsByFilter(patientList: any) {
  
    if (patientList) {
     // console.log('patientList========================', patientList)
     this.loading=true;
    this.allServices.categoryService.getCategory(patientList._id).then((data)=>{
      this.temp=data;
      this.loading=false;
      console.log ('patientList============',this.temp)
      var obIDs=[];
      var first = new Date();
      var last = new Date(first.getFullYear(), first.getMonth()-10, first.getDate());
      this.obValues=[];
      patientList.obs=[];
      patientList.obs=this.temp.obs;
      patientList.selectedObs=[];
      patientList.selectedObs=this.temp.selectedObs;
      if (patientList.obs) {
        for (let ob of patientList.obs) {
          obIDs.push(ob._id)
          this.obValues.push(ob.options[0].text)
        }
     //   console.log('obValues===========', this.obValues)
          this.allServices.datasService.getDatasByFilter2(
            { 'obID': {'$in': obIDs},
             'createdAt':{'$gte':last, '$lt': first}
            }).then((data) => {
            this.temp = data;
          
            var patientIDs=[]
            for (let item of this.temp){
              var index=0
                if (item.values&&this.findValueList(item.values, this.obValues)){
                  for (let item_1 of patientIDs){
                    if (item.patientID==item_1._id&&item_1.obID==item.obID){
                      index++;
                      item_1.occurence++;
                    }
                  }
                if (index==0){
                  patientIDs.push({_id:item.patientID,obID:item.obID, occurence:1})
                }
                
                }
            }
      
            var patientIDs_2=[]
            for (let item of patientIDs){
              patientIDs_2.push(item._id)
            }
          
            this.allServices.usersService.getByFilter({'_id': {'$in': patientIDs_2}}).then((data)=>{
              this.temp=data;
              this.profile.patients=[];
              this.profile.patients=this.temp;
              console.log ('patient list=========', this.temp);
              
            })

          })
        
      }
      this.profile.selectedPatientList = patientList;
    
 
    })
    }
  }
  getPatientsByFilterVoid(patientList: any) {
    if (patientList) {
      console.log('patientList========================', patientList)
      console.log('profile========================', this.profile)
    /*  if (patientList.obs) {
        for (let ob of patientList.obs) {
          this.allServices.datasService.getDatasByFilter2({ 'obID': ob._id }).then((data) => {
            this.temp = data;
            console.log('this.temp========================', this.temp)
            for (let item of this.temp) {
              if (item.values.length > 0 && item.values[0].text) {
                var values = [];
                for (let value of item.values) {
                  values.push(value.text)
                }
                item.values = [];
                item.values = values;
                this.allServices.datasService.update(item).then((data) => {
                  this.allServices.alertDialogService.alert('updated')
                });
              }
            }
          })
        }
      }*/
      this.profile.selectedPatientList = patientList;
      /* if (this.service){
        this.dataService.getPatientsByFilter(
          {patientListID:patientList._id, 
            profileID:this.profile._id, 
            serviceID:this.service._id}).then((data)=>{
          console.log ('data', data)
          this.profile.patients=[];
          this.profile.patients=data;
          this.getDeviceFilterList(patientList);
          this.loading=false;
       });
      }*/
      //   else{
      // }
      this.loading = true;
      this.allServices.datasService.getPatientsByFilter(
        {
          patientListID: patientList._id,
          profileID: this.profile._id
        }).then((data) => {
          console.log('data============================', data)
          this.profile.patients = [];
          this.profile.patients = data;
          this.loading = false;
        });
    }
  }


  findPatientOccurence(patientID:any, patients:any){
    for (let item of patients){
      if (patientID==item._id){
        return true;
      }
     
    }
    return false;
  }
  findValueList(values:any, valueList:any){
     for (let item of valueList){
       for (let item_1 of values){
         if (item==item_1){
           return true;
         }
       }
     }
    return false;
  }

  getDeviceID(devices: any) {
    var deviceIDs = []
    for (let device of devices) {
      deviceIDs.push("'" + device.ID + "'")
    }
    return deviceIDs;
  }


  combineUsers(compareList: any, outComeList: any) {
    for (let item of compareList) {
      if (this.findUser(item, outComeList) == -1) {
        var device = { ID: item.deviceID, name: item.name, value: item.deviceValue, time: item.time }
        outComeList.push({ userID: item.userID, devices: [device] });
      }
    }
  }

  shareUsers(compareList: any) {
    if (!this.devicePatients) {
      this.devicePatients = [];
      for (let item of compareList) {
        this.devicePatients.push(item)
      }
    } else if (this.devicePatients.length > 0) {
      var tempList = this.devicePatients;
      this.devicePatients = [];
      console.log('tempList', tempList)
      console.log('compareList', compareList)
      for (let item of tempList) {
        var index = this.findUser(item, compareList);
        if (index > -1) {
          if (!item.devices)
            item.devices = [];
          var device = compareList[index].devices[0];
          if (!this.findDevice(device, item.devices)) {
            item.devices.push(device);
          }
          this.devicePatients.push(item);
        }
      }
    }
  }


  findDevice(device: any, devices: any) {
    for (let item of devices) {
      if (item.ID == device.ID) {
        return true;
      }
    }
    return false;
  }


  findUser(user: any, list: any) {

    for (let item of list) {
      var index = list.indexOf(item);
      if (item.userID == user.userID) {
        return index;
      }
    }
    return -1;
  }


  loadPatient() {
    console.log('ok', this.searchProfile.length)
    if (this.searchProfile.length > 0) {
      this.profiles = [];
      for (let profile of this.originalProfiles) {
        if (profile.name.toLowerCase().indexOf(this.searchProfile.toLowerCase()) > -1) {
          this.profiles.push(profile);
        }
      }
      this.profiles[0].chart = true;
      this.profiles[0].list = false;
      this.profiles[0].selected = true;
      if (!this.profiles[0].report)
        this.getReport(this.profiles[0])
    } else if (this.searchProfile.length == 0) {
      this.profiles = [];
      this.profiles = this.originalProfiles;
      for (let profile of this.profiles) {
        profile.selected = false;
      }
      this.profiles[0].chart = true;
      this.profiles[0].list = false;
      this.profiles[0].selected = true;
      if (!this.profiles[0].report)
        this.getReport(this.profiles[0])
    }
    if (this.profiles.length > 0) {
      console.log('this.profiles[0]', this.profiles[0].name)
      if (this.service) {
        this.allServices.usersService.getPatientsByProfileService(this.profiles[0], this.service).then((data) => {
          this.profiles[0].patients = [];
          this.profiles[0].patients = data;
          if (this.profiles[0])
            this.loading = false;
        })
      } else {
        this.allServices.usersService.getPatientsByProfile(this.profiles[0]).then((data) => {
          this.profiles[0].patients = [];
          this.profiles[0].patients = data;
          if (this.profiles[0])
            this.loading = false;
        })
      }
    }
  }


  //click on mat-tab
  profileChanged(event: any) {
    let selectedTab = event.tab;
    this.patients = [];
    for (let profile of this.profiles) {
      profile.selected = false;
      if (selectedTab.textLabel == profile.name) {
        console.log('profile', profile)
        profile.filter=true;
        profile.list = false;
        profile.selected = true;
        if (!profile.report)
          this.getReport(profile);
      }
    }
  }

  getpatientList(profile: any) {
    if (profile.patients && profile.patients.length > 0) {
      for (let patient of profile.patients) {
        if (profile.selectedObs) {
          for (let ob of profile.selectedObs) {
            this.findValue(patient, ob, profile);
          }
        }
      }
    }
  }


  getList(patientList: any, profile: any) {
    for (let item of this.consultProfiles) {
      item.selected = false;
    }
    console.log('patientList', patientList)
    for (let patientListItem of profile.patientLists) {
      patientListItem.selected = false;
    }
    patientList.selected = true;
    this.filters = [];
    profile.patients = [];
    //   this.patientList=patientList;
    var obList = [];
    var valueList = [];
    this.emailList = [];
    var filterIndex = 0;
    this.allServices.categoryService.getCategory(patientList._id).then((data) => {
      patientList.obs = [];
      this.temp = data;
      patientList.obs = this.temp.obs;
      for (let ob of patientList.obs) {
        this.filters.push({
          obID: ob._id,
          values: ob.options
        });
      }
      for (let filter of this.filters) {
        this.allServices.datasService.getDatasByFilter(filter).then((data) => {
          this.temp = data;
          this.combineEmail(this.temp)
          console.log('filter', filter)
          console.log('this.filters.indexOf(filter)', this.filters.indexOf(filter));
          console.log('this.filters.length', this.filters.length);
          console.log('emailList', this.emailList)
          if (this.filterIndex == this.filters.length - 1) {
            console.log('emailList-last', this.emailList)
            for (let item of this.emailList) {
              if (item) {
                this.allServices.usersService.getUserByEmail(item).then((data) => {
                  this.temp = data;
                  for (let ob of profile.selectedObs) {
                    if (this.temp)
                      this.findValue(this.temp, ob, profile);
                  }
                  // console.log ('patients', this.patients)
                  if (!this.findPatient(this.temp, profile.patients))
                    profile.patients.push(this.temp);
                })
              }
            }
          }
        });
      }
    })
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false
  }


  getListByProfile(profileItem: any, profile: any) {
    profile.patients = [];
    for (let patient of profile.totalPatients) {
      if (this.find(profileItem, patient.profiles))
        profile.patients.push(patient);
    }
    console.log('profile.patients', profile.patients)
  }


  combineEmail(dataList: any) {
    var temp = [];
    if (this.emailList.length == 0) {
      this.filterIndex = 0;
      for (let data of dataList) {
        if (this.emailList.indexOf(data.patientEmail) == -1)
          this.emailList.push(data.patientEmail)
      }
    } else {
      this.filterIndex++;
      for (let email of this.emailList) {
        for (let data of dataList) {
          if (email == data.patientEmail && temp.indexOf(email) == -1)
            temp.push(email)
        }
      }
      this.emailList = [];
      this.emailList = temp;
    }
    // console.log('temp', temp)
    // console.log('emailList', emailList)
  }


  findPatient(patient: any, patients: any) {
    for (let item of patients) {
      if (item._id == patient._id)
        return true;
    }
    return false;
  }


  findPatient2(item: any, patients: any) {
    for (let patient of patients) {
      if (item.patientID == patient._id)
        return true;
    }
    return false;
  }


  findValue(patient: any, ob: any, selectedObs: any) {
    //  console.log ('ok-patient')
    patient.selectedObs = [];
    for (const item of selectedObs) {
      patient.selectedObs.push(null)
    }
    this.allServices.datasService.getDatasByPatient(patient._id, ob._id).then((data) => {
      this.temp = data;
      if (this.temp.length > 0)
        for (const item of selectedObs) {
          if (item._id == this.temp[0].obID) {
            var index = selectedObs.indexOf(item);
            patient.selectedObs[index] = this.temp[0];
          }
        }
      //  patient.selectedObs.push(this.temp[0]);
      //  console.log ('patient',patient)
    })
  }


  sortList(patientList: any, patient: any) {
    let temp = [];
    temp = patient.selectedObs;
    console.log('got sort', temp)
    console.log('patient.selectedObs', patient.selectedObs)
    patient.selectedObs = [];
    for (let ob of patientList.selectedObs) {
      for (let obItem of temp) {
        console.log('ob.name', ob.name)
        console.log('obItem.obName', obItem.obName)
        if (ob.name == obItem.obName) {
          patient.selectedObs.push(obItem)
        }
      }
    }
  }


  findOb(ob: any) {
    if (this.patientList.selectedObs == undefined)
      this.patientList.selectedObs = [];
    for (let item of this.patientList.selectedObs) {
      if (item._id === ob._id)
        return true;
    }
    return false;
  }


  addToMyList() {
    if (!this.user.patientLists)
      this.user.patientLists = [];
    if (this.allPatients == true) {
      this.listItem = {
        profile: { _id: this.profile._id },
        name: this.profile.name,
        label: this.profile.label
      };
    } else {
      this.listItem = {
        list: this.profile.selectedPatientList,
        profile: { _id: this.profile._id },
        label: this.profile.label,
        name: this.profile.selectedPatientList.name + ' ' + this.profile.name
      };
    }
    console.log(' this.listItem', this.listItem)
    if (!this.findPatientList(this.listItem, this.user.patientLists))
      this.user.patientLists.push(this.listItem);
    console.log('this.user.patientLists', this.user.patientLists)
    this.allServices.usersService.updateUser(this.user).then((data) => {
      console.log('user updated', data);
      this.storage.set('user', this.user)
      this.selectedIndex = 0;
    })
  }


  findList(item: any, list: any) {
    for (let i of list) {
      if (item.name == i.name)
        return true;
    }
    return false
  }


  findPatientList(item: any, list: any) {
    for (let i of list) {
      if ((item.list && i.list && item.list._id == i.list._id && item.profile._id == i.profile._id)
        || (!item.list && !i.list && item.profile._id == i.profile._id))
        return true;
    }
    return false
  }


  tabSelectionChanged(event: any) {
    // Get the selected tab
    let selectedTab = event.tab;
    this.isReport = true;
    // console.log(selectedTab);
    if (selectedTab.textLabel == '分析图表 chart') {
      console.log('ok-1')
      //this.report=this.patientList.reportForm;
      this.report = null;
      if (this.selectedProfile.forms.length > 0) {
        console.log('ok-2', this.selectedProfile.forms)
        for (let form of this.selectedProfile.forms) {
          if (form.formType == 'report')
            this.report = form;
        }
        if (this.report) {
          console.log('ok-3')
          this.allServices.categoryService.getCategory(this.report._id).then((data) => {
            this.temp = data;
            this.report.obSets = [];
            this.report.obSets = this.temp.obSets;
            for (let obSet of this.report.obSets) {
              this.allServices.categoryService.getCategory(obSet._id).then((data) => {
                this.temp = data;
                obSet.obs = [];
                obSet.obs = this.temp.obs;
              })
            }
            console.log('this.report', this.report)
          })
        }
      }
    }
  }
}



