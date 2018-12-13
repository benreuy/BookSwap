import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { MybooksComponent } from './my-area/personal-zone/mybooks/mybooks.component';
import { WishbooksComponent } from './my-area/personal-zone/wishbooks/wishbooks.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BooksavailibilityComponent } from './booksavailibility/booksavailibility.component';




const routes: Routes = [
  { path: '', component: WelcomeComponent,pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'wishbooks', component: WishbooksComponent,canActivate: [AuthGuard]},
  { path: 'mybooks', component: MybooksComponent,canActivate: [AuthGuard]},
  { path: 'booksavailibilty', component: BooksavailibilityComponent,canActivate: [AuthGuard]},
  { path: 'wishbooks',canActivateChild: [AuthGuard],
    children: [
  
  
      {
        path: 'mybooks',
        component: MybooksComponent,
     
      
      } 
    ]
  }
]

  @NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }   