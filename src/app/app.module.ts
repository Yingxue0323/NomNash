import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router"
import { FormsModule } from '@angular/forms'

import { AppComponent } from "./app.component"
import { HeaderComponent } from "./components/header/header.component"
import { FooterComponent } from "./components/footer/footer.component"
import { RestaurantCardComponent } from "./components/restaurant-card/restaurant-card.component"
import { HomePageComponent } from "./pages/home-page/home-page.component"
import { SearchFormComponent } from "./components/search-form/search-form.component"
import { StarRatingComponent } from "./components/star-rating/star-rating.component"
import { LaunchPageComponent } from "./pages/launch-page/launch-page.component"
import { SignUpPageComponent } from "./pages/sign-up-page/sign-up-page.component"
import { StudentProfileComponent } from "./pages/student-profile/student-profile.component"

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RestaurantCardComponent,
    HomePageComponent,
    SearchFormComponent,
    StarRatingComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: LaunchPageComponent },
      { path: "signup", component: SignUpPageComponent },
      { path: "student", component: StudentProfileComponent},
      { path: "**", redirectTo: "" },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

