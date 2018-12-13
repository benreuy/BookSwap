import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { GetBooksService } from '../services/getbooks.service';



@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  userID:string;
  private isAuthenticated = false;
  private subscription: Subscription;
  private id:string;

  constructor(private bookService: GetBooksService,private route: ActivatedRoute,private router: Router, private afAuth: AngularFireAuth) { }

  registerUser(authData: AuthData,latitude:number,longitude:number,adress:string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.id = result.user.uid;
        this.signUpSucceded(this.id,name,latitude,longitude,adress);
      })
      .catch(error => {
        console.log(error);
      });
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        //  this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.userID = result.user.uid;
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      });
  }
  private authSuccessfully() {
    // this.subscription = this.route.queryParams.subscribe(
    //   (queryParams: any) => {
    //     this.id= queryParams.id;
    //   });
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['mybooks'],{ queryParams: { id:this.id}} );
  }
  private signUpSucceded(id:string,name:string,latitude:number,longitude:number,adress:string)
  {
    this.bookService.registerUser(adress,id,latitude,longitude,name);
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['mybooks'],{ queryParams: { id:this.id}} );
    
  }

  isAuth() {
    return this.isAuthenticated;
  }
} 
