import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const ReadingGoalSettings = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['reading-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/reading/stats');
      return response.data;
    }
  });

  const [annualBookGoal, setAnnualBookGoal] = useState(24);
  const [dailyPageGoal, setDailyPageGoal] = useState(30);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data?.goals) {
      setAnnualBookGoal(data.goals.annualBookGoal || 24);
      setDailyPageGoal(data.goals.dailyPageGoal || 30);
    }
  }, [data]);

  const updateGoals = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/reading/goals', {
        annualBookGoal: Number(annualBookGoal),
        dailyPageGoal: Number(dailyPageGoal)
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-stats'] });
      setMessage('Reading goals updated successfully!');
    },
    onError: (error) => {
      setMessage(
        error.response?.data?.message || 'Unable to update reading goals.'
      );
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    if (
      !Number.isInteger(Number(annualBookGoal)) ||
      !Number.isInteger(Number(dailyPageGoal)) ||
      Number(annualBookGoal) <= 0 ||
      Number(dailyPageGoal) <= 0
    ) {
      setMessage('Please enter valid positive whole numbers.');
      return;
    }

    updateGoals.mutate();
  };

  return (
    <section
      style={{
        padding: '20px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}
    >
      <h3 style={{ marginTop: 0 }}>Customize Reading Goals</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <label>
            Annual Book Goal
            <input
              type="number"
              min="1"
              value={annualBookGoal}
              onChange={(e) => setAnnualBookGoal(e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '6px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </label>

          <label>
            Daily Page Goal
            <input
              type="number"
              min="1"
              value={dailyPageGoal}
              onChange={(e) => setDailyPageGoal(e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginTop: '6px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </label>

          <button
            type="submit"
            disabled={updateGoals.isPending}
            style={{
              padding: '11px 18px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {updateGoals.isPending ? 'Saving...' : 'Save Goals'}
          </button>

          {message && <p role="status">{message}</p>}
        </div>
      </form>
    </section>
  );
};