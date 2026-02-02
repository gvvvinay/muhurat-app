// src/lib/types.ts

export type ActivityType =
    | 'marriage'
    | 'business'
    | 'travel'
    | 'housewarming'
    | 'naming'
    | 'surgery'
    | 'interview'
    | 'exams'
    | 'spiritual'
    | 'other';

export interface LocationData {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    timezone: string;
}

export interface DateRange {
    start: Date;
    end: Date;
}

export type TimeQuality = 'auspicious' | 'neutral' | 'inauspicious' | 'mixed';

export interface TimeBlock {
    start: Date;
    end: Date;
    quality: TimeQuality;
    score: number; // 0-100, where 100 is best
    reason: string[]; // List of reasons (e.g. "Rahu Kalam", "Best Nakshatra")
    activity: ActivityType;
}

export interface PanchangData {
    sunrise: Date;
    sunset: Date;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    rahuKalam: { start: Date, end: Date };
    yamagandam: { start: Date, end: Date };
    gulika: { start: Date, end: Date };
    abhijit: { start: Date, end: Date };
}
