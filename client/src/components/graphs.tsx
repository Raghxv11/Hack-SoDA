import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Criterion {
  criteria: string;
  scored: string;
  total: string;
}

interface GraphProps {
  criteria: Criterion[];
}

const Graphs: React.FC<GraphProps> = ({ criteria }) => {
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

  const labels = Object.keys(uniqueCriteria);
  const scoredData = labels.map(label => uniqueCriteria[label].scored / uniqueCriteria[label].count);
  const totalData = labels.map(label => uniqueCriteria[label].total / uniqueCriteria[label].count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Scored',
        data: scoredData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total',
        data: totalData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...totalData) * 1.1, // Set max to 110% of the highest total score
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Grading Criteria Scores',
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graphs;