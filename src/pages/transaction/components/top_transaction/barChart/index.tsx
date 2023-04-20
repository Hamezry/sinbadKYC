import { Bar } from 'react-chartjs-2';
import React from 'react';
// import { useTransactionCtx } from '../../../../../context';
import { t } from 'i18next';
import { useGetTransLocation } from '../../../../../queries';
import { useThemeCtx } from '../../../../../context/theme_context';

const BarChart = () => {
  const { theme } = useThemeCtx();
  const { data: stats, isError, isLoading } = useGetTransLocation();

  if (isLoading) return <p>Loading....</p>;

  if (isError) return <p>Error!!!</p>;

  const OPTIONS = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false,
        labels: {
          usePointStyle: true,
          pointStyle: 'rounded',
        },
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
    responsive: true,

    barThickness: 25,

    scales: {
      x: {
        gridLines: {
          skip: function (index: any, gridLines: any) {
            return index % 2 === 0;
          },
        },
        grid: {
          display: false,

          drawBorder: false,

          drawOnChartArea: false,

          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },

      y: {
        grid: {
          color: theme === 'dark' ? '#333233' : '#F0F0F0',

          drawBorder: false,
        },
      },
    },
  };
  const data = {
    labels: stats?.data.map((el): string => t(el.name)),

    datasets: [
      {
        label: '',
        backgroundColor: ['#38CB89', '#38CB89', '#38CB89', '#38CB89'],
        borderWidth: 1,
        hoverBackgroundColor: ['#38CB89', '#38CB89', '#38CB89', '#38CB89'],
        hoverBorderColor: ['#38CB89', '#38CB89', '#38CB89', '#38CB89'],
        data: stats?.data.map(
          (el): string | number => el.total_transactions_value
        ),
        borderRadius: Number.MAX_VALUE,
      },
    ],
  };
  return (
    <div className=' w-[100%]'>
      <Bar options={OPTIONS} data={data} />
    </div>
  );
};

export default BarChart;
