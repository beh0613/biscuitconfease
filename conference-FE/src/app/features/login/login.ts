import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  hidePassword = true;
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password_hash: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('email', credentials.email);

          // Fetch User ID to create log
          this.http.get<any[]>('http://localhost:8081/users').subscribe(users => {
            const user = users.find(u => u.email.trim().toLowerCase() === credentials.email.toLowerCase());
            if (user) {
              this.recordActivity(user.user_id, 'LOGIN', `User logged into dashboard`);
              this.handleRoleRedirection(user.user_id);
            }
          });
        }
      });
    }
  }

  private recordActivity(userId: number, action: string, details: string) {
    const logData = {
      user_id: userId,
      action: action,
      details: details,
      login_time: new Date().toISOString() // Setting login_time
    };

    this.http.post('http://localhost:8081/api/log-activities', logData).subscribe({
      next: () => console.log('Activity logged successfully')
    });
  }

  private handleRoleRedirection(userId: number) {
    this.http.get<any[]>('http://localhost:8081/api/user-roles').subscribe({
      next: (roles) => {
        // Admin is defined as role_id 3 in the database
        const isAdmin = roles.some(r => r.user_id === userId && r.role_id === 3);

        if (isAdmin) {
          console.log('Admin user detected. Redirecting to Admin View.');
        } else {
          console.log('Author user detected. Redirecting to Author View.');
        }

        if (isAdmin) {
          this.router.navigate(['/all-paper']);
        } else {
          this.router.navigate(['/all-paper']);
        }
      }
    });
  }
}
