import { Component, Input } from "@angular/core"

@Component({
  selector: "app-restaurant-card",
  templateUrl: "./restaurant-card.component.html",
  standalone: true,
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

