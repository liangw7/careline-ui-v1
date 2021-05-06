import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistryComponent } from './registry/registry.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginPosterComponent } from './login-poster/login-poster.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProviderComponent } from './provider/provider.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { PublishListComponent } from './publish-list/publish-list.component';
import { PublishComponent } from './publish/publish.component';
import { ServiceComponent } from './service/service.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { HomePageComponent } from './homepage/homepage.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
const routes: Routes = [
  {
    path: "service/:serviceID", component: ServiceComponent },
      {path: '', component: HomeComponent, children: [
      { path: "main", component: HomePageComponent },// 首页
      { path: "login", component: LoginComponent },// 登录
      { path: 'registry', component: RegistryComponent },//
      { path: 'forget-password', component: ForgetPasswordComponent },// 忘记密码
      { path: 'reset-password', component: ResetPasswordComponent },// 忘记密码
      { path: 'login-poster', component: LoginPosterComponent },
      { path: 'login-poster/:role/:senderID', component: LoginPosterComponent },// 授权登录回调地址
      { path: "publish-list", component: PublishListComponent },//发表
      { path: "publish/:publishID", component: PublishComponent },// 发表文章跳转
    
      { path: "profile-list", component: ProfileListComponent },// 健康项目
      { path: "service-list", component: ServiceListComponent },
      { path: "provider-list", component: ProviderListComponent },// 执业医师
      { path: "provider/:providerID", component: ProviderComponent },// 执业医师
      { path: "provider/:providerID/:profileID", component: ProviderComponent },// 执业医师微信授权登陆回调地址
      { path: "service/:serviceID", component: ServiceComponent },
     // { path: "profile", component: ProfileComponent },
      { path: "profile/:profileID/:serviceID/:color/:photo", component: ProfileComponent },// 健康项目下的调研
      { path: '', redirectTo: 'main', pathMatch: 'full' },
  //    { path: '**', redirectTo: 'main' }//otherwise
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
