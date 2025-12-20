import { Routes } from '@angular/router';
// Import your component so the router knows it exists
import { SessionListComponent } from './features/scheduling/session-list/session-list'; 

export const routes: Routes = [
  // 1. When the URL is 'http://localhost:4200/sessions', show the Session List
  { path: 'sessions', component: SessionListComponent },

  // 2. When the URL is empty ('http://localhost:4200'), automatically go to /sessions
  { path: '', redirectTo: 'sessions', pathMatch: 'full' }
];