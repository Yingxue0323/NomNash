import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router"
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { AppComponent } from "./app.component"
import { FooterComponent } from "./components/footer/footer.component"
import { RestaurantCardComponent } from "./components/restaurant-card/restaurant-card.component"
import { HomePageComponent } from "./pages/home-page/home-page.component"
import { StarRatingComponent } from "./components/star-rating/star-rating.component"
import { LaunchPageComponent } from "./pages/launch-page/launch-page.component"
import { SignUpPageComponent } from "./pages/sign-up-page/sign-up-page.component"
import { StudentProfileComponent } from "./pages/student-profile/student-profile.component"
import { BusinessProfileComponent } from "./pages/business-profile/business-profile.component"
import { ReviewPageComponent } from "./pages/review-page/review-page.component"
import { SearchFormComponent } from "./components/search-form/search-form.component"
import { HeaderComponent } from "./components/header/header.component"
import { HttpInterceptor } from "./http.interceptor"

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    SearchFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RestaurantCardComponent,
    StarRatingComponent,
    RouterModule.forRoot([
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "launch", component: LaunchPageComponent },
      { path: "home", component: HomePageComponent },
      { path: "signup", component: SignUpPageComponent },
      { path: "student", component: StudentProfileComponent },
      { path: "business", component: BusinessProfileComponent},
      { path: "review-page", component: ReviewPageComponent},
      { path: "restaurants/:id", component: ReviewPageComponent },
      { path: "profile", component: StudentProfileComponent },
      { path: "**", redirectTo: "home" },
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}

