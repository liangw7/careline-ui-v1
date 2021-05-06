import { Component, OnInit, Inject, Input, Output,EventEmitter,HostListener } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { AllServices } from 'src/app/core/common-services';
import wx from 'weixin-jsapi';
@Component({
  selector: 'schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})

export class ScheduleDetailComponent implements OnInit{
  scheduleForm:any;
  language:any;
  accessToken:any;
  provider:any;
  patient:any;
  schedule:any;
  imageList:any;
  labList:any;
  color:any;
  profiles:any;
  forms:any;
  selectedProfile:any;
  temp:any;
  loading:any;
  receipt:any;
  showConfirm:any;
  signature:any;
  bigScreen: any;
  
  constructor(
    public dialogRef: MatDialogRef<ScheduleDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public allServices:AllServices
   ) {
     this.bigScreen = this.storage.get('bigScreen');
     this.scheduleForm=data.scheduleForm;
     this.language=data.language;
     this.provider=data.provider;
     this.patient=data.patient;
     this.schedule=data.schedule;
    this.color=this.storage.get('color')
    }
  
  ngOnInit() {

    this.getProfiles();
    this.getConfig();
    this.forms=[];
    if (this.profiles.length==1){
      console.log ('this.profiles',this.profiles)
      this.getForm(this.profiles[0]);
    }
}
close(){
  this.dialogRef.close();
 }

 getProfiles(){
   this.profiles=[];
  for (let providerProfile of this.schedule.provider.profiles){
    for (let patientProfile of this.patient.profiles){
      if (providerProfile._id==patientProfile._id){
        this.profiles.push(patientProfile);
        
      
      }
    }
  }
 }

 getForm(profile:any){

   this.selectedProfile=profile;
   this.loading=true;
   var storageForms=this.storage.get('forms');
   if (!storageForms){
    this.allServices.categoryService.getForm({profileIDs:[profile._id], 
      formTypes:['schedule'], 
      visitID:this.schedule._id,
      patientID:this.patient._id}).then((data)=>{
        this.loading=false;
        this.forms=data;
      })
   }
   else{
    this.allServices.categoryService.getCategory(profile._id).then((data)=>{
      this.temp=data;
      if (this.temp){
         for (let formItem of this.temp.forms){
           if (storageForms[0]._id==formItem._id){
             this.forms=storageForms;
           }
         }
         if (this.forms.length==0){
          this.allServices.categoryService.getForm({profileIDs:[profile._id], 
            formTypes:['schedule'], 
            visitID:this.schedule._id,
            patientID:this.patient._id}).then((data)=>{
              this.loading=false;
              this.forms=data;
            })
         }
      }
    })
   }
   

 }


 delete(){
  console.log ('this.scheduleForm',this.scheduleForm)
 this.dialogRef.close({delete:true});

}

 getImages(){
   this.imageList=[];
   this.allServices.imagesService.getByFilter({visitID:this.schedule._id}).then((data)=>{
   this.imageList=data;
   })
 }

 getLabs(){
  this.labList=[];
  this.allServices.labsService.getByFilter({visitID:this.schedule._id}).then((data)=>{
  this.labList=data;
  })
 }
 deleteImage(image:any){
  this.allServices.imagesService.delete(image._id);
 }
 deleteLab(lab:any){
  this.allServices.labsService.delete(lab._id);
 }

 getConfig(){
   
  var link= location.href.split('#')[0]; 
  this.allServices.usersService.getWeChatSignature(link).then((data) => {
    this.signature=data;
   console.log ('this.signature',this.signature)
   var config = {
     //below are mandatory options to finish the wechat signature verification
     //the 4 options below should be received like api '/get-signature' above
     'appId': this.signature.appId,
     'nonceStr':this.signature.nonceStr,
     'signature': this.signature.signature,//this.getSignature(ticket,nonceStr,timestamp,link),
     'timestamp': this.signature.timestamp,
     'url':this.signature.url,
     //below are optional
     //enable debug mode, same as debug
     'debug': false,
     'jsApiList': ['chooseWXPay'], //optional, pass all the jsapi you want, the default will be ['onMenuShareTimeline', 'onMenuShareAppMessage']
     'customUrl': '' //set custom weixin js script url, usually you don't need to add this js manually
   }
   wx.config(config);
   wx.ready(function(){
   wx.checkJsApi({
        jsApiList: ['chooseWXPay'],
        success:function(res:any){
            console.log("seccess")
            console.log(res)
        }
      
     
    })
})

}).catch((error) =>{
  this.allServices.alertDialogService.alert( '获取config失败，请重试')

  })

 }

 refund(){
   
 }

 payment(){
    var that:any=this;
    var openID=this.patient.openID;
// var    openID= this.storage.get('openID')
console.log ('openID',openID)
    var filter={
      "patientId": this.patient._id,
      "patient": this.patient.name,
      "openId" :  openID,//"oN_YY0y3EEXFItLEZ4_ai59104wY",//openID,
      "providerId": this.schedule.providerID,
      "provider": this.schedule.provider.name,
      "popenId" : this.schedule.provider.openID,
      "visitId": this.schedule._id,
      "amount": 1,
      "desc": "cloud visit",
      }
      console.log ('filter============', filter)
    this.allServices.paymentService.reservePayment(filter).then((data)=>{
      this.receipt=data;
      console.log ('this.receipt', this.receipt);


      if (this.receipt.data){
        console.log ('this.receipt.data', this.receipt.data);
        var response=this.receipt.data;
        this.allServices.alertDialogService.alert('开始支付');
        wx.ready(function(){
          console.log ('response', response);
        wx.chooseWXPay({
          // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
          // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
       
         timestamp:response.timeStamp,
         // 支付签名随机串，不长于 32 位
         nonceStr: response.nonceStr, 
         package: response.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
         signType: response.signType,//this.receipt.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
         paySign:response.paySign, // 支付签名
         success: function (res:any) {
          //跳转到支付成功页面有这个页面
          that.allServices.alertDialogService.alert(JSON.stringify(res));
          that.allServices.alertDialogService.success('支付成功');
          that.submit();
          console.log(res);
      },
      cancel: function (res:any) {//提示引用的是mint-UI里toast
        that.allServices.alertDialogService.alert('已取消支付');
          that.close();
      },


      fail: function (res:any) {
        that.allServices.alertDialogService.alert('支付失败，请重试');

      }
   
      });
      })

  }
})
 }
 submit(){
  
    this.dialogRef.close({forms:this.forms, profile:this.selectedProfile});
   
   }
}
 
 
