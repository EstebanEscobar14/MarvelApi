import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Result } from '../../interfaces/character.interface';
import { FavoriteService } from '../../service/favorite.service';
import { MarvelService } from '../../service/marvel.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {
  characters: Result[] = [];
  favoriteCount: number = 0;
  private charactersSubscription: Subscription | undefined;
  private favoritesSubscription: Subscription | undefined;

  constructor(
    private favoriteService: FavoriteService,
    private marvelService: MarvelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToCharacterUpdates();
    this.subscribeToFavoritesUpdates();
  }

  /**
   * Subscribes to character updates from MarvelService.
   */
  private subscribeToCharacterUpdates(): void {
    this.charactersSubscription = this.marvelService.characters$.subscribe(characters => {
      this.characters = characters;
      this.updateCharacters();
    });
  }

  /**
   * Subscribes to favorite updates from FavoriteService.
   */
  private subscribeToFavoritesUpdates(): void {
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(() => {
      this.updateCharacters();
    });
  }

  /**
   * Updates the character list to mark favorites.
   */
  private updateCharacters(): void {
    const favorites = this.favoriteService.getFavorites();
    this.characters.forEach(character => {
      character.isFavorite = favorites.some(fav => fav.id === character.id);
    });
    this.updateFavoriteCount();
  }

  /**
   * Updates the count of favorite characters.
   */
  private updateFavoriteCount(): void {
    this.favoriteCount = this.favoriteService.getFavorites().length;
  }

  /**
   * Toggles a character as a favorite.
   */
  toggleFavorite(character: Result): void {
    this.favoriteService.toggleFavorite(character);
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

  ngOnDestroy(): void {
    this.unsubscribeFromCharacterUpdates();
    this.unsubscribeFromFavoritesUpdates();
  }

  /**
   * Unsubscribes from character updates.
   */
  private unsubscribeFromCharacterUpdates(): void {
    this.charactersSubscription?.unsubscribe();
  }

  /**
   * Unsubscribes from favorite updates.
   */
  private unsubscribeFromFavoritesUpdates(): void {
    this.favoritesSubscription?.unsubscribe();
  }
}
