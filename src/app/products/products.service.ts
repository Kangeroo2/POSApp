import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import { Product } from './product.model';


@Injectable({providedIn: 'root'})

export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<{product: Product[], productCount: number}>();
  url: string;

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any, maxProducts: number }>('http://localhost:3000/api/products' + queryParams)
      .pipe(
        map(productData => {
          return { products: productData.products.map(product => {
            return {
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              cost: product.cost,
              id: product._id,
              imagePath: product.imagePath
            };
          }), maxProducts: productData.maxProducts
        };
        })
      )
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          product: [...this.products],
          productCount: transformedProductData.maxProducts
        });
      });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string,
      name: string,
      description: string,
      price: string,
      category: string,
      cost: string,
      imagePath: string
    }>(
      'http://localhost:3000/api/products/' + id
      );
  }

  addProduct(name: string, description: string, price: string, category: string, cost: string, image: File) {
    const productData = new FormData();
    productData.append('name', name);
    productData.append('description', description);
    productData.append('price', price);
    productData.append('category', category);
    productData.append('cost', cost);
    productData.append('image', image, name);
    this.http
      .post<{message: string, product: Product}>(
        'http://localhost:3000/api/products',
        productData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateProduct(id: string, name: string, description: string, price: string, category: string, cost: string, image: File | string) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('category', category);
      productData.append('cost', cost);
      productData.append('image', image, name);
    } else {
      productData = {
        id,
        name,
        description,
        category,
        price,
        cost,
        imagePath: image
      };
    }
    this.http
      .put('http://localhost:3000/api/products/' + id, productData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }
  deleteProduct(productId: string) {
    return this.http.delete('http://localhost:3000/api/products/' + productId);
  }

}
