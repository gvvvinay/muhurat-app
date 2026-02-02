import SunCalc from 'suncalc';
import * as Astronomy from 'astronomy-engine';
import { AstroTime } from 'astronomy-engine';
import { PanchangData, LocationData } from './types';

// Data mapping for the 8 parts of the day
const RAHU_MAPPING = [7, 1, 6, 4, 5, 3, 2];
const YAMA_MAPPING = [4, 3, 2, 1, 0, 5, 6];
const GULIKA_MAPPING = [6, 5, 4, 3, 2, 1, 0];

const TITHI_NAMES = [
    "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
    "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
    "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima",
    "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
    "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
    "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"
];

const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const YOGA_NAMES = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

const KARANA_NAMES = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

function getSegmentTimes(sunrise: Date, sunset: Date, segmentIndex: number): { start: Date, end: Date } {
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const segmentDuration = dayDuration / 8;

    const start = new Date(sunrise.getTime() + (segmentIndex * segmentDuration));
    const end = new Date(start.getTime() + segmentDuration);

    return { start, end };
}

export function calculateSunTimes(date: Date, location: LocationData) {
    return SunCalc.getTimes(date, location.latitude, location.longitude);
}

function normalizeDegrees(deg: number) {
    deg = deg % 360;
    if (deg < 0) deg += 360;
    return deg;
}

export function calculatePanchang(date: Date, location: LocationData): PanchangData {
    const sunTimes = calculateSunTimes(date, location);
    const sunrise = sunTimes.sunrise;
    const sunset = sunTimes.sunset;

    // Abhijit Calculation
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const muhuratDuration = dayDuration / 15;
    const abhijitStart = new Date(sunrise.getTime() + (7 * muhuratDuration));
    const abhijitEnd = new Date(sunrise.getTime() + (8 * muhuratDuration));

    const dayIndex = date.getDay();

    // Kalams
    const rahuKalam = getSegmentTimes(sunrise, sunset, RAHU_MAPPING[dayIndex]);
    const yamagandam = getSegmentTimes(sunrise, sunset, YAMA_MAPPING[dayIndex]);
    const gulika = getSegmentTimes(sunrise, sunset, GULIKA_MAPPING[dayIndex]);

    // Astronomical Calculations at Sunrise
    const astroTime = new AstroTime(sunrise);

    // Use GeoVector for geocentric position, then Ecliptic for longitude
    const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, true);
    const sunLong = Astronomy.Ecliptic(sunVec).elon;

    const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true);
    const moonLong = Astronomy.Ecliptic(moonVec).elon;

    const sunDeg = normalizeDegrees(sunLong);
    const moonDeg = normalizeDegrees(moonLong);

    // Tithi: (Moon - Sun) / 12
    let tithiDiff = normalizeDegrees(moonDeg - sunDeg);
    const tithiIndex = Math.floor(tithiDiff / 12);
    const tithi = TITHI_NAMES[tithiIndex % 30] || "Unknown";

    // Nakshatra: Moon / 13.3333
    const nakshatraIndex = Math.floor(moonDeg / (360 / 27));
    const nakshatra = NAKSHATRA_NAMES[nakshatraIndex % 27] || "Unknown";

    // Yoga: (Sun + Moon) / 13.3333
    const yogaSum = normalizeDegrees(sunDeg + moonDeg);
    const yogaIndex = Math.floor(yogaSum / (360 / 27));
    const yoga = YOGA_NAMES[yogaIndex % 27] || "Unknown";

    // Karana: Half-tithi
    const karanaCalc = Math.floor(tithiDiff / 6);
    let karana = "";
    if (karanaCalc === 0) karana = "Kimstughna";
    else if (karanaCalc >= 57) {
        if (karanaCalc === 57) karana = "Shakuni";
        if (karanaCalc === 58) karana = "Chatushpada";
        if (karanaCalc === 59) karana = "Naga";
    } else {
        karana = KARANA_NAMES[(karanaCalc - 1) % 7] || "Unknown";
    }

    return {
        sunrise,
        sunset,
        tithi,
        nakshatra,
        yoga,
        karana,
        rahuKalam,
        yamagandam,
        gulika,
        abhijit: { start: abhijitStart, end: abhijitEnd }
    };
}
