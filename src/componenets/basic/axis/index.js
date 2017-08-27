/**
 * Created by Xinhe on 2017/8/27.
 */
import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';


const AxisTypes = {
  Time: Symbol('Time'),
  Ordinary: Symbol('Ordinary'),
  Linear: Symbol('Linear'),
};

const AxisOrientation = {
  Positive: Symbol('Positive'),
  Negative: Symbol('Negative'),
};

const AxisPosition = {
  Left: Symbol('Left'),
  Right: Symbol('Right'),
  Top: Symbol('Top'),
  Bottom: Symbol('Bottom'),
};


const defaultConfig = {
  axisType: AxisTypes.Linear,
  orientation: AxisOrientation.Positive,
  position: AxisPosition.Bottom,
  dateTimeFormat: '%Y-%m-%d',
  showAxis: true,
  nice: false,
};

class Axis extends React.Component {
  onRef = (ref) => {
    this.axis = d3.select(ref);
    this.buildAxis(this.props);
  }

  buildAxis = (props) => {
    const {
      config,
      length,
      data,
      minValue,
      maxValue,
    } = props;
    const {
      axisType,
      orientation,
      position,
      dateTimeFormat,
      tickTimeFormat,
      showAxis,
      nice,
      tickCount,
      customTicks,
    } = { ...defaultConfig, ...config };
    let axis;
    console.log(config);
    console.log(axisType);

    // build scale
    const scale = this.buildScale({
      length,
      orientation,
      axisType,
    });

    // set domain
    let dataDomain;
    if (axisType === AxisTypes.Time) {
      const parseDate = d3.timeParse(dateTimeFormat);
      dataDomain = d3.extent(data, d => parseDate(d));
    } else {
      dataDomain = [d3.min(data), d3.max(data)];
    }

    if (minValue !== undefined) {
      dataDomain[0] = minValue;
    }
    if (maxValue !== undefined) {
      dataDomain[1] = maxValue;
    }
    console.log(dataDomain);
    scale.domain(dataDomain);

    if (nice) {
      scale.nice();
    }

    // set tick Orientation
    switch (position) {
      case AxisPosition.Left:
        axis = d3.axisLeft(scale);
        break;
      case AxisPosition.Right:
        axis = d3.axisRight(scale);
        break;
      case AxisPosition.Top:
        axis = d3.axisTop(scale);
        break;
      case AxisPosition.Bottom:
        axis = d3.axisBottom(scale);
        break;
      default:
        this.throwError();
    }
    if (tickCount !== undefined) {
      axis.ticks(tickCount);
    }

    if (axisType === AxisTypes.Time) {
      if (tickTimeFormat) {
        axis.tickFormat(d3.timeFormat(tickTimeFormat));
      }
    }
    this.axis.call(axis);

    if (showAxis === false) {
      this.axis.select('.domain')
        .remove();
    }


    const ticks = this.axis.selectAll('text');
    if (customTicks) {
      customTicks(ticks);
    }
  }

  throwError = () => {
    throw Error();
  }

  buildScale = ({ length, orientation, axisType }) => {
    let scale;
    let range;
    switch (orientation) {
      case AxisOrientation.Positive:
        range = [0, length];
        break;
      case AxisOrientation.Negative:
        range = [length, 0];
        break;
      default:
        this.throwError();
    }
    console.log(axisType);

    switch (axisType) {
      case AxisTypes.Time:
        scale = d3.scaleTime();
        break;
      case AxisTypes.Linear:
        scale = d3.scaleLinear();
        break;
      case AxisTypes.Ordinary:
        scale = d3.scaleOrdinal();
        break;
      default:
        this.throwError();
    }

    scale.range(range);
    return scale;
  }

  render() {
    return (
      <g ref={this.onRef} transform={this.props.transform} />
    );
  }
}

Axis.propTypes = {
  config: PropTypes.shape({
    axisType: PropTypes.oneOf(Object.values(AxisTypes)),
    orientation: PropTypes.oneOf(Object.values(AxisOrientation)),
    tickOrientation: PropTypes.oneOf(Object.values(AxisPosition)),
    dateTimeFormat: PropTypes.string,
    tickTimeFormat: PropTypes.string,
    nice: PropTypes.bool,
    customTicks: PropTypes.func,
    tickCount: PropTypes.number,
  }),
  length: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired).isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  transform: PropTypes.string,
};

Axis.defaultProps = {
  config: defaultConfig,
  minValue: undefined,
  maxValue: undefined,
  transform: undefined,
};

export { AxisTypes, AxisOrientation, AxisPosition };
export default Axis;
