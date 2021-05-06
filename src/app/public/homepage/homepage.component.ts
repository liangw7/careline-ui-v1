import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomePageComponent implements OnInit {
  bigScreen: any;
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.bigScreen = this.storage.get('bigScreen');
  }

  ngOnInit() {
  }

}
