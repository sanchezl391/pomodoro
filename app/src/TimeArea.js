import React, {Component} from 'react';
import './TimeArea.css'

class TimeArea extends Component {
    render() {
        this.setMinutes = this.setMinutes.bind(this); 
        let input = <input className={this.props.inputClasses} placeholder="25" min="1" type="number" onChange={this.setMinutes}/>;
        
        if (this.props.title === "Break")
            input = <input className={this.props.inputClasses} placeholder="5" min="1" type="number" onChange={this.setMinutes}/>;
            let html = 
                <div className = 'row'>
                    <p className = 'title'> {this.props.title} </p>
                    {input}
                    <p className={this.props.displayClasses}>{this.props.minutes}</p>
                </div>;
        return html;
    }

    setMinutes(event) {
        let minutes = ~~event.target.value;
        // Clean up minutes here before calling function
        if(minutes < 1)
            event.target.value = minutes = 1;
        // Change this 
        let updateMinutesInParent = this.props.setMinutes.bind(this.props.ctx);
        updateMinutesInParent(minutes);
    }
}
  
export default TimeArea;