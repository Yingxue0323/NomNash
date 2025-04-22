import { Component, Input } from "@angular/core"
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from "../star-rating/star-rating.component";

@Component({
  selector: "app-restaurant-card",
  templateUrl: "./restaurant-card.component.html",
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
})
export class RestaurantCardComponent {
  @Input() name = ""
  @Input() image = ""
  @Input() rating = 0
  @Input() reviews = 0
  @Input() cuisine = ""
  @Input() priceRange = ""
  @Input() location = ""
  @Input() phone = ""
}

