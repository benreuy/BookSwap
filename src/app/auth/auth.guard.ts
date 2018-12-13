import { Injectable,OnInit } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';

import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private subscription: Subscription;
  constructor(private route: ActivatedRoute, private router: Router,private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login'],{ queryParams:{ id:route.queryParams.id } });
    }
    
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }  
} 
