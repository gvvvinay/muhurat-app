"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

// NOTE: In a real app, this should be in .env.local
// REACT_APP_GOOGLE_CLIENT_ID or NEXT_PUBLIC_...
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function GoogleOAuthWrapper({ children }: { children: React.ReactNode }) {
    if (!CLIENT_ID) {
        console.warn("Google Client ID is missing. Calendar features will be disabled.");
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
}
