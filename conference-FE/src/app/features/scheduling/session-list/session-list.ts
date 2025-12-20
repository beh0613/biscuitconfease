import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { SchedulingService, Session } from '../../../services/scheduling';
import { FormsModule } from '@angular/forms'; // For the Create Form later

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], 
  template: `
    <div class="container" style="padding: 20px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Session Management</h2>
        <button (click)="showForm = !showForm" style="padding: 8px 16px; cursor: pointer;">
          {{ showForm ? 'Cancel' : '+ New Session' }}
        </button>
      </div>

      <div *ngIf="showForm" style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; background: #f9f9f9;">
        <h3>Create New Session</h3>
        <form (ngSubmit)="createSession()">
          <div style="margin-bottom: 10px;">
            <label>Title:</label>
            <input type="text" [(ngModel)]="newSession.title" name="title" required style="width: 100%; padding: 5px;">
          </div>
          <button type="submit" [disabled]="!newSession.title" style="padding: 5px 15px;">Save</button>
        </form>
      </div>

      <hr>

      <p *ngIf="sessions.length === 0">Loading sessions from Docker...</p>

      <table *ngIf="sessions.length > 0" border="1" cellpadding="10" cellspacing="0" style="width: 100%; margin-top: 20px;">
        <thead>
          <tr style="background: #eee;">
            <th>ID</th>
            <th>Title</th>
            <th>Chair ID</th>
            <th>Time Range</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let session of sessions">
            <td>{{ session.session_id }}</td>
            <td><strong>{{ session.title }}</strong></td>
            <td>{{ session.chair_id || 'N/A' }}</td>
            <td>
              <span *ngIf="session.start_time">
                {{ session.start_time | date:'short' }} - {{ session.end_time | date:'shortTime' }}
              </span>
              <span *ngIf="!session.start_time">Not Scheduled</span>
            </td>
            <td>
              <button (click)="deleteSession(session.session_id!)" style="color: red;">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  `
})
export class SessionListComponent implements OnInit {
  private schedulingService = inject(SchedulingService);
  
  sessions: Session[] = [];
  showForm = false;

  // Model for the Create Form
  newSession: Session = {
    title: '',
    event_id: 1, // Defaulting to 1 for now
    chair_id: 1  // Defaulting to 1 for now
  };

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.schedulingService.getSessions().subscribe({
      next: (data) => this.sessions = data,
      error: (err) => console.error('Error fetching sessions:', err)
    });
  }

  createSession() {
    this.schedulingService.createSession(this.newSession).subscribe({
      next: (savedSession) => {
        this.sessions.push(savedSession); // Add to list instantly
        this.newSession = { title: '', event_id: 1, chair_id: 1 }; // Reset form
        this.showForm = false; // Close form
      },
      error: (err) => alert('Failed to create session. Is the Backend running?')
    });
  }

  deleteSession(id: number) {
    if(confirm('Are you sure you want to delete this session?')) {
      this.schedulingService.deleteSession(id).subscribe({
        next: () => {
          this.sessions = this.sessions.filter(s => s.session_id !== id);
        }
      });
    }
  }
}