import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { mimeType } from './mime-type.validator';
import { Vendor } from 'src/app/vendors/vendor.model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  enteredName = '';
  enteredDescription = '';
  enteredCategory = '';
  enteredPrice = '';
  enteredCost = '';
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three', 'Four'];
  filteredOptions: Observable<string[]>;

  constructor(public productsService: ProductsService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null,
        {validators: [Validators.required]
      }),
      price: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(1)]
      }),
      category: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      cost: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(1)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            cost: productData.cost,
            imagePath: productData.imagePath
          };
          this.form.setValue({
            name: this.product.name,
            description: this.product.description,
            price: this.product.price,
            category: this.product.category,
            cost: this.product.cost,
            image: this.product.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
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

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.name,
        this.form.value.description,
        this.form.value.price,
        this.form.value.category,
        this.form.value.cost,
        this.form.value.image
        );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.name,
        this.form.value.description,
        this.form.value.price,
        this.form.value.category,
        this.form.value.cost,
        this.form.value.image
        );
    }
    this.form.reset();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
