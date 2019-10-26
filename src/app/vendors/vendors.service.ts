import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Vendor } from './vendor.model';


@Injectable({providedIn: 'root'})

export class VendorsService {
  private vendors: Vendor[] = [];
  private vendorsUpdated = new Subject<{vendor: Vendor[], vendorCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getVendors(vendorsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${vendorsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; vendors: any, maxVendors: number }>('http://localhost:3000/api/vendors' + queryParams)
      .pipe(
        map(vendorData => {
          return { vendors: vendorData.vendors.map(vendor => {
            return {
              vendorName: vendor.vendorName,
              firstName: vendor.firstName,
              lastName: vendor.lastName,
              commission: vendor.commission,
              email: vendor.email,
              phoneNumber: vendor.phoneNumber,
              address: vendor.address,
              startDate: vendor.startDate,
              rentAmount: vendor.rentAmount,
              contractLength: vendor.contractLength,
              id: vendor._id,
              imagePath: vendor.imagePath
            };
          }), maxVendors: vendorData.maxVendors
        };
        })
      )
      .subscribe(transformedVendorData => {
        this.vendors = transformedVendorData.vendors;
        this.vendorsUpdated.next({ vendor: [...this.vendors], vendorCount: transformedVendorData.maxVendors });
      });
  }

  getVendorUpdateListener() {
    return this.vendorsUpdated.asObservable();
  }

  getVendor(id: string) {
    return this.http.get<{
      _id: string,
      vendorName: string,
      firstName: string,
      lastName: string,
      commission: string,
      address: string,
      email: string,
      phoneNumber: string,
      startDate: string,
      rentAmount: string,
      contractLength: string,
      imagePath: string
    }>(
      'http://localhost:3000/api/vendors/' + id
      );
  }

  addVendor(
    vendorName: string,
    firstName: string,
    lastName: string,
    commission: string,
    email: string,
    phoneNumber: string,
    address: string,
    startDate: string,
    rentAmount: string,
    contractLength: string,
    image: File) {
    const vendorData = new FormData();
    vendorData.append('vendorName', vendorName);
    vendorData.append('firstName', firstName);
    vendorData.append('lastName', lastName);
    vendorData.append('commission', commission);
    vendorData.append('email', email);
    vendorData.append('phoneNumber', phoneNumber);
    vendorData.append('address', address);
    vendorData.append('startDate', startDate);
    vendorData.append('rentAmount', rentAmount);
    vendorData.append('contractLength', contractLength);
    vendorData.append('image', image, vendorName);
    this.http
      .post<{message: string, vendor: Vendor}>(
        'http://localhost:3000/api/vendors',
        vendorData)
      .subscribe((responseData) => {
        this.router.navigate(['/vendorList']);
      });
  }

  updateVendor(
    id: string,
    vendorName: string,
    firstName: string,
    lastName: string,
    commission: string,
    email: string,
    phoneNumber: string,
    address: string,
    startDate: string,
    rentAmount: string,
    contractLength: string,
    image: File | string
    ) {
    let vendorData: Vendor | FormData;
    if (typeof image === 'object') {
      vendorData = new FormData();
      vendorData.append('id', id);
      vendorData.append('vendorName', vendorName);
      vendorData.append('firstName', firstName);
      vendorData.append('lastName', lastName);
      vendorData.append('commission', commission);
      vendorData.append('email', email);
      vendorData.append('phoneNumber', phoneNumber);
      vendorData.append('address', address);
      vendorData.append('startDate', startDate);
      vendorData.append('rentAmount', rentAmount);
      vendorData.append('contractLength', contractLength);
      vendorData.append('image', image, vendorName);
    } else {
      vendorData = {
        id,
        vendorName,
        firstName,
        lastName,
        commission,
        email,
        phoneNumber,
        address,
        startDate,
        rentAmount,
        contractLength,
        imagePath: image
      };
    }
    this.http
      .put('http://localhost:3000/api/vendors/' + id, vendorData)
      .subscribe(response => {
        this.router.navigate(['/vendorList']);
      });
  }
  deleteVendor(vendorId: string) {
    return this.http.delete('http://localhost:3000/api/vendors/' + vendorId);
  }
}
