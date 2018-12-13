import { Component, OnInit ,OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { GetBooksService } from '../../../services/getbooks.service';
import { AuthService } from '../../../auth/auth.service';
import { Book } from '../../book.model';
import { Subject } from "rxjs/Subject";
import { Subscription } from 'rxjs';
import {SelectionModel } from "@angular/cdk/collections" ;
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../dialog/dialog.component';
import { NgForm ,ReactiveFormsModule, FormControl } from '@angular/forms';
import { style } from '@angular/animations';
import { database } from 'firebase';

@Component({
  selector: 'app-mybooks',
  templateUrl: './mybooks.component.html',
  styleUrls: ['./mybooks.component.css']
})
export class MybooksComponent implements OnInit, OnDestroy{

  constructor(private route: ActivatedRoute, private router: Router,private dialog: MatDialog, private bookService: GetBooksService, private authService: AuthService, private changeDetectorRefs: ChangeDetectorRef) { }
  private userID: string;
  private subscription: Subscription;
  public columnsToDisplay: string[] = ['select', 'name', 'style'];
  myAvailableBooksChanged: Subscription;
  initialSelection = [];
  selection = new SelectionModel<Book>(false, []);
  public books = new MatTableDataSource<Book>();
  bookFound:boolean=false;
  book:Book={name:"",style:"",id:""};
  options:Book[]=[{name:"",id:"",style:""}];
  public query :string ='';
  private bookname:string;


  ngOnInit() {
    this.selection = new SelectionModel<Book>(false, this.initialSelection);
  
    this.userID = this.authService.userID;
  
    this.myAvailableBooksChanged= this.bookService.AvailableBooks.subscribe(books =>{
      this.books =new MatTableDataSource<Book>(books);
    });
    this.bookService.fetchAvailableBooksByUser(this.authService.userID,'usersbooks');
    this.bookname =this.route.snapshot.queryParams.id;


  }
  ngOnDestroy() {
    this.myAvailableBooksChanged.unsubscribe();
    
  }
  isAllSelected(event) {
    const dataS=this.books;
    let y;

  }
  toggleRow(row) {
    if (this.selection.selected.length == 0 ) {

      const dialogRef = this.dialog.open(DialogComponent, {

      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.bookService.deleteBookFromUserRepo(this.authService.userID, row.id,"usersbooks")
        }
        else {
          console.log(event);
        }
      });
    }
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
    let book:Book = this.bookService.getBooksArr().find(obj => obj.name == form.controls.search.value);
    let bookID:string;
    if (book) {
      bookID = book.id;
      this.bookService.addBookToMyRepoService(this.authService.userID, bookID,"usersbooks")
    }
      
  }
 
}
