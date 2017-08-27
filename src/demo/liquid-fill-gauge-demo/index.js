import React from 'react';
import LiquidFillGauge from '../../componenets/liquid-fill-gauge';

class LiquidFillGaugeDemo extends React.Component {
  state = {
    value: 25,
  }

  componentDidMount() {
    this.interValId = setInterval(() => {
      this.setState({ value: Math.random() * 100 });
    }, 5000);
  }


  componentWillUnmount() {
    clearInterval(this.interValId);
  }

  render() {
    return (
      <div>
        <p>liquid-fill-gauge</p>
        <LiquidFillGauge
          value={55}
          elementId={'1'}
        />
        <LiquidFillGauge
          width={200}
          height={200}
          value={29}
          elementId={'2'}
          config={{
            circleColor: '#FF7777',
            textColor: '#FF4444',
            waveTextColor: '#FFAAAA',
            waveColor: '#FFDDDD',
            circleThicknessRatio: 0.2,
            textVertPosition: 0.2,
            waveAnimateTime: 1000,
          }}
        />
        <LiquidFillGauge
          value={this.state.value}
          height={150}
          width={250}
          elementId={'3'}
          config={{
            circleColor: '#D4AB6A',
            textColor: '#553300',
            waveTextColor: '#805615',
            waveColor: '#AA7D39',
            circleThicknessRatio: 0.1,
            circleFillGapRatio: 0.2,
            textVertPosition: 0.8,
            waveAnimateTime: 2000,
            waveHeightRatio: 0.3,
            waveCount: 1,
          }}
        />
      </div>
    );
  }
}

export default LiquidFillGaugeDemo;
