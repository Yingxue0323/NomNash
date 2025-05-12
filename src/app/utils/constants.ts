// 餐厅类别枚举
export enum Category {
  CHINESE = 'CHINESE',
  ITALIAN = 'ITALIAN',
  JAPANESE = 'JAPANESE',
  MEXICAN = 'MEXICAN',
  AMERICAN = 'AMERICAN',
  INDIAN = 'INDIAN',
  THAI = 'THAI',
  MEDITERRANEAN = 'MEDITERRANEAN',
  KOREAN = 'KOREAN',
  VIETNAMESE = 'VIETNAMESE',
  FRENCH = 'FRENCH',
  SPANISH = 'SPANISH',
  OTHER = 'OTHER'
}

// 校区枚举
export enum Campus {
  MANHATTAN = 'MANHATTAN',
  BROOKLYN = 'BROOKLYN',
  QUEENS = 'QUEENS',
  BRONX = 'BRONX',
  STATEN_ISLAND = 'STATEN_ISLAND'
}

// 星期几枚举
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

// 导出常量数组
export const CATEGORIES = Object.values(Category);
export const CAMPUSES = Object.values(Campus);
export const DAYS_OF_WEEK = Object.values(DayOfWeek);

// 价格范围转换函数
export function formatPriceRange(priceRange: number[]): string {
  if (!priceRange || priceRange.length !== 2) {
    return '';
  }
  
  const min = priceRange[0];
  const max = priceRange[1];
  
  if (max <= 15) return '$';
  if (max <= 30) return '$$';
  if (max <= 50) return '$$$';
  return '$$$$';
}

// 将分钟数转换为时间字符串
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
} 