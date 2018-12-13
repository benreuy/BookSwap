import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription,BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });

  }

  onSubmit(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {  
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password     
      
    });
  }
}
 