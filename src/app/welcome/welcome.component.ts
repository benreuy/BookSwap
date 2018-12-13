import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }
  search(form: NgForm)
 {
  this.router.navigate(['wishbooks'], { queryParams: { id: form.value.search } });

   
 };

}
