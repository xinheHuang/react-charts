/**
 * Created by Xinhe on 2017-08-25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const defaultConfig = {
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
  componentWillUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props.config) !== JSON.stringify(nextProps.config)) {
      this.createGauge(nextProps);
      return;
    }

    if (this.props.value !== nextProps.value) {
      console.log('newValue', nextProps.value);
      this.updateValue(nextProps.value);
    }
  }

  onRef = (ref) => {
    this.svg = d3.select((ref));
    this.createGauge(this.props);
    // this.setState({ svg: d3.select(ref) }, () => this.createGauge(this.props));
  }


  createGauge(props) {
    // this.ref.remove();
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

    const gauge = this.svg;
    gauge.html('');
    const radius = Math.min(width, height) / 2;
    const locationX = width / 2 - radius;
    const locationY = height / 2 - radius;
    const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue;

    let waveHeightScale;
    if (waveHeightScaling) {
      waveHeightScale = d3.scaleLinear()
        .range([0, waveHeightRatio, 0])
        .domain([0, 50, 100]);
    } else {
      waveHeightScale = d3.scaleLinear()
        .range([waveHeightRatio, waveHeightRatio])
        .domain([0, 100]);
    }

    const textPixels = (textSize * radius / 2);
    const textFinalValue = parseFloat(value)
      .toFixed(2);
    console.log('textFinalValue', textFinalValue);
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
      textRounder = v => parseFloat(v)
        .toFixed(1);
    }
    if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
      textRounder = v => parseFloat(v)
        .toFixed(2);
    }

    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i += 1) {
      data.push({ x: i / (40 * waveClipCount), y: (i / (40)) });
    }

    // Scales for drawing the outer circle.
    const gaugeCircleX = d3.scaleLinear()
      .range([0, 2 * Math.PI])
      .domain([0, 1]);
    const gaugeCircleY = d3.scaleLinear()
      .range([0, radius])
      .domain([0, radius]);

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3.scaleLinear()
      .range([0, waveClipWidth])
      .domain([0, 1]);
    const waveScaleY = d3.scaleLinear()
      .range([0, waveHeight])
      .domain([0, 1]);

    // Scales for controlling the position of the clipping path.
    const waveRiseScale = d3.scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
      .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
      .domain([0, 1]);
    const waveAnimateScale = d3.scaleLinear()
      .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
      .domain([0, 1]);

    // Scale for controlling the position of the text within the gauge.
    const textRiseScaleY = d3.scaleLinear()
      .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
      .domain([0, 1]);

    // Center the gauge within the parent SVG.
    const gaugeGroup = gauge.append('g')
      .attr('transform', `translate(${locationX},${locationY})`);

    // Draw the outer circle.
    const gaugeCircleArc = d3.arc()
      .startAngle(gaugeCircleX(0))
      .endAngle(gaugeCircleX(1))
      .outerRadius(gaugeCircleY(radius))
      .innerRadius(gaugeCircleY(radius - circleThickness));
    gaugeGroup.append('path')
      .attr('d', gaugeCircleArc)
      .style('fill', circleColor)
      .attr('transform', `translate(${radius},${radius})`);

    // Text where the wave does not overlap.
    console.log('text1', textRounder(textStartValue) + percentText);
    const text1 = gaugeGroup.append('text')
      .text(textRounder(textStartValue) + percentText)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${textPixels}px`)
      .style('fill', textColor)
      .attr('transform', `translate(${radius},${textRiseScaleY(textVertPosition)})`);

    // The clipping wave area.
    const clipArea = d3.area()
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
    console.log('text2', textRounder(textStartValue) + percentText);
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
        console.log(this.textContent);
        const i = d3.interpolate(this.textContent, textFinalValue);
        return (t) => {
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
        .on('start', () => {
          wave.attr('transform', 'translate(1,0)');
        }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and
      // waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is
      // actually necessary.
    } else {
      waveGroup.attr('transform', `translate(${waveGroupXPosition},${waveRiseScale(fillPercent)})`);
    }

    function animateWave() {
      console.log('animate Wave ', waveAnimateTime * (1 - wave.attr('T')));
      wave.attr('transform', `translate(${waveAnimateScale(wave.attr('T'))},0)`);
      wave.transition()
        .duration(waveAnimateTime * (1 - wave.attr('T')))
        .ease(d3.easeLinear)
        .attr('transform', `translate(${waveAnimateScale(1)},0)`)
        .attr('T', 1)
        .on('end', () => {
          wave.attr('T', 0);
          console.log('end');
          animateWave(waveAnimateTime);
        });
    }

    if (waveAnimate) animateWave();

    this.updateValue = (newVal) => {
      const newFinalValue = parseFloat(newVal)
        .toFixed(2);
      let textRounderUpdater = v => Math.round(v);
      if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
        textRounderUpdater = v => parseFloat(v)
          .toFixed(1);
      }
      if (parseFloat(newFinalValue) !== parseFloat(textRounderUpdater(newFinalValue))) {
        textRounderUpdater = v => parseFloat(v)
          .toFixed(2);
      }

      const textTween = function () {
        const i = d3.interpolate(this.textContent, parseFloat(newVal)
          .toFixed(2));
        return (t) => {
          this.textContent = textRounderUpdater(i(t)) + percentText;
        };
      };

      text1.transition()
        .duration(waveRiseTime)
        .tween('text', textTween);
      text2.transition()
        .duration(waveRiseTime)
        .tween('text', textTween);

      const newFillPercent = Math.max(minValue, Math.min(maxValue, newVal)) / maxValue;
      const newWaveHeight = fillCircleRadius * waveHeightScale(newFillPercent * 100);
      const newWaveRiseScale = d3.scaleLinear()
        .range([(fillCircleMargin + fillCircleRadius * 2 + newWaveHeight), (fillCircleMargin - newWaveHeight)])
        .domain([0, 1]);
      const newHeight = newWaveRiseScale(newFillPercent);
      const newWaveScaleX = d3.scaleLinear()
        .range([0, waveClipWidth])
        .domain([0, 1]);
      const newWaveScaleY = d3.scaleLinear()
        .range([0, newWaveHeight])
        .domain([0, 1]);
      let newClipArea;
      if (waveHeightScaling) {
        newClipArea = d3.area()
          .x(d => newWaveScaleX(d.x))
          .y0(d => newWaveScaleY(Math.sin(Math.PI * 2 * waveOffset * -1 + Math.PI * 2 * (1 - waveCount) + d.y * 2 * Math.PI)))
          .y1(d => (fillCircleRadius * 2 + newWaveHeight));
      } else {
        newClipArea = clipArea;
      }
      const newWavePosition = waveAnimate ? waveAnimateScale(1) : 0;
      wave.transition()
        .duration(0)
        .transition()
        .duration(waveAnimate ? (waveAnimateTime * (1 - wave.attr('T'))) : (waveRiseTime))
        .ease(d3.easeLinear)
        .attr('d', newClipArea)
        .attr('transform', `translate(${newWavePosition},0)`)
        .attr('T', '1')
        .on('end', () => {
          if (waveAnimate) {
            wave.attr('transform', `translate(${waveAnimateScale(0)},0)`);
            animateWave(waveAnimateTime);
          }
        });
      waveGroup.transition()
        .duration(waveRiseTime)
        .attr('transform', `translate(${waveGroupXPosition},${
          newHeight})`);
    };
  }

  render() {
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={this.onRef}
      />
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
