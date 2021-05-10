import { NgModule } from '@angular/core';

import { PosterComponent } from './poster/poster.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRegistryComponent } from './user-registry/user-registry.component';
import { UserComponent } from './user/user.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MaterialModule } from '../common-modules/material.module';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '../common-components/common-components.module'
@NgModule({
  imports: [
    CommonModule,
    NgxQRCodeModule,
    MaterialModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedComponentsModule,
    CommonComponentsModule
  ],
  declarations: [PosterComponent, UserListComponent, UserRegistryComponent, UserComponent],
  exports:[
    
  ]
})
export class UserListModule { }
