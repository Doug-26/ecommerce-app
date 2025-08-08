import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, map, catchError, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, LoginResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  private readonly API_URL = 'http://localhost:3000';
  private readonly STORAGE_KEY = 'ecommerce-user';

  private _currentUser = signal<User | null>(null);
  
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.STORAGE_KEY);
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this._currentUser.set(user);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    }
  }

  private saveUserToStorage(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  private clearUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Fix the login method to return Observable<User>
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Invalid credentials');
        }
        
        const user = users[0];
        this._currentUser.set(user);
        this.saveUserToStorage(user);
        
        console.log('User logged in successfully:', user);
        return user;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  // Simplified register method in AuthService
  register(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}/users?email=${userData.email}`).pipe(
      switchMap(existingUsers => {
        if (existingUsers.length > 0) {
          return throwError(() => new Error('Email already exists'));
        }
        
        return this.http.post<User>(`${this.API_URL}/users`, userData);
      }),
      map(newUser => {
        this._currentUser.set(newUser);
        this.saveUserToStorage(newUser);
        console.log('User registered successfully:', newUser);
        return newUser;
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    this.clearUserFromStorage();
    console.log('User logged out');
    this.router.navigate(['/']);
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  // Get current user data
  getCurrentUser(): User | null {
    return this._currentUser();
  }

  // Update user profile
  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this._currentUser();
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    const updatedUser = { ...currentUser, ...userData };
    
    return this.http.put<User>(`${this.API_URL}/users/${currentUser.id}`, updatedUser).pipe(
      map(user => {
        this._currentUser.set(user);
        this.saveUserToStorage(user);
        return user;
      }),
      catchError(error => {
        console.error('Profile update failed:', error);
        return throwError(() => new Error('Failed to update profile'));
      })
    );
  }
}