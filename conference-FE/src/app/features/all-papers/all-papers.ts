import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  allPapers: any[] = [];
  keywordsList: any[] = [];
  searchTerm: string = '';
  selectedTrack: number = 0;
  selectedStatus: string = '';
  selectedPaper: any = null;

  // Base API matching your Docker setup
  apiBase = 'http://localhost:8081/api';

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>(`${this.apiBase}/papers`).subscribe(data => this.allPapers = data);
    this.http.get<any[]>(`${this.apiBase}/keywords`).subscribe(data => this.keywordsList = data);
  }

  // Statistics Getters
  get totalPapersCount(): number { return this.allPapers.length; }
  get papersUnderReviewCount(): number {
    return this.allPapers.filter(p => p.status?.toLowerCase() === 'under_review').length;
  }

  get filteredPapers() {
    return this.allPapers.filter(paper => {
      const searchSource = (paper.title || '') + (paper.abstractText || '');
      const matchesSearch = searchSource.toLowerCase().includes(this.searchTerm.toLowerCase());
      const paperTrackId = paper.keyword_id || paper.track_id;
      const matchesTrack = this.selectedTrack == 0 || paperTrackId == this.selectedTrack;
      const matchesStatus = !this.selectedStatus || paper.status?.toLowerCase() === this.selectedStatus.toLowerCase();
      return matchesSearch && matchesTrack && matchesStatus;
    });
  }

  openDetails(paper: any) { this.selectedPaper = paper; }
  closeDetails() { this.selectedPaper = null; }

  downloadFile(paperId: number) {
    this.http.get(`${this.apiBase}/papers/${paperId}/download`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Manuscript_${paperId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => alert('File not found in backend storage.')
      });
  }
}
