import { Routes } from '@angular/router';
import { RoomListComponent } from './features/scheduling/room-list/room-list';
import { SessionListComponent } from './features/scheduling/session-list/session-list'; 
import { ScheduleListComponent } from './features/scheduling/schedule-list/schedule-list';

export const routes: Routes = [
  // 1. When the URL is 'http://localhost:4200/sessions', show the Session List
  { path: 'sessions', component: SessionListComponent },
  {path: 'rooms', component: RoomListComponent},
  {path: 'schedules',component: ScheduleListComponent},

  // 2. When the URL is empty ('http://localhost:4200'), automatically go to /sessions
  { path: '', redirectTo: 'sessions', pathMatch: 'full' }
];