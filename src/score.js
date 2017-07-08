import React, {Component, PropTypes} from 'react';
import 'rc-progress/assets/index.css';
import { Line as LineProgress } from 'rc-progress';

import * as imgs from './imgs';

const scoreLookup = {
  location: {score: 0, reference: 60, optimum: 200},
  catering: {score: 0, reference: 150, optimum: 200},
};
const sumOptima = Object.keys(scoreLookup)
                        .map(key => scoreLookup[key].optimum)
                        .reduce((acc, val) => acc + val, 0);

class Score extends Component {

  state = {
    curReference: scoreLookup.location.reference,
    curOptimum: scoreLookup.location.optimum,
    sumOptima: sumOptima,
    score: 0,
    meterWidth: 0,
    meterHorizontalMargin: 56,
  };

  render() {
    const styleInducedMeterFillOffset = 3;
    const scorePercent = scoreToPercent(this.state.score - styleInducedMeterFillOffset, this.state.sumOptima);
    let referencePercent = scoreToPercent(this.state.curReference, this.state.sumOptima);
    let optimumPercent = scoreToPercent(this.state.curOptimum, this.state.sumOptima);
    console.log("Score#render state.score", this.state.score, 'in percent', scorePercent);
    console.log("referencePercent", referencePercent);
    console.log("optimumPercent", optimumPercent);

    // account for the fact that pins have a certain width and offset the bar position to it
    const pinStyle = {
      width: '60px',
    };
    const styleInducedPinCenterOffset = 5;
    const pinCenter = (parseInt(pinStyle.width) / 2) + styleInducedPinCenterOffset;
    const offsetToCenterOfPins = pinCenter / this.state.meterWidth * 100;
    console.log("offsetToCenterOfPins", offsetToCenterOfPins);
    referencePercent -= offsetToCenterOfPins;
    optimumPercent -= offsetToCenterOfPins;

    // merge the actual pin positions to dedicated style objects
    const referencePinStyle = Object.assign({}, pinStyle, {left: referencePercent + "%"});
    const optimumPinStyle = Object.assign({}, pinStyle, {left: optimumPercent + "%"});

    const meterStyle = {margin: '20px ' + this.state.meterHorizontalMargin + 'px'};
    return (
      <div id="meter" style={meterStyle}>
        <div id="reference_pin" className="pin" style={referencePinStyle}>
          <span>R</span>
          <img src={imgs['pinBlue']} />
        </div>
        <div id="optimum_pin" className="pin" style={optimumPinStyle}>
          <span>O</span>
          <img src={imgs['pinGreen']} />
        </div>
        <LineProgress percent={scorePercent}
                      strokeWidth="1" strokeColor="#00FF00"
                      trailWidth="1" />
      </div>
    );
  }

  setScore(score, type) {
    console.log('Score#setScore type', type, 'score', score, "old score", this.state.score);
    if (type !== 'location') {
      // add to the old score, reference and optimum
      this.setState({
        score: score + scoreLookup['location'].score,
        curReference: scoreLookup[type].reference + scoreLookup['location'].reference,
        curOptimum: scoreLookup[type].optimum + scoreLookup['location'].optimum,
      });
    } else {
      // don't add anything, instead simply set to corresponding values
      scoreLookup[type].score = score;
      this.setState({
        score: score,
        curReference: scoreLookup[type].reference,
        curOptimum: scoreLookup[type].optimum,
      });
    }
  }

  updateMeterWidth() {
    this.setState({meterWidth: window.innerWidth - this.state.meterHorizontalMargin * 2});
    console.log("updateMeterWidth", window.innerWidth - this.state.meterHorizontalMargin * 2, window.innerWidth, this.state.meterHorizontalMargin);
  }

  componentWillMount() {
    this.updateMeterWidth();
    window.addEventListener('resize', this.updateMeterWidth.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMeterWidth);
  }

}

function scoreToPercent(score, optimum) {
  return score / optimum * 100;
}

export default Score;
