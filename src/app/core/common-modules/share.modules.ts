import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//shared module
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';

import { OrderModule } from 'ngx-order-pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    NgxQRCodeModule,
    Ng2SearchPipeModule,
    OrderModule, 
    RouterModule,
    NgbModule,
    StorageServiceModule,
   
    Ng2SearchPipeModule,
    
  ],

  providers:[DatePipe,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}
  ],
  exports: [
    
    CommonModule,
    FormsModule,
    FileUploadModule,
    NgxQRCodeModule,
    Ng2SearchPipeModule,
    OrderModule, 
    RouterModule,
    NgbModule,
    StorageServiceModule,
    Ng2SearchPipeModule,
   
  ], // 把共享的组件放入到导出的出口中 
  // entryComponents: COMPONENTS_NOROUNT
})
export class ShareModule { }
