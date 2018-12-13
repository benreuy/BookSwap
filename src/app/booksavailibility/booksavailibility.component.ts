import { Component, OnInit } from '@angular/core';
import { Book } from '../my-area/book.model';
import { GetBooksService } from '../services/getbooks.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material';
import { PreUsers } from '../Entities/pre-users';
import { User } from '../my-area/User.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-booksavailibility',
  templateUrl: './booksavailibility.component.html',
  styleUrls: ['./booksavailibility.component.css']
})
export class BooksavailibilityComponent implements OnInit {

  options:Book[]=[{name:"",id:"",style:""}];
  books:Book[];
  public tblSrc = new MatTableDataSource<User & PreUsers>();
  initialSelection = [];
  selection = new SelectionModel<User & PreUsers>(false, []);
  user:User & PreUsers={latitude:"",name:"",userid:"",id:"",booksIDs:[],distance2Destination:0};
  public columnsToDisplay: string[] = ['select', 'name','latitude'];

  constructor(private bookService:GetBooksService,private authService:AuthService) { }

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
  onSubmit(form: NgForm) {
    let book: Book = this.bookService.getBooksArr().find(obj => obj.name == form.controls.search.value);
    let dist: string[];
    this.bookService.getUserDetails(this.authService.userID).map(data => {
      return [data.latitude, data.longitude]
    })
      .subscribe(data => {
        dist = data;
        if (book) {
          this.bookService.checkAvailibility(
            book.id, this.authService.userID, "usersbooks", dist)
            .subscribe(data => {
              this.tblSrc=new MatTableDataSource<User & PreUsers>(data);
            })
        }
      })
  }
}
