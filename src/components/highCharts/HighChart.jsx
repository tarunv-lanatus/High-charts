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
  { value: 1000, status: 1 },
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
    let dataCount = 0;
    const consumedData = sampleChartData.map((a, index) => {
      if (index <= breakdownPoint) {
        dataCount = dataCount + a.value;
        return dataCount;
      }
      return null;
    });
    const estimatedData = sampleChartData.map((a, index) => {
      if (index >= breakdownPoint) {
        dataCount = dataCount + a.value;
        return dataCount;
      }
      return null;
    });
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
    const lineCount = Math.ceil(sampleChartData.length / 10);
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

  const dataWithMarkerForConsumedWHAndEstimatedPower = (data) => {
    return data.map((item, index) => {
      const previousValue = index > 0 ? data[index - 1] : null;
      const enabled = previousValue !== item || index === data.length - 1;
      return {
        y: item,
        marker: {
          enabled,
          radius: 4,
          symbol: "circle",
        },
      };
    });
  };

  const dataWithMarkerForOthers = (data) => {
    return data.map((item, index) => {
      const enabled = index === 0 || index === data.length - 1;
      return {
        y: item,
        marker: {
          enabled,
          radius: 4,
          symbol: "circle",
        },
      };
    });
  };

  const options = {
    chart: { type: "line" },
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
      min: 0,
      title: { text: "Demand (KW)" },
      tickInterval: 500,
      gridLineWidth: 1,
    },
    series: [
      {
        data: dataWithMarkerForOthers(precomputedData.alarmValueData),
        name: "Alarm Value of Power",
        color: "red",
        lineWidth: 2,
        enableMouseTracking: false,
        marker: {
          symbol: "circle",
        },
      },
      {
        data: dataWithMarkerForOthers(precomputedData.targetValueData),
        name: "Target Value of Power",
        color: "yellow",
        lineWidth: 2,
        enableMouseTracking: false,
        marker: {
          symbol: "circle",
        },
      },
      {
        data: dataWithMarkerForOthers(precomputedData.trendLineData),
        color: "yellow",
        showInLegend: false,
        lineWidth: 2,
        enableMouseTracking: false,
      },
      {
        data: dataWithMarkerForConsumedWHAndEstimatedPower(
          precomputedData.estimatedData
        ),
        name: "Estimated Power",
        color: "grey",
        lineWidth: 2,
        marker: {
          symbol: "circle",
        },
      },
      {
        data: dataWithMarkerForConsumedWHAndEstimatedPower(
          precomputedData.consumedData
        ),
        name: "Consumed WH in this term",
        color: "green",
        lineWidth: 2,
        marker: {
          symbol: "circle",
        },
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
