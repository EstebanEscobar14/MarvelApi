import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result, TopLevel } from '../interfaces/character.interface';
import { ResultComics } from '../interfaces/comics.interface';

const URL_API = environment.apiMarvel;
const KEY_PUBLIC = environment.public_key;
const HASH = environment.hash;

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private charactersSource = new BehaviorSubject<Result[]>([]);
  characters$ = this.charactersSource.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Generates the complete API URL with the required parameters.
   */
  private getApiUrl(endpoint: string, params: string = ''): string {
    return `${URL_API}${endpoint}?ts=1&apikey=${KEY_PUBLIC}&hash=${HASH}${params}`;
  }

  /**
   * Filters and limits the characters array.
   */
  private processCharacters(results: Result[], limit: number): Result[] {
    return results
      .filter(character => character.thumbnail?.path && !character.thumbnail.path.includes('image_not_available'))
      .slice(0, limit);
  }

  /**
   * Fetches characters with a default limit of 50.
   */
  getCharacters(limit: number = 50): Observable<Result[]> {
    const url = this.getApiUrl('/characters', '&limit=100');
    return this.http.get<TopLevel>(url).pipe(
      map((data: TopLevel) => this.processCharacters(data.data.results, limit))
    );
  }

  /**
   * Searches for characters by name.
   */
  searchCharacters(query: string): Observable<Result[]> {
    const url = this.getApiUrl('/characters', `&nameStartsWith=${query}&limit=100`);
    return this.http.get<TopLevel>(url).pipe(
      map((data: TopLevel) => this.processCharacters(data.data.results, 50))
    );
  }

  /**
   * Fetches a character by its ID.
   */
  getCharacter(id: number): Observable<Result> {
    const url = this.getApiUrl(`/characters/${id}`);
    return this.http.get<TopLevel>(url).pipe(
      map((data: TopLevel) => data.data.results[0])
    );
  }

  /**
   * Fetches comics for a given character ID.
   */
  getCharacterComics(id: number): Observable<ResultComics[]> {
    const url = this.getApiUrl(`/characters/${id}/comics`);
    return this.http.get<TopLevel>(url).pipe(
      map((data: TopLevel) => data.data.results as unknown as ResultComics[])
    );
  }

  /**
   * Fetches multiple characters by their IDs.
   */
  getCharactersByIds(ids: number[]): Observable<Result[]> {
    const requests = ids.map(id => this.getCharacter(id));
    return forkJoin(requests);
  }

  /**
   * Updates the characters observable with new data.
   */
  updateCharacters(characters: Result[]): void {
    this.charactersSource.next(characters);
  }
}
