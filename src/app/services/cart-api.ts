import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app.config';
import { Observable, of, switchMap, map } from 'rxjs';
import { ServerCartItem } from '../models/cart-item';
import { AuthService } from './auth.service';

interface ServerCartDoc { id: string; userId: string; items: ServerCartItem[]; }

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = environment.apiUrl;

  private uid(): string {
    return this.auth.currentUser()?.id?.toString() ?? '';
  }

  private getOrCreate(): Observable<ServerCartDoc> {
    const userId = this.uid();
    if (!userId) return of({ id: '', userId: '', items: [] } as ServerCartDoc);
    return this.http.get<ServerCartDoc[]>(`${this.api}/cart?userId=${encodeURIComponent(userId)}`).pipe(
      switchMap(rows => rows.length
        ? of(rows[0])
        : this.http.post<ServerCartDoc>(`${this.api}/cart`, { userId, items: [] }))
    );
  }

  // Load the items array for current user
  load(): Observable<ServerCartItem[]> {
    return this.getOrCreate().pipe(map(c => c.items ?? []));
  }

  // Replace the items array for current user
  save(items: ServerCartItem[]): Observable<ServerCartItem[]> {
    return this.getOrCreate().pipe(
      switchMap(c => this.http.patch<ServerCartDoc>(`${this.api}/cart/${c.id}`, { items })),
      map(doc => doc.items ?? [])
    );
  }
}
