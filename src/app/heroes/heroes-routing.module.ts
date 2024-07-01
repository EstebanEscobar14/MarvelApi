import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroDetailsComponent } from './pages/hero-details/hero-details.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { HeroComponent } from './pages/hero/hero.component';


const routes: Routes = [
  { path: 'heroes-page', component: HeroComponent },
  { path: 'hero-details/:id', component: HeroDetailsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', redirectTo: 'heroes-page', pathMatch: 'full' },
  { path: '**', redirectTo: 'heroes-page' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
