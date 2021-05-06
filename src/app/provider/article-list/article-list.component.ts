import { Component, OnInit, Inject } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { AllServices, WechatJssdkConfig } from '../../core/common-services';
import { CategoryImageComponent } from '../../core/common-components/category-image/category-image.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
var URL: string = environment.apiUrl + 'upload/';

@Component({
  selector: 'article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  categories: any;
  temp: any;
  field: any;
  //diagnosisList: any;
  // oriDiagnosis: any;
  //diagnosisLevelTwoList: any;
  // diagnosisLevelThreeList: any;
  // diagnosisLevelFourList: any;
  // selectedLevelOne: any;
  // selectedLevelTwo: any;
  // selectedLevelThree: any;
  // showCh: any;
  diagnosis: any;
  color: any;
  search: any;
  loading: any;
  showAll: any;
  user: any;
  articles: any;

  constructor(
    private wechatJssdkConfig: WechatJssdkConfig,
    public allServices: AllServices,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public router: Router) {
    this.user = this.storage.get('user')
  }


  ngOnInit() {
    this.color = 'blue'
    this.articles = [];
    this.loading = true;
    this.allServices.categoryService.getCategoriesByFilter({ 'field': 'form', 'createdBy._id': this.user._id }).then((data) => {
      this.articles = data;
      console.log('articles', this.articles)
      this.loading = false;
    })
  }


  addImage(ob: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { 'image': ob.image };
    const dialogRef = this.dialog.open(CategoryImageComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        ob.image = result.image
      this.allServices.categoryService.update(ob);
    })
  }


  getImage(ob: any) {
    return this.allServices.utilService.getImageUrl(String(ob.image));
    // console.log ('image', URL+'photo-'+String(ob.image)+'.png')
  }


  add() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '70vw',
      maxHeight: '80vh',
      height: '80%',
      width: '70%',
      autoFocus: true,
      disableClose: true
    }
    const dialogRef = this.dialog.open(ArticleComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.labs.push(lab);
        console.log('result', result);
        this.allServices.categoryService.create(result).then(res => {
          this.temp = res;
          this.articles.push(this.temp);
          console.log('created category', res);
        }, err => {
          console.log(err);
        });
      }
    });
  }


  edit(category: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      data: { _id: category._id, category: category, edit: true, view: false },
      maxWidth: '70vw',
      maxHeight: '80vh',
      height: '80%',
      width: '70%',
      autoFocus: true,
      disableClose: true
    }
    const dialogRef = this.dialog.open(ArticleComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.labs.push(lab);
        // console.log ('value', result );
        this.temp = result;
        this.allServices.categoryService.update(this.temp).then(res => {
          console.log('this.article', this.temp)
          for (let item of this.articles) {
            if (item._id === this.temp._id) {
              item.label = this.temp.label;
              item.internalName = this.temp.internalName;
              item.formType = this.temp.formType;
              item.status = this.temp.status;
            }
          }
        })
      }
    });
  }


  view(category: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      data: { _id: category._id, category: category, view: true, edit: false },
      maxWidth: '70vw',
      maxHeight: '80vh',
      height: '80%',
      width: '70%',
      autoFocus: true,
      disableClose: true
    }
    const dialogRef = this.dialog.open(ArticleComponent,
      dialogConfig);
    // console.log ('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.labs.push(lab);
        // console.log ('value', result );
        this.temp = result;
        this.allServices.categoryService.update({ _id: this.temp, status: this.temp.status }).then((data) => {
          for (let item of this.articles) {
            if (item._id === this.temp._id) {
              item.label = this.temp.label;
              item.internalName = this.temp.internalName;
              item.formType = this.temp.formType;
              item.status = this.temp.status;
            }
          }
          //send message to all patient 
          //find all patient wth the same profle
          this.router.navigate(['/homepage/provider-card', this.user._id, this.temp._id]);
        });
      }
    })
  }


  copy(category: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { _id: category._id, copy: true };
    const dialogRef = this.dialog.open(ArticleComponent,
      dialogConfig);
    console.log('category1', category)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.temp = {
          name: result.name,
          label: result.label,
          internalName: result.internalName,
          type: result.type,
          field: result.field,
          formType: result.formType,
          activityForm: result.activityForm,
          singleSelection: result.singleSelection,
          min: result.min,
          max: result.max,
          imageType: result.imageType,
          activityType: result.activityType,
          profileType: result.profileType,
          orderType: result.orderType,
          context: result.context,
          uom: result.uom,
          orderMaster: result.orderMaster,
          isOrderMaster: result.isOrderMaster,
          addMoreThanOnce: result.addMoreThanOnce,
          allowDuplicate: result.allowDuplicate,
          options: [],
          synonyms: result.synonyms,
          packageVolume: result.packageVolume,
          packageType: result.packageType,
          medForm: result.medForm,
          dose: result.dose,
          education: result.education,
          resource: result.resource,
          route: result.route,
          problemType: result.problemType,
          obs: result.obs,
          medicationID: result.medicationID,
          problemID: result.problemID,
          medicationSet: result.medicationSet
        };
        this.temp.options = result.options;
        this.allServices.categoryService.create(this.temp).then(res => {
          this.temp = res;
          this.categories.push(this.temp)
          console.log('copy created', this.temp)
        }, err => {
          console.log(err);
        });
      }
    });
  }


  delete(category: any) {
    this.allServices.categoryService.delete(category._id).then((data) => {
      var index = this.categories.indexOf(category);
      this.categories.splice(index, 1);
    })
  }


  sendMail(receiver: any, category: any) {
    var image = URL + 'photo-' + String(category.image) + '.png';
    var title = '数基邮箱| ' + category.label.ch;
    var url = 'https://www.digitalbaseas.com/public-platform/homepage/provider-card/' + this.user._id + '/' + category._id;
    var message = '';
    var filter = {
      appID: this.wechatJssdkConfig.appID0,
      appSecret: this.wechatJssdkConfig.appSecrete0,
      openID: receiver.openID,
      message: message,
      title: title,
      url: url,
      picUrl: image
    };

    console.log('mail filter', filter)
    this.allServices.mailService.sendMessageLink(filter, 1).then((data) => {
      console.log('message sent');
    })
  }
}
