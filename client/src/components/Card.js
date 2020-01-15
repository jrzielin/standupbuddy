import React, {Component} from 'react';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoverItem: null
        };
    }

    handleMouseEnter = (e) => {
        this.setState({
            hoverItem: parseInt(e.target.id)
        });
    }

    handleMouseExit = (e) => {
        this.setState({hoverItem: null});
    }

    render() {
        const styles = {
            text: {
                color: 'white'
            },
            list: {
                paddingLeft: '10px'
            },
            completed: {
                textDecoration: 'line-through'
            },
            open: {
                textDecoration: 'none'
            }
        };

        return (
            <div className="card" style={this.props.style}>
                <div className="card-header">
                    <p className="card-header-title is-centered" style={styles.text}>{this.props.title}</p>
                </div>
                <div className="card-content">
                    <ol style={styles.list}>
                        {
                            this.props.items.map(item => {
                            return (
                            <li 
                                key={item.id} 
                                id={item.id} 
                                onClick={this.props.handleClick} 
                                style={item.completed ? styles.completed : styles.open}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseLeave={this.handleMouseExit}
                            >
                                {item.title}
                                {item.id === this.state.hoverItem && item.completed &&
                                    <div style={{textAlign: 'right', float: 'right'}}>
                                        <span className="icon" style={styles.icon} onClick={() => this.props.delete(`${item.id}`)}>
                                            <i className="fas fa-trash"></i>
                                        </span>
                                        <span className="icon" style={styles.icon} onClick={() => this.props.uncomplete(`${item.id}`)}>
                                            <i className="fas fa-check"></i>
                                        </span>
                                    </div>
                                }
                                {item.id === this.state.hoverItem && !item.completed &&
                                    <div style={{textAlign: 'right', float: 'right'}}>
                                        <span className="icon" style={styles.icon} onClick={() => this.props.delete(`${item.id}`)}>
                                            <i className="fas fa-trash"></i>
                                        </span>
                                        <span className="icon" style={styles.icon} onClick={() => this.props.complete(`${item.id}`)}>
                                            <i className="fas fa-check"></i>
                                        </span>
                                    </div>
                                }
                            </li> 
                            );
                        })
                        }
                    </ol>
                </div>
            </div>
        );
    }
}

export default Card;