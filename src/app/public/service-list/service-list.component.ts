import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from 'src/app/core/common-services';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  bigScreen: any;
  services: any;
  search: any;
  loading: any;
  providers: number = 0;
  profiles: number = 0;
  createdate: any;
  screenWidth: any;
  role:any;


  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private allService: AllServices,
  ) {
    
    this.bigScreen = this.storage.get('bigScreen');
    this.screenWidth = window.innerWidth;
    this.getServices();
    this.role='provider'
  }

  ngOnInit(): void {
  }

  getServices() {
    if (!this.services) {
      this.loading = true;
      this.allService.usersService.getWithDetailByFilter({ role: 'service' }).then((data: any) => {
        console.log(data);
        this.services = data;
        this.loading = false;
      })
    }
  }

  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }

}
