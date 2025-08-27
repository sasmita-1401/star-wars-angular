import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,  // ✅ standalone component
  imports: [CommonModule, RouterModule,HttpClientModule, FormsModule], // ✅ import FormsModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Star Wars Characters';

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
this.http.get<any>('https://swapi.info/api/films').subscribe({
    next: (res) => {
      let filmslist = Array.isArray(res) ? res : res.results || [];
      this.films = [...filmslist];
    },
    error: () => {
      this.error = 'Failed to fetch data';
      this.loading = false;
    }
  });
  this.http.get<any>('https://swapi.info/api/species').subscribe({
    next: (res) => {
      let specieslist = Array.isArray(res) ? res : res.results || [];
      this.species = [...specieslist];
    },
    error: () => {
      this.error = 'Failed to fetch data';
      this.loading = false;
    }
  });  
  this.http.get<any>('https://swapi.info/api/vehicles').subscribe({
    next: (res) => {
      let vehicleslist = Array.isArray(res) ? res : res.results || [];
      this.vehicles = [...vehicleslist];
    },
    error: () => {
      this.error = 'Failed to fetch data';
      this.loading = false;
    }
  });
  this.http.get<any>('https://swapi.info/api/starships').subscribe({
    next: (res) => {
      let starshipslist = Array.isArray(res) ? res : res.results || [];
      this.starships = [...starshipslist];
    },
    error: () => {
      this.error = 'Failed to fetch data';
      this.loading = false;
    }
  });
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

updatePagination() {
  this.totalPages = Math.ceil(this.filteredCharacters.length / this.pageSize);
  this.currentPage = 1; // reset when filters change
}
getCharacterId(url: string): string {
  return url.split('/').filter(part => part).pop() || '';
}

}
