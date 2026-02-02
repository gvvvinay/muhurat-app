import { ActivityType } from "./types";

export const ACTIVITIES: { id: ActivityType; label: string; icon: string }[] = [
    { id: 'marriage', label: 'Marriage', icon: '💍' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'housewarming', label: 'House Warming', icon: '🏡' },
    { id: 'naming', label: 'Naming Ceremony', icon: '👶' },
    { id: 'surgery', label: 'Surgery', icon: '🏥' },
    { id: 'interview', label: 'Job Interview', icon: '🤝' },
    { id: 'exams', label: 'Exams', icon: '📚' },
    { id: 'spiritual', label: 'Spiritual / Puja', icon: '🕉️' },
    { id: 'other', label: 'Other / General', icon: '⏳' },
];
