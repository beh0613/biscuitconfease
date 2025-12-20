import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { FormsModule } from '@angular/forms';
import { SchedulingService, Schedule, Room, Session } from '../../../services/scheduling';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], // Add DatePipe to imports
  template: `
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 class="font-semibold text-lg text-blueGray-700">Master Schedule</h3>
          </div>
          <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button (click)="showForm = !showForm" 
              class="bg-purple-500 text-white active:bg-purple-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
              {{ showForm ? 'Cancel' : '+ Schedule Event' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="showForm" class="p-4 bg-blueGray-50">
        <form (ngSubmit)="createSchedule()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Session</label>
              <select [(ngModel)]="newSchedule.session_id" name="sessionId" class="px-3 py-3 w-full bg-white rounded text-sm border-0 shadow focus:ring">
                <option *ngFor="let s of sessions" [value]="s.session_id">{{ s.title }}</option>
              </select>
            </div>

            <div>
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Room</label>
              <select [(ngModel)]="newSchedule.room_id" name="roomId" class="px-3 py-3 w-full bg-white rounded text-sm border-0 shadow focus:ring">
                <option *ngFor="let r of rooms" [value]="r.room_id">{{ r.name }}</option>
              </select>
            </div>

            <div>
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Start Time</label>
              <input type="datetime-local" [(ngModel)]="newSchedule.start_time" name="startTime" class="px-3 py-3 w-full bg-white rounded text-sm border-0 shadow focus:ring"/>
            </div>

            <div>
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">End Time</label>
              <input type="datetime-local" [(ngModel)]="newSchedule.end_time" name="endTime" class="px-3 py-3 w-full bg-white rounded text-sm border-0 shadow focus:ring"/>
            </div>

          </div>
          <button type="submit" class="mt-4 bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">
            Save Schedule
          </button>
        </form>
      </div>

      <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Session</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Room</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Time</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sch of schedules">
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold">{{ getSessionTitle(sch.session_id) }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{{ getRoomName(sch.room_id) }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {{ sch.start_time | date:'short' }} - {{ sch.end_time | date:'shortTime' }}
              </td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <button (click)="deleteSchedule(sch.schedule_id!)" class="text-red-500 font-bold uppercase text-xs px-2 py-1">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ScheduleListComponent {
  private schedulingService = inject(SchedulingService);
  
  schedules: Schedule[] = [];
  sessions: Session[] = [];
  rooms: Room[] = [];

  showForm = false;
  
  // Initialize with empty values (ID 0 means 'not selected yet')
  newSchedule: Schedule = { 
    session_id: 0, 
    room_id: 0, 
    start_time: '', 
    end_time: '' 
  };

  constructor() {
    this.loadData();
  }

  loadData() {
    // 1. Get the Schedule List
    this.schedulingService.getSchedules().subscribe(data => this.schedules = data);
    // 2. Get Sessions (for the dropdown)
    this.schedulingService.getSessions().subscribe(data => this.sessions = data);
    // 3. Get Rooms (for the dropdown)
    this.schedulingService.getRooms().subscribe(data => this.rooms = data);
  }

  createSchedule() {
    // Basic validation
    if(this.newSchedule.session_id && this.newSchedule.room_id) {
      this.schedulingService.createSchedule(this.newSchedule).subscribe(() => {
        this.loadData(); // Refresh list
        this.showForm = false;
        // Reset form
        this.newSchedule = { session_id: 0, room_id: 0, start_time: '', end_time: '' };
      });
    } else {
      alert("Please select both a Session and a Room!");
    }
  }

  deleteSchedule(id: number) {
    if(confirm('Are you sure?')) {
      this.schedulingService.deleteSchedule(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // --- HELPER FUNCTIONS ---
  // These translate "ID 1" into "Intro to Java" for the user to read
  
  getSessionTitle(id: number): string {
    const s = this.sessions.find(x => x.session_id === id);
    return s ? s.title : 'Unknown Session';
  }

  getRoomName(id: number): string {
    const r = this.rooms.find(x => x.room_id === id);
    return r ? r.name : 'Unknown Room';
  }
}