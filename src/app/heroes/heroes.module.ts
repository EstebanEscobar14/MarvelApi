import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroesRoutingModule } from './heroes-routing.module';
import { HeroesPageComponent } from './pages/heroes-page/heroes-page.component';
import { HeroDetailsComponent } from './pages/hero-details/hero-details.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { HeroComponent } from './pages/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { HeartComponent } from './components/heart/heart.component';
import { CardComponent } from './components/card/card.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    HeroesPageComponent,
    HeroDetailsComponent,
    FavoritesComponent,
    HeroComponent,
    HeartComponent,
    CardComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    HeroesRoutingModule,
    FormsModule
  ]
})
export class HeroesModule { }
