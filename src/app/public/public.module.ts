import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';

import { RegistryComponent } from './registry/registry.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProviderComponent } from './provider/provider.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { PublishListComponent } from './publish-list/publish-list.component';
import { PublishComponent } from './publish/publish.component';
import { ServiceComponent } from './service/service.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { LoginPosterComponent } from './login-poster/login-poster.component';
import { HomePageComponent } from './homepage/homepage.component';

//import { Ng2SearchPipeModule } from 'ng2-search-filter';
//import { NgxQRCodeModule } from 'ngx-qrcode2';
//import { FormsModule } from '@angular/forms';
//import { OrderModule } from 'ngx-order-pipe';
import { AllServices } from 'src/app/core/common-services';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
//import { MaterialModule } from 'src/app/core/common-modules/material.module';
import { AllModel } from 'src/app/core/models/all-model';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    PublicRoutingModule,
    RouterModule
  ],
  providers: [
    AllServices,
    AllModel
  ],
  declarations: [
    ProfileListComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    ProviderComponent,
    PublishListComponent,
    PublishComponent,
    RegistryComponent,
    ServiceComponent,
    ServiceListComponent,
    HomePageComponent,
    ForgetPasswordComponent, 
    ResetPasswordComponent,
    RegistryComponent,
    LoginPosterComponent,
    ProviderListComponent
  ],
  exports: [
    ResetPasswordComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule { }
