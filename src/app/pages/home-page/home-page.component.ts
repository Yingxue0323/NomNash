import { Component } from "@angular/core"

interface Restaurant {
  name: string
  image: string
  rating: number
  reviews: number
  cuisine: string
  priceRange: string
  location: string
  phone: string
}

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
})
export class HomePageComponent {
  restaurants: Restaurant[] = [
    {
      name: "Bazar Tapas Bar and Restaurant",
      image: "/assets/images/placeholder.svg",
      rating: 4.5,
      reviews: 385,
      cuisine: "Tapas / Small Plates",
      priceRange: "$$$",
      location: "NoMad",
      phone: "(212) 510-8155",
    },
    {
      name: "Lupa",
      image: "/assets/images/placeholder.svg",
      rating: 4.5,
      reviews: 5653,
      cuisine: "Italian",
      priceRange: "$$$",
      location: "Greenwich Village",
      phone: "(212) 982-5089",
    },
    {
      name: "Crave Fishbar - Midtown",
      image: "/assets/images/placeholder.svg",
      rating: 4.5,
      reviews: 2373,
      cuisine: "Seafood",
      priceRange: "$$$",
      location: "Midtown East",
      phone: "(646) 895-9585",
    },
    {
      name: "TacoVision",
      image: "/assets/images/placeholder.svg",
      rating: 4.5,
      reviews: 506,
      cuisine: "Mexican",
      priceRange: "$$",
      location: "Midtown East",
      phone: "(646) 921-1990",
    },
    {
      name: "House of Lasagna",
      image: "/assets/images/placeholder.svg",
      rating: 4.5,
      reviews: 358,
      cuisine: "Italian",
      priceRange: "$$",
      location: "Murray Hill",
      phone: "(212) 883-9555",
    },
  ]
}

