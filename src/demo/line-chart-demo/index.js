import React from 'react';
import LineChart from '../../componenets/line-chart';
import data from './data';

class LineChartDemo extends React.Component {
  render() {
    const lineChartData = data.map(d => ({ x: d.date, y: d.close }));
    return (
      <div>
        <p>Line-Chart</p>
        <LineChart data={lineChartData} />
      </div>
    );
  }
}

export default LineChartDemo;
