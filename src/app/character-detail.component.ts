import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  character: any;
  speciesName = 'Unknown';
  homeworldName = 'Unknown';
  movies: any[] = [];
  vehicles: any[] = [];
  starships: any[] = [];
  loading = true;
  error: string | null = null;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
      this.http.get<any>('https://swapi.info/api/films').subscribe({
    next: (res) => {
      let filmslist = Array.isArray(res) ? res : res.results || [];
      this.movies = [...filmslist];
      console.log(this.movies,"pooi")
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
    this.http.get<any>(`https://swapi.info/api/people/${id}/`).subscribe(res => {
      this.character = res;

      const requests: any[] = [];

      // Species
      if (res.species?.length > 0) {
        requests.push(this.http.get(res.species[0]));
      } else {
        requests.push(null);
      }
      if (res.homeworld) {
        requests.push(this.http.get(res.homeworld));
      } else {
        requests.push(null);
      }
    });
  }
}
