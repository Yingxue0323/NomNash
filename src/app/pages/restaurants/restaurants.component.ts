import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/database.service';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss'
})
export class RestaurantsComponent {

  restaurants: Restaurant[] = [];

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit() {
    this.db.findRestaurantByName().subscribe((restaurants: any) => {
      this.restaurants = restaurants;
    })
  }

}
