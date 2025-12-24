import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-paper',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './my-paper.html',
  styleUrls: ['./my-paper.css']
})
export class MyPaperPage implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Essential for direct display

  userName: string = 'User';
  currentUserId: number | null = null;
  myPapers: any[] = [];
    selectedPaper: any = null;

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.userName = email || 'User';

    if (email) {
      this.identifyUserAndLoadData(email.trim().toLowerCase());
    }
  }

  identifyUserAndLoadData(email: string) {
    this.http.get<any[]>('http://localhost:8081/users').subscribe({
      next: (users) => {
        const user = users.find(u => u.email.trim().toLowerCase() === email);
        if (user) {
          this.currentUserId = user.user_id;
          // Step: Fetch papers immediately once user is identified
          this.loadMyPapers();
        }
      },
      error: (err) => console.error('User fetch failed', err)
    });
  }

  loadMyPapers() {
    this.http.get<any[]>('http://localhost:8081/api/papers').subscribe({
      next: (data) => {
        // Step: Filter and assign
        this.myPapers = data.filter(p => Number(p.submitted_by) === Number(this.currentUserId));

        // Step: Force Angular to update the UI immediately
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Papers fetch failed', err)
    });
  }

downloadPaper(paperId: number, fileName: string) {
  if (!fileName) {
    alert('No file associated with this paper.');
    return;
  }

  // Use your backend endpoint that serves the actual file
  const fileUrl = `http://localhost:8081/api/papers/download/${paperId}`;

  this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Use the original filename from the database
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed', err);
      alert('Could not download file. Please check if the file exists on the server.');
    }
  });
}

// DELETE: Remove paper from DB
  deletePaper(paperId: number) {
    if (confirm('Are you sure you want to permanently delete this submission?')) {
      this.http.delete(`http://localhost:8081/api/papers/${paperId}`).subscribe({
        next: () => {
          this.myPapers = this.myPapers.filter(p => p.paper_id !== paperId);
          this.cdr.detectChanges();
        },
        error: (err) => alert('Delete failed: ' + err.message)
      });
    }
  }

  // EDIT: Navigate to the submission page with the paper ID
  editPaper(paperId: number) {
    // Assuming your submit-paper component can handle an ID for editing
    this.router.navigate(['/submit-paper'], { queryParams: { edit: paperId } });
  }

  // VIEW DETAIL: Open a modal or overlay
  viewDetail(paper: any) {
    this.selectedPaper = paper;
  }

  closeDetail() {
    this.selectedPaper = null;
  }
}


