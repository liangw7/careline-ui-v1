import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonServicesModule } from './common-services/common-services.module';
import { ModelsModule } from './models/models.module';
import {ShareModule} from './common-modules/share.modules';
import {MaterialModule} from './common-modules/material.module';
import { CommonComponentsModule } from './common-components/common-components.module';
import { CommonModule } from '@angular/common';


const Core = [
  CommonServicesModule,
  ModelsModule,
  CommonComponentsModule,
  FormsModule,
  ShareModule,
  MaterialModule
] 
@NgModule({
  imports: [
    CommonModule,
    Core
  ],
  providers: [
  ],
 
  exports: [Core]
})
export class CoreModule { }
