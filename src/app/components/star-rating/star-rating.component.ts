import { Component, Input } from "@angular/core"

@Component({
  selector: "app-star-rating",
  template: `
    <div class="flex">
      <ng-container *ngFor="let star of stars; let i = index">
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
          class="h-4 w-4">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </ng-container>
    </div>
  `,
})
export class StarRatingComponent {
  @Input() rating = 0
  stars = Array(5).fill(0)

  getStarClass(index: number): string {
    if (index < Math.floor(this.rating)) {
      return "fill-red-500 text-red-500"
    } else if (index === Math.floor(this.rating) && this.rating % 1 > 0) {
      return "fill-red-500/50 text-red-500"
    } else {
      return "fill-gray-200 text-gray-200"
    }
  }
}

