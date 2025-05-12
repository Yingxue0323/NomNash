import { Component, Input, Output, EventEmitter, HostListener } from "@angular/core"
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-star-rating",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex">
      <ng-container *ngFor="let star of stars; let i = index">
        <div class="star-container relative" 
             (mousemove)="interactive && onMouseMove($event, i)"
             (click)="interactive && onStarClick($event, i)">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            [ngClass]="getStarClass(i)"
            class="h-5 w-5 cursor-pointer">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .star-container {
      display: inline-block;
      position: relative;
      cursor: pointer;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() interactive = false;
  @Output() ratingChange = new EventEmitter<number>();
  
  stars = Array(5).fill(0);
  hoverRating: number | null = null;

  getStarClass(index: number): string {
    const currentRating = this.hoverRating !== null ? this.hoverRating : this.rating;
    
    if (index < Math.floor(currentRating)) {
      // Full star
      return "fill-red-500 text-red-500";
    } else if (index === Math.floor(currentRating) && currentRating % 1 >= 0.5) {
      // Half star
      return "fill-red-500/50 text-red-500";
    } else {
      // Empty star
      return "fill-gray-200 text-gray-200";
    }
  }
  
  onMouseMove(event: MouseEvent, starIndex: number): void {
    if (!this.interactive) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const width = rect.width;
    const position = event.clientX - rect.left;
    const percentage = position / width;
    
    // Calculate half or full star based on mouse position
    let value: number;
    if (percentage <= 0.5) {
      value = starIndex + 0.5; // Half star
    } else {
      value = starIndex + 1; // Full star
    }
    
    this.hoverRating = value;
  }
  
  onStarClick(event: MouseEvent, starIndex: number): void {
    if (!this.interactive) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const width = rect.width;
    const position = event.clientX - rect.left;
    const percentage = position / width;
    
    // Calculate half or full star based on click position
    let newRating: number;
    if (percentage <= 0.5) {
      newRating = starIndex + 0.5; // Half star
    } else {
      newRating = starIndex + 1; // Full star
    }
    
    this.rating = newRating;
    this.ratingChange.emit(this.rating);
  }
  
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hoverRating = null;
  }
}

