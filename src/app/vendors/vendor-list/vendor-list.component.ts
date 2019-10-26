import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Vendor } from '../vendor.model';
import { VendorsService } from '../vendors.service';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})


export class VendorListComponent implements OnInit, OnDestroy {
  // vendors = [
  //   {title: 'First vendor', content: "This is the first vendor's content"},
  //   {title: 'Second vendor', content: "This is the first vendor's content"},
  //   {title: 'Third vendor', content: "This is the first vendor's content"}
  // ];
  vendors: Vendor[] = [];
  isLoading = false;
  totalVendors = 10;
  vendorsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = true;
  private vendorsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public vendorsService: VendorsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
    this.vendorsSub = this.vendorsService.getVendorUpdateListener()
      .subscribe((vendorData: {vendor: Vendor[], vendorCount: number}) => {
        this.isLoading = false;
        this.totalVendors = vendorData.vendorCount;
        this.vendors = vendorData.vendor;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.vendorsPerPage = pageData.pageSize;
    this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
  }

  onDelete(vendorId: string) {
    this.isLoading = true;
    this.vendorsService.deleteVendor(vendorId).subscribe(() => {
      this.vendorsService.getVendors(this.vendorsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.vendorsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
