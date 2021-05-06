import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from 'src/app/core/common-services/all-services';

@Component({
  selector: 'provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
  bigScreen: any;
  providers: any;
  search: any;
  loading: any;
  screenWidth: number;
  imgMarginleft: number;
  imgMarginleftPhone: number;
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private allService: AllServices,
  ) {
    this.bigScreen = this.storage.get('bigScreen');
    this.screenWidth = window.innerWidth;
    // 如果修改样式记得要修改这里,要不然图片不会居中的
    this.imgMarginleft = (this.screenWidth*0.9*0.84/4 - 114)/2;
    this.imgMarginleftPhone = (this.screenWidth - 114)/2;
    this.getProviders();
  }

  ngOnInit(): void {
  }

  getProviders() {
    if (!this.providers)
      this.providers = [];
    this.loading = true;
    this.allService.usersService.getWithDetailByFilter({ role: 'provider', status: '2' }).then((data: any) => {
      console.log('providers', data)
      this.providers = data;
      this.loading = false;
    })
  }

  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }

}
