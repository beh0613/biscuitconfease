import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-papers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './all-papers.html',
  styleUrls: ['./all-papers.css']
})
export class AllPapersPage implements OnInit {
  private http = inject(HttpClient);

  allPapers: any[] = [];
  keywordsList: any[] = [];
  searchTerm: string = '';
  selectedTrack: number = 0;
  selectedStatus: string = '';
  selectedPaper: any = null;

  apiBase = 'http://localhost:8081/api';

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>(`${this.apiBase}/papers`).subscribe(data => this.allPapers = data);
    this.http.get<any[]>(`${this.apiBase}/keywords`).subscribe(data => this.keywordsList = data);
  }

  // Statistics Calculation
  get totalPapersCount(): number { return this.allPapers.length; }
  get papersUnderReviewCount(): number {
    return this.allPapers.filter(p => p.status?.toLowerCase() === 'under_review').length;
  }

  // Search and Filter Logic
  get filteredPapers() {
    return this.allPapers.filter(paper => {
      const searchSource = (paper.title || '') + (paper.abstractText || '');
      const matchesSearch = searchSource.toLowerCase().includes(this.searchTerm.toLowerCase());

      const paperTrackId = paper.track_id || paper.keyword_id;
      const matchesTrack = this.selectedTrack == 0 || paperTrackId == this.selectedTrack;

      const matchesStatus = !this.selectedStatus ||
                            paper.status?.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }

  openDetails(paper: any) { this.selectedPaper = paper; }
  closeDetails() { this.selectedPaper = null; }

  // VIEW FILE: Opens PDF in a new browser tab
 viewFile(paperId: number) {
   // Ensure the slash / is present between 'papers' and the ID variable
   const url = `${this.apiBase}/papers/${paperId}/download`;

   this.http.get(url, { responseType: 'blob' }).subscribe({
     next: (blob) => {
       const file = new Blob([blob], { type: 'application/pdf' });
       const fileURL = URL.createObjectURL(file);
       window.open(fileURL, '_blank');
       // Clean up the URL to prevent memory leaks
       setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
     },
     error: (err) => {
       console.error('File View Error:', err);
       alert('Could not open manuscript. Check if the backend is running on 8081.');
     }
   });
 }
}
