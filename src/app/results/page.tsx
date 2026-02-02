"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { calculatePanchang } from '@/lib/calculations';
import { getConsultation } from '@/lib/rules';
import { ActivityType, PanchangData, LocationData } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import CalendarButton from '@/components/CalendarButton';

function ResultsContent() {
    const searchParams = useSearchParams();
    const [panchang, setPanchang] = useState<PanchangData | null>(null);
    const [consultation, setConsultation] = useState<{ isGoodNakshatra: boolean, avoidFactors: string[] } | null>(null);
    const [loading, setLoading] = useState(true);

    // Parse params
    const activity = searchParams.get('activity') as ActivityType;
    const dateStr = searchParams.get('date');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const city = searchParams.get('city');
    const tz = searchParams.get('tz') || 'UTC';

    useEffect(() => {
        if (activity && dateStr && lat && lng) {
            const date = parseISO(dateStr);
            const loc: LocationData = { latitude: lat, longitude: lng, city: city || 'Unknown', timezone: tz };

            const p = calculatePanchang(date, loc);
            const c = getConsultation(activity, p.nakshatra);

            setPanchang(p);
            setConsultation(c);
            setLoading(false);
        }
    }, [searchParams]);

    if (loading || !panchang || !consultation) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Calculating celestial positions...</div>;
    }

    const formatTime = (d: Date) => format(d, 'h:mm a');

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>← Back</Link>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Muhurat Report</h1>
            <p style={{ color: 'var(--text-muted)' }}>
                For <strong>{activity.toUpperCase()}</strong> on {format(parseISO(dateStr!), 'MMMM do, yyyy')} in {city}
            </p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '2rem' }}>
                {/* Main Status */}
                <div className="glass-panel">
                    <h2>Overall Status</h2>
                    <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                        Nakshatra Today: <strong style={{ color: 'var(--secondary)' }}>{panchang.nakshatra}</strong>
                    </div>
                    {consultation.isGoodNakshatra ? (
                        <div style={{ padding: '1rem', background: 'rgba(var(--hue-success), 0.2)', color: 'hsl(var(--hue-success), 80%, 70%)', borderRadius: 'var(--radius-sm)' }}>
                            ✅ Auspicious Day for {activity}
                        </div>
                    ) : (
                        <div style={{ padding: '1rem', background: 'rgba(255, 100, 100, 0.2)', color: '#ffaaaa', borderRadius: 'var(--radius-sm)' }}>
                            ⚠️ This Nakshatra is not traditionally recommended for {activity}. Proceed with caution or consult a pandit.
                        </div>
                    )}
                </div>

                {/* Time Windows */}
                <div className="glass-panel">
                    <h2>Time Windows</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <span>☀️ Sunrise: {formatTime(panchang.sunrise)}</span>
                            <span>🌙 Sunset: {formatTime(panchang.sunset)}</span>
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '1rem' }}>
                            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.25rem' }}>Abhijit Muhurat (Best Time) ✨</h4>
                            <p>{formatTime(panchang.abhijit.start)} — {formatTime(panchang.abhijit.end)}</p>
                        </div>

                        <div style={{ borderLeft: '3px solid #ff5555', paddingLeft: '1rem' }}>
                            <h4 style={{ color: '#ff5555', marginBottom: '0.25rem' }}>Rahu Kalam (Avoid) ⛔</h4>
                            <p>{formatTime(panchang.rahuKalam.start)} — {formatTime(panchang.rahuKalam.end)}</p>
                        </div>

                        <div style={{ borderLeft: '3px solid #ffaa55', paddingLeft: '1rem' }}>
                            <h4 style={{ color: '#ffaa55', marginBottom: '0.25rem' }}>Yamagandam (Avoid) ⚠️</h4>
                            <p>{formatTime(panchang.yamagandam.start)} — {formatTime(panchang.yamagandam.end)}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <h2>Panchang Details</h2>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Tithi:</strong> {panchang.tithi}</li>
                        <li><strong>Yoga:</strong> {panchang.yoga}</li>
                        <li><strong>Karana:</strong> {panchang.karana}</li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <CalendarButton
                    eventsToBlock={[
                        {
                            min: panchang.rahuKalam.start,
                            max: panchang.rahuKalam.end,
                            title: `⛔ Avoid: Rahu Kalam (${activity})`,
                            description: "Inauspicious time window to be avoided.",
                            colorId: '11' // Red
                        },
                        {
                            min: panchang.yamagandam.start,
                            max: panchang.yamagandam.end,
                            title: `⚠️ Avoid: Yamagandam (${activity})`,
                            description: "Inauspicious time window to be avoided.",
                            colorId: '6' // Orange
                        }
                    ]}
                />
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    This will block Rahu Kalam and Yamagandam on your calendar.
                </p>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading App...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
