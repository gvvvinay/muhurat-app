"use client";

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

interface Props {
    eventsToBlock: {
        min: Date;
        max: Date;
        title: string;
        description: string;
        colorId?: string; // '11' is red usually in Google Calendar api
    }[];
}

function CalendarAuthBtn({ eventsToBlock }: Props) {
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/calendar.events',
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                await createEvents(tokenResponse.access_token, eventsToBlock);
                alert(`Successfully blocked ${eventsToBlock.length} events!`);
            } catch (err) {
                console.error(err);
                alert("Failed to create events.");
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            alert("Login Failed");
        }
    });

    return (
        <button className="btn btn-primary" onClick={() => login()} disabled={loading}>
            {loading ? "Syncing..." : "📅 Block in Google Calendar"}
        </button>
    );
}

// Logic extracted to avoid closure issues if needed, but here simple enough.
async function createEvents(accessToken: string, events: Props['eventsToBlock']) {
    for (const evt of events) {
        const event = {
            'summary': evt.title,
            'description': evt.description,
            'start': {
                'dateTime': evt.min.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': evt.max.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'colorId': evt.colorId || '1'
        };

        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });
    }
}

export default function CalendarButton({ eventsToBlock }: Props) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        return (
            <button className="btn btn-secondary" disabled title="Setup Google Client ID in .env.local to enable this feature">
                ⚠️ Calendar Sync Disabled (Config Missing)
            </button>
        );
    }

    return <CalendarAuthBtn eventsToBlock={eventsToBlock} />;
}
