import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Added DatePipe for formatting
import { FormsModule } from '@angular/forms';
import { SchedulingService, Session } from '../../../services/scheduling';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], 
  template: `
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 class="font-semibold text-lg text-blueGray-700">
              Session Management
            </h3>
          </div>
          <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button (click)="showForm = !showForm" 
              class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
              {{ showForm ? 'Cancel' : '+ New Session' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="showForm" class="p-4 bg-blueGray-50 border-t border-solid border-blueGray-100">
        <form (ngSubmit)="createSession()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" [(ngModel)]="newSession.title" name="title" placeholder="Session Title" 
              class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
            
            <input type="number" [(ngModel)]="newSession.chair_id" name="chairId" placeholder="Chair ID" 
              class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
          </div>
          <button type="submit" class="mt-4 bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">
            Save Session
          </button>
        </form>
      </div>

      <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">ID</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Title</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Chair ID</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let session of sessions">
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{{ session.session_id }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold text-blueGray-700">{{ session.title }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{{ session.chair_id }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <button (click)="deleteSession(session.session_id!)" class="text-red-500 font-bold uppercase text-xs px-2 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SessionListComponent {
  private schedulingService = inject(SchedulingService);
  
  sessions: Session[] = [];
  showForm = false;
  newSession: Session = { title: '', chair_id: 0 };

  constructor() {
    this.loadSessions(); // This ensures data loads AUTOMATICALLY on page load
  }

  loadSessions() {
    this.schedulingService.getSessions().subscribe(data => {
      this.sessions = data;
    });
  }

  createSession() {
    if(this.newSession.title) {
      this.schedulingService.createSession(this.newSession).subscribe(() => {
        this.loadSessions();
        this.showForm = false;
        this.newSession = { title: '', chair_id: 0 };
      });
    }
  }

  deleteSession(id: number) {
    if(confirm('Are you sure you want to delete this session?')) {
      this.schedulingService.deleteSession(id).subscribe(() => {
        this.loadSessions();
      });
    }
  }
}