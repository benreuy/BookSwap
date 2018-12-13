import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../my-area/book.model';
import { style } from '@angular/animations';
import { GetBooksService } from '../services/getbooks.service';
import { MatDialog } from '@angular/material';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css']
})
export class SearchBookComponent implements OnInit {
  @Output() searchResult = new EventEmitter<Book>();
  options:Book[]=[{name:"",id:"",style:""}];

  constructor(private authService: AuthService,private dialog: MatDialog,private router: Router,private bookService: GetBooksService) { }

  ngOnInit() {
  }
  onInputChanged(query: string): void {
  
    if (query !== "") {
      this.options= this.bookService.getAutoComplete(query)
      .map(data=>{
        return {name:data.name,style:data.style,id:data.id};
     })
    }

  }
  redirectToWishZone(form:NgForm){
   
  }
  redirectToMyBooks(form:NgForm){
    this.router.navigate(['mybooks'], { queryParams: { id: form.value.search } });


  }

}
