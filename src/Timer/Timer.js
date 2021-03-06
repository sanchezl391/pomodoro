import React, { Component } from 'react';
import './Timer.css'
import '../textFonts.css'

/**
 * this component shows the display for the timer
 */
class Timer extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            calculations:  this.getCalculationsObj(200, 5)
        };
        this.updateCircleRadius = this.updateCircleRadius.bind(this);
    }

    /**
     * generates an object that will be used to animate the timer circle
     * @param outerRadius the radius for the outer part of the circle
     * @param stroke the thickness of the circle
     */
    getCalculationsObj(outerRadius, stroke) {
        let innerRadius = outerRadius - stroke * 2;
        
        let circumference = innerRadius * 2 * Math.PI;
        return {
            outerRadius: outerRadius, 
            circumference: circumference,
            innerRadius: innerRadius,
            stroke: stroke
        };
    }

    render(){
        const {innerRadius, outerRadius, stroke, circumference} = this.state.calculations;
        let progress = this.props.progress;
        let timeStr = this.makeTimeStr();
        let type = (this.props.stateSession) ? 'WORK' : 'BREAK' ;

        // Dash offset is the starting point of the dasharray
        // Dasharray is similar or border
        const strokeDashoffset = circumference - progress / 100 * circumference;

        let html = 
            <div className='timerDisplayContainer'>
                <svg
                    className="progress-ring"
                    height={outerRadius * 2}
                    width={outerRadius * 2}
                    >
                    <circle
                        stroke="#3498db"
                        fill="transparent"
                        strokeWidth={ stroke }
                        strokeDasharray={ circumference + ' ' + circumference }
                        style={ { strokeDashoffset } }
                        r={ innerRadius }
                        cx={ outerRadius }
                        cy={ outerRadius }
                    />
                </svg>
                <div className="textContainer">
                    <p className='superTitle sourceCode minutesLeft'>{timeStr}</p>
                    <p className='subheader type ubuntu'>{type}</p>
                </div>
            </div>;
        return html;
    }

    componentDidMount() {
        this.updateCircleRadius();
        window.addEventListener('resize', this.updateCircleRadius);
      }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCircleRadius);
    }

    /**
     * changes the circle's size depending on screen size
     */
    updateCircleRadius() {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;

        let smallestDimension = (screenWidth < screenHeight) ? screenWidth : screenHeight;
        let buttonPixels = .3 * smallestDimension;
        
        let radius = (smallestDimension - buttonPixels)/ 2;
        this.setState((prevState, props) => ({
            calculations: this.getCalculationsObj(radius, 5)
        }));
    }

    /**
     * generates time string that will displayed on the timer
     */
    makeTimeStr() {
        let {breakSecondsLeft, sessionSecondsLeft, stateSession} = this.props;
        let minutes = (stateSession) ? ~~(sessionSecondsLeft / 60) : ~~(breakSecondsLeft / 60);
        let seconds = (stateSession) ? sessionSecondsLeft%60 : breakSecondsLeft%60;
        if(minutes < 10)
            minutes = '0' + minutes;
        if(seconds < 10)
            seconds = '0' + seconds;
        return minutes + ':' + seconds;
    }
}

export default Timer;