import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorCreateComponent } from './vendor-create/vendor-create.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule ({
  declarations: [
    VendorCreateComponent,
    VendorListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class VendorsModule {}
