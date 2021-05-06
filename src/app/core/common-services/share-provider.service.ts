import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShareProviderService {

  // Observable string sources
  private dataSource = new Subject<boolean>();
  //private missionConfirmedSource = new Subject<string>();

  // Observable string streams
  //missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  //missionConfirmed$ = this.missionConfirmedSource.asObservable();
  dataSent$ = this.dataSource.asObservable();
  // Service message commands

  sendShareProvider(shareProvider: boolean) {
    this.dataSource.next(shareProvider);
  }


  // confirmMission(astronaut: string) {
  //   this.missionConfirmedSource.next(astronaut);
  // }
}