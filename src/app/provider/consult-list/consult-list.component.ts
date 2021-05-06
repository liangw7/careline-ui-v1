import {
  Component, OnInit, OnChanges, Inject, HostListener, Input, Output, EventEmitter
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MessageBoxComponent } from '../../core/common-components/message-box/message-box.component';
//import { ChatComponent } from '../../../patient/chat/chat.component';
import { AllServices, WechatJssdkConfig } from '../../core/common-services';
//provider
import { DomSanitizer } from '@angular/platform-browser';
import wx from 'weixin-jsapi';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'patient-consult-list',
  templateUrl: './consult-list.component.html',
  styleUrls: ['./consult-list.component.scss']
})
export class ConsultListComponent implements OnInit, OnChanges {
  @Input() providers: any;
  @Input() hideHeader: any;
  @Output() getSelectedProvider = new EventEmitter();
  temp: any;
  consult: any;
  vedio: any;
  isVisit: any;
  charge: any;
  createdAt: any;
  selectedProvider: any;
  profileProviders: any;
  allProviders: any;
  showMyProviders: any;
  showAllProviders: any;
  myProviders: any;
  selectedPovider: any;
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
  language: any;
  showProfileProviders: any;
  bigScreen: any;
  profile: any;
  consults: any;
  vedios: any;
  visits: any;
  visit: any;
  consultVisits: any;
  activeConsultVisit: any;
  vedioVisits: any;
  officeVisits: any;
  editSchedule: any;
  receipt: any;
  signature: any;
  chatRoom: any;
  selectedProfile: any;
  allConsultVisits: any;
  allVedioVisits: any;
  allOfficeVisits: any;
  status: any;
  selectedPatient: any;
  invoices: any;
  screenHeight: any;
  senderID: any;
  @Output() messageEvent = new EventEmitter();
  //@ViewChild('template') template: FormComponent;


  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.bigScreen = this.storage.get('bigScreen');
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
  }


  ngOnInit() {
    
    this.consult = true;
    this.getScreenSize();
    this.language = this.storage.get('language');
    // this.bigScreen = this.storage.get('bigScreen');
    this.profile = this.storage.get('profile');
    this.user = this.storage.get('user');
    this.selectedProvider = this.storage.get('provider');
    console.log('profile after login=======', this.profile);
    this.getActiveVisits();
  }


  ngOnChanges() {

  }
  onChangeStatus($event: any) {
    this.status = $event.value
    // let statusCode = $event.value != 'All' ? $event.value : null
    // this.getAllVisits(statusCode);
  }


  goToChat(visit: any) {
    //this.temp=visit.patient;
    //this.temp.role='patient'
    //this.visitService.Update({_id:visit._id, 
    //patient:this.temp}).then((data)=>{
    this.loading = true;
    this.allServices.visitsService.getOneVisit({ '_id': visit._id }).then((data) => {
      visit = data;
      console.log ('visit=====', visit)
      if (!visit.patient){
   this.allServices.usersService.findUserById(visit.patientID).then((data)=>{
       visit.patient=data;
     this.selectedPatient = visit.patient;
     this.activeConsultVisit = visit;
     this.selectedProfile = visit.profiles[0];
     this.chatRoom = true;
     this.loading = false;
      
       })
      }
      else{
        this.selectedPatient = visit.patient;
        this.activeConsultVisit = visit;
        this.selectedProfile = visit.profiles[0];
        this.chatRoom = true;
        this.loading = false;
         
      }
      
    })

  }

  getInvoices() {
    this.invoices = [];
    var patientIDs = [];
    for (let visit of this.visits) {
      patientIDs.push(visit.patientID)
    }
    this.allServices.invoiceService.getByFilter({ 'patientId': { '$in': patientIDs } }).then((data) => {
      this.invoices = data;
      console.log('patient invoice-2', this.invoices)
    })
  }


  receiveMessage($event: any) {
    if ($event == false) {
      this.chatRoom = false;
    }
  }


  getDetail() {
    var data = {
      provider: this.selectedProvider,
      language: this.language,
    }
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this.bigScreen == 1) {
      dialogConfig = {
        data: data,
        maxWidth: '90vw',
        maxHeight: '90vh',
        height: '90%',
        width: '90%'
      }
    } else {
      dialogConfig = {
        data: data,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
    }
    console.log('data in create patient', data)
    const dialogRef = this.dialog.open(MessageBoxComponent,
      dialogConfig);
  }


  receiveMessageFromSchedule($event: any) {
    this.editSchedule = $event;
  }


  getMyProviders() {
    console.log('this.providers', this.providers);
    if (!this.providers) {
      this.providers = [];
      var providerIDs = [];
      for (let provider of this.user.providers) {
        providerIDs.push(provider._id)
      }
      this.allServices.usersService.getWithDetailByFilter({ '_id': { '$in': providerIDs } }).then((data) => {
        this.providers = data;
        console.log('my providers', this.providers)
        if (this.bigScreen == 1)
          this.selectProvider(this.providers[0])
      })
    } else {
      this.selectProvider(this.providers[0])
    }
  }


  getProfileProviders() {
    if (!this.profileProviders) {
      this.profileProviders = []
      this.allServices.usersService.getWithDetailByFilter({ 'profiles': { '$elemMatch': { _id: this.profile._id } }, 'role': 'provider' }).then((data) => {
        this.profileProviders = data;
        console.log('profile provides', this.profileProviders)
        if (this.bigScreen == 1)
          this.selectProvider(this.profileProviders[0])
      })
    } else {
      this.selectProvider(this.profileProviders[0])
    }
  }


  getAllProviders() {
    this.selectedProvider = null;
    if (!this.allProviders)
      this.allServices.usersService.getWithDetailByFilter({ 'role': 'provider' }).then((data) => {
        this.allProviders = data;
      })
  }


  getList(desc: any) {
    var list = [];
    if (desc) {
      list = desc.split(', ');
    }
    return list;
  }


  breakLines(str: any) {
    var temp = [];
    if (str)
      temp = str.split('/n');
    return temp;
  }

  select(provider: any, providers: any) {
    if (provider.selected) {
      provider.selected = false;
    } else {
      for (let item of providers) {
        item.selected = false;
      }
      provider.selected = true;
      this.getSelectedProvider.emit(provider);
    }
  }


  findProvider(provider: any, providers: any) {
    if (providers) {
      for (let item of providers) {
        if (item._id == provider._id)
          return true;
      }
    }
    return false;
  }

  getUrl(item: any) {
    if (item) {
      return this.allServices.utilService.getHttpUrl(item.photo);
    } else {
      return null
    }
  }


  sendSubmit(submit: any, provider: any) {
    this.messageEvent.emit({ submit: submit, provider: provider });
  }


  selectProvider(provider: any) {
    this.selectedProvider = provider;
    if (this.selectedProvider) {
      if (!this.findProvider(provider, this.providers))
        this.getDetail();
      this.getActiveConsult();
      this.getReservedVisits();
    }
  }


  getReservedVisits() {
    var filter = {
      patientID: this.user._id,
      providerID: this.selectedProvider._id,
      status: 'reserved'
    }
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      this.temp = data;
      this.visits = this.temp;
      this.vedioVisits = [];
      this.officeVisits = [];
      for (let item of this.temp) {
        if (item.type == 'vedio') {
          this.vedioVisits.push(item)
        } else if (item.type == 'visit') {
          this.officeVisits.push(item)
        }
      }
    })
  }

  /* getActiveVisits(){
         var filter={
           providerID:this.user._id,
           type:{'$in':['consult','visit','vedio']},
           status:{'$in':['active','reserved']}
         }
         
           this.visits=[];
           this.allConsultVisits=[];
           this.allOfficeVisits=[];
           this.allVedioVisits=[];
           this.loading=true;
           this.visitService.getVisitsByFilter(filter).then((data)=>{
             this.visits=data;
             this.loading=false;
             console.log ('visits', this.visits)
            
              
                 for (let visit of this.visits){
                   
                   
                   if (visit.type=='consult'&&!this.findVisit(visit, this.allConsultVisits)){
                     
                     this.allConsultVisits.push(visit);
 
                   }
                   else if (visit.type=='visit'&&!this.findVisit(visit, this.allOfficeVisits)){
                     this.allOfficeVisits.push(visit)
                   }
                   else if (visit.type=='vedio'&&!this.findVisit(visit, this.allVedioVisits)){
                     this.allVedioVisits.push(visit)
                   }
                 }
               
               
 
               console.log ('consult visit', this.allConsultVisits)
                   })
                 
               
             
             
     }*/
  getActiveVisitsVoid() {
    var filter = {
      providerID: this.user._id,
      type: { '$in': ['consult', 'visit', 'vedio'] },
      status: { '$in': ['active', 'reserved'] }
    }
    this.visits = [];
    this.allConsultVisits = [];
    this.allOfficeVisits = [];
    this.allVedioVisits = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      this.visits = data;
      this.loading = false;
      var patientIDs = [];
      for (let visit of this.visits) {
        patientIDs.push(visit.patientID)
      }
      this.allServices.usersService.getWithDetailByFilter({ '_id': { '$in': patientIDs } }).then((data) => {
        this.temp = data;
        for (let item of this.temp) {
          for (let visit of this.visits) {
            if (item._id == visit.patientID) {
              visit.patient = item;
              if (visit.type == 'consult' && !this.findVisit(visit, this.allConsultVisits)) {
                this.allConsultVisits.push(visit);
              } else if (visit.type == 'visit' && !this.findVisit(visit, this.allOfficeVisits)) {
                this.allOfficeVisits.push(visit)
              } else if (visit.type == 'vedio' && !this.findVisit(visit, this.allVedioVisits)) {
                this.allVedioVisits.push(visit)
              }
            }
          }
        }
        if (this.senderID) {
          for (let visit of this.visits) {
            if (visit.patientID == this.senderID) {
              this.selectedPatient = visit.patient;
              this.chatRoom = true;
            }
          }
        }
      })
      console.log('visits', this.visits)
      console.log('consult visit', this.allConsultVisits)
    })
  }
  getActiveVisits() {
    var filter = {
      providerID: this.user._id,
     // type: { '$in': ['consult', 'visit', 'vedio'] },
      type: 'consult' ,
      status: { '$in': ['active', 'reserved'] }
    }
    this.visits = [];
    this.allConsultVisits = [];
    this.allOfficeVisits = [];
    this.allVedioVisits = [];
   // this.loading = true;
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      this.visits = data;
  //    this.loading = false;
      
      for (let visit of this.visits){
        if (visit.patient){
              if (visit.type == 'consult' && !this.findVisit(visit, this.allConsultVisits)) {
                this.allConsultVisits.push(visit);
              } else if (visit.type == 'visit' && !this.findVisit(visit, this.allOfficeVisits)) {
                this.allOfficeVisits.push(visit)
              } else if (visit.type == 'vedio' && !this.findVisit(visit, this.allVedioVisits)) {
                this.allVedioVisits.push(visit)
              }
            }
              if (!visit.patient){
                this.allServices.usersService.findUserById(visit.patientID).then((data)=>{
                    visit.patient=data;
                    if (visit.type == 'consult' && !this.findVisit(visit, this.allConsultVisits)) {
                      this.allConsultVisits.push(visit);
                    } else if (visit.type == 'visit' && !this.findVisit(visit, this.allOfficeVisits)) {
                      this.allOfficeVisits.push(visit)
                    } else if (visit.type == 'vedio' && !this.findVisit(visit, this.allVedioVisits)) {
                      this.allVedioVisits.push(visit)
                    }
                })
              }
            
            }
        if (this.senderID) {
          for (let visit of this.visits) {
            if (visit.patientID == this.senderID) {
              this.selectedPatient = visit.patient;
              this.chatRoom = true;
            }
          }
        }
      
      console.log('visits', this.visits)
      console.log('consult visit', this.allConsultVisits)
    })
  }

  findVisit(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false;
  }


  getActiveConsult() {
    var filter = {
      type: 'consult',
      patientID: this.user._id,
      providerID: this.selectedProvider._id,
      status: 'active'
    }
    this.allServices.visitsService.getOneVisit(filter).then((data) => {
      this.activeConsultVisit = data
    })
  }


  getVisitInfor(profileItem: any) {
    if (!this.activeConsultVisit) {
      return null;
    } else {
      for (let item of this.activeConsultVisit.profiles) {
        if (item._id == profileItem._id) {
          console.log('item', item)
          return this.activeConsultVisit;
        }
      }
    }
    return null
  }


  addConsult(profile: any) {
    if (!this.consultVisits) {
      this.consultVisits = [];
    }
    //create a visit with visit type:'consult'
    var filter = {
      patientID: this.user._id,
      patient:this.user,
      providerID: this.selectedProvider._id,
      provider: this.selectedProvider,
      profiles: [profile],
      desc: { label: profile.label },
      visitDate: new Date(),
      type: 'consult',
      status: 'active'
    }
    console.log('filter', filter)
    this.allServices.visitsService.createVisit(filter).then((data) => {
      this.activeConsultVisit = data;
      this.consultVisits.push(this.activeConsultVisit);
      this.createMessage(this.activeConsultVisit);
    })
  }


  vedioSchedule() {
  }

  visitSchedule() {
  }

  sendMail(receiver: any, message: any) {
    var image = URL + 'photo-' + String(this.user.photo) + '.png';
    if (this.user.role == 'provider') {
      var receiverRole = 'patient';
      var title = '数基邮箱:' + this.user.name + '医生有一条消息在您的数基健康卡邮箱';
    } else {
      receiverRole = 'provider';
      var title = '数基邮箱:' + this.user.name + '有一条消息在您的数基医生工作室邮箱';
    }
    var filter = {
      appID: this.wechatJssdkConfig.appID0,
      appSecret: this.wechatJssdkConfig.appSecrete0,
      openID: receiver.openID,
      message: message,
      title: title,
      url: 'https://www.digitalbaseas.com/public-platform/homepage/login-poster/'
        + receiverRole
        + '/'
        + this.user._id,
      picUrl: image
    };
    console.log('mail filter', filter)
    this.allServices.mailService.sendMessageLink(filter, 0).then((data) => {
      console.log('message sent', message);
    })
  }

  cancelConsult() {
    // this.activeConsultVisit.status='canceled'
    //refund money to user's wechat account
    var filter = {
      visitId: this.activeConsultVisit._id
    }
    console.log('refund filter', filter)
    this.allServices.paymentService.refund(filter).then((data) => {
      this.temp = data;
      console.log('refund data', data)
      if (this.temp.params) {
        this.allServices.alertDialogService.alert('refund is done!')
        this.allServices.visitsService.update({ _id: this.activeConsultVisit._id, status: 'canceled' }).then((data) => {
          for (let visit of this.visits) {
            if (visit._id == this.activeConsultVisit) {
              visit.status = 'canceled'
              this.activeConsultVisit.status = 'canceled'
            }
          }
          this.createMessage(this.activeConsultVisit);
        })
      }
    })
  }

  createMessage(visit: any) {
    //adde from patient
    var patientID = this.user._id;
    if (this.selectedProvider) {
      var providerID = this.selectedProvider._id;
      if (visit.status == 'active') {
        var mail = {
          contentList: [{ component: 'message', visit: visit }],
          userID: this.user._id,
          patientID: patientID,
          providerID: providerID,
          status: visit.status
        }
        this.allServices.mailService.create(mail).then((data) => {
          this.temp = data;
          var message = '图文咨询请求|' + visit.profiles[0].label.ch;
          this.sendMail(this.selectedProvider, message);
        })
        // this.showChat();
      } else {
        var cancelMail = {
          contentList: [{ component: 'message', message: '图文咨询请求已经取消.' }],
          userID: this.user._id,
          patientID: patientID,
          providerID: providerID,
          status: visit.status
        }
        this.allServices.mailService.create(cancelMail).then((data) => {
          this.temp = data;
          var message = '图文咨询请求|' + visit.profiles[0].label.ch + '已经取消.';
          this.sendMail(this.selectedProvider, message);
        })
      }
    }
  }


 /* showChat(profile: any) {
    let dialogConfig = new MatDialogConfig();
    //  dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    if (this.bigScreen == 0) {
      dialogConfig = {
        data: {
          'visit': this.activeConsultVisit,
          'profile': profile,
          'user': this.user,
          'language': this.language,
          'selected': this.selectedProvider,
          'bigScreen': this.bigScreen
        },
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
    } else if (this.bigScreen == 1) {
      dialogConfig = {
        data: {
          'visit': this.activeConsultVisit,
          'profile': profile,
          'user': this.user,
          'language': this.language,
          'selected': this.selectedProvider,
          'bigScreen': this.bigScreen
        },
        //maxWidth: '80vw',
        //maxHeight: '80vh',
        height: '90%',
        width: '80%'
      }
    }
    const dialogRef = this.dialog.open(ChatComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.visit) {
          if (result.visit.status == 'active') {
            this.activeConsultVisit = result.visit;
          }
        }
      }
    })
  }*/


  activate(visit: any) {
    this.loading = true;
    this.allServices.visitsService.update({ '_id': visit._id, 'status': 'active' }).then((data) => {
      console.log('updated visit', data)
      visit.status = 'active';
      this.activeConsultVisit = visit;
      this.loading = false;
    })
  }


  delete(visit: any) {
    this.loading = true;
    this.allServices.visitsService.delete(visit._id).then((data) => {
      var index = this.visits.indexOf(visit);
      this.visits.splice(index, 1);
      this.loading = false;
    })
  }


  deActivate(visit: any) {
    this.allServices.visitsService.update({ '_id': visit._id, 'status': 'canceled' }).then((data) => {
      console.log('updated visit', data)
      visit.status = 'canceled';
      this.activeConsultVisit.status = 'canceled';
      this.loading = false;
    })

  }
}
