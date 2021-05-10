import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AppSpinnerComponent]
  ,
  exports:[
    AppSpinnerComponent
  ]
})
export class SharedComponentsModule { }
