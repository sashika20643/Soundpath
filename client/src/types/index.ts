// Global types for the application
export interface Event {
  id: string;
  title: string;
  heroImage?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  date?: string | null;
  tags?: string[] | null;
  instagramLink?: string | null;
  continent?: string | null;
  country?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  genreIds?: string[] | null;
  settingIds?: string[] | null;
  eventTypeIds?: string[] | null;
  approved?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'genre' | 'setting' | 'eventType';
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  continent: string;
  country: string;
  cities: string[];
}

export interface EventFilters {
  continent?: string;
  country?: string;
  city?: string;
  genreIds?: string[];
  settingIds?: string[];
  eventTypeIds?: string[];
  tags?: string[];
  search?: string;
  approved?: boolean;
}

export interface EventFormData {
  title: string;
  heroImage: string;
  shortDescription: string;
  longDescription: string;
  date: string;
  tags: string[];
  instagramLink: string;
  continent: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  genreIds: string[];
  settingIds: string[];
  eventTypeIds: string[];
  fromDashboard?: boolean;
  timestamp?: string;
  formType?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}