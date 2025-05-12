import { Component, OnInit } from "@angular/core";
import { FilterService, FilterOptions } from "../../services/filter.service";

@Component({
  selector: "app-search-form",
  templateUrl: "./search-form.component.html",
})
export class SearchFormComponent implements OnInit {
  filterOptions: FilterOptions = {
    rating: null,
    category: null,
    priceRange: null
  };

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    // 初始化组件
  }

  /**
   * Apply filter conditions
   */
  applyFilter(): void {
    this.filterService.applyFilters(this.filterOptions);
  }

  /**
   * Reset filter conditions
   */
  resetFilter(): void {
    this.filterOptions = {
      rating: null,
      category: null,
      priceRange: null
    };
    this.filterService.applyFilters(this.filterOptions);
  }
}

