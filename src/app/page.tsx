"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActivitySelector from '@/components/ActivitySelector';
import LocationInput from '@/components/LocationInput';
import { ActivityType, LocationData } from '@/lib/types';
import { format } from 'date-fns';

export default function Home() {
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [location, setLocation] = useState<LocationData | null>(null);

  const handleCalculate = () => {
    if (!activity || !date || !location) return;

    const params = new URLSearchParams({
      activity,
      date,
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      city: location.city || '',
      tz: location.timezone
    });

    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Divine Timing</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Select an activity and date to find the most auspicious muhurat.
        </p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>1. What are you planning?</h2>
          <ActivitySelector
            selected={activity}
            onSelect={setActivity}
          />
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>2. When?</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              color: 'white',
              fontSize: '1rem',
              colorScheme: 'dark'
            }}
          />
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>3. Where?</h2>
          <LocationInput onLocationFound={setLocation} />
          {location && (
            <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,255,0,0.1)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              ✓ Location set: {location.city}
            </div>
          )}
        </section>

        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
          onClick={handleCalculate}
          disabled={!activity || !location}
        >
          Find Auspicious Times
        </button>
      </div>
    </main>
  );
}
