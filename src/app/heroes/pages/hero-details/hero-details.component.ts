import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarvelService } from '../../service/marvel.service';
import { Result } from '../../interfaces/character.interface';
import { ResultComics, DateType } from '../../interfaces/comics.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css'],
})
export class HeroDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  hero: Result | null = null;
  comics: ResultComics[] = [];
  private routeSubscription: Subscription | undefined;
  private comicsSubscription: Subscription | undefined;
  @ViewChild('comicsSlider', { static: false }) comicsSlider!: ElementRef;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private marvelService: MarvelService
  ) {}

  ngOnInit(): void {
    // Subscribe to route params to get hero ID and fetch hero details
    this.routeSubscription = this.route.params.subscribe((params) => {
      const heroId = +params['id'];
      this.getHeroDetails(heroId);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.routeSubscription?.unsubscribe();
    this.comicsSubscription?.unsubscribe();
  }

  /**
   * Fetches hero details using MarvelService.s
   */
  getHeroDetails(id: number): void {
    this.marvelService.getCharacter(id).subscribe((data) => {
      this.hero = data;
      this.getHeroComics(id);
    });
  }

  /**
   * Fetches hero comics using MarvelService and sorts them by publication date.
   */
  getHeroComics(id: number): void {
    this.comicsSubscription = this.marvelService.getCharacterComics(id).subscribe((data: ResultComics[]) => {
      this.comics = data.sort((a, b) => {
        const dateA = this.getComicDate(a);
        const dateB = this.getComicDate(b);
        return dateA ? (dateB ? dateA.getTime() - dateB.getTime() : -1) : 1;
      });
    });
  }

  /**
   * Retrieves the publication date of a comic.
   */
  getComicDate(comic: ResultComics): Date | null {
    const publicationDate = comic.dates.find(date => date.type === DateType.OnsaleDate);
    return publicationDate ? new Date(publicationDate.date) : null;
  }

  ngAfterViewInit(): void {
    // Automatically scrolls the comics slider and updates the progress bar every 3 seconds
    setInterval(() => {
      const sliderElement: HTMLElement = this.comicsSlider.nativeElement;
      const scrollWidth = sliderElement.scrollWidth;
      const scrollPosition = sliderElement.scrollLeft;
      const visibleWidth = sliderElement.clientWidth;

      let newPosition = scrollPosition + visibleWidth;
      if (newPosition >= scrollWidth) {
        newPosition = 0;
      }

      sliderElement.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });

      const progressBarElement: HTMLElement = this.progressBar.nativeElement;
      progressBarElement.style.width = `${(newPosition / scrollWidth) * 100}%`;
    }, 3000);
  }

  /**
   * Retrieves the publication year of a comic.
   */
  getComicYear(comic: ResultComics): string {
    const publicationDate = comic.dates.find(date => date.type === DateType.OnsaleDate);
    if (publicationDate) {
      return new Date(publicationDate.date).getFullYear().toString();
    } else {
      return 'Year unknown';
    }
  }
}
