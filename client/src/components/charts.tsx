import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Criterion {
  criteria: string;
  scored: string;
  total: string;
}

interface ChartProps {
  criteria: Criterion[];
}

const Charts: React.FC<ChartProps> = ({ criteria }) => {
  const uniqueCriteria = criteria.reduce((acc, curr) => {
    const key = curr.criteria.replace(':', '').trim();
    if (!acc[key]) {
      acc[key] = { scored: 0, total: 0, count: 0 };
    }
    acc[key].scored += parseFloat(curr.scored);
    acc[key].total += parseFloat(curr.total);
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { scored: number; total: number; count: number }>);

  const createChartData = (name: string, scored: number, total: number) => {
    return {
      labels: [name, 'Remaining'],
      datasets: [
        {
          data: [scored, total - scored],
          backgroundColor: ['#22c55e', '#FFCE56'],
          hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.entries(uniqueCriteria).map(([name, data], index) => (
        <div key={index} style={{ width: '300px', height: '300px', margin: '10px' }}>
          <h3>{`${name}: ${data.scored.toFixed(1)}/${data.total.toFixed(1)}`}</h3>
          <Pie data={createChartData(name, data.scored, data.total)} options={options} />
        </div>
      ))}
    </div>
  );
};

export default Charts;