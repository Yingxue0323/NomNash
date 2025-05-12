import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Restaurant } from "../../models/restaurant.model";
import { formatPriceRange, CATEGORIES, Category } from "../../utils/constants";
import { FilterService, FilterOptions, ApiResponse } from "../../services/filter.service";
import { Subscription } from "rxjs";

interface RestaurantViewModel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number; // This field is not in the backend, using temporary value
  cuisine: string;
  priceRange: string;
  location: string;
  phone: string;
}

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
})
export class HomePageComponent implements OnInit, OnDestroy {
  // all restaurants
  allRestaurants: RestaurantViewModel[] = [];
  // filtered restaurants
  restaurants: RestaurantViewModel[] = [];
  isLoading = true;
  error: string | null = null;
  
  private filterSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    // 获取餐厅数据
    this.fetchRestaurants();
    
    // 订阅筛选事件
    this.filterSubscription = this.filterService.filters$.subscribe(filterOptions => {
      this.applyFilters(filterOptions);
    });
  }
  
  ngOnDestroy(): void {
    // 取消订阅，防止内存泄漏
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }
  
  /**
   * 在前端应用筛选条件
   */
  private applyFilters(filterOptions: FilterOptions): void {
    console.log('Applying filters:', filterOptions);
    console.log('All restaurants:', this.allRestaurants);
    
    // 检查是否有筛选条件
    const hasFilters = !(filterOptions.rating === null && 
                         filterOptions.category === null && 
                         filterOptions.priceRange === null);
    
    // 如果没有筛选条件，显示所有餐厅
    if (!hasFilters) {
      this.restaurants = [...this.allRestaurants];
      return;
    }
    
    // 应用筛选条件
    this.restaurants = this.allRestaurants.filter(restaurant => {
      console.log(`Checking restaurant: ${restaurant.name}, Rating: ${restaurant.rating}, Cuisine: ${restaurant.cuisine}, Price: ${restaurant.priceRange}`);
      
      // 评分筛选
      if (filterOptions.rating !== null) {
        if (restaurant.rating < filterOptions.rating) {
          console.log(`- Failed rating filter: ${restaurant.rating} < ${filterOptions.rating}`);
          return false;
        }
      }
      
      // 类别筛选
      if (filterOptions.category !== null) {
        if (restaurant.cuisine !== filterOptions.category) {
          console.log(`- Failed category filter: ${restaurant.cuisine} !== ${filterOptions.category}`);
          return false;
        }
      }
      
      // 价格范围筛选
      if (filterOptions.priceRange !== null) {
        // 将$, $$, $$$, $$$$转换为数值进行比较
        const priceValue = restaurant.priceRange.length * 20;
        if (priceValue > filterOptions.priceRange) {
          console.log(`- Failed price filter: ${priceValue} > ${filterOptions.priceRange}`);
          return false;
        }
      }
      
      console.log(`- Passed all filters`);
      return true;
    });
    
    console.log('Filtered restaurants:', this.restaurants);
  }

  fetchRestaurants(): void {
    this.isLoading = true;
    this.error = null;

    this.filterService.getAllRestaurants().subscribe({
      next: (response) => {
        console.log('API response received:', response);
        if (response && response.code === 2000 && Array.isArray(response.data)) {
          this.allRestaurants = this.mapRestaurantsToViewModel(response.data);
          this.restaurants = [...this.allRestaurants]; // 初始时显示所有餐厅
        } else {
          console.error('Invalid response format:', response);
          this.error = 'Invalid response format from server.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
        this.error = 'Unable to load restaurant data. Please try again later.';
        this.isLoading = false;
        
        // Use mock data in development environment
        if (err.status === 0) {
          this.useMockData();
        }
      }
    });
  }

  private mapRestaurantsToViewModel(restaurants: Restaurant[]): RestaurantViewModel[] {
    return restaurants.map(restaurant => ({
      id: restaurant._id || '',
      name: restaurant.name,
      image: restaurant.imagesUrl && restaurant.imagesUrl.length > 0 
        ? restaurant.imagesUrl[0] 
        : '/assets/images/placeholder.svg',
      rating: restaurant.rating,
      reviews: 0, // No review count information for now
      cuisine: restaurant.category, // category直接映射到cuisine
      priceRange: formatPriceRange(restaurant.priceRange),
      location: restaurant.campus,
      phone: restaurant.phone || 'N/A'
    }));
  }

  private useMockData(): void {
    const mockData = [
      {
        id: '1',
        name: "Bazar Tapas Bar and Restaurant",
        image: "/assets/images/placeholder.svg",
        rating: 4.5,
        reviews: 385,
        cuisine: "ITALIAN",
        priceRange: "$$$",
        location: "NoMad",
        phone: "(212) 510-8155",
      },
      {
        id: '2',
        name: "Lupa",
        image: "/assets/images/placeholder.svg",
        rating: 3.5,
        reviews: 5653,
        cuisine: "ITALIAN",
        priceRange: "$$$",
        location: "Greenwich Village",
        phone: "(212) 982-5089",
      },
      {
        id: '3',
        name: "Crave Fishbar - Midtown",
        image: "/assets/images/placeholder.svg",
        rating: 2.5,
        reviews: 2373,
        cuisine: "CHINESE",
        priceRange: "$$$",
        location: "Midtown East",
        phone: "(646) 895-9585",
      },
      {
        id: '4',
        name: "TacoVision",
        image: "/assets/images/placeholder.svg",
        rating: 4.7,
        reviews: 506,
        cuisine: "MEXICAN",
        priceRange: "$$",
        location: "Midtown East",
        phone: "(646) 921-1990",
      },
      {
        id: '5',
        name: "House of Lasagna",
        image: "/assets/images/placeholder.svg",
        rating: 4.2,
        reviews: 358,
        cuisine: "ITALIAN",
        priceRange: "$$",
        location: "Murray Hill",
        phone: "(212) 883-9555",
      },
    ];
    
    this.allRestaurants = mockData;
    this.restaurants = [...mockData];
  }
}

