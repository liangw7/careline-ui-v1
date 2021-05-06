import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
//import { LoginComponent } from '../login/login.component';

declare const $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: any[] = [];
  @Input() sidebarShow: any[] = [];
  patientList: any;
  patientLinkList: any;
  title: any;
  user: any;
  patient: any;
  color: any;
  bigScreen: any;
  focus: any;
  // 主账号加所有家庭成员信息汇总
  allFamilyMembers: any;
  // 是否拥有家庭成员
  hasFamilyMembers: any;
  // 家庭成员关系码
  relationships: any;
  // 当前选中的家庭成员
  nowFamilyMember: any;
  // 当前选中的家庭成员关系
  nowFamilyMemberrelationships: any;
  loading: any;
  @Input() language: any;
  constructor(
    private allService: AllServices,
    public router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialog: MatDialog,
   // private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bigScreen = this.storage.get('bigScreen');
    this.user = this.storage.get('user');
    this.getAllMembers();
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
  }

  ngOnInit() {
    this.getAllMembers();
    let item = this.storage.get('selectedMenu');
    console.log('++++', this.menuItems)
    if (item) {
      for (let i of this.menuItems) {
        if (i.path == item.path) {
          i.active = true;
        } else {
          i.active = false;
        }
      }
    }
    this.focus = 'patient';
    this.color = this.storage.get('color');
    // this.bigScreen = this.storage.get('bigScreen')
    this.language = this.storage.get('language')
    this.user = this.storage.get('user')


    console.log('menuItems', this.menuItems)

  }

  getImg(url: any) {
    return this.allService.utilService.getHttpUrl(url);
  }

  ngOnChanges() {
    this.user = this.storage.get('user');
    this.getAllMembers();
    this.allService.communicateService.ob.subscribe((info: any) => {
      if (info && info.path) {
        for (let i of this.menuItems) {
          if (i.path == info.path) {
            i.active = true;
          } else {
            i.active = false;
          }
        }
      }
    });
    this.allService.communicateService.obLoginMsg.subscribe((user: any) => {
      if (user) {
        this.user = this.storage.get('user')
      }
    });
  }

  //切换账号
  changeFamilyMember(u: any) {
    this.nowFamilyMember = u.name;
    this.nowFamilyMemberrelationships = this.getRelationshipName(u.relationship);
    if (this.user._id == u._id) {
      this.allService.alertDialogService.warn('您已经在当前账号下,无需切换');
      return;
    } else {
      if (u.father_id) {
        this.imitateLogin(u);
      } else {
        this.viewLogin();
      }
    }
  }

  getAllMembers() {
    this.user = this.storage.get('user');
    if (this.user && this.user.father_id) {
      this.allService.usersService.findUserById(this.user.father_id).then((data: any) => {
        if (data) {
          this.allFamilyMembers = data;
          let params = {
            father_id: this.user.father_id
          }
          this.allService.usersService.getUserByFatherId(params).then((data1: any) => {
            if (data1 && data1.code == 1) {
              if (Array.isArray(this.allFamilyMembers)) {
                this.allFamilyMembers.concat(data1.data);
              } else {
                let arrays: any[] = [];
                arrays.push(...data1.data);
                arrays.push(this.allFamilyMembers);
                this.allFamilyMembers = arrays;
              }
              if (Array.isArray(this.allFamilyMembers)) {
                this.hasFamilyMembers = true;
              }
              console.log('allFamilyMembers------', this.allFamilyMembers);
            } else {
              this.allService.alertDialogService.alert(data1.msg);
            }
          })
        } else {
          this.allService.alertDialogService.alert(data.msg);
        }
      })
    } else {
      this.allFamilyMembers = this.user;
      let params = {
        father_id: this.user._id
      }
      this.allService.usersService.getUserByFatherId(params).then((data1: any) => {
        if (data1 && data1.code == 1) {
          if (data1.data.length > 0) {
            if (Array.isArray(this.allFamilyMembers)) {
              this.allFamilyMembers.concat(data1.data);
            } else {
              let arrays: any[] = [];
              arrays.push(...data1.data);
              arrays.push(this.allFamilyMembers);
              this.allFamilyMembers = arrays;
            }
            if (Array.isArray(this.allFamilyMembers)) {
              this.hasFamilyMembers = true;
            }
          }
          console.log('allFamilyMembers------', this.allFamilyMembers);
        } else {
          this.allService.alertDialogService.alert(data1.msg);
        }
      })
    }
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
    return '主账号';
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };


  getLink(item: any) {
    for (let i of this.menuItems) {
      if (i.path == item.path) {
        i.active = true;
      } else {
        i.active = false;
      }
    }
    this.router.navigate([item.path]);
    this.storage.set('patient', item.param);
    this.storage.set('selectedMenu', item);
  }


  getPersonInfo() {
    //this.allService.communicateService.send('ddddddddd')
    // let menuItem = this.menuItems.filter(item => {
    //   return item.title == '个人信息'
    //   })
    let menuItem = [{ active: false, focus: 'profile', path: '/provider-platform/patient/profile', para: '', title: '个人信息', enTitle: 'profile', icon: 'fa fa-list', class: '', img: '../../../../../assets/images/core/yy.png' }];
    for (let i of this.menuItems) {
      i.active = false;
    }

    this.router.navigate([menuItem[0].path]);
    //this.storage.set('patient', menuItem[0].param);
    // this.storage.set('selectedMenu', menuItem[0]);
  }

  /**
   * 退出方法
   */
  logout() {
    this.allService.authService.logout('public');
    this.user = null;
  }

  /**
   * 弹窗形式展示添加家庭成员
   * @param category 
   */
  viewLogin() {
    // this.logout();
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      data: { view: true, edit: false },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '80%',
      width: '60%',
      autoFocus: true,
      disableClose: true
    }
 //   const dialogRef = this.dialog.open(LoginComponent,
  //    dialogConfig);
 //   dialogRef.afterClosed().subscribe(result => {
   //   this.getAllMembers();
   // });
  }

  /**
   * 模拟登陆
   * @param member 家庭成员信息
   */
  imitateLogin(member: any) {
    if (this.user._id == member._id) {
      this.allService.alertDialogService.warn('您已经切换到当前用户,无需重复操作!');
      return;
    }

    let username = member.email;
    let password = member.email.split('@')[0];
    let credentials = {
      email: username,
      password: password,
      role: 'patient'
    };
    this.allService.authService.login(credentials).then((res: any) => {
      // this.storage.set('bigScreen', this.bigScreen)
      console.log("Already authorized", res);
      this.user = this.storage.get('user');

      this.color = this.user.color;
      this.storage.set('color', this.color);

      this.storage.set('patient', this.user);
      this.patient = this.user;
      this.allService.usersService.findUserById(this.user.father_id).then((data: any) => {
        debugger;
        this.getAllMembers();
      })
    }, (err: any) => {
      console.log(err);
      console.log("Not already authorized");
      this.loading = false;
    });
  }
}
