import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'public',
    loadChildren: './public/public.module#PublicModule',
  },
  {
    path: 'patient',
    loadChildren: './patient/patient.module#PatientModule',
  },
  {
    path: 'provider',
    loadChildren: './provider/provider.module#ProviderModule',
  },


  { path: '', redirectTo: 'public', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
   // LoginModule,
   // PublicPlatformModule,
   // ProviderPlatformModule,
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
