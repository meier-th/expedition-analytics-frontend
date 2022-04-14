import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './component/analytics/analytics.component';
import { InsertionComponent } from './component/insertion/insertion.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';

const routes: Routes = [
  {path: '', redirectTo: 'analytics', pathMatch: 'full'},
  {path:'analytics', component: AnalyticsComponent},
  {path:'insertion', component: InsertionComponent},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
