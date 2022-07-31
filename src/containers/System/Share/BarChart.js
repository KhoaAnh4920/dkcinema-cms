import React from "react";
import { Bar } from "react-chartjs-2";


export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
    },
  },
};

function BarChart({ chartData }) {
  return <Bar options={options} data={chartData} />;
}

export default BarChart;
