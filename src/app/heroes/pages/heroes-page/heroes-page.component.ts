// heroes-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteService } from '../../service/favorite.service';


@Component({
  selector: 'app-heroes-page',
  templateUrl: './heroes-page.component.html',
  styleUrls: ['./heroes-page.component.css']
})
export class HeroesPageComponent implements OnInit {
  favoriteCount: number = 0;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.favoriteService.favoriteCount$.subscribe(count => {
      this.favoriteCount = count;
    });
  }

  goToFavorites() {
    this.router.navigateByUrl(`/heroes/favorites`);
  }

  goToHome() {
    this.router.navigateByUrl(`/heroes/hero-page`);
  }
}
