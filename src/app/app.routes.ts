import { Routes } from '@angular/router';
import { LaunchPageComponent } from './pages/launch-page/launch-page.component';
// import { HomeComponent } from './home/home.component';
// import { RestaurantsComponent } from './restaurants/restaurants.component';
// import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';


export const routes: Routes = [
    { path: '', component: LaunchPageComponent}
];
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   { path: 'restaurants', component: RestaurantsComponent },
//   { path: 'restaurant/:id', component: RestaurantDetailComponent }
// ];
