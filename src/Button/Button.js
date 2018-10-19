import React, { Component } from 'react';
import './Button.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Button extends Component{
    render(){
        let {stateActive, toggleState, ctx} = this.props;
        let toggle = toggleState.bind(ctx);
        let icon = (stateActive) ? 'pause' : 'play';

        let html = 
            <div className='buttonContainer'>
                <FontAwesomeIcon 
                    className={'btn ' +  icon + 'Btn'}
                    icon={ icon }
                    onClick={() => toggle()}
                />
            </div>;
        return html;
    }
}

export default Button;