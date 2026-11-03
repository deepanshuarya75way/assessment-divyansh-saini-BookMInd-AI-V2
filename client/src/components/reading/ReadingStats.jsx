import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  Flame,
  BookOpen,
  Target,
  CalendarCheck,
  Trophy
} from 'lucide-react';
import { WeeklyReadingChart } from './WeeklyReadingChart';

const fetchReadingStats = async () => {
  const response = await axios.get('/api/reading/stats');
  return response.data;
};

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div
    style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      minWidth: 0
    }}
  >
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <Icon size={21} color="var(--accent-primary)" />
    </div>

    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        {title}
      </p>
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)'
        }}
      >
        {value}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {subtitle}
      </p>
    </div>
  </div>
);

export const ReadingStats = () => {
  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['reading-stats'],
    queryFn: fetchReadingStats,
    staleTime: 60 * 1000,
    retry: 1
  });

  if (isLoading) {
    return (
      <div style={{ color: 'var(--text-secondary)', padding: '20px' }}>
        Loading your reading statistics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-secondary)'
        }}
      >
        Unable to load reading statistics. Please try again later.
      </div>
    );
  }

  const goals = data.goals || {};
  const streak = data.streak || {};
  const milestones = streak.milestones || {};

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}
        >
          Reading Goals & Streaks
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Track your reading consistency and progress.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={`${streak.currentStreak || 0} days`}
          subtitle="Consecutive reading days"
        />

        <StatCard
          icon={Trophy}
          title="Longest Streak"
          value={`${streak.longestStreak || 0} days`}
          subtitle="Your personal best"
        />

        <StatCard
          icon={BookOpen}
          title="Pages Read"
          value={streak.totalPagesRead || 0}
          subtitle="Total pages recorded"
        />

        <StatCard
          icon={CalendarCheck}
          title="Reading Days"
          value={streak.totalReadingDays || 0}
          subtitle="Days with reading activity"
        />
      </div>

      <WeeklyReadingChart data={streak.weeklyActivity || []} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Annual Book Goal
            </h3>
          </div>

          <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '12px' }}>
            {goals.annualBookGoal || 24} books
          </p>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Your target for this year
          </p>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Daily Page Goal
            </h3>
          </div>

          <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '12px' }}>
            {goals.dailyPageGoal || 30} pages
          </p>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Pages to read each day
          </p>
        </div>
      </div>

      <div
        style={{
          padding: '18px 20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ flex: 1, minWidth: '180px' }}>
          <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Streak Milestones
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Keep reading to unlock achievements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {milestones.sevenDay ? '🏅' : '🔒'} 7-day streak
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {milestones.thirtyDay ? '🏆' : '🔒'} 30-day streak
          </span>
        </div>
      </div>
    </section>
  );
};