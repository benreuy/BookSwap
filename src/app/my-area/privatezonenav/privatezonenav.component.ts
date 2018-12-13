import { Component, OnInit, EventEmitter, Output,OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-privatezonenav',
  templateUrl: './privatezonenav.component.html',
  styleUrls: ['./privatezonenav.component.css']
})
export class PrivatezonenavComponent implements OnInit {
  isAuth = false;
  authSubscription: Subscription;


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
}
