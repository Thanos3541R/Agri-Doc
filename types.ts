export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  alert?: string;
  location: string;
}

export interface DailyForecast {
  day: string;
  tempMax: number;
  tempMin: number;
  icon: any; // Lucide icon component
  condition: string;
  rainChance: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: any;
}

export interface DiagnosisResult {
  detectedCrop: string;
  detectedCropTamil: string;
  diseaseName: string;
  diseaseNameTamil: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  descriptionTamil: string;
  treatment: string[];
  treatmentTamil: string[];
  cause: string;
  isHealthy: boolean;
}

export interface HistoryItem {
  id: string;
  date: string;
  crop: string;
  imagePreview: string; // Base64
  diagnosis: DiagnosisResult;
}

export type CropType = 'Paddy' | 'Tomato' | 'Cotton' | 'Banana' | 'Chili' | 'Groundnut' | 'Sugarcane';

export interface TabItem {
  id: 'home' | 'scan' | 'history' | 'weather';
  label: string;
  labelTamil: string;
  icon: any;
}

export interface CropData {
  id: string;
  name: string;
  tamilName: string;
  type: 'Field Crop' | 'Vegetable' | 'Fruit' | 'Plantation' | 'Flower' | 'Spice' | 'Medicinal';
  description: string;
  soil: string;
  climate: string;
  water: string;
  iconName: string; // Helper to pick icon
}