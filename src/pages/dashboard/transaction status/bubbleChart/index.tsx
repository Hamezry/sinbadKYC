import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { calculatePercentageRadius } from '../../../../utils';
import { useQuery } from 'react-query';
import { get_dashboard_stats_query } from '../../../../queries/dash_board';

ChartJS.register(LinearScale, PointElement, Tooltip);

export default function BubbleChart() {
  const {
    data: list,
    isLoading,
    isError,
  } = useQuery(get_dashboard_stats_query());

  if (isLoading) return <p>Loading....</p>;

  if (isError) return <p>Error!!!</p>;

  const total =
    list!.transactionStatus.failed +
    list!.transactionStatus.pending +
    list!.transactionStatus.successful;

  const successRadius = calculatePercentageRadius(
    list!.transactionStatus.successful,
    total
  );
  // console.log(list.transactionStatus.successful, 'here');
  const pendingRadius = calculatePercentageRadius(
    list!.transactionStatus.pending,
    total
  );
  const failedRadius = calculatePercentageRadius(
    list!.transactionStatus?.failed,
    total
  );

  const transactionStatus = {
    successful: list?.transactionStatus?.successful,
    failed: list?.transactionStatus?.failed,
    pending: list?.transactionStatus?.pending,
  };

  // const radius
  const data = {
    datasets: [
      {
        label: 'Success',
        extra: transactionStatus.successful,
        data: [
          {
            x: 190,
            y: 90,
            r: successRadius,
          },
        ],
        backgroundColor: 'rgba(101, 214, 191, 1)',
      },
      {
        label: 'Pending',
        extra: transactionStatus.pending,
        data: [
          {
            x: 100,
            y: 200,
            r: pendingRadius,
          },
        ],
        backgroundColor: 'rgba(249, 195, 98, 1)',
      },

      {
        label: 'Failed',
        extra: transactionStatus.failed,
        data: [
          {
            x: 310,
            y: 210,
            r: failedRadius,
          },
        ],
        backgroundColor: 'rgba(237, 85, 86, 1)',
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return context.dataset.label + ': ' + context.dataset.extra;
          },
        },
      },
      legend: {
        display: true,
        // position: 'bottom',
        // labels: {
        //   usePointStyle: true,
        // },

        labels: {
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;

            return datasets.map((data: any, i: any) => ({
              text: `${data.label} ${data.extra}`,
              fillStyle: data.backgroundColor,
              strokeStyle: data.backgroundColor,
              fontColor: data.backgroundColor,
            }));
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F0F0F0',
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
          gridLines: {
            drawBorder: false,
          },
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  return <Bubble options={options} data={data} />;
}
