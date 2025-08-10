import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../models/products';
import { environment } from '../app.config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private normalize = (row: any): Product | null => {
    // Ignore incomplete rows in db.json
    if (!row || !row.id || !row.name || row.price == null) return null;

    const id = String(row.id);
    const name = String(row.name);
    const description = String(row.description ?? '');
    const price = Number(row.price);
    const imageUrl =
      String(row.imageUrl ?? 'https://via.placeholder.com/600x400?text=No+Image');
    const category = String(row.category ?? 'General');
    const stock = Number(row.stock ?? 0);

    return { id, name, description, price, imageUrl, category, stock };
  };

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.api}/products`).pipe(
      map(rows => rows
        .map(this.normalize)
        .filter((p): p is Product => p !== null))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<any>(`${this.api}/products/${id}`).pipe(
      map(this.normalize as (r: any) => Product)
    );
  }
}
