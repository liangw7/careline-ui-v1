import { Injectable } from '@angular/core';
import { ApiUrl } from '../models/api-url';
import { HttpService } from './http.service';
// import wx from 'wechat-jssdk/dist/client.umd';
const WechatJSSDK = require('wechat-jssdk');
@Injectable()
export class PaymentService {
  temp: any;
  constructor(
    public entity: ApiUrl,
    public httpservice: HttpService) {

  }

  downloadBill(filter: any) {
    console.log('--paymentService--downloadBill--start--');
    return this.httpservice.postAuthParam(this.entity.downloadBill, filter);
  }

  reservePayment(filter: any) {
    console.log('--paymentService--reservePayment--start--');
    return this.httpservice.postAuthParam(this.entity.getPayParams, filter);
  }

  /**
   * 扫码支付接口
   * @param filter {desc:'商品简单描述',amount:'订单金额',product_id:'商品ID'}
   * @returns 
   */
  unifiedOrderNative(filter: any) {
    console.log('--paymentService--reservePayment--start--');
    return this.httpservice.postAuthParam(this.entity.unifiedOrderNative, filter);
  }

  /**
   * 微信统一下单接口
   * @param filter {desc:'商品简单描述',amount:'订单金额',product_id:'商品ID', trade_type: 'MWEB'}
   * @returns 
   */
   unifiedOrder(filter: any) {
    console.log('--paymentService--reservePayment--start--');
    return this.httpservice.postAuthParam(this.entity.unifiedOrder, filter);
  }

  /**
   * 微信支付主动查询接口
   * transaction_id, out_trade_no 二选一
   * transaction_id: '微信的订单号',
   * @param filter {transaction_id: '微信的订单号'}或者{out_trade_no: '系统订单号'}
   * @returns 
   */
  orderQuery(filter: any) {
    console.log('--paymentService--orderQuery--start--');
    return this.httpservice.postAuthParam(this.entity.orderQuery, filter);
  }

  /**
   * 微信支付主动查询退款订单状态接口
   * transaction_id: '微信的订单号',
   * out_trade_no: '商户内部订单号',
   * out_refund_no: '商户内部退款单号',
   * @param filter  {transaction_id: '微信的订单号'}或者
   *                {out_trade_no: '系统订单号'}或者
   *                {out_refund_no: '商户内部退款单号'}
   * @returns 
   */
  orderRefundQuery(filter: any){
    console.log('--paymentService--orderQuery--start--');
    return this.httpservice.postAuthParam(this.entity.orderRefundQuery, filter);
  }

  transfer(filter: any) {
    console.log('--paymentService--transfer--start--');
    return this.httpservice.postAuthParam(this.entity.transfers, filter);
  }

  refund(filter: any) {
    console.log('--paymentService--refund--start--');
    return this.httpservice.postAuthParam(this.entity.refund, filter);
  }

  createInvoice(filter: any) {
    console.log('--paymentService--createInvoice--start--');
    return this.httpservice.postAuthParam(this.entity.createInvoice, filter);
  }

  updateInvoice(filter: any){
    console.log('--paymentService--updateInvoice--start--');
    return this.httpservice.postAuthParam(this.entity.updateInvoice, filter);
  }

  /**
   * 待处理...
   * @param link 
   */
  getSignature(link: any) {
    var filter = { "url": link }
    var AppId = ''
    var Timestamp = ''
    var Signature = ''
    var Noncestr = ''
    var data = this.httpservice.postAuthParam(this.entity.signature, filter);

    this.temp = data;
    AppId = this.temp.appId
    Timestamp = this.temp.timestamp
    Signature = this.temp.signatu
    Noncestr = this.temp.nonceStr
    var config = ({
      beta: true,
      debug: false,
      appId: AppId,
      timestamp: Timestamp,
      nonceStr: Noncestr,
      signature: Signature,
      // 这里是把所有的方法都写出来了 如果只需要一个方法可以只写一个
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
        'openWXDeviceLib',
        'closeWXDeviceLib',
        'configWXDeviceWiFi',
        'getWXDeviceInfos',
        'sendDataToWXDevice',
        'startScanWXDevice',
        'stopScanWXDevice',
        'connectWXDevice',
        'disconnectWXDevice',
        'getWXDeviceTicket',
        'WeixinJSBridgeReady',
        'onWXDeviceBindStateChange',
        'onWXDeviceStateChange',
        'onScanWXDeviceResult',
        'onReceiveDataFromWXDevice',
        'onWXDeviceBluetoothStateChange'
      ]
    })
    return new WechatJSSDK(config);
  }
}

