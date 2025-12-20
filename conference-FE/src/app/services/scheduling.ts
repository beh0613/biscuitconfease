import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES ---
export interface Room {
  room_id?: number;
  name: string;
  capacity: number;
  location: string;
}

export interface Session {
  session_id?: number;
  event_id?: number;
  title: string;
  chair_id?: number;
  start_time?: string;
  end_time?: string;
}

export interface Schedule {
  schedule_id?: number;
  session_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private http = inject(HttpClient);

  // ✅ STEP 1: Define the Base URL here (Inside the class)
  // Since we aren't using a proxy, we must list the FULL Docker address.
  private baseUrl = 'http://localhost:8081/api'; 

  // ==========================================
  // 1. ROOMS API
  // ==========================================
  
  getRooms(): Observable<Room[]> {
    // ✅ STEP 2: Use `this.baseUrl` instead of just '/api/...'
    return this.http.get<Room[]>(`${this.baseUrl}/rooms`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/rooms/${id}`);
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.baseUrl}/rooms`, room);
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/rooms/${id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/rooms/${id}`);
  }


  // ==========================================
  // 2. SESSIONS API
  // ==========================================

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/sessions`);
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/sessions/${id}`);
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}/sessions`, session);
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.baseUrl}/sessions/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sessions/${id}`);
  }


  // ==========================================
  // 3. SCHEDULES API
  // ==========================================

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.baseUrl}/schedules`);
  }

  getScheduleById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.baseUrl}/schedules/${id}`);
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.baseUrl}/schedules`, schedule);
  }

  updateSchedule(id: number, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/schedules/${id}`, schedule);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/schedules/${id}`);
  }
}