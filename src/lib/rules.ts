import { ActivityType } from './types';

// Simplified Auspicious Nakshatras for activities
// Source: Common Muhurat principles
const ACTIVITY_RULES: Record<ActivityType, { goodNakshatras: string[], avoidScale: string[] }> = {
    marriage: {
        goodNakshatras: ["Rohini", "Mrigashirsha", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
        avoidScale: ["Rahu Kalam", "Yamagandam"]
    },
    travel: {
        goodNakshatras: ["Ashwini", "Mrigashirsha", "Punarvasu", "Pushya", "Hasta", "Anuradha", "Shravana", "Dhanishtha", "Revati"],
        avoidScale: ["Rahu Kalam", "Yamagandam"]
    },
    business: {
        goodNakshatras: ["Ashwini", "Pushya", "Hasta", "Chitra", "Swati", "Anuradha", "Revati"],
        avoidScale: ["Rahu Kalam", "Yamagandam"]
    },
    housewarming: {
        goodNakshatras: ["Rohini", "Mrigashirsha", "Pushya", "Uttara Phalguni", "Hasta", "Chitra", "Anuradha", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
        avoidScale: ["Rahu Kalam", "Yamagandam", "Gulika"]
    },
    naming: { // Namakaran
        goodNakshatras: ["Ashwini", "Rohini", "Mrigashirsha", "Punarvasu", "Pushya", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Anuradha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Uttara Bhadrapada", "Revati"],
        avoidScale: ["Rahu Kalam"]
    },
    surgery: {
        goodNakshatras: ["Ashwini", "Ardra", "Ashlesha", "Jyeshtha", "Mula"], // Typically aggressive nakshatras might be okay for cutting? Actually often avoided. Let's use generic logic for now.
        avoidScale: ["Rahu Kalam", "Yamagandam"]
    },
    interview: {
        goodNakshatras: ["Ashwini", "Pushya", "Hasta", "Anuradha"],
        avoidScale: ["Rahu Kalam"]
    },
    exams: {
        goodNakshatras: ["Ashwini", "Pushya", "Hasta", "Shatabhisha"],
        avoidScale: ["Rahu Kalam"]
    },
    spiritual: {
        goodNakshatras: ["All"], // Generally any time is good for prayer, but avoiding Rahu Kalam is standard.
        avoidScale: ["Rahu Kalam"]
    },
    other: {
        goodNakshatras: [],
        avoidScale: ["Rahu Kalam", "Yamagandam"]
    }
};

export function getConsultation(activity: ActivityType, nakshatra: string) {
    const rules = ACTIVITY_RULES[activity] || ACTIVITY_RULES.other;
    const isGoodNakshatra = rules.goodNakshatras.includes(nakshatra) || rules.goodNakshatras.includes("All");

    return {
        isGoodNakshatra,
        avoidFactors: rules.avoidScale
    };
}
