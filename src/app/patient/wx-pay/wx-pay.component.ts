import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from 'ngx-qrcode2';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ChatComponent } from '../chat/chat.component';
import wx from 'weixin-jsapi';
import { Title } from '@angular/platform-browser';
import { ApiUrl } from 'src/app/core/models';
import { AllServices } from 'src/app/core/common-services';

@Component({
  selector: 'app-wx-pay',
  templateUrl: './wx-pay.component.html',
  styleUrls: ['./wx-pay.component.scss']
})
export class WxPayComponent implements OnInit, OnChanges, AfterViewInit {
  // 二维码链接
  code_url: any;
  // 二维码链接相关
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  // H5支付返回的mweb_url
  mweb_url: any;
  // 定时任务状态
  interval: any;
  // 是否关闭咨询
  isClosed: any;
  // 是否支付成功
  isPaySuccess: any;
  // 是否可以退款标识符
  isRefund: any;
  // 是否同意支付协议
  isAgree: any;
  orderId: any;
  visitId: any;
  isPc: any;
  isWeixin: any;
  patient: any;
  provider: any;
  receipt: any;
  consultForm: any;
  message: any;
  myPeerId: any;
  temp: any;
  senderID: any;
  addFiles: any;
  @Input() selected: any;
  @Input() messages: any;
  @Input() user: any;
  @Input() bigScreen: any;
  @Input() visit: any;
  @Input() profile: any;
  @Input() language: any;
  @Output() messageEvent = new EventEmitter<Boolean>();
  @Output() visitEvent = new EventEmitter<String>();

