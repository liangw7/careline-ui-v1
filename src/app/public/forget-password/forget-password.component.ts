import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from 'src/app/core/common-services';
import { ShortMessageModel } from 'src/app/core/models/shortMessage';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  screenHeight: any;
  countDown = false; // 按钮是否可点击
  countDownTime = 300; //倒计时
  showButtonText = '发送短信验证码'; //按钮文字内容
  bigScreen: any;
  shortMessage: ShortMessageModel = new ShortMessageModel;
  confirmPassword: any;// 确认新密码
  password: any; // 新密码
  phoneIsInuser: boolean = false;
  userId: any; // 关联用户的id
  // 初始化登录角色 0:患者登录;1:医生登录;
  userType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private allService: AllServices,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.userType = params['userType'];
      console.log('this.userType', this.userType);
    });
    console.log(window.screen.height);
    this.screenHeight = window.screen.height + "px";
    console.log(this.screenHeight);
    this.bigScreen = this.storage.get('bigScreen');
  }

  /**
   * 发送验证码方法
   */
  sendMessage() {
    console.log(this.shortMessage);
    if (!this.shortMessage.mobile) {
      this.allService.alertDialogService.warn('请输入手机号');
      return;
    }
    if (!this.checkMobile(this.shortMessage.mobile)) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
    // 先校验该手机号是否与用户有关联,如果没有关联则没有必要发短信
    this.allService.usersService.getUserByPhone(this.shortMessage.mobile).then((res1: any) => {
      var mobileIsInUse: any = res1;
      console.log('mobileIsInUse', mobileIsInUse)
      if (mobileIsInUse && mobileIsInUse.code == 1) {// 如果手机号关联用户则继续执行下一步操作
        this.phoneIsInuser = true;
        this.userId = mobileIsInUse.res;
        this.allService.shortMessageService.sendShortMessageForReset(this.shortMessage).then((data: any) => {
          if (data.code == 1) {// 返回code=1则说明发送成功
            this.countDown = true;
            this.showButtonText = '验证码已发送(' + 300 + 's)';
            console.log(data);
            const start = setInterval(() => { //间歇调用计时器，间隔为1000ms
              if (this.countDownTime >= 0) {
                this.showButtonText = '验证码已发送(' + this.countDownTime-- + 's)';
              } else {
                clearInterval(start); // 清除计时器
                this.showButtonText = '重新发送';
                this.countDown = false;
                this.countDownTime = 300;
              }
            }, 1000);
          } else {// 如果没有发送成功则返回提示信息即可
            this.allService.alertDialogService.alert(data.msg);
            return;
          }
        });
      } else {// 如果手机号码没有关联用户,则不会发送短信,返回提示信息即可
        this.phoneIsInuser = false;
        this.allService.alertDialogService.alert(mobileIsInUse.msg);
        return;
      }
    });
  }

  /**
   * 手机框失去焦点后触发事件,校验手机号是否准确
   */
  checkPhone() {
    if (!this.checkMobile(this.shortMessage.mobile)) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
  }

  /**
   * 提交修改密码方法
   */
  confirm() {
    // 校验参数
    if (!this.shortMessage.mobile) {
      this.allService.alertDialogService.warn('请输入手机号');
      return;
    }
    if (!this.checkMobile(this.shortMessage.mobile)) {
      this.allService.alertDialogService.warn('手机号格式不正确');
      return;
    }
    if (!this.phoneIsInuser) {
      this.allService.alertDialogService.warn('您的手机号未关联用户,请确认手机号是否准确');
      return;
    }
    if (!this.shortMessage.num) {
      this.allService.alertDialogService.warn('请输入短信验证码');
      return;
    }
    if (!this.password) {
      this.allService.alertDialogService.warn('请输入新密码');
      return;
    }
    if (!this.confirmPassword) {
      this.allService.alertDialogService.warn('请输入确认新密码');
      return;
    }
    if (this.confirmPassword != this.password) {
      this.allService.alertDialogService.warn('两次密码输入不一致,请重新输入');
      this.password = "";
      this.confirmPassword = "";
      return;
    }
    let role = '';
    if (this.userType == 0) {
      role = 'patient'
    } else if (this.userType == 1) {
      role = 'provider'
    } else {
      this.allService.alertDialogService.warn("系统异常");
      return;
    }
    var userInfo = { id: this.userId, role: role, password: this.password };
    console.log('修改密码:' + userInfo);
    this.allService.usersService.updateUserPassword(userInfo).then((res: any) => {
      if (res.code == 1) {
        this.allService.alertDialogService.warn('修改成功!');
        // 跳转到登录页面
        this.router.navigate(['/public-platform/homepage/login'], {
          queryParams: {
            userType: this.userType
          }
        })
      } else {// 如果修改失败则返回提示信息
        this.allService.alertDialogService.warn(res.msg);
        return;
      }
    })
  }

  /**
   * 正则校验手机号
   * @param {手机号} mobile 
   */
  checkMobile(mobile: String) {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile + ""))) {
      console.log("手机号码不合法，请重新输入");
      return false;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    var user: any = this.storage.get('user');
    if (user) {
      this.router.navigate(['/public-platform/homepage/reset-password']);
    }
  }

}
