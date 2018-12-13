import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Rx";
import { ActivatedRoute, Router } from "@angular/router";
import { Book } from '../../book.model';
import { GetBooksService } from '../../../services/getbooks.service';
import { AuthService } from '../../../auth/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogComponent } from '../../../dialog/dialog.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-wishbooks',
  templateUrl: './wishbooks.component.html',
  styleUrls: ['./wishbooks.component.css']
})
export class WishbooksComponent implements OnInit {
  private wishBooks: Subscription;
  public books = new MatTableDataSource<Book>();
  public columnsToDisplay: string[] = ['select', 'name', 'style'];
  private userID :string;
  options:Book[]=[{name:"",id:"",style:""}];
  selection = new SelectionModel<Book>(false, []);
  book:Book={name:"",style:"",id:""};
  initialSelection = [];


  constructor(private authService: AuthService,private dialog: MatDialog,private route: ActivatedRoute, private router: Router,private bookService:GetBooksService) { }
  ngOnInit() {
    this.selection = new SelectionModel<Book>(false, this.initialSelection);
  
    this.userID = this.authService.userID;
  
    this.wishBooks= this.bookService.AvailableBooks.subscribe(books =>{
      this.books =new MatTableDataSource<Book>(books);
    });
    this.bookService.fetchAvailableBooksByUser(this.authService.userID,'wishlist');
    
  }; 
  ngOnDestroy() {
    this.wishBooks.unsubscribe();
    
  }
  onInputChanged(query: string): void {
  
    if (query !== "") {
      this.options= this.bookService.getAutoComplete(query)
      .map(data=>{
        return {name:data.name,style:data.style,id:data.id};
     })
    }

  }
  toggleRow(row) {
    if (this.selection.selected.length == 0 ) {

      const dialogRef = this.dialog.open(DialogComponent, {

      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.bookService.deleteBookFromUserRepo(this.authService.userID, row.id,"wishlist")
        }
        else {
          console.log(event);
        }
      });
    }
  }
  onSubmit(form: NgForm) {
    let book:Book = this.bookService.getBooksArr().find(obj => obj.name == form.controls.search.value);
    let bookID:string;
    if (book) {
      bookID = book.id;
      this.bookService.addBookToMyRepoService(this.authService.userID, bookID,"wishlist")
    }
      
  }
}
