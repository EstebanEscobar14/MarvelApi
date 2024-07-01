import { Component, OnInit } from '@angular/core';
import { Result } from '../../interfaces/character.interface';
import { Router } from '@angular/router';
import { FavoriteService } from '../../service/favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteCharacters: Result[] = [];
  searchQuery: string = '';

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize favoriteCharacters with all favorite characters
    this.loadFavoriteCharacters();
  }

  /**
   * Loads favorite characters from FavoriteService.
   */
  private loadFavoriteCharacters(): void {
    this.favoriteCharacters = this.favoriteService.getFavorites();
  }

  /**
   * Navigates to the character details page.
   */
  goToDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigateByUrl(`/heroes/hero-details/${id}`);
    } else {
      console.error('Character ID is undefined');
    }
  }

  /**
   * Handles the search event and updates the displayed favorite characters.
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    this.favoriteCharacters = this.favoriteService.searchFavorites(query);
  }
}
