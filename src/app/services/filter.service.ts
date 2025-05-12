import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';

export interface FilterOptions {
  rating: number | null;
  category: string | null;
  priceRange: number | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // 添加Subject用于筛选通信
  private filterSubject = new Subject<FilterOptions>();
  public filters$ = this.filterSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * 应用筛选条件并通知订阅者
   */
  applyFilters(options: FilterOptions): void {
    this.filterSubject.next(options);
  }

  /**
   * 获取所有餐厅
   */
  getAllRestaurants(): Observable<ApiResponse<Restaurant[]>> {
    return this.http.get<ApiResponse<Restaurant[]>>('/api/v1/restaurants');
  }

  /**
   * 根据筛选条件获取餐厅
   * @param options 筛选选项
   */
  getFilteredRestaurants(options: FilterOptions): Observable<ApiResponse<Restaurant[]>> {
    let params = new HttpParams();
    
    if (options.rating !== null) {
      params = params.set('rating', options.rating.toString());
    }
    
    if (options.category !== null) {
      params = params.set('category', options.category);
    }
    
    if (options.priceRange !== null) {
      params = params.append('priceRange', options.priceRange.toString());
    }

    return this.http.get<ApiResponse<Restaurant[]>>('/api/v1/restaurants/filter', { params });
  }
  
  /**
   * 获取评分筛选选项
   */
  getRatingOptions() {
    return [
      { value: null, label: 'All Ratings' },
      { value: 4, label: '4+ Stars' },
      { value: 3, label: '3+ Stars' },
      { value: 2, label: '2+ Stars' },
      { value: 1, label: '1+ Stars' }
    ];
  }
  
  /**
   * 获取类别筛选选项
   */
  getCategoryOptions() {
    return [
      { value: null, label: 'All Categories' },
      { value: 'CAFE', label: 'Cafe' },
      { value: 'CHINESE', label: 'Chinese' },
      { value: 'SOUTH_EAST_ASIAN', label: 'South East Asian' },
      { value: 'JAPANESE', label: 'Japanese' },
      { value: 'MEXICAN', label: 'Mexican' },
      { value: 'ITALIAN', label: 'Italian' },
      { value: 'INDIAN', label: 'Indian' },
      { value: 'KOREAN', label: 'Korean' },
      { value: 'FAST_FOOD', label: 'Fast Food' },
      { value: 'BAR', label: 'Bar' },
      { value: 'PUB', label: 'Pub' },
      { value: 'OTHER', label: 'Other' }
    ];
  }
  
  /**
   * 获取价格范围筛选选项
   */
  getPriceRangeOptions() {
    return [
      { value: null, label: 'All Prices' },
      { value: 20, label: 'Under $20' },
      { value: 40, label: 'Under $40' },
      { value: 60, label: 'Under $60' },
      { value: 80, label: 'Under $80' }
    ];
  }
} 