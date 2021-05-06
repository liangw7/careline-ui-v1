import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedPageTypeService {

  // Observable string sources
  private dataSource = new Subject<string>();
  //private missionConfirmedSource = new Subject<string>();

  // Observable string streams
  //missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  //missionConfirmed$ = this.missionConfirmedSource.asObservable();
  dataSent$ = this.dataSource.asObservable();
  // Service message commands


  sendPageType(pageType: string) {
    this.dataSource.next(pageType);
  }

  // confirmMission(astronaut: string) {
  //   this.missionConfirmedSource.next(astronaut);
  // }
}