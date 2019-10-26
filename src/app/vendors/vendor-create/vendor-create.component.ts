import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { VendorsService } from '../vendors.service';
import { Vendor } from '../vendor.model';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrls: ['./vendor-create.component.css']
})
export class VendorCreateComponent implements OnInit {
  enteredVendorName = '';
  enteredFirstName = '';
  enteredLastName = '';
  enteredCommission = '';
  enteredEmail = '';
  enteredPhoneNumber = '';
  enteredAddress = '';
  enteredStartDate = '';
  enteredRentAmount = '';
  enteredContractLength = '';
  vendor: Vendor;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private vendorId: string;


  constructor(public vendorsService: VendorsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      vendorName: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      firstName: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      lastName: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      commission: new FormControl(null,
        {validators: [Validators.required]
      }),
      email: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(1)]
      }),
      phoneNumber: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      address: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      startDate: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      rentAmount: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(1)]
      }),
      contractLength: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(1)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('vendorId')) {
        this.mode = 'edit';
        this.vendorId = paramMap.get('vendorId');
        this.isLoading = true;
        this.vendorsService.getVendor(this.vendorId).subscribe(vendorData => {
          this.isLoading = false;
          this.vendor = {
            id: vendorData._id,
            vendorName: vendorData.vendorName,
            firstName: vendorData.firstName,
            lastName: vendorData.lastName,
            commission: vendorData.commission,
            email: vendorData.email,
            phoneNumber: vendorData.phoneNumber,
            address: vendorData.address,
            startDate: vendorData.startDate,
            rentAmount: vendorData.rentAmount,
            contractLength: vendorData.contractLength,
            imagePath: vendorData.imagePath
          };
          this.form.setValue({
            vendorName: this.vendor.vendorName,
            firstName: this.vendor.firstName,
            lastName: this.vendor.lastName,
            commission: this.vendor.commission,
            email: this.vendor.email,
            phoneNumber: this.vendor.phoneNumber,
            address: this.vendor.address,
            startDate: this.vendor.startDate,
            rentAmount: this.vendor.rentAmount,
            contractLength: this.vendor.contractLength,
            image: this.vendor.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.vendorId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveVendor() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.vendorsService.addVendor(
        this.form.value.vendorName,
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.commission,
        this.form.value.email,
        this.form.value.phoneNumber,
        this.form.value.address,
        this.form.value.startDate,
        this.form.value.rentAmount,
        this.form.value.contractLength,
        this.form.value.image
        );
    } else {
      this.vendorsService.updateVendor(
        this.vendorId,
        this.form.value.vendorName,
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.commission,
        this.form.value.email,
        this.form.value.phoneNumber,
        this.form.value.address,
        this.form.value.startDate,
        this.form.value.rentAmount,
        this.form.value.contractLength,
        this.form.value.image
        );
    }
    this.form.reset();
  }
}
