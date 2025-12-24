import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterPage {
  categories = ['student', 'academic', 'staff', 'other'];

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password_hash: new FormControl('', [Validators.required, Validators.minLength(8)]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    affiliation: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    category: new FormControl('student', [Validators.required]),
    orcid: new FormControl(''),
    role_id: new FormControl(1, [Validators.required])
  });

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {}

  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.getRawValue();

      // Corrected URL: added '/api' prefix
      this.http.post('http://localhost:8081/users', formData).subscribe({
        next: (newUser: any) => {
          const assignedId = newUser.user_id || newUser.id;

          if (assignedId) {
            const rolePayload = {
              user_id: assignedId,
              role_id: Number(formData.role_id),
              assigned_at: new Date().toISOString()
            };

            this.http.post('http://localhost:8081/api/user-roles', rolePayload).subscribe({
              next: () => {
                this.snackBar.open('Registration Successful!', 'Close', { duration: 3000 });
                this.router.navigate(['/login']);
              },
              error: (err) => {
                console.error('Role assignment failed', err);
                alert('User created, but role assignment failed.');
              }
            });
          }
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Registration failed. Check if email is already taken or backend logs.');
        }
      });
    }
  }
}
