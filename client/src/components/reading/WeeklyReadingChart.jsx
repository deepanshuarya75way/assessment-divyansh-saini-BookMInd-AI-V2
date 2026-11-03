import React from 'react';
import{
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const WeeklyReadingChart = ({ data = []}) => {
  const chartData = data.map((item) => ({
    ...item,
    day:new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', {
      weekday:'short'
    })
  }));

  return (
    <div
    style = {{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px',
      width: '100%'
    }}
    >
      <h3 style={{marginTop :0, marginBottom:'20px'}}>
        Weekly Reading Activity
      </h3>

      {chartData.length == 0 ? (<p>No reading activity avilable</p>) :(
        <ResponsiveContainer width = '100%' height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray = "3 3" stroke="var(--border-color"/>
            <XAxis dataKey = "day"/>
            <YAxis allowDecimal = {false}/>
            <Tooltip/>
            <Bar
              dataKey = "pagesRead"
              name="Pages Read"
              fill="var(--accent-primary)"
              radius={[6,6,0,0]}
              />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}