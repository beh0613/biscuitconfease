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

// 1. ADD THIS VARIABLE
  private apiBase = 'http://localhost:8081/api';

userName: string = 'User';
  currentUserId: number | null = null;
  myPapers: any[] = [];
    selectedPaper: any = null;
keywords: any[] = [];
  ngOnInit() {
    this.loadKeywords();
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

// NEW: Fetch keywords from the backend
  loadKeywords() {
    this.http.get<any[]>(`${this.apiBase}/keywords`).subscribe({
      next: (data) => {
        this.keywords = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Keyword load failed', err)
    });
  }

getKeywordName(trackId: number): string {
  if (!this.keywords || this.keywords.length === 0) return `Track ${trackId}`;

  const found = this.keywords.find((kw: any) => kw.keyword_id === trackId);

  // Try both 'name' and 'keyword_name' to be safe
  return found ? (found.name || found.keyword_name) : `Track ${trackId}`;
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

 // VIEW FILE: Opens PDF in a new browser tab
 viewFile(paperId: number) {
     // 2. Corrected the URL path to match your Backend
     const url = `${this.apiBase}/papers/${paperId}/download`;

     this.http.get(url, { responseType: 'blob' }).subscribe({
       next: (blob) => {
         const file = new Blob([blob], { type: 'application/pdf' });
         const fileURL = URL.createObjectURL(file);
         window.open(fileURL, '_blank');
         setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
       },
       error: (err) => {
         console.error('File View Error:', err);
         alert('Could not open manuscript. Verify the file exists on the server.');
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


