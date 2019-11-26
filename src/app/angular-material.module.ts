import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatRippleModule,
  MatAutocompleteModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  exports: [
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule
  ]
})

export class AngularMaterialModule {}
