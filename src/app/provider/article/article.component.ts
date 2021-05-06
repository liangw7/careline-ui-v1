import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../core/common-services';
import { CategoryImageComponent } from '../../core/common-components/category-image/category-image.component';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';
@Component({
  selector: 'article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})

export class ArticleComponent implements OnInit {


  article: any;
  obSetTitle: any;
  formTitle: any;
  obTitle: any;
  ob: any;
  content: any;
  index: any;
  image: any;
  obs: any;
  obSet: any;
  form: any;
  user: any;
  temp: any;
  edit: any;
  view: any;
  loading: any;
  forms: any;
  language: any;
  origiArticle: any;
  bigScreen: any;
  tempObs: any;

  constructor(
    public allServices: AllServices,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ArticleComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bigScreen = this.storage.get('bigScreen')
    this.language = this.storage.get('language')

    if (data && data.category) {
      this.origiArticle = data.category;
      console.log('this.origiArticle', this.origiArticle)
      this.edit = data.edit;
      this.view = data.view;
      this.article = data.category;
      this.formTitle = this.article.label.ch;
      this.obs = this.article.obSets[0].obs;
      var obIDs = [];
      for (let ob of this.article.obSets[0].obs) {
        obIDs.push(ob._id)
      }
      this.allServices.categoryService.getCategoriesByFilter({ '_id': { '$in': obIDs } }).then((data) => {
        this.temp = data;
        for (let item of this.temp) {
          for (let ob of this.article.obSets[0].obs) {
            if (item._id == ob._id) {
              ob.education = item.education;
              ob.image = item.image;
              // if (!ob.index)
              //   ob.index=this.article.obSets[0].obs.indexOf(ob);
            }
          }
        }
        this.obs = [];
        this.obs = this.article.obSets[0].obs;
      })
      /* this.forms=[];
       this.categoryService.getFormById({formIDs:[data._id]}).then((result)=>{
            this.forms=result;
            console.log ('this.temp', this.forms)
            if (this.forms.length==0){
              this.obs=[];
              this.article=this.origiArticle;
              this.formTitle=this.origiArticle.label.ch;

            }
            else{
              this.article=this.forms[0];
              this.obs=[];
              if (this.article){
               this.obs=this.article.obSets[0].obs
               this.formTitle=this.article.label.ch
            }
            }
       })*/
    } else {
      this.obs = [];
      this.edit = true;
    }
    this.user = this.storage.get('user')
  }


  ngOnInit() {
    //this.edit=true;
  }

  addOb() {
    if (!this.obs)
      this.obs = [];
    var ob = {
      label: { ch: '', en: '' },
      internalName: '',
      type: 'instruction',
      field: 'ob',
      education: { ch: '', en: '' },
      image: this.image,
      index: this.obs.length
    };
    if (!this.article) {
      this.obs.push(ob);
    } else {
      this.loading = true;
      this.allServices.categoryService.create(ob).then((data) => {
        this.loading = false;
        this.ob = data;
        console.log('create ob', data);
        this.obs.push({
          label: this.ob.label,
          internalName: this.ob.internalName,
          type: this.ob.type,
          field: this.ob.field,
          education: this.ob.education,
          image: this.ob.image,
          index: this.obs.length,
          _id: this.ob._id
        });
      })
    }
  }


  updateOb() {
    return new Promise((resolve, reject) => {
      this.tempObs = [];
      var index = 0;
      for (let ob of this.obs) {
        ob.internalName = ob.label.ch;
        if (ob._id) {
          //alert('index'+index)
          this.loading = true;
          this.allServices.categoryService.update(ob).then((data) => {
            this.temp = data;
            index++;
            console.log('updated ob', data);
            this.tempObs.push({
              label: this.temp.label,
              internalName: this.temp.internalName,
              type: this.temp.type,
              field: this.temp.field,
              education: this.temp.education,
              image: this.temp.image,
              index: ob.index,
              _id: this.temp._id
            })
            if (index == this.obs.length) {
              this.loading = false;
              resolve(this.tempObs);
              reject(new Error('error')); // ignored
            }
          })
        }
      }
    })
  }


  delete(ob: any) {
    var index = this.obs.indexOf(ob);
    if (ob._id) {
      this.allServices.categoryService.delete(ob._id).then((data) => {
        this.obs.splice(index, 1)
      })
    } else {
      this.obs.splice(index, 1)
    }
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
    })

  }


  getImage(ob: any) {
    return this.allServices.utilService.getImageUrl(String(ob.image));
    // console.log ('image', URL+'photo-'+String(ob.image)+'.png')
  }


  find(item: any, list: any) {
    for (let i of list) {
      if (i._id == item._id) {
        return true;
      }
    }
    return false;
  }


  close() {
    this.dialogRef.close();
  }


  save() {
    if (!this.formTitle || this.formTitle == '') {
      this.allServices.alertDialogService.alert('please enter article title');
      return
    }
    this.loading = true;
    if (this.obs && this.obs.length > 0) {
      for (let ob of this.obs) {
        if (ob.label.ch == '' || !ob.label.ch) {
          this.allServices.alertDialogService.alert('please enter title name');
          return;
        }
      }
    }
    if (!this.article) {
      this.allServices.categoryService.createMany(this.obs).then((data) => {
        this.temp = data;
        var obs = [];
        for (let ob of this.temp) {
          obs.push({ _id: ob._id, image: ob.image, education: ob.education, index: ob.index, internalName: ob.label.ch, label: ob.label })
        }
        var obSet = { field: 'obSet', obs: obs, label: { ch: this.formTitle, en: '' }, internalName: this.formTitle }
        this.allServices.categoryService.create(obSet).then((result) => {
          this.obSet = result;
          console.log('obSet', this.obSet)
          this.loading = false;
          var form = {
            field: 'form',
            obSets: [this.obSet],
            label: { ch: this.formTitle, en: '' },
            internalName: this.formTitle,
            formType: 'publish',
            desc: { patient: this.obs[0].education.ch },
            createdBy: { _id: this.user._id, title: this.user.specialty, name: this.user.name, photo: this.user.photo }
          };
          this.dialogRef.close(form);
        })
      });
    } else {
      this.tempObs = []
      if (this.obs.length > 0) {
        this.updateOb().then((data) => {
          console.log('outcome obs=============', data)
          this.temp = data;
          this.article.label = { ch: this.formTitle, en: '' };
          this.article.createdBy = { _id: this.user._id, title: this.user.specialty, name: this.user.name, photo: this.user.photo };
          this.article.obSets[0].label.ch = this.formTitle;
          this.article.desc = { patient: this.obs[0].education.ch };

          for (let ob of this.temp) {
            this.tempObs.push({ _id: ob._id, image: ob.image, education: ob.education, index: ob.index, internalName: ob.label.ch, label: ob.label })
          }
          this.article.obSets[0].obs = this.tempObs;
          this.loading = true;
          this.allServices.categoryService.update(this.article.obSets[0]).then((data) => {
            this.loading = false;
            console.log('obSet', data)
            this.dialogRef.close(this.article);
          })
        })
      } else {
        this.article.label = { ch: this.formTitle, en: '' };
        this.article.createdBy = { _id: this.user._id, title: this.user.specialty, name: this.user.name, photo: this.user.photo };
        this.article.obSets[0].label.ch = this.formTitle;
        this.article.obSets[0].obs = [];
        this.article.desc = { patient: '' },
          this.loading = true;
        this.allServices.categoryService.update(this.article.obSets[0]).then((data) => {
          this.loading = false;
          console.log('obSet', data)
          this.dialogRef.close(this.article);
        })
      }
    }
  }


  publish() {
    this.origiArticle.status = 'active'
    this.dialogRef.close(this.origiArticle);
  }


  withdraw() {
    this.allServices.categoryService.update({ _id: this.origiArticle._id, status: 'inactive' }).then((data) => {
      this.close();
    })
  }
}



