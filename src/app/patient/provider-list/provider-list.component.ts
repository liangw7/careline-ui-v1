import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';

import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AllServices, WechatJssdkConfig } from '../../core/common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MessageBoxComponent } from '../../core/common-components/message-box/message-box.component';
//provider
import { DomSanitizer } from '@angular/platform-browser';
import wx from 'weixin-jsapi';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';
import { ChatComponent } from '../chat/chat.component';
import { WxPayComponent } from '../wx-pay/wx-pay.component';
import { ActivatedRoute } from '@angular/router';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, OnChanges {
  @Input() providers: any;
  @Output() getSelectedProvider = new EventEmitter();
  openChat: any;// 是否打开chat标识
  openWxPay: any;// 是否打开wx-pay标识
  // 定时任务状态
  interval: any;
  // 医生患者聊天内容
  messages: any;
  // 是否可以退款标识符
  isRefund: any;
  temp: any;
  search: any;
  selectedProvider: any;
  profileProviders: any;
  allProviders: any;
  showMyProviders: any;
  showAllProviders: any;
  myProviders: any;// 我的医生
  myOrder: any;// 我的订单
  searchProviders: any;// 搜索医生
  profileProvider: any;// 项目医生
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
  allVisits: any;
  status: any;
  screenHeight: any;
  senderID: any;
  consult: any;
  list: any;
  selectedIndex: any;
  showProvider: any;
  newVisit: any;
  addOrder: any;
  //订单折腾面板
  consultShow: any = true;
  vedioShow: any = false;
  visitShow: any = false;
  @Output() messageEvent = new EventEmitter();
  //@ViewChild('template') template: FormComponent;


  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private titleService: Title,
    public route: ActivatedRoute,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

    this.bigScreen = this.storage.get('bigScreen');
    this.route.queryParams.subscribe(queryParams => {
      this.myOrder = queryParams.myOrder;
      this.myProviders = queryParams.myProviders;
      console.log('====================', queryParams)
      this.searchProviders = queryParams.searchProviders;
      this.profileProvider = queryParams.profileProvider;
      if (this.searchProviders) {
        this.getAllProviders();
      }

      if (this.profileProvider) {
        this.getProfileProviders();
      }
    })
    this.myProviders = true;
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight;
  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  ngOnInit() {
    this.getScreenSize();
    this.consult = this.storage.get('consult');
    if (!this.consult) {
      this.list = true;
    }
    this.language = this.storage.get('language');
    // this.bigScreen = this.storage.get('bigScreen');
    this.profile = this.storage.get('profile');
    this.user = this.storage.get('user');
    this.senderID = this.storage.get('senderID');
    if (this.senderID) {
      this.selectedProvider = { _id: this.senderID };

    }
    if (!this.selectedProvider) {
      this.selectedProvider = this.storage.get('provider');
      //  if (this.selectedProvider){
      //    this.chatRoom=true;
      //    this.selectedProfile=this.profile
      //  }
    }
    console.log('profile after login=======', this.profile);
    this.status = 'active'
    this.getAllVisits('active');
    if (!this.profile) {
      this.showMyProviders = true;
      this.myOrder = true;
      this.getMyProviders();
    } else {
      this.showProvider = true;
      this.selectedIndex = 2;
      this.showProfileProviders = true;
      this.getProfileProviders();
    }
    if (this.bigScreen == 1 && this.providers) {
      this.selectProvider(this.providers[0])
    }
    if (this.selectedProvider) {
      this.getActiveConsult();
    }
  }

  onChangeStatus($event: any) {
    this.status = $event.value
    let statusCode = $event.value != 'All' ? $event.value : null
    this.getAllVisits(statusCode);
    this.consultShow = true;
    this.vedioShow = false;
    this.visitShow = false;
  }

  ngOnChanges() {
    this.myOrder = true;
  }

  getMessages(selected: any) {
    this.messages = [];
    let flag = false;
    let flag1 = false;
    this.allServices.mailService.getMailByFilter(
      {
        '$or': [{ '$and': [{ 'userID': this.user._id }, { 'providerID': selected._id }] },
        { '$and': [{ 'userID': selected._id }, { 'patientID': this.user._id }] }
        ]
      }).then((data: any) => {
        this.messages = data;
        console.log('messages', this.messages);
        if (this.activeConsultVisit && this.activeConsultVisit.out_trade_no) {
          // 根据订单号获取支付成功的订单信息
          this.allServices.invoiceService.getByOutTradeNo(this.activeConsultVisit.out_trade_no).then((data) => {
            this.temp = data;
            console.log('-----getMessages----根据订单号获取支付成功的订单信息 data', data);
            if (this.temp && this.temp.code) {
              if (this.temp.code == 2) {// 支付成功状态
                let startDate = this.temp.time_end;
                // 从支付成功时间开始计算,如果未超过48小时的咨询是不可以退款的
                let time = 2 * 24 * 60 * 60 * 1000;
                if (new Date().getTime() - new Date(startDate).getTime() > time) {
                  flag1 = true;
                }
                // 循环遍历消息,看看医生是否给发过信息,如果发过则不能退款,如果没发过可以退款
                for (let index = 0; index < this.messages.length; index++) {
                  const element = this.messages[index];
                  /**
                   * 此处要注意,系统有个问题就是只要是咨询相同的医生,所有的消息记录都会存到一起
                   * 所以要注意一个细节,就是在判断医生是否给患者发过信息,要在此订单支付时间后的才有效
                   */
                  if (new Date(element.createdAt).getTime() > new Date(startDate).getTime()) {
                    if (element.patientID) {
                      break;
                    } else {
                      flag = true;
                      // break;
                    }
                  }
                }
              }
            }
            if (flag == true && flag1 == true) {
              this.isRefund = true;
            }
          })
        }
      })
  }

  /**
   * 如果visit.status == active || visit.status == reserved 可以打开chat,
   * 否则不可以打开chat
   * @param visit 选中每行信息,判断是否可以打开chat
   */
  isOpenChat(visit: any) {
    if (visit && visit.status) {
      if (visit.status == 'active' || visit.status == 'reserved') {
        this.openChat = true;
        this.openWxPay = false;
      } else {
        this.allServices.alertDialogService.alert('未支付成功订单,无法打开');
        this.openChat = false;
        this.openWxPay = false;
      }
    } else {
      this.openChat = false;
      this.openWxPay = true;
    }
  }

  tabSelectionChanged(event: any) {
    // Get the selected tab
    let selectedTab = event.tab;
    if (selectedTab.textLabel == '搜索医生') {
      this.selectedIndex = 1;
      this.getAllProviders();
    } else if (selectedTab.textLabel == '我的医生') {
      this.selectedIndex = 0;
    } else if (selectedTab.textLabel == '项目医生') {
      this.selectedIndex = 3;
    }
  }

  /**
   * 接收咨询Chat关闭是返回内容
   * @param $event 
   */
  receiveMessageChat($event: any) {
    if ($event == false) {
      this.chatRoom = false;
    }
  }

  /**
   * 接收咨询Chat关闭是返回内容
   * @param $event 
   */
  receiveVisitChat($event: any) {
    if ($event == 'new visit') {
      this.getActiveConsult();
      // this.selectProvider(this.selectedProvider);
    }
  }

  /**
   * 接收付费WxPay关闭是返回内容
   * @param $event 
   */
  receiveMessageWxPay($event: any) {
    if ($event == false) {
      this.chatRoom = false;
    }
  }

  /**
   * 接收付费WxPay关闭是返回内容
   * @param $event 
   */
  receiveVisitWxPay($event: any) {
    if ($event) {

      if ($event == 'selectProvider') {
        // this.getActiveConsult();
        this.selectProvider(this.selectedProvider);
      } else {
        var filter = {
          type: 'consult',
          _id: $event,
          // status: 'active'
        }
        this.allServices.visitsService.getOneVisit(filter).then((data) => {
          this.activeConsultVisit = data;
          console.log(this.selectedProfile);
          console.log(this.selectedProvider);
          this.chatRoom = true;
          this.openChat = true;
          this.openWxPay = false;
        })
      }
    }
  }


  getDetail(provider: any) {
    var selected = false;
    if (this.selectedProvider && this.selectedProvider._id == provider._id) {
      selected = true;
    }
    var data = {
      provider: provider,
      selected: selected,
      language: this.language
    }
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (this.bigScreen == 1) {
      dialogConfig = {
        data: data,
        maxWidth: '50vw',
        maxHeight: '50vh',
        height: '50%',
        width: '50%'
      }
    } else {
      dialogConfig = {
        data: data,
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: '90%'
      }
    }
    console.log('data in create patient', data)
    const dialogRef = this.dialog.open(MessageBoxComponent,
      dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      //  if (!this.selectedProvider){
      console.log('result', result)
      if (result) {
        if (result.consult) {
          this.selectedProvider = provider;
          this.getActiveConsult();
          this.getReservedVisits();
        }
      }
      // }
    });
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
      this.allServices.usersService.getByFilter({ '_id': { '$in': providerIDs } }).then((data) => {
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
    // if (!this.profileProviders) {
    this.profileProviders = []
    this.allServices.usersService.getByFilter(
      { 'profiles': { '$elemMatch': { _id: this.profile._id } }, 'role': 'provider' }).then((data) => {
        this.profileProviders = data;
        console.log('profile provides', this.profileProviders)
        if (this.bigScreen == 1)
          this.selectProvider(this.profileProviders[0])
      })
    // } else {
    //   this.selectProvider(this.profileProviders[0])
    // }
  }


  getAllProviders() {
    this.selectedProvider = null;
    if (!this.allProviders)
      // this.allServices.usersService.getByFilter({ 'role': 'provider' }).then((data) => {
      this.allServices.usersService.getWithDetailByFilter({ role: 'provider' }).then((data: any) => {
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
    return this.allServices.utilService.getHttpUrl(item.photo);
  }


  sendSubmit(submit: any, provider: any) {
    this.messageEvent.emit({ submit: submit, provider: provider });
  }


  selectProvider(provider: any) {
    if (provider && provider._id) {
      this.selectedProvider = provider;
      this.allServices.usersService.findUserById(provider._id).then((data) => {
        this.temp = data;
        if (this.temp) {
          // if (!this.findProvider(provider,this.providers))
          //    this.getDetail(this.temp);
          // else{
          this.selectedProvider = this.temp;
          // }
          if (this.selectedProvider) {
            this.getActiveConsult();
            this.getReservedVisits();

          }
        }
      })
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


  getVisits() {
    var filter = {
      patientID: this.user._id,
      providerID: this.selectedProvider._id,
      type: { '$in': ['consult', 'visit', 'vedio'] },
      status: { '$in': ['active', 'canceled', 'reserved',] }
    }
    this.visits = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      this.temp = data;
      this.visits = this.temp;
      this.loading = false;
      console.log('visits==============', this.visits)
    })
  }


  getAllVisits(status: any) {
    if (status) {
      this.filter = {
        patientID: this.user._id,
        // type: { '$in': ['consult', 'visit', 'vedio'] },
        type: 'consult',
        status: status
      }
    } else {
      this.filter = {
        patientID: this.user._id,
        // type: { '$in': ['consult', 'visit', 'vedio'] },
        type: 'consult',
        status: { '$in': ['active', 'canceled', 'reserved',] }
      }
    }
    this.allVisits = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsForProviderList(this.filter).then((data: any) => {
      debugger;
      if (data.code == 1) {
        this.allVisits = data.data;
        console.log('----this.allVisits----');
        console.log(this.allVisits);
      } else {
        alert(data.msg);
      }
      this.loading = false;
    })
  }


  getActiveVisits() {
    var filter = {
      patientID: this.user._id,
      type: { '$in': ['consult', 'visit', 'vedio'] },
      status: 'active'
    }
    this.allVisits = [];
    this.loading = true;
    this.allServices.visitsService.getVisitsByFilter(filter).then((data) => {
      console.log('active visits==============', data)
      this.temp = data;
      this.allVisits = this.temp;
      this.loading = false;
    })
  }


  getActiveConsult() {
    var filter = {
      type: 'consult',
      patientID: this.user._id,
      providerID: this.selectedProvider._id,
      status: 'active'
    }
    this.allServices.visitsService.getOneVisit(filter).then((data) => {
      this.activeConsultVisit = data;
      // 如果是患者端进入,获取消息内容,判断是否可以进行退款标识
      if (this.user.role == 'patient') {
        this.getMessages(this.selectedProvider);
      }
      if (this.senderID) {
        this.chatRoom = true;
      }
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
    this.allServices.mailService.sendMessageLink(filter, 1).then((data) => {
      console.log('message sent', message);
    })
  }


  cancelConsult() {
    // this.activeConsultVisit.status='canceled'
    //refund money to user's wechat account
    var filter = {
      out_trade_no: this.activeConsultVisit.out_trade_no
    }
    console.log('refund filter', filter)
    this.allServices.paymentService.refund(filter).then((data) => {
      this.temp = data;
      console.log('refund data', data)
      if (this.temp.code) {
        if (this.temp.code == 200) {
          this.allServices.visitsService.update({ _id: this.activeConsultVisit._id, status: 'canceled' }).then((data) => {
            this.allServices.alertDialogService.alert('申请退款成功!');
            let info = {
              "out_trade_no": this.activeConsultVisit.out_trade_no,
            }
            this.queryRefundOrderStatus(info);
          })
        } else {
          this.allServices.alertDialogService.alert('申请退款失败,请联系管理员或再次申请退款!');
        }
      }
    })
  }


  /**
   * 主动查询微信退款订单状态
   * @param info { out_trade_no: "系统订单号" }
   */
  queryRefundOrderStatus(info: any) {
    let that = this;
    // 定时任务开始查询微信退款订单状态
    console.log('定时任务开始查询微信退款订单状态');
    that.interval = setInterval(function () {
      that.allServices.paymentService.orderRefundQuery(info).then((data: any) => {
        console.log('定时任务开始查询微信退款订单状态----data----' + data);
        // 处理返回参数{ code: 500, message: '系统异常,查询订单失败!', data: { code: 3, status: '申请退款' } }
        if (data.code == 200) {// 系统后台未报错,逻辑执行完毕
          if (data.data) {
            // 4为退款成功,6为订单关闭,-3为退款异常
            if (data.data.code == 6 || data.data.code == -2) {
              // 更新为canceled
              that.allServices.visitsService.update({ out_trade_no: data.out_trade_no, status: 'refundcanceled' }).then((data: any) => {
                console.log('定时任务查询微信退款订单状态----关闭定时任务----');
                clearInterval(that.interval);
                that.allServices.alertDialogService.alert('退款失败，请重试');
                that.visit.status = 'refundcanceled';
              })
              // 以上状态则说明执行完毕,无需再继续查询
            } else if (data.data.code == 4) {
              //跳转到退款成功页面有这个页面
              // 更新为active
              that.allServices.visitsService.update({ out_trade_no: data.out_trade_no, status: 'refunded' }).then((data: any) => {
                console.log('定时任务查询微信支付订单状态----关闭定时任务----');
                clearInterval(that.interval);
                that.allServices.alertDialogService.alert('退款成功');
                // that.visit.status = 'refunded';
                // that.addVisit(that.visit);
                that.createMessage(that.activeConsultVisit);
                // 退款后刷新一下
                that.selectProvider(that.selectedProvider);
                // 以上状态则说明执行完毕,无需再继续查询
                for (let visit of that.visits) {
                  if (visit._id == that.activeConsultVisit) {
                    visit.status = 'refunded'
                    that.activeConsultVisit = null;
                  }
                }
              })
            }
          } else {
            console.log('退款状态为:');
            console.log(data.message);
          }
        } else {
          console.log('退款状态为:');
          console.log(data.message);
        }
      })
    }, 1000);
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



  showChat(profile: any) {
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
    const dialogRef = this.dialog.open(WxPayComponent,
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
  }


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
      this.selectProvider(this.selectedProvider);
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