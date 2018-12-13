import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule, NgForm,
   FormGroup, FormControl, Validators, AbstractControl,
    ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { GetBooksService } from '../../services/getbooks.service';
import { retry } from 'rxjs-compat/operator/retry';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loginForm: FormGroup;
  latitude:number;
  longitude:number; 
  adress:string;

  constructor( private bookService:GetBooksService,private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] }),
      // location: new FormControl('', { asyncValidators:this.locationValidator()}),
      location: new FormControl('', 
      [ Validators.required, Validators.maxLength(10) ], //sync validators
      [ this.locationValidator()])
    });

  }
  onSubmit() {
    this.authService.registerUser({
      email:this.loginForm.value.email	, 
      password:this.loginForm.value.password,
    },this.latitude,this.longitude,this.adress);
  }
  locationValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.bookService.validateAdress(control.value)
        .pipe(
          map(res => {
            if (res) {
              this.longitude=res[0].geometry.location.lat;
              this.latitude=res[0].geometry.location.lng;
              this.adress=control.value;
              return null; 
            }
            else{
              return null;
              // return { 'userNameExists': true};
            } 
          })
        );
    };

  }  
  
}
