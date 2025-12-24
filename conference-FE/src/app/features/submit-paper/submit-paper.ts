import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-submit-paper',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './submit-paper.html',
  styleUrls: ['./submit-paper.css']
})
export class SubmitPaperComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  userName: string = 'User';
  keywords: any[] = [];
  isEditMode = false;
  paperId: number | null = null;
  selectedFile: File | null = null;

  paper: any = {
    title: '',
    abstractText: '',
    track_id: 0,
    status: 'submitted',
    submitted_by: 0,
    submission_file: '',
    file_type: 'PDF',
    version: 1
  };

  ngOnInit() {
    this.userName = localStorage.getItem('email') || 'User';
    const userId = localStorage.getItem('user_id');
    if (userId) this.paper.submitted_by = Number(userId);

    this.loadKeywords();

    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.isEditMode = true;
        this.paperId = Number(params['edit']);
        this.loadPaperForEdit(this.paperId);
      }
    });
  }

  loadKeywords() {
    this.http.get<any[]>('http://localhost:8081/api/keywords').subscribe({
      next: (data) => this.keywords = data,
      error: (err) => console.error('Keyword load failed', err)
    });
  }

  loadPaperForEdit(id: number) {
    this.http.get<any>(`http://localhost:8081/api/papers/${id}`).subscribe({
      next: (data) => this.paper = { ...data },
      error: () => alert('Error loading paper details.')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.paper.submission_file = file.name;
    } else alert('Please select a PDF file.');
  }

  onSubmit() {
    const formData = new FormData();
    if (this.selectedFile) formData.append('file', this.selectedFile);
    formData.append('paper', new Blob([JSON.stringify(this.paper)], { type: 'application/json' }));

    if (this.isEditMode) {
      this.http.put(`http://localhost:8081/api/papers/${this.paperId}`, formData).subscribe({
        next: () => { alert('Paper updated successfully!'); this.router.navigate(['/my-paper']); },
        error: () => alert('Update failed.')
      });
    } else {
      this.http.post('http://localhost:8081/api/papers', formData).subscribe({
        next: () => { alert('Paper submitted successfully!'); this.router.navigate(['/my-paper']); },
        error: () => alert('Submission failed.')
      });
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
