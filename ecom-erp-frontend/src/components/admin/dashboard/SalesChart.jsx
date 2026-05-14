import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getSalesOverview } from '../../../services/api'; // <-- import here
import './SalesChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await getSalesOverview(timeRange);

        const labels = response.data.map(item => {
          if (timeRange === 'daily') return new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' });
          if (timeRange === 'monthly') return new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
          return `Week ${item.week}`;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales ($)',
              data: response.data.map(item => item.amount),
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchSalesData();
  }, [timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="sales-chart-container">
      <div className="chart-header">
        <h3>Sales Performance</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-selector"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="chart-wrapper">
        {chartData ? <Line data={chartData} options={options} /> : <div>Loading chart...</div>}
      </div>
    </div>
  );
};

export default SalesChart;
