import {
  Component, OnInit, Inject, HostListener, OnDestroy
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//provider
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllServices } from 'src/app/core/common-services';

@Component({
  selector: 'publish-list',
  templateUrl: './publish-list.component.html',
  styleUrls: ['./publish-list.component.scss']
})

export class PublishListComponent implements OnInit, OnDestroy {
  publishList: any;
  marketPlace: any;
  marketPlaceID: any;
  temp: any;
  providerList: any;
  newPatient: any;
  service: any;
  profile: any;
  selectedIndex: any;
  registryList: any;
  user: any;
  photoList: any;
  loading: any;
  language: any;
  subscription: Subscription;
  bigScreen: any;
  scrollSize: any;


  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    this.language = this.storage.get('language');
    this.bigScreen = this.storage.get('bigScreen');
    this.subscription = allService.sharedDataService.dataSent$.subscribe(
      (      language: any) => {
        this.language = language;

      });
    this.marketPlaceID = this.route.snapshot.paramMap.get('marketPlaceID');
  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?:any) {

  //   var screenWidth = window.innerWidth;
  //   if (this.bigScreen == 1)
  //     this.scrollSize = window.innerHeight * 0.85;
  //   else if (this.bigScreen == 1)
  //     this.scrollSize = window.innerHeight * 0.88;
  //   if (screenWidth <= 992)
  //     this.bigScreen = 0;
  //   else
  //     this.bigScreen = 1;
  // }

  ngOnInit() {
    // this.getScreenSize();
    this.loading = true;
    this.allService.categoryService.getInternalByFilter({
      formType: { '$in': ['publish'] },
      status: { '$in': ['active'] }
    }).then((data:any) => {
      this.temp = data;
      console.log('publish list===========', this.temp)
      this.publishList = this.temp;
      this.loading = false;
      var title = this.titleService.getTitle;
      this.titleService.setTitle('数基健康, 慢病管理项目');
    })

  }

  getUrl(form:any) {
    if(form.image){
      return this.allService.utilService.getImageUrl(String(form.image));
    }else{
      return '';
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
