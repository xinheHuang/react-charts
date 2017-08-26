/**
 * Created by Xinhe on 2017-08-25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { arc, area } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import { transition } from 'd3-transition';
import { select } from 'd3-selection';
import { easeLinear } from 'd3-ease';

const defaultConfig = {
  width: 250,
  height: 250,
  minValue: 0,
  maxValue: 100,
  circleThicknessRatio: 0.05,
  circleFillGapRatio: 0.05,
  circleColor: '#178BCA',

  waveHeightRatio: 0.05,
  waveCount: 1,
  waveRiseTime: 1000,
  waveAnimateTime: 18000,
  waveHeightScaling: true,
  waveRise: true,
  waveAnimate: true,
  waveOffset: 0,
  waveColor: '#178BCA',

  valueCountUp: true,
};

class LiquidFillGauge extends React.Component {
  // waveTransition = transition()
  //   .duration(750)
  //   .ease('linear');
  onRef = (ref) => {
    this.wave = ref;
    this.animateWave();
  }

  animateWave() {
    const wave = select(this.wave);
    const T = this.T;
    const waveAnimateTime = this.waveAnimateTime;
    wave.attr('transform', `translate(${this.waveAnimateScale(T)},0)`);
    console.log('duration', waveAnimateTime * (1 - T));
    const trans = transition()
      .duration(waveAnimateTime * (1 - T))
      .ease(easeLinear)
      .on('start', () => {
        console.log('start');
      })
      .on('end', () => {
        console.log('end');
        wave.attr('T', 0);
        this.animateWave(waveAnimateTime);
      });
    console.log('hear');
    wave.transition(trans)
      .attr('transform', `translate(${this.waveAnimateScale(1)},0)`)
      .attr('T', 1);
  }

  render() {
    const {
      value,
      elementId,
      config,
    } = this.props;
    const {
      width,
      height,
      circleThicknessRatio,
      circleFillGapRatio,
      circleColor,
      waveHeightScaling,
      waveHeightRatio,
      minValue,
      maxValue,
      waveOffset,
      waveCount,
      waveColor,
      waveAnimateTime,
      valueCountUp,
    } = { ...defaultConfig, ...config };
    const radius = Math.min(width, height) / 2;
    const circleThickness = circleThicknessRatio * radius;
    const circleFillGap = circleFillGapRatio * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    console.log(circleFillGapRatio);
    const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;
    const waveHeightScale = scaleLinear()
      .range(waveHeightScaling ? [0, waveHeightRatio, 0] : [waveHeightRatio, waveHeightRatio])
      .domain(waveHeightScaling ? [0, 50, 100] : [0, 100]);

    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
    const waveLength = (fillCircleRadius * 2) / waveCount;
    const waveClipCount = 1 + waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    const locationX = (width / 2) - radius;
    const locationY = (height / 2) - radius;

    // Scales for drawing the outer circle.
    const gaugeCircleX = scaleLinear()
      .range([0, 2 * Math.PI])
      .domain([0, 1]);
    const gaugeCircleY = scaleLinear()
      .range([0, radius])
      .domain([0, radius]);
    const gaugeCircleArc = arc()
      .startAngle(gaugeCircleX(0))
      .endAngle(gaugeCircleX(1))
      .outerRadius(gaugeCircleY(radius))
      .innerRadius(gaugeCircleY(radius - circleThickness));

    // Scales for controlling the size of the clipping path.
    const waveScaleX = scaleLinear()
      .range([0, waveClipWidth])
      .domain([0, 1]);
    const waveScaleY = scaleLinear()
      .range([0, waveHeight])
      .domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    const waveRiseScale = scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
      .range([(fillCircleMargin + (fillCircleRadius * 2) + waveHeight), (fillCircleMargin - waveHeight)])
      .domain([0, 1]);


    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i += 1) {
      data.push({ x: i / (40 * waveClipCount), y: (i / (40)) });
    }
    const clipArea = area()
      .x(d => waveScaleX(d.x))
      .y0(d => waveScaleY(Math.sin((Math.PI * 2 * waveOffset * (-1)) + (Math.PI * 2 * (1 - waveCount)) + (d.y * 2 * Math.PI))))
      .y1(d => (fillCircleRadius * 2 + waveHeight));
    console.log(data);
    data.forEach((d) => {
      console.log(waveScaleX(d.x));
      console.log(waveScaleY(Math.sin((Math.PI * 2 * waveOffset * (-1)) + (Math.PI * 2 * (1 - waveCount)) + (d.y * 2 * Math.PI))));
    });
    console.log(waveScaleX);
    console.log(waveScaleY);
    console.log(clipArea);
    console.log(clipArea(data));

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    const waveGroupXPosition = fillCircleMargin + (fillCircleRadius * 2) - waveClipWidth;
    // if (config.waveRise) {
    //   waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(0)})`)
    //     .transition()
    //     .duration(config.waveRiseTime)
    //     .attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`)
    //     .each('start', () => {
    //       wave.attr('transform', 'translate(1,0)');
    //     }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    // } else {
    //   waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`);
    // }

    this.waveAnimateScale = scaleLinear()
      .range([0, waveClipWidth - (fillCircleRadius * 2)]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    this.T = 0;
    this.waveAnimateTime = waveAnimateTime;

    // if (config.waveAnimate) animateWave();
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${locationX},${locationY})`}>
          <path
            d={gaugeCircleArc()}
            transform={`translate(${radius},${radius})`}
            style={{ fill: circleColor }}
          />
          <defs>
            <clipPath
              id={`clipWave${elementId}`}
              transform={`translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`}
            >
              <path ref={this.onRef} d={clipArea(data)} />
            </clipPath>
          </defs>

          <g clipPath={`url(#clipWave${elementId})`}>
            <circle
              cx={radius}
              cy={radius}
              r={fillCircleRadius}
              style={{ fill: waveColor }}
            />
          </g>
        </g>
      </svg>
    );
  }
}

LiquidFillGauge.propTypes = {
  config: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    circleThicknessRatio: PropTypes.number,
    circleColor: PropTypes.string,
  }),
  value: PropTypes.number.isRequired,
  elementId: PropTypes.string.isRequired,
};

LiquidFillGauge.defaultProps = {
  config: defaultConfig,
};

export default LiquidFillGauge;


/**
 export class App extends React.Component {
    state = {
        g: null,
    }

    onRef = (ref) => {
        this.setState({ g: d3.select(ref) }, () => this.renderBubbles(this.props.data))
    }

    renderBubbles(data) {
        const bubbles = this.state.g.selectAll('.bubble').data(data, d => d.id)

        // Exit
        bubbles.exit().remove()

        // Enter
        const bubblesE = bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        // Update
        // ...

        // can use animations like this now
        bubblesE.transition().duration(2000).attr('r', d => d.radius)
    }

    componentWillReceiveProps(nextProps) {
        // we have to handle the DOM ourselves now
        if (nextProps.data !== this.props.data) {
            this.renderBubbles(nextProps.data)
        }
    }

    shouldComponentUpdate() { return false }

    render() {
        const { width, height } = this.props
        return (
            <svg width={width} height={height}>
                <g ref={this.onRef} className="bubbles" />
            </svg>
        )
    }
}
 * */
