import { Routes } from '@angular/router';
import { CharacterDetailComponent } from './character-detail.component';
import { CharacterListComponent } from './character-list/character-list.component'; // small standalone list

export const routes: Routes = [
  { path: '', component: CharacterListComponent },
  { path: 'character/:id', component: CharacterDetailComponent }
];
