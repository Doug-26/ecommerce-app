import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = signal(false);       // Changed to signal
  error = signal('');           // Changed to signal
  returnUrl = '/';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // If user is already logged in, redirect to return URL
    if (this.authService.currentUser()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Add getter for form controls (used in template as f['email'], f['password'])
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set('');
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.loading.set(false);
          // Navigate to return URL after successful login
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set('Invalid email or password. Please try again.');
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} must be at least 6 characters`;
    }
    return '';
  }
}


