import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {AngularFireDatabase} from "angularfire2/database";
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './auth/auth.service';
import {environment} from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header-component/header-component';
import { MybooksComponent } from './my-area/personal-zone/mybooks/mybooks.component';
import { WelcomeComponent } from './welcome/welcome.component'; 
import { GetBooksService } from './services/getbooks.service';
import { PrivatezonenavComponent } from './my-area/privatezonenav/privatezonenav.component';
import { WishbooksComponent } from './my-area/personal-zone/wishbooks/wishbooks.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DialogComponent } from './dialog/dialog.component';
import { SearchBookComponent } from './search-book/search-book.component';
import { HttpClientModule } from '@angular/common/http';
import { BooksavailibilityComponent } from './booksavailibility/booksavailibility.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    WelcomeComponent,
    MybooksComponent,
    PrivatezonenavComponent,
    WishbooksComponent,
    SignupComponent,
    DialogComponent,
    SearchBookComponent,
    BooksavailibilityComponent

  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule
  ],

  providers: [AuthService,GetBooksService,AngularFireDatabase],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { } 
