import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatTableModule,
  MatDialogModule,
  MatCardModule,
  MatAutocompleteModule,
  

} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatAutocompleteModule,
   

  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatAutocompleteModule
    

  ]
})
export class MaterialModule {} 