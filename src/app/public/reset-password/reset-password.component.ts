import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from 'src/app/core/common-services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  screenHeight: any;
  bigScreen: any;
  confirmPassword: any;// 确认新密码
  password: any; // 新密码
  originalPassword: any; // 原密码
  userId: any; // 关联用户的id

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private allService: AllServices,
    public router: Router,) {
    console.log(window.screen.height);
    this.screenHeight = window.screen.height + "px";
    console.log(this.screenHeight);
    this.bigScreen = this.storage.get('bigScreen');
  }

  /**
   * 提交修改密码方法
   */
  confirm() {
    // 校验参数
    if (!this.originalPassword) {
      this.allService.alertDialogService.warn('请输入原密码');
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
    if (this.confirmPassword == this.originalPassword) {
      this.allService.alertDialogService.warn('新密码不能与原密码一致,请重启输入新密码');
      this.password = "";
      this.confirmPassword = "";
      return;
    }
    var user: any = { id: this.userId, password: this.originalPassword }
    this.allService.usersService.checkUserPassword(user).then((checkRes: any) => {
      debugger;
      console.log('checkUserPassword返回:' + checkRes);
      if (checkRes.code == 1) {
        var userInfo = { id: this.userId, password: this.password }
        this.allService.usersService.updateUserPasswordAuth(userInfo).then((res: any) => {
          if (res.code == 1) {
            this.allService.alertDialogService.success('修改成功!');
            // 跳转到登录页面
            // 在已经登录情况下,根据用户角色重定向到登录页面
            this.allService.authService.redirectLogin();
          } else {// 如果修改失败则返回提示信息
            this.allService.alertDialogService.error(res.msg);
            return;
          }
        });
      } else {
        this.allService.alertDialogService.warn('原密码错误,请重新输入原密码!');
        this.originalPassword = "";
      }
    });
  }

  ngOnInit(): void {
    var user: any = this.storage.get('user');
    if (!user) {
      this.allService.alertDialogService.alert('请重新登录系统再修改密码!');
      // 在已经登录情况下,根据用户角色重定向到登录页面
      this.allService.authService.redirectLogin();
    } else {
      this.userId = user._id;
    }
  }



}