  constructor(
    private apiUrl: ApiUrl,
    private allService: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialogRef: MatDialogRef<ChatComponent>,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private titleService: Title,
  ) {

    this.user = this.storage.get('user');
    if (!this.selected) {
      this.selected = data.selected;
    }
    if (!this.user) {
      this.user = data.user;
    }
    if (data) {
      this.visit = data.visit;
      this.profile = data.profile;
    }
    // 是否是pc浏览器访问
    this.isPc = this.storage.get('isPc');
    // 是否是微信app内打开项目
    this.isWeixin = this.storage.get('isWeixin');
    this.bigScreen = this.storage.get('bigScreen');
    if (!this.messages) {
      this.messages = []
    }
    this.isPaySuccess = false;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.addFiles = false;
    this.myPeerId = this.user._id;
    if (this.selected) {
      if (this.selected.role == 'patient') {
        this.patient = this.selected
        this.provider = this.user;
      } else if (this.selected.role == 'provider') {
        this.patient = this.user;
        this.provider = this.selected;
        this.titleService.setTitle(this.provider.name + '医师咨询室')
      }
      if (!this.visit) {
        this.consultForm = false;
        this.payment();
      } else {
        this.consultForm = false;
        if (this.user.role == 'provider') {
          this.isClosed = true;
        } else {
          this.isClosed = false;
        }
      }
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.senderID = this.storage.get('senderID');
    if (this.senderID) {
      this.selected = { _id: this.senderID };
    }
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.visitId = this.route.snapshot.paramMap.get('visitId');
    if (this.orderId && this.visitId) {
      if (!this.selected) {
        this.selected = this.storage.get('h5-selected');
      }
      if (!this.visit) {
        this.visit = this.storage.get('h5-visit');
      }
      if (!this.profile) {
        this.profile = this.storage.get('h5-profile');
      }
      this.createOrDeleteStorage(false);
      let data = {
        title: '提示', //标题  选填 默认值为提示
        content: '支付成功', //内容  必填 询问的内容
        button: '确定', //确定按钮文字  选填  默认值为确定
        cancel: '取消' //取消按钮文字  选填  默认值为取消
      }
      this.allService.alertDialogService.confirm(data).subscribe(res => {
        if (res) {// 确定调用方法
          let info = {
            "out_trade_no": this.orderId,
            "visitId": this.visitId
          }
          this.queryOrderStatus(info);
        } else {// 取消调用方法
          return;
        }
      });
    }
  }

  /**
   * 由于H5支付需要重定向到该页面,导致弹出chat组件参数不全
   * 因此需要放入到storage中,用完删掉即可
   * @param isCreate 新增/删除标识
   */
  createOrDeleteStorage(isCreate: boolean) {
    if (isCreate) {
      this.storage.set('h5-selected', this.selected);
      this.storage.set('h5-visit', this.visit);
      this.storage.set('h5-profile', this.profile);
    } else {
      this.storage.remove('h5-selected');
      this.storage.remove('h5-visit');
      this.storage.remove('h5-profile');
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  selectedIsAgree(completed: boolean) {
    this.isAgree = completed;
  }


  close() {
    var chatRoom = false
    this.messageEvent.emit(chatRoom);
    // this.dialogRef.close({visit:this.visit});
  }

  /**
   * 支付入口,根据浏览器类型判断用哪种支付方式
   */
  payment() {
    if (this.isWeixin) {
      // 微信JSAPI支付方式
      alert('微信JSAPI支付方式');
      this.paymentJsapi();
    } else {
      if (this.isPc) {
        // 微信Native支付
        this.paymentNative();
      } else {
        // 微信H5支付
        this.paymentH5();
      }
    }
  }

  /**
   * 微信NATIVE扫码支付
   */
  paymentNative() {
    console.log('开始顶用微信NATIVE支付');
    //debugger;
    console.log('this.visit', this.visit)
    //create visit
    if (!this.visit) {
      console.log('开始创建Visti');
      this.prePayToCreateVisit().then((data: any) => {
        this.visit = data;
        if (this.visit) {
          const desc = "cloud visit";
          // 开始调用native支付方法
          console.log('开始调用native支付方法');
          this.nativePay(desc);
        } else {
          this.allService.alertDialogService.error('支付失败，请重试');
        }
      });
    } else {//if prepay exists
      const desc = this.profile.label + '咨询';
      this.nativePay(desc);
    }
  }


  /**
   * 微信H5支付 MWEB: H5 支付
   */
  paymentH5() {
    console.log('开始顶用微信H5支付');
    //debugger;
    console.log('this.visit', this.visit)
    //create visit
    if (!this.visit) {
      console.log('开始创建Visti');
      this.prePayToCreateVisit().then((data: any) => {
        this.visit = data;
        if (this.visit) {
          const desc = "cloud visit";
          // 开始调用H5支付方法
          console.log('开始调用H5支付方法');
          this.h5Pay(desc);
        } else {
          this.allService.alertDialogService.error('支付失败，请重试');
        }
      });
    } else {//if prepay exists
      const desc = this.profile.label + '咨询';
      // 开始调用jsapi支付方法
      console.log('开始调用H5支付方法');
      this.h5Pay(desc);
    }
  }

  /**
   * 微信Jsapi支付
   */
  paymentJsapi() {
    console.log('开始顶用微信Jsapi支付');
    //debugger;
    console.log('this.visit', this.visit)
    //create visit
    if (!this.visit) {
      console.log('开始创建Visti');
      this.prePayToCreateVisit().then((data: any) => {
        this.visit = data;
        if (this.visit) {
          const desc = "cloud visit";
          // 开始调用jsapi支付方法
          console.log('开始调用jsapi支付方法');
          this.jsapiPay(desc);
        } else {
          this.allService.alertDialogService.error('支付失败，请重试');
        }
      });
    } else {//if prepay exists
      const desc = this.profile.label + '咨询';
      // 开始调用jsapi支付方法
      console.log('开始调用jsapi支付方法');
      this.jsapiPay(desc);
    }
  }


  /**
   * 预支付处理逻辑,创建Visit数据
   */
  prePayToCreateVisit() {
    console.log('预支付处理逻辑,创建Visit数据');
    var preVisit = {
      patientID: this.patient._id,
      providerID: this.provider._id,
      patient: this.patient,
      provider: this.provider,
      profiles: [this.profile],
      desc: { label: this.profile.label },
      visitDate: new Date(),
      type: 'consult',
      status: 'prePay'
    }
    return new Promise((resolve, reject) => {
      this.allService.visitsService.createVisit(preVisit).then((data: any) => {
        console.log('预支付处理逻辑,创建Visit数据返回data:' + data);
        resolve(data);
      })
    });
  }


  /**
   * 创建订单
   */
  createInvoice() {
    console.log('开始创建订单');
    var invoice = {
      "out_trade_no": this.receipt.out_trade_no,
      "patientId": this.patient._id,
      "patient": this.patient.name,
      "openId": this.patient.openID,
      "providerId": this.provider._id,
      "provider": this.provider.name,
      "popenId": this.provider.openID,
      "visitId": this.visit._id,
      "amount": 0.01,
      "desc": this.profile.label + '咨询',
      "productId": "",
      "trade_type": this.receipt.trade_type
    }
    return new Promise((resolve, reject) => {
      this.allService.paymentService.createInvoice(invoice).then((data: any) => {
        console.log('创建订单返回data:' + data);
        resolve(data);
      })
    });
  }


  /**
   * 统一微信JSAPI支付入口
   * @param desc 商品描述
   */
  jsapiPay(desc: any) {
    const self = this;
    var openID = this.user.openID;
    console.log('openID', openID);
    var filter = {
      "amount": 0.01,
      "desc": desc,
      "openId": openID,
      "trade_type": 'JSAPI'
    }
    console.log('filter============', filter)
    this.allService.paymentService.reservePayment(filter).then((data: any) => {
      this.receipt = data;
      alert('out_trade_no' + this.receipt.out_trade_no);
      console.log('this.receipt', this.receipt);
      if (this.receipt.data) {
        // 创建订单
        this.createInvoice().then((data: any) => {
          var response = this.receipt.data;
          this.allService.alertDialogService.alert('开始支付');
          wx.ready(function () {
            console.log('response', response);
            wx.chooseWXPay({
              // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
              // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              timestamp: response.timeStamp,
              // 支付签名随机串，不长于 32 位
              nonceStr: response.nonceStr,
              // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              package: response.package,
              // this.receipt.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              signType: response.signType,
              // 支付签名
              paySign: response.paySign,
              success: function (res: any) {
                //跳转到支付成功页面有这个页面
                self.allService.visitsService.update({ _id: self.visit._id, status: 'active' }).then((data: any) => {
                  self.allService.alertDialogService.alert('支付成功');
                  self.visit.status = 'active';
                  self.consultForm = false;
                  self.addVisit(self.visit);
                })
                console.log(res);
              },
              cancel: function (res: any) {//提示引用的是mint-UI里toast
                self.allService.visitsService.update({ _id: self.visit._id, status: 'canceled' }).then((data: any) => {
                  self.allService.alertDialogService.alert('已取消支付');
                  self.visit.status = 'canceled'
                })
              },
              fail: function (res: any) {
                self.allService.visitsService.update({ _id: self.visit._id, status: 'canceled' }).then(((data: any) => {
                  self.allService.alertDialogService.alert('支付失败，请重试');
                  self.visit.status = 'canceled'
                }))
              }
            });
          })
        })
      } else {
        this.allService.visitsService.update({ _id: this.visit._id, status: 'canceled' }).then((data: any) => {
          this.allService.alertDialogService.alert('支付失败，请重试');
          this.visit.status = 'canceled'
        })
      }
    })
  }

  /** 
   * 统一微信NATIVE支付入口
   * @param desc 商品描述
   */
  nativePay(desc: any) {
    var filter = {
      amount: 0.01,
      desc: desc,
      trade_type: 'NATIVE'
    }
    console.log('统一微信NATIVE支付入口----filter----', filter)
    this.allService.paymentService.unifiedOrderNative(filter).then((data: any) => {
      this.receipt = data;
      console.log('统一微信NATIVE支付入口----this.receipt----', this.receipt);
      if (this.receipt.data) {
        // 创建订单
        this.createInvoice().then((data: any) => {
          // 接收返回的二维码链接
          this.code_url = this.receipt.data.code_url;
          console.log('统一微信NATIVE支付入口二维码链接:' + this.code_url);

          // 生成二维码后定时主动查询订单状态
          let info = {
            "out_trade_no": this.receipt.out_trade_no,
            "visitId": this.visit._id
          }
          this.queryOrderStatus(info);
        });
      } else {
        this.allService.visitsService.update({ _id: this.visit._id, status: 'canceled' }).then((data: any) => {
          this.allService.alertDialogService.alert('支付失败，请重试');
          this.visit.status = 'canceled'
        })
      }
    })
  }


  /** 
   * 统一微信H5支付入口
   * @param desc 商品描述
   */
  h5Pay(desc: any) {
    //debugger;
    var filter = {
      amount: 0.01,
      desc: desc,
      trade_type: 'MWEB'
    }
    console.log('统一微信H5下单入口----filter----', filter)
    this.allService.paymentService.unifiedOrder(filter).then((data: any) => {
      this.receipt = data;
      console.log('统一微信H5下单入口----this.receipt----', this.receipt);
      if (this.receipt.data) {
        // 创建订单
        this.createInvoice().then((data: any) => {
          // 需要将弹出chat组件必备信息放入到storage中
          this.createOrDeleteStorage(true);
          // 接收返回的mweb_url
          console.log(this.receipt.data);
          this.mweb_url = this.receipt.data.mweb_url;
          console.log('统一微信H5下单入口----mweb_url----:' + this.mweb_url);
          let orderId = this.receipt.out_trade_no;
          let visitId = this.visit._id;
          let redirect_url = encodeURIComponent('https://www.digitalbaseas.com/provider-platform/patient/h5-pay-redirect/' + visitId + '/' + orderId);
          debugger
          window.location.href = this.mweb_url + "&redirect_url=" + redirect_url;
          // 生成二维码后定时主动查询订单状态
          // let info = {
          //   "out_trade_no": this.receipt.out_trade_no,
          //   "visitId": this.visit._id
          // }
          // this.queryOrderStatus(info, isChatRoom);
        });
      } else {
        this.allService.visitsService.update({ _id: this.visit._id, status: 'canceled' }).then((data: any) => {
          this.allService.alertDialogService.alert('支付失败，请重试');
          this.visit.status = 'canceled'
        })
      }
    })
  }

  /**
   * 主动查询微信支付订单状态
   * @param info { out_trade_no: "系统订单号" }
   */
  queryOrderStatus(info: any) {

    let visitId = '';
    if (this.visit && this.visit._id) {
      visitId = this.visit._id;
    }
    if (this.visitId) {
      visitId = this.visitId;
    }
    let that = this;
    // 定时任务开始查询微信支付订单状态
    console.log('定时任务开始查询微信支付订单状态');
    that.interval = setInterval(function () {
      that.allService.paymentService.orderQuery(info).then((data: any) => {
        console.log('定时任务开始查询微信支付订单状态----data----' + data);
        // 处理返回参数{ code: 500, message: '系统异常,查询订单失败!', data: { code: 1, status: '未支付' } }
        if (data.code == 200) {// 系统后台未报错,逻辑执行完毕
          if (data.data) {
            // 2为支付成功,6为订单关闭
            if (data.data.code == 6 || data.data.code == -1) {
              // 更新为canceled
              that.allService.visitsService.update({ _id: visitId, status: 'canceled' }).then((data: any) => {
                that.visit.status = 'canceled';
                that.allService.alertDialogService.alert('支付失败，请重试');
              })
              // 以上状态则说明执行完毕,无需再继续查询
              console.log('定时任务查询微信支付订单状态----关闭定时任务----');
              clearInterval(that.interval);
            } else if (data.data.code == 2) {
              //跳转到支付成功页面有这个页面
              // 更新为active
              that.allService.visitsService.update({ _id: visitId, status: 'active' }).then((data: any) => {
                that.visit.status = 'active';
                that.isPaySuccess = true;
                that.consultForm = false;
                that.addVisit(that.visit);
                // 以上状态则说明执行完毕,无需再继续查询
                console.log('定时任务查询微信支付订单状态----关闭定时任务----');
                clearInterval(that.interval);
                that.allService.alertDialogService.alert('支付成功');
              })
            } else if (data.data.code == 3) {
              //跳转到支付成功页面有这个页面
              // 更新为active
              that.allService.visitsService.update({ _id: visitId, status: 'refund' }).then((data: any) => {
                that.visit.status = 'refund';
                that.consultForm = false;
                that.addVisit(that.visit);
                // 以上状态则说明执行完毕,无需再继续查询
                console.log('定时任务查询微信支付订单状态----关闭定时任务----');
                clearInterval(that.interval);
                that.allService.alertDialogService.alert('该订单已经申请退款');
              })
            }
          }
        }
      })
    }, 1000);
  }

  addVisit(visit: any) {
    var component = {
      component: 'visit',
      visit: visit
    }
    this.message = '就诊总结'
    this.addComponent(component);
  }

  addComponent(component: any) {
    const newMessage = {
      id: this.myPeerId,
      message: component.message
    };
    let mail: any = {
      contentList: [component],
      userID: this.user._id,
      status: 'active'
    }
    if (this.user.role == 'patient') {
      var receiver = this.selected;
      mail.providerID = this.selected._id;
      this.allService.mailService.create(mail).then((data: any) => {
        this.temp = data;
        this.messages.push(this.temp);
        this.sendMail(receiver, this.message);
        this.message = '';
        if (this.addFiles == true) {
          this.addFiles = false;
        }
      })

    } else if (this.user.role == 'provider') {
      var receiver = this.selected;
      mail.patientID = this.patient._id;
      this.allService.mailService.create(mail).then((data: any) => {
        this.temp = data;
        this.messages.push(this.temp);
        this.sendMail(receiver, this.message);
        this.message = '';
        if (this.addFiles == true) {
          this.addFiles = false;
        }
        console.log('message added', data)
        console.log('this.messageList', this.messages)
      })
    }
  }


  sendMail(receiver: any, message: any) {
    //debugger;
    console.log(receiver);
    if (receiver && receiver.openID) {// 如果有openid,优先公众号推送
      var image = this.apiUrl.setFormUploadPhoto + String(this.user.photo) + '.png';
      if (this.user.role == 'provider') {
        var receiverRole = 'patient';
        var title = '数基邮箱:' + this.user.name + '医生有一条消息在您的数基健康卡邮箱';
      } else {
        receiverRole = 'provider';
        var title = '数基邮箱:' + this.user.name + '有一条消息在您的数基医生工作室邮箱';
      }
      var filter = {
        openID: receiver.openID,
        message: message,
        title: title,
        url: '/'
          + receiverRole
          + '/'
          + this.user._id,
        picUrl: image
      };
      console.log('mail filter', filter)
      this.allService.mailService.sendMessageLink(filter, 0).then((data: any) => {
        console.log('message sent', message);
      })
    } else if (receiver && receiver.phone) {// 如果没有openid,优先手机短信通知
      var filter1 = {
        mobile: receiver.phone,
        message: message
      }
      this.allService.shortMessageService.sendShortMessageNotification(filter1).then((data: any) => {
        if (data.code == 1) {// 返回code=1则说明发送成功
          console.log('message sent success:', data + message);
        } else {// 如果没有发送成功则返回提示信息即可
          console.log('message sent fail:', data + message);
        }
      });
    }
  }

  getActiveConsult() {
    var filter = {
      type: 'consult',
      patientID: this.user._id,
      providerID: this.selected._id,
      status: 'active'
    }
    this.allService.visitsService.getOneVisit(filter).then((data) => {
      this.visit = data;
      // 如果是患者端进入,获取消息内容,判断是否可以进行退款标识
      if (this.user.role == 'patient') {
        this.getMessages(this.selected);
      }
      if (this.senderID) {
        this.isPaySuccess = true;
      }
    })
  }


  getMessages(selected: any) {
    this.messages = [];
    let flag = false;
    let flag1 = false;
    this.allService.mailService.getMailByFilter(
      {
        '$or': [{ '$and': [{ 'userID': this.user._id }, { 'providerID': selected._id }] },
        { '$and': [{ 'userID': selected._id }, { 'patientID': this.user._id }] }
        ]
      }).then((data: any) => {
        this.messages = data;
        console.log('messages', this.messages);
        if (this.visit && this.visit.out_trade_no) {
          // 根据订单号获取支付成功的订单信息
          this.allService.invoiceService.getByOutTradeNo(this.visit.out_trade_no).then((data) => {
            this.temp = data;
            console.log('-----getMessages----根据订单号获取支付成功的订单信息 data', data);
            //debugger;
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
                      break;
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


  receiveMessage($event: any) {
    if ($event == false) {
      this.isPaySuccess = false;
    }
  }

  receiveVisit($event: any) {
    if ($event == 'new visit') {
      this.getActiveConsult();
    }
  }


}