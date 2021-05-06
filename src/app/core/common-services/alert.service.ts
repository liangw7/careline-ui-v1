import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private alertSource = new Subject<any>();
    private keepAfterNavigationChange = false;

    // constructor(private router: Router) {
    //     // clear alert message on route change
    //     this.router.events.subscribe(event => {
    //         if (event instanceof NavigationStart) {
    //             if (this.keepAfterNavigationChange) {
    //                 // only keep for a single location change
    //                 this.keepAfterNavigationChange = false;
    //             } else {
    //                 // clear alert
    //                 this.alertSource.next();
    //             }
    //         }
    //     });
    // }

    getMessages$ = this.alertSource.asObservable();

    success(message: string, keepAfterNavigationChange = false) {
        // this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.alertSource.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false) {
        // this.keepAfterNavigationChange = keepAfterNavigationChange;
        console.log('===================',message)
        this.alertSource.next({ type: 'error', text: message });
    }
    constructor() {}
    

}