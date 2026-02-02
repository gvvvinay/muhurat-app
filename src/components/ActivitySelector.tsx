"use client";

import { ACTIVITIES } from "@/lib/constants";
import { ActivityType } from "@/lib/types";
import styles from './ActivitySelector.module.css';

interface Props {
    selected: ActivityType | null;
    onSelect: (activity: ActivityType) => void;
}

export default function ActivitySelector({ selected, onSelect }: Props) {
    return (
        <div className={styles.grid}>
            {ACTIVITIES.map((act) => (
                <button
                    key={act.id}
                    onClick={() => onSelect(act.id)}
                    className={`${styles.card} ${selected === act.id ? styles.selected : ''}`}
                >
                    <span className={styles.icon}>{act.icon}</span>
                    <span className={styles.label}>{act.label}</span>
                </button>
            ))}
        </div>
    );
}
