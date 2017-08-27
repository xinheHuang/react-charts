import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Axis, { AxisOrientation, AxisPosition, AxisTypes } from '../basic/axis';

const defaultConfig = {};

class LineChart extends React.Component {
  onRef = (ref) => {
    this.linePath = d3.select(ref);
    this.createLine(this.props);
  }

  createLine = (props) => {
    console.log(props.config);
    // const line=d3.line().x()
  }

  render() {
    const margin = { ...LineChart.defaultProps.margin, ...this.props.margin };
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;
    const xData = this.props.data.map(d => d.x);
    const yData = this.props.data.map(d => d.y);
    console.log(this.props.config);
    return (
      <svg width={this.props.width} height={this.props.height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            length={width}
            transform={`translate(0,${height})`}
            data={xData}
            config={{
              dateTimeFormat: '%d-%b-%y',
              axisType: AxisTypes.Time,
              showAxis: false,
            }}
          />
          <Axis
            length={height}
            data={yData}
            config={{
              orientation: AxisOrientation.Negative,
              position: AxisPosition.Left,
              axisType: AxisTypes.Linear,
            }}
          />
          <path ref={this.onRef} />
        </g>
      </svg>
    );
  }
}

LineChart.propTypes = {
  config: PropTypes.shape({}),
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired).isRequired,
};

LineChart.defaultProps = {
  width: 1000,
  height: 500,
  margin: {
    left: 50,
    top: 20,
    right: 20,
    bottom: 30,
  },
};

export default LineChart;
