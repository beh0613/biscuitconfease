import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/users';

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('user_name');
      if (name) this.currentUserSubject.next(name);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.API_URL, userData);
  }

  login(credentials: { email: string; password_hash: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(user => {
        this.handleAuthSuccess(user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  private handleAuthSuccess(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      // Correctly store Gmail and ID retrieved from database
      localStorage.setItem('user_name', user.first_name);
      localStorage.setItem('email', user.email);
      localStorage.setItem('user_id', user.user_id.toString());

      this.currentUserSubject.next(user.first_name);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_name');
      localStorage.removeItem('email');
      localStorage.removeItem('user_id');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('user_id');
    }
    return false;
  }
}
