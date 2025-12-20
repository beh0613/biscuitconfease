import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES (Matching your Java Models exactly) ---

export interface Room {
  room_id?: number;      // Optional '?' because it's null when creating a new one
  name: string;
  capacity: number;
  location: string;
}

export interface Session {
  session_id?: number;
  event_id?: number;     // Nullable in backend? If so, keep optional
  title: string;
  chair_id?: number;
  start_time?: string;   // Java Timestamp comes as ISO String (e.g., "2023-12-01T09:00:00")
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

  // ==========================================
  // 1. ROOMS API (/api/rooms)
  // ==========================================
  
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('/api/rooms');
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`/api/rooms/${id}`);
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>('/api/rooms', room);
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`/api/rooms/${id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`/api/rooms/${id}`);
  }


  // ==========================================
  // 2. SESSIONS API (/api/sessions)
  // ==========================================

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>('/api/sessions');
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`/api/sessions/${id}`);
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>('/api/sessions', session);
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`/api/sessions/${id}`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`/api/sessions/${id}`);
  }


  // ==========================================
  // 3. SCHEDULES API (/api/schedules)
  // ==========================================

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>('/api/schedules');
  }

  getScheduleById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`/api/schedules/${id}`);
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>('/api/schedules', schedule);
  }

  updateSchedule(id: number, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`/api/schedules/${id}`, schedule);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`/api/schedules/${id}`);
  }
}