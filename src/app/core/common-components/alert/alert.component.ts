import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {
    @Input() config: any;
    bigScreen: any;

    constructor(
      private dialogRef: MatDialogRef<AlertComponent>,
      @Inject(SESSION_STORAGE) private storage: StorageService,
      @Inject(MAT_DIALOG_DATA) private data: any) {
        this.config = data;

        this.bigScreen = this.storage.get('bigScreen');
    }
    ngOnInit() { }
    checkFn(status:any) {
      this.dialogRef.close(status)
    }
}
