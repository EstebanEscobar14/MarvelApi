import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Result } from '../../interfaces/character.interface';
import { FavoriteService } from '../../service/favorite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.css']
})
export class HeartComponent implements OnInit, OnDestroy {
  @Input() character: Result = {} as Result;
  isFavorited = false;
  private favoritesSubscription: Subscription | undefined;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.subscribeToFavorites();
    this.updateFavoritedStatus();
  }

  /**
   * Subscribes to the favorites observable to update the favorited status when favorites change.
   */
  private subscribeToFavorites(): void {
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(() => {
      this.updateFavoritedStatus();
    });
  }

  /**
   * Updates the favorited status of the character.
   */
  private updateFavoritedStatus(): void {
    this.isFavorited = this.favoriteService.getFavorites().some(fav => fav.id === this.character.id);
  }

  /**
   * Toggles the character as a favorite.
   */
  toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.character);
  }

  ngOnDestroy(): void {
    this.unsubscribeFromFavorites();
  }

  /**
   * Unsubscribes from the favorites observable.
   */
  private unsubscribeFromFavorites(): void {
    this.favoritesSubscription?.unsubscribe();
  }
}
