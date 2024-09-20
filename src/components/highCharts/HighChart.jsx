import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo } from "react";

const sampleChartData = [
  { value: 0, status: 0 },
  { value: 0, status: 1 },
  { value: 1000, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 500, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: -1000, status: 1 },
  { value: 500, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 2 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 1 },
  { value: 0, status: 2 },
  { value: 0, status: 2 },
];

export const HighChart = () => {
  const breakdownPoint = useMemo(
    () => sampleChartData.findIndex((item) => item.status > 1),
    []
  );

  const precomputedData = useMemo(() => {
    const consumedData = sampleChartData.map((a, index) =>
      index <= breakdownPoint ? a.value : null
    );
    const estimatedData = sampleChartData.map((a, index) =>
      index >= breakdownPoint ? a.value : null
    );
    const targetValueData = Array(sampleChartData.length).fill(1000);
    const alarmValueData = Array(sampleChartData.length).fill(2000);
    const trendLineData = sampleChartData.map(
      (_, index) => (1000 / sampleChartData.length) * index
    );

    return {
      consumedData,
      estimatedData,
      targetValueData,
      alarmValueData,
      trendLineData,
    };
  }, [breakdownPoint]);

  const plotLines = useMemo(() => {
    const lineCount = Math.ceil(sampleChartData.length / 10); // Example logic for determining the number of plot lines
    return Array.from({ length: lineCount }, (_, i) => ({
      color: "grey",
      width: 2,
      value: i * 10,
      zIndex: 5,
    })).concat({
      color: "blue",
      dashStyle: "Dash",
      width: 2,
      value: breakdownPoint,
      zIndex: 5,
    });
  }, [breakdownPoint]);

  const options = {
    chart: { type: "spline" },
    title: { text: "Electric Demand Monitoring", align: "left" },
    xAxis: {
      title: { text: "Time (minutes)" },
      plotLines: plotLines,
      tickWidth: 1,
      tickInterval: 1,
      labels: {
        formatter: function () {
          return sampleChartData
            .map((_, index) => (index % 10 === 0 ? index : null))
            .filter((item) => item !== null)
            .includes(this.value)
            ? this.value
            : "";
        },
      },
    },
    yAxis: {
      max: 2500,
      min: 0,
      title: { text: "Demand (KW)" },
      tickInterval: 500,
      gridLineWidth: 1,
    },
    series: [
      {
        data: precomputedData.alarmValueData,
        name: "Alarm Value of Power",
        color: "red",
        lineWidth: 2,
        marker: { enabled: true, radius: 4, symbol: "circle" },
      },
      {
        data: precomputedData.targetValueData,
        name: "Target Value of Power",
        color: "yellow",
        lineWidth: 2,
        marker: { enabled: true, radius: 4, symbol: "circle" },
      },
      {
        data: precomputedData.trendLineData,
        color: "yellow",
        showInLegend: false,
        lineWidth: 2,
        marker: { enabled: true, radius: 4, symbol: "circle" },
      },
      {
        data: precomputedData.estimatedData,
        name: "Estimated Power",
        color: "grey",
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
        lineWidth: 2,
      },
      {
        data: precomputedData.consumedData,
        name: "Consumed WH in this term",
        color: "green",
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
        lineWidth: 2,
      },
    ],
    tooltip: { shared: true, valueSuffix: " W" },
    credits: { enabled: false },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
