/**
 * Created by Xinhe on 2017/8/27.
 */
import React from 'react';
import Axis, {
  AxisTypes,
  AxisOrientation, AxisPosition,
} from '../../../componenets/basic/axis';

import data from './data';

class AxisDemo extends React.Component {
  infoText = text => (
    <text x={240} y={0} alignmentBaseline={'middle'} textAnchor={'end'}>
      {text}
    </text>
  )

  render() {
    const data1 = new Array(10).fill()
      .map(() => parseInt(Math.random() * 100, 10));

    const data2 = data.map(d => d.date);
    return (
      <div>
        <p>axis</p>
        <p style={{ 'text-align': 'left' }}> data: {data1.toString()}</p>
        <p style={{ 'text-align': 'left' }}> data2: {data2.toString()}</p>
        <svg width={'100%'} height={800}>
          <g transform={'translate(0,50)'}>
            {this.infoText('linear axis with default config')}
            <Axis
              transform={'translate(270,0)'}
              length={400}
              data={data1}
            />
          </g>

          <g transform={'translate(0,100)'}>
            {this.infoText('negative orientation')}
            <Axis
              transform={'translate(270,0)'}
              config={{
                axisType: AxisTypes.Linear,
                orientation: AxisOrientation.Negative,
                nice: true,
              }}
              minValue={-100}
              maxValue={300}
              length={400}
              data={data1}
            />
          </g>


          <g transform={'translate(0,150)'}>
            {this.infoText('time')}
            <Axis
              transform={'translate(270,0)'}
              config={{
                dateTimeFormat: '%d-%b-%y',
                tickTimeFormat: '%m-%d',
                axisType: AxisTypes.Time,
                tickCount: 5,
                nice: true,
              }}
              length={1000}
              data={data2}
            />
          </g>

          <g transform={'translate(0,200)'}>
            {this.infoText('custom ticks')}
            <Axis
              transform={'translate(270,0)'}
              config={{
                dateTimeFormat: '%d-%b-%y',
                tickTimeFormat: '%m-%d',
                axisType: AxisTypes.Time,
                nice: true,
                tickCount: 15,
                customTicks: (ticks) => {
                  ticks.style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', 'rotate(-65)');
                },
              }}
              length={1000}
              data={data2}
            />
          </g>

          <g transform={'translate(0,350)'}>
            {this.infoText('vertical')}
            <Axis
              transform={'translate(270,0)'}
              config={{
                axisType: AxisTypes.Linear,
                orientation: AxisOrientation.Negative,
                position: AxisPosition.Left,
                nice: true,
              }}
              minValue={-100}
              maxValue={300}
              length={400}
              data={data1}
            />
          </g>

        </svg>
      </div>
    );
  }
}

export default AxisDemo;
