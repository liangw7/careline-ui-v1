import { Component, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../common-components/alert/alert.component';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class alertDialogService {
    [x: string]: any;

    constructor( @Inject(MatDialog) public _alertDialog: MatDialog, @Inject(DOCUMENT) doc: any) {
        // 打开dialog，body添加no-scroll样式
        _alertDialog.afterOpened.subscribe((ref: MatDialogRef<any>) => {
            if (!doc.body.classList.contains('no-scroll')) {
                doc.body.classList.add('no-scroll');
            }
        });
        // 关闭dialog，body移除no-scroll样式
        _alertDialog.afterAllClosed.subscribe(() => {
            doc.body.classList.remove('no-scroll');
        });
    }

    confirm(contentOrConfig: any, title?: string): Observable<any> {
        // 设置dialog的属性，宽度，高度，内容等。
        let config = new MatDialogConfig();
        config = {
            width: '460px',
            height: '260px',
            autoFocus: false
        };
        if (contentOrConfig instanceof Object) {
            config.data = contentOrConfig;
        } else if ((typeof contentOrConfig) === 'string') {
            config.data = {
                content: contentOrConfig,
                title: title
            }
        }
        return this._alertDialog.open(AlertComponent, config).afterClosed();
    }

    alert(contentOrConfig: any, title?: string) {
        // 设置dialog的属性，宽度，高度，内容等。
        let config = new MatDialogConfig();
        config = {
            maxWidth: '100%',
            minHeight: '56px',
            position: {top:'2px'},
            backdropClass:'popping',
            hasBackdrop: false,
            panelClass: 'alertbg'
        };

        if (contentOrConfig instanceof Object) {
            config.data = contentOrConfig;
        } else if ((typeof contentOrConfig) === 'string') {
            config.data = {
                message: contentOrConfig,
                title: title
            }
        }
        this._alertDialog.open(AlertComponent, config).afterOpened().subscribe(result => {
            setTimeout(()=> {
                this._alertDialog.closeAll();
            },2000);
        });
    }

    success(contentOrConfig: any, title?: string) {
        // 设置dialog的属性，宽度，高度，内容等。
        let config = new MatDialogConfig();
        config = {
            maxWidth: '100%',
            minHeight: '56px',
            position: {top:'2px'},
            backdropClass:'popping',
            hasBackdrop: false,
            panelClass: ['alertbg','success']
        };

        if (contentOrConfig instanceof Object) {
            config.data = contentOrConfig;
        } else if ((typeof contentOrConfig) === 'string') {
            config.data = {
                message: contentOrConfig,
                title: title
            }
        }
        this._alertDialog.open(AlertComponent, config).afterOpened().subscribe(result => {
            setTimeout(()=> {
                this._alertDialog.closeAll();
            },2000);
        });
    }

    error(contentOrConfig: any, title?: string) {
        // 设置dialog的属性，宽度，高度，内容等。
        let config = new MatDialogConfig();
        config = {
            maxWidth: '100%',
            minHeight: '56px',
            position: {top:'2px'},
            backdropClass:'popping',
            hasBackdrop: false,
            panelClass: ['alertbg','error']
        };

        if (contentOrConfig instanceof Object) {
            config.data = contentOrConfig;
        } else if ((typeof contentOrConfig) === 'string') {
            config.data = {
                message: contentOrConfig,
                title: title
            }
        }
        this._alertDialog.open(AlertComponent, config).afterOpened().subscribe(result => {
            setTimeout(()=> {
                this._alertDialog.closeAll();
            },2000);
        });
    }

    warn(contentOrConfig: any, title?: string) {
        // 设置dialog的属性，宽度，高度，内容等。
        let config = new MatDialogConfig();
        config = {
            maxWidth: '100%',
            minHeight: '56px',
            position: {top:'2px'},
            backdropClass:'popping',
            hasBackdrop: false,
            panelClass: ['alertbg','warn']
        };

        if (contentOrConfig instanceof Object) {
            config.data = contentOrConfig;
        } else if ((typeof contentOrConfig) === 'string') {
            config.data = {
                message: contentOrConfig,
                title: title
            }
        }
        this._alertDialog.open(AlertComponent, config).afterOpened().subscribe(result => {
            setTimeout(()=> {
                this._alertDialog.closeAll();
            },2000);
        });
    }
}
