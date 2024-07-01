import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MarvelService } from '../../service/marvel.service';
import { Result } from '../../interfaces/character.interface';
import { FavoriteService } from '../../service/favorite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  characters: Result[] = [];
  searchQuery: string = '';
  favoriteCount: number = 0;
  private favoritesSubscription: Subscription | undefined;

  constructor(
    private marvelService: MarvelService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize component: fetch characters and subscribe to favorite updates
    this.getCharacters();
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(() => {
      this.updateCharacters();
    });
  }

  /**
   * Fetches characters from MarvelService.
   */
  getCharacters(): void {
    this.marvelService.getCharacters(50).subscribe(data => {
      this.characters = data;
      this.updateCharacters();
    });
  }

  /**
   * Toggles the favorite status of a character.
   */
  toggleFavorite(character: Result): void {
    this.favoriteService.toggleFavorite(character);
  }

  /**
   * Updates each character's favorite status based on current favorites.
   */
  updateCharacters(): void {
    const favorites = this.favoriteService.getFavorites();
    this.characters.forEach(character => {
      character.isFavorite = favorites.some(fav => fav.id === character.id);
    });
    this.updateFavoriteCount();
  }

  /**
   * Updates the favorite count based on current favorites.
   */
  updateFavoriteCount(): void {
    this.favoriteCount = this.favoriteService.getFavorites().length;
  }

  /**
   * Navigates to the details page of a character.
   */
  goToDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigateByUrl(`/heroes/hero-details/${id}`);
    } else {
      console.error('Character ID is undefined');
    }
  }

  /**
   * Handles the search event and fetches characters based on the search query.
   */
  searchCharacters(query: string): void {
    this.searchQuery = query;
    if (this.searchQuery.trim() === '') {
      this.getCharacters(); // Fetch all characters if search query is empty
    } else {
      this.marvelService.searchCharacters(this.searchQuery).subscribe(data => {
        this.characters = data;
        this.updateCharacters();
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks
    this.favoritesSubscription?.unsubscribe();
  }
}
