import React, { Component } from 'react';
import './TimerMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../textFonts.css'

/**
 * this component is the menu used to set the session, break
 *  message
 */
class TimerMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: true,
            width: window.innerWidth,
            messageIsOpen: false,
            message: ''
        };
        this.handleMinuteBreakChange = this.handleMinuteBreakChange.bind(this);
        this.handleMinuteSessionChange = this.handleMinuteSessionChange.bind(this);
        this.updateWindowWidth = this.updateWindowWidth.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }
    render(){
        // let updateBreakMinutes = this.handleMinuteBreakChange.bind(this.props.ctx);
        // Will have closed and open states for the drawer
        // let setMessage = this.props.setMessage.bind(this);
        let drawerContainerClasses = 'timerMenuContainer open';
        let arrowIcon = this.getArrowIcon();

        let messageClasses = (this.state.messageIsOpen) ? 'messageTextDialog visible' : 'messageTextDialog hidden' ;
        let messageOverlayClasses = (this.state.messageIsOpen) ? 'messageOverlay visible' : 'messageOverlay hidden';
        let sessionInputClasses = (this.props.errorInSession) ? 'sourceCode regularText time errorInSession' : 'sourceCode regularText time';

        if(!this.state.open)
            drawerContainerClasses = 'timerMenuContainer closed';
            
        let html = 
            <div className={drawerContainerClasses}>
                <div className='drawerContainer'>
                    <div className="timerDrawerContainer">
                        <p className='ubuntu regularText drawerTitle'>TIMERS</p>
                        <div className="timerContainer">
                            <p className='ubuntu regularText timerType'>Work</p>
                            <input 
                                onChange={this.handleMinuteSessionChange}
                                className={sessionInputClasses} 
                                placeholder='25' 
                                type="number"
                                min={1}
                                required="required"
                                />
                        </div>
                        <div className="divider"></div>
                        <div className="timerContainer">
                            <p className='ubuntu regularText timerType'>Break</p>
                            <input 
                                onChange={this.handleMinuteBreakChange} 
                                className='sourceCode regularText time' 
                                // min={1} 
                                placeholder='5' 
                                type="number"/>
                        </div>
                        <div className="divider"></div>
                        <div className="timerContainer">
                            <p className='ubuntu regularText timerType'>Message</p>
                            <p onClick={() => {this.toggleMessageDialogState()}} className='title commentIcon'>
                                <FontAwesomeIcon icon='comment-alt'/>
                            </p>
                        </div>
                    </div>                
                    <div 
                        onClick={this.toggleDrawerState.bind(this)} 
                        className="arrowContainer">
                        {arrowIcon}
                    </div>
                </div>
                <div className={messageOverlayClasses}>
                    <div className={messageClasses}>
                        <p className='title closeDialogIcon'>
                            <FontAwesomeIcon 
                                onClick={() => {this.toggleMessageDialogState()}}
                                icon='times-circle'/>
                        </p>
                        <textarea 
                            className='regularText ubuntu'
                            onChange={this.handleMessageChange}
                            placeholder="Enter a message here to remind you to do a task when your session is done. E.g. Take out the trash and plan next day tasks."
                            >
                        </textarea>
                        <div 
                            className="saveBtn subheader ubuntu"
                            onClick={() => this.handleSaveMessageClicked(this.state.message)}
                            >
                                SAVE
                        </div>
                    </div>
                </div>
            </div>;

        return html;
    }

    /**
     * saves the message to be used for notification and closes message dialog
     * @param message the string to be shown in the push notification
     */
    handleSaveMessageClicked (message) {
        this.props.setMessage(message);
        this.toggleMessageDialogState();
    }

    /**
     * stores input for the message
     * @param e the event object 
     */
    handleMessageChange(e) {
        let message = e.target.value;
        this.setState((prevState, props) => ({
            open: prevState.open,
            width: prevState.width,
            messageIsOpen: prevState.messageIsOpen,
            message: message
        }));
    }

    /**
     * opens and closes message dialog box
     */
    toggleMessageDialogState() {
        this.setState((prevState, props) => ({
            open: prevState.open,
            width: prevState.width,
            messageIsOpen: !prevState.messageIsOpen
        }));
    }

    componentDidMount() {
        this.updateWindowWidth();
        window.addEventListener('resize', this.updateWindowWidth);
      }
      
    /**
     * stores the width of the window
     */
    updateWindowWidth() {
        this.setState((prevState, props) => ({
            width: window.innerWidth,
            open: prevState.open
        }));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowWidth);
    }

    /**
     * generates icon to be shown for the drawer depending on app layout
     */
    getArrowIcon() {
        let arrowIcon = <FontAwesomeIcon className='arrow' icon='caret-left'/>;
        let {open, width} = this.state;
        
        if(open) {
            if(width <= 575)
                arrowIcon = <FontAwesomeIcon className='arrow' icon='caret-up'/>;
        }
        else if(!open){
            if(width <= 575)
                arrowIcon = <FontAwesomeIcon className='arrow' icon='caret-down'/>;
            else    
                arrowIcon = <FontAwesomeIcon className='arrow' icon='caret-right'/>;
        }
        return arrowIcon;

    }

    /**
     * closes and opens the menu drawer
     */
    toggleDrawerState () {
        this.setState((prevState, props) => ({
            open: !this.state.open,
            width: prevState.width
        }));
    }

    /**
     * checks if the entered minutes are valid
     * @param e the event object
     */
    sanitizeMinutes(e) {
        let minutes = e.target.value;
        // handle invalid values of minutes
        if (minutes < 0){
            minutes = 0;
            e.target.value = minutes;
        }
        
        return minutes;
    }

    /**
     * stores the minutes for break
     * @param e the event object
     */
    handleMinuteBreakChange(e) {
        let minutes = this.sanitizeMinutes(e);

        // Change 'this'
        let updateMinutesInParent = this.props.setFinalBreakMinutes.bind(this.props.ctx);
        updateMinutesInParent(minutes);
    }
     /**
     * stores the minutes for session
     * @param e the event object
     */
    handleMinuteSessionChange(e) {
        let minutes = this.sanitizeMinutes(e);

        // Change 'this'
        let updateMinutesInParent = this.props.setFinalSessionMinutes.bind(this.props.ctx);
        updateMinutesInParent(minutes);
    }
}

export default TimerMenu;