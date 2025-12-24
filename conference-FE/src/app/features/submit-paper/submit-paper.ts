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
    track_id: null, // This will be bound to the select dropdown
    submitted_by: 0  // Hardcoded to 1 as requested
  };

  ngOnInit() {
     this.userName = localStorage.getItem('email') || 'User';
        const userId = localStorage.getItem('user_id');
        if (userId) {
          this.paper.submitted_by = Number(userId);
        }

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
      next: (data) => {
        console.log('Keywords loaded:', data); // Check the console to see the correct property names
        this.keywords = data;

        // Do not auto-set if in edit mode
        if (this.keywords.length > 0 && !this.isEditMode) {
          this.paper.track_id = this.keywords[0].keyword_id;
        }
      },
      error: (err) => console.error('Keyword load failed', err)
    });
  }

  loadPaperForEdit(id: number) {
    this.http.get<any>(`http://localhost:8081/api/papers/${id}`).subscribe({
      next: (data) => {
        this.paper.title = data.title;
        this.paper.abstractText = data.abstractText;
        this.paper.track_id = data.track_id;
        this.paper.submitted_by = data.submitted_by || 1;
      },
      error: () => alert('Error loading paper details.')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please select a valid PDF file.');
      event.target.value = '';
    }
  }

  onSubmit() {
    if (!this.selectedFile && !this.isEditMode) {
      alert('Please select a PDF file to upload.');
      return;
    }

    // Double check that track_id is selected
    if (!this.paper.track_id) {
      alert('Please select a track (keyword).');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.paper.title);
    formData.append('abstractText', this.paper.abstractText);
    formData.append('track_id', this.paper.track_id.toString());
    formData.append('submitted_by', this.paper.submitted_by.toString());

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const url = this.isEditMode
      ? `http://localhost:8081/api/papers/${this.paperId}`
      : `http://localhost:8081/api/papers`;

    const request = this.isEditMode
      ? this.http.put(url, formData)
      : this.http.post(url, formData);

    request.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Paper updated successfully!' : 'Paper submitted successfully!');
        this.router.navigate(['/my-paper']);
      },
      error: (err) => {
        console.error('Submission failed:', err);
        alert(`Error ${err.status}: Check if User ID 1 and Track ID ${this.paper.track_id} exist in DB.`);
      }
    });
  }

  navigateToDashboard() {
    this.router.navigate(['/my-paper']);
  }
}
