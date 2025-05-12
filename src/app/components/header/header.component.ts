import { Component } from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  constructor(public router: Router) {}

  findRestaurantByName(name: string) {
    if (name) {
      this.router.navigate(["/restaurant", name])
    } else {
      this.router.navigate(["/"])
    }
  }
}