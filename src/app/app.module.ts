import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HttpAuthInterceptor } from './core/common-services/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AllServices } from 'src/app/core/common-services';

import { CoreModule } from './core/core.module';
import { PublicModule } from './public/public.module';
import { PatientModule } from './patient/patient.module';
import { ProviderModule } from './provider/provider.module';

@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    PublicModule,
    PatientModule,
    ProviderModule
  ],
  providers: [
    // HttpAuthInterceptor,
    // AllServices,
  ],
  bootstrap: [AppComponent,
  ],
})
export class AppModule { }
