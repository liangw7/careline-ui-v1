import {
  Component, OnInit, Inject
} from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from 'src/app/core/common-services';

//provider

@Component({
  selector: 'profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
  search: any;
  bigScreen: any;
  profiles: any;
  loading: any;
  constructor(
    private allService: AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.bigScreen = this.storage.get('bigScreen');
  }

  ngOnInit(): void {
    // this.bigScreen = this.storage.get('bigScreen');
    this.getProfiles();
  }

  getProfiles() {
    if (!this.profiles) {
      this.loading = true;
      this.allService.categoryService.getInternalByFilter({ field: 'profile', status: 'active' }).then((data: any) => {
        this.profiles = data;
        console.log('this.profiles', this.profiles)
        this.loading = false;
      })
    }
  }

  getUrl(image: any) {
    return this.allService.utilService.getHttpUrl(image);
  }
}
