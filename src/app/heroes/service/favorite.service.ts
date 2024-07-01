import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Result } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: Result[] = [];
  private favoritesSubject = new BehaviorSubject<Result[]>([]);
  private favoriteCountSubject = new BehaviorSubject<number>(0);

  favorites$ = this.favoritesSubject.asObservable();
  favoriteCount$ = this.favoriteCountSubject.asObservable();

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  /**
   * Loads favorites from localStorage and updates the observables.
   */
  private loadFavoritesFromLocalStorage(): void {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.favoritesSubject.next(this.favorites);
      this.updateFavoriteCount();
    }
  }

  /**
   * Toggles a character in the favorites list.
   */
  toggleFavorite(character: Result): void {
    const index = this.favorites.findIndex(fav => fav.id === character.id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(character);
    }
    this.updateFavorites();
  }

  /**
   * Retrieves the list of favorite characters.
   */
  getFavorites(): Result[] {
    return this.favorites;
  }

  /**
   * Searches for characters in the favorites list by name.
   */
  searchFavorites(searchQuery: string): Result[] {
    if (searchQuery.trim() === '') {
      return this.getFavorites();
    }
    return this.favorites.filter(fav =>
      fav.name!.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  /**
   * Saves the favorites list to localStorage and updates the observables.
   */
  private updateFavorites(): void {
    this.saveFavoritesToLocalStorage();
    this.favoritesSubject.next(this.favorites);
    this.updateFavoriteCount();
  }

  /**
   * Saves the favorites list to localStorage.
   */
  private saveFavoritesToLocalStorage(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  /**
   * Updates the favorite count observable.
   */
  private updateFavoriteCount(): void {
    this.favoriteCountSubject.next(this.favorites.length);
  }
}
