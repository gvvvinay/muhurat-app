"use client";

import { useState } from 'react';
import { LocationData } from '@/lib/types';

interface Props {
    onLocationFound: (loc: LocationData) => void;
}

export default function LocationInput({ onLocationFound }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualCity, setManualCity] = useState("");

    const handleGeoLocate = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, we would reverse geocode here to get City name.
                // For MVP, valid lat/long is enough for SunCalc.
                onLocationFound({
                    latitude,
                    longitude,
                    city: "Current Location",
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                });
                setLoading(false);
            },
            (err) => {
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    // Quick Mock for manual input since we don't have a Geocoding API key setup
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Defaulting to New Delhi coordinates if user types loosely, just for demo.
        // Ideally use Google Places Autocomplete or similar.
        onLocationFound({
            latitude: 28.6139,
            longitude: 77.2090,
            city: manualCity || "New Delhi (Default)",
            timezone: "Asia/Kolkata"
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGeoLocate}
                disabled={loading}
            >
                {loading ? "Locating..." : "📍 Use Current Location"}
            </button>

            {error && <p style={{ color: 'var(--hue-danger)', fontSize: '0.875rem' }}>{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Enter City Manual (Mock)"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'white'
                    }}
                />
                <button type="submit" className="btn btn-secondary">Set</button>
            </form>
        </div>
    );
}
