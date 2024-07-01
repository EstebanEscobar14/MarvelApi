import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarvelService } from '../../service/marvel.service';
import { Result } from '../../interfaces/character.interface';
import { FavoriteService } from '../../service/favorite.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  characters: Result[] = [];
  searchQuery: string = '';
  @Input() searchInFavorites: boolean = false;
  @Output() search = new EventEmitter<string>();

  constructor(
    private marvelService: MarvelService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  /**
   * Loads the initial characters based on the search query and searchInFavorites flag.
   */
  private loadInitialCharacters(): void {
    this.getCharacters();
  }

  /**
   * Fetches characters based on the search query and searchInFavorites flag.
   */
  private getCharacters(): void {
    if (this.isSearchQueryEmpty()) {
      this.loadCharactersWhenQueryIsEmpty();
    } else {
      this.loadCharactersBasedOnQuery();
    }
  }

  /**
   * Checks if the search query is empty.
   */
  private isSearchQueryEmpty(): boolean {
    return this.searchQuery.trim() === '';
  }

  /**
   * Loads characters when the search query is empty.
   */
  private loadCharactersWhenQueryIsEmpty(): void {
    if (this.searchInFavorites) {
      this.characters = this.favoriteService.getFavorites();
    } else {
      this.marvelService.getCharacters(50).subscribe(data => {
        this.characters = data;
        this.marvelService.updateCharacters(data);
      });
    }
  }

  /**
   * Loads characters based on the search query.
   */
  private loadCharactersBasedOnQuery(): void {
    if (this.searchInFavorites) {
      this.characters = this.favoriteService.searchFavorites(this.searchQuery);
    } else {
      this.marvelService.searchCharacters(this.searchQuery).subscribe(data => {
        this.characters = data;
        this.marvelService.updateCharacters(data);
      });
    }
  }

  /**
   * Emits the search query and fetches characters based on the query.
   */
  searchCharacters(): void {
    this.search.emit(this.searchQuery);
    this.getCharacters();
  }
}
