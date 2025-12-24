import { Routes } from '@angular/router';
import { RoomListComponent } from './features/scheduling/room-list/room-list';
import { SessionListComponent } from './features/scheduling/session-list/session-list';
import { ScheduleListComponent } from './features/scheduling/schedule-list/schedule-list';

export const routes: Routes = [
  { path: 'sessions', component: SessionListComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'schedules', component: ScheduleListComponent },
  {
    path: 'all-paper',
    loadComponent: () => import('./features/all-papers/all-papers').then(m => m.AllPapersPage)
  },
  {
    path: 'submit-paper',
    loadComponent: () => import('./features/submit-paper/submit-paper').then(m => m.SubmitPaperComponent)
  },
  {
    path: 'my-paper',
    loadComponent: () => import('./features/my-paper/my-paper').then(m => m.MyPaperPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then(m => m.RegisterPage)
  },
  // Default route: Redirect to login on start
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
