/**
 * Created by Xinhe on 2017-08-25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

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

  textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 =
  // top.
  textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
  valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the
  // final value is displayed.
  displayPercent: true, // If true, a % symbol is displayed after the value.
  textColor: '#045681', // The color of the value text when the wave does not overlap it.
  waveTextColor: '#A4DBf8', // The color of the value text when the wave overlaps it.
};


class LiquidFillGauge extends React.Component {
  onRef = (ref) => {
    this.setState({ svg: d3.select(ref) }, () => this.createGauge(this.props));
  }

  createGauge(props) {
    // function loadLiquidFillGauge(elementId, value, config) {
    //   if (config == null) config = liquidFillGaugeDefaultSettings();
    //
    //
    //   function GaugeUpdater() {
    //     this.update = function (value) {
    //       var newFinalValue = parseFloat(value).toFixed(2);
    //       var textRounderUpdater = function (value) {
    //         return Math.round(value);
    //       };
    //       if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
    //         textRounderUpdater = function (value) {
    //           return parseFloat(value).toFixed(1);
    //         };
    //       }
    //       if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
    //         textRounderUpdater = function (value) {
    //           return parseFloat(value).toFixed(2);
    //         };
    //       }
    //
    //       var textTween = function () {
    //         var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
    //         return function (t) {
    //           this.textContent = textRounderUpdater(i(t)) + percentText;
    //         }
    //       };
    //
    //       text1.transition()
    //         .duration(config.waveRiseTime)
    //         .tween("text", textTween);
    //       text2.transition()
    //         .duration(config.waveRiseTime)
    //         .tween("text", textTween);
    //
    //       var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
    //       var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
    //       var waveRiseScale = d3.scale.linear()
    //       // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    //       // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    //       // circle at 100%.
    //         .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
    //         .domain([0, 1]);
    //       var newHeight = waveRiseScale(fillPercent);
    //       var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    //       var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);
    //       var newClipArea;
    //       if (config.waveHeightScaling) {
    //         newClipArea = d3.svg.area()
    //           .x(function (d) {
    //             return waveScaleX(d.x);
    //           })
    //           .y0(function (d) {
    //             return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 -
    // config.waveCount) + d.y * 2 * Math.PI)); }) .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); }); }
    // else { newClipArea = clipArea; }  var newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
    // wave.transition() .duration(0) .transition() .duration(config.waveAnimate ? (config.waveAnimateTime * (1 -
    // wave.attr('T'))) : (config.waveRiseTime)) .ease('linear') .attr('d', newClipArea) .attr('transform',
    // 'translate(' + newWavePosition + ',0)') .attr('T', '1') .each("end", function () { if (config.waveAnimate) {
    // wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)'); animateWave(config.waveAnimateTime); } });
    // waveGroup.transition() .duration(config.waveRiseTime) .attr('transform', 'translate(' + waveGroupXPosition + ','
    // + newHeight + ')') } }  return new GaugeUpdater(); }

    const width = this.props.width;
    const height = this.props.height;
    const {
      value,
      elementId,
      config,
    } = this.props;
    const {
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
      waveRise,
      waveRiseTime,
      waveAnimateTime,
      waveAnimate,
      valueCountUp,
      displayPercent,
      waveTextColor,
      textColor,
      textVertPosition,
      textSize,
    } = { ...defaultConfig, ...config };

    const gauge = this.state.svg;
    const radius = Math.min(width, height) / 2;
    const locationX = width / 2 - radius;
    const locationY = height / 2 - radius;
    const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;

    let waveHeightScale;
    if (waveHeightScaling) {
      waveHeightScale = d3.scale.linear()
        .range([0, waveHeightRatio, 0])
        .domain([0, 50, 100]);
    } else {
      waveHeightScale = d3.scale.linear()
        .range([waveHeightRatio, waveHeightRatio])
        .domain([0, 100]);
    }

    const textPixels = (textSize * radius / 2);
    const textFinalValue = parseFloat(value).toFixed(2);
    const textStartValue = valueCountUp ? minValue : textFinalValue;
    const percentText = displayPercent ? '%' : '';
    const circleThickness = circleThicknessRatio * radius;
    const circleFillGap = circleFillGapRatio * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = fillCircleRadius * 2 / waveCount;
    const waveClipCount = 1 + waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    let textRounder = v => Math.round(v);
    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = v => parseFloat(v).toFixed(1);
    }
    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = v => parseFloat(v).toFixed(2);
    }

    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i += 1) {
      data.push({ x: i / (40 * waveClipCount), y: (i / (40)) });
    }

    // Scales for drawing the outer circle.
    const gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
    const gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    const waveRiseScale = d3.scale.linear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
      .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
      .domain([0, 1]);
    const waveAnimateScale = d3.scale.linear()
      .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    // Scale for controlling the position of the text within the gauge.
    const textRiseScaleY = d3.scale.linear()
      .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
      .domain([0, 1]);

    // Center the gauge within the parent SVG.
    const gaugeGroup = gauge.append('g')
      .attr('transform', `translate(${locationX},${locationY})`);

    // Draw the outer circle.
    const gaugeCircleArc = d3.svg.arc()
      .startAngle(gaugeCircleX(0))
      .endAngle(gaugeCircleX(1))
      .outerRadius(gaugeCircleY(radius))
      .innerRadius(gaugeCircleY(radius - circleThickness));
    gaugeGroup.append('path')
      .attr('d', gaugeCircleArc)
      .style('fill', circleColor)
      .attr('transform', `translate(${radius},${radius})`);

    // Text where the wave does not overlap.
    const text1 = gaugeGroup.append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${textPixels}px`)
      .style('fill', textColor)
      .attr('transform', `translate(${radius},${textRiseScaleY(textVertPosition)})`);

    // The clipping wave area.
    const clipArea = d3.svg.area()
      .x(d => waveScaleX(d.x))
      .y0(d => waveScaleY(Math.sin(Math.PI * 2 * waveOffset * -1 + Math.PI * 2 * (1 - waveCount) + d.y * 2 * Math.PI)))
      .y1(d => (fillCircleRadius * 2 + waveHeight));
    const waveGroup = gaugeGroup.append('defs')
      .append('clipPath')
      .attr('id', `clipWave${elementId}`);
    const wave = waveGroup.append('path')
      .datum(data)
      .attr('d', clipArea)
      .attr('T', 0);

    // The inner circle with the clipping wave attached.
    const fillCircleGroup = gaugeGroup.append('g')
      .attr('clip-path', `url(#clipWave${elementId})`);
    fillCircleGroup.append('circle')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', fillCircleRadius)
      .style('fill', waveColor);

    // Text where the wave does overlap.
    const text2 = fillCircleGroup.append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${textPixels}px`)
      .style('fill', waveTextColor)
      .attr('transform', `translate(${radius},${textRiseScaleY(textVertPosition)})`);

    // Make the value count up.
    if (valueCountUp) {
      const textTween = function () {
        const i = d3.interpolate(this.textContent, textFinalValue);
        return function (t) {
          this.textContent = textRounder(i(t)) + percentText;
        };
      };
      text1.transition()
        .duration(waveRiseTime)
        .tween('text', textTween);
      text2.transition()
        .duration(waveRiseTime)
        .tween('text', textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled
    // independently.
    const waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (waveRise) {
      waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(0)})`)
        .transition()
        .duration(waveRiseTime)
        .attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`)
        .each('start', () => {
          wave.attr('transform', 'translate(1,0)');
        }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and
      // waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is
      // actually necessary.
    } else {
      waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`);
    }

    function animateWave() {
      wave.attr('transform', `translate(${waveAnimateScale(wave.attr('T'))},0)`);
      wave.transition()
        .duration(waveAnimateTime * (1 - wave.attr('T')))
        .ease('linear')
        .attr('transform', `translate(${waveAnimateScale(1)},0)`)
        .attr('T', 1)
        .each('end', () => {
          wave.attr('T', 0);
          animateWave(waveAnimateTime);
        });
    }

    if (waveAnimate) animateWave();
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height} ref={this.onRef} />
    );
  }
}

LiquidFillGauge.propTypes = {
  config: PropTypes.shape({
    circleThicknessRatio: PropTypes.number,
    circleColor: PropTypes.string,
  }),
  value: PropTypes.number.isRequired,
  elementId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

LiquidFillGauge.defaultProps = {
  config: defaultConfig,
  width: 250,
  height: 250,
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
