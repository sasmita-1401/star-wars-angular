import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];
  loading = true;
  error: string | null = null;

  // ✅ Declare filters + dropdown data
  films: any[] = [];
  species: any[] = [];
  vehicles: any[] = [];
  starships: any[] = [];

  selectedMovie: string = '';
  selectedSpecies: string = '';
  selectedVehicle: string = '';
  selectedStarship: string = '';
  birthYearRange = { min: 0, max: 1000 };
  currentPage: number = 1;
  pageSize: number = 10; // how many characters per page
  totalPages: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Characters
    this.http.get<any>('https://swapi.info/api/people').subscribe({
    next: (res) => {
      this.characters = Array.isArray(res) ? res : res.results || [];
      this.filteredCharacters = [...this.characters];
      this.updatePagination();
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to fetch data';
      this.loading = false;
    }
  });

 

  }
updatePagination() {
  this.totalPages = Math.ceil(this.filteredCharacters.length / this.pageSize);
  this.currentPage = 1; // reset when filters change
}
applyFilters() {
  this.filteredCharacters = this.characters.filter(c => {
    let match = true;

    if (this.selectedMovie && !c.films?.includes(this.selectedMovie)) match = false;
    if (this.selectedSpecies && !c.species?.includes(this.selectedSpecies)) match = false;
    if (this.selectedVehicle && !c.vehicles?.includes(this.selectedVehicle)) match = false;
    if (this.selectedStarship && !c.starships?.includes(this.selectedStarship)) match = false;

    if (c.birth_year) {
      const year = parseInt(c.birth_year);
      if (!isNaN(year)) {
        if (year < this.birthYearRange.min || year > this.birthYearRange.max) match = false;
      }
    }

    return match;
  });

  this.updatePagination();
}
  get paginatedCharacters() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredCharacters.slice(start, end);
}
 setPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

  getCharacterId(url: string): string {
  return url.split('/').filter(part => part).pop() || '';
}
}