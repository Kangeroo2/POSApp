import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { VendorListComponent } from './vendors/vendor-list/vendor-list.component';
import { VendorCreateComponent } from './vendors/vendor-create/vendor-create.component';
import { from } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'vendorList', component: VendorListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:productId', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'createVendor', component: VendorCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/vendor/:vendorId', component: VendorCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}

