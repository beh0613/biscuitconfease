import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (!isAuthPage) {
      <div class="relative min-h-screen md:flex" data-dev-hint="container">
        <nav class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
          <div class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
            <a class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" routerLink="/">
              <span class="text-red-600">Conference</span> Manager
            </a>
            <hr class="my-4 md:min-w-full" />
            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
              <li class="items-center">
                <a routerLink="/sessions" routerLinkActive="text-red-500" class="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500">
                  <i class="fas fa-tv mr-2 text-sm opacity-75"></i> Sessions
                </a>
              </li>
              <li class="items-center">
                <a routerLink="/my-paper" routerLinkActive="text-red-500" class="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500">
                  <i class="fas fa-file-alt mr-2 text-sm opacity-75"></i> My Paper
                </a>
              </li>
              <li class="items-center">
                <a routerLink="/submit-paper" routerLinkActive="text-red-500" class="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500">
                  <i class="fas fa-upload mr-2 text-sm opacity-75"></i> Submit Paper
                </a>
              </li>
              <li class="items-center">
                <a routerLink="/all-paper" routerLinkActive="text-red-500" class="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500">
                  <i class="fas fa-list mr-2 text-sm opacity-75"></i> View Paper
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div class="relative md:ml-64 w-full bg-blueGray-100 min-h-screen">
          <nav class="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
            <div class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10">
              <a class="text-white text-sm uppercase hidden lg:inline-block font-semibold">Dashboard</a>

              <ul class="flex-col md:flex-row list-none items-center hidden md:flex">
                <div class="items-center flex text-white text-sm font-semibold">
                  <span class="mr-4">{{ userEmail }}</span>

                  <button (click)="logout()" class="mr-4 bg-white text-red-600 px-3 py-1 rounded shadow hover:bg-gray-100 transition-colors">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </button>

                  <span class="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                    <i class="fas fa-user-circle text-2xl"></i>
                  </span>
                </div>
              </ul>
            </div>
          </nav>

          <div class="relative bg-red-600 md:pt-32 pb-32 pt-12 z-0"></div>

          <div class="px-4 md:px-10 mx-auto w-full -m-24 relative z-50">
            <router-outlet></router-outlet>
            <footer class="block py-4 mt-24">
               <div class="container mx-auto px-4">
                <hr class="mb-4 border-b-1 border-blueGray-200" />
                <div class="text-sm text-blueGray-500 font-semibold py-1">
                  Copyright © 2024 Conference Manager
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    } @else {
      <div class="auth-container">
        <router-outlet></router-outlet>
      </div>
    }
  `
})
export class App implements OnInit {
  private router = inject(Router);
  isAuthPage = false;
  userEmail = '';

  ngOnInit() {
    this.updateUserEmail();
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const fullScreenRoutes = ['/login', '/register'];
      this.isAuthPage = fullScreenRoutes.some(p => url.includes(p));
      this.updateUserEmail();
    });
  }

  updateUserEmail() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userEmail = user.email || 'Guest';
      } catch {
        this.userEmail = localStorage.getItem('email') || 'Guest';
      }
    } else {
      this.userEmail = localStorage.getItem('email') || 'Guest';
    }
  }

  // LOGOUT FUNCTION
  logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.clear(); // Clears all user data (email, user object, etc.)
      this.userEmail = '';
      this.router.navigate(['/login']); // Redirect to login page
    }
  }
}
