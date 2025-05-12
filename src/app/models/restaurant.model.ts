import { Category, Campus, DayOfWeek } from '../utils/constants';

export interface OpenTime {
  dayOfWeek: DayOfWeek;
  openTime: number;
  closeTime: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  category: Category;
  campus: Campus;
  address: string;
  priceRange: number[];
  phone?: string;
  websiteUrl?: string;
  imagesUrl: string[];
  rating: number;
  openTime: OpenTime[];
  createdAt: Date | string;
  updatedAt: Date | string;
} 