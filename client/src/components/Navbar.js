import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Auth from '../helpers/Auth';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            burgerClass: 'navbar-burger burger',
            menuClass: 'navbar-menu'
        };
    }

    logout = (e) => {
        Auth.signout(() => this.props.history.push('/login'));
    }

    toggleMenu = (e) => {
        if(this.state.burgerClass === 'navbar-burger burger') {
            this.setState({burgerClass: 'navbar-burger burger is-active'});
        }
        else {
            this.setState({burgerClass: 'navbar-burger burger'});
        }

        if(this.state.menuClass === 'navbar-menu') {
            this.setState({menuClass: 'navbar-menu is-active'});
        }
        else {
            this.setState({menuClass: 'navbar-menu'});
        }        
    }

    render() {
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        Standup Buddy
                    </Link>
                    <a role="button" className={this.state.burgerClass} onClick={this.toggleMenu} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className={this.state.menuClass}>
                    <div className="navbar-start" />
                    <div className="navbar-end">
                        <div className="navbar-item">
                            { this.props.authenticated && 
                                <div className="buttons">
                                    <button className="button is-light" onClick={this.logout}>
                                        Log out
                                    </button>
                                </div>
                            }
                            { !this.props.authenticated && 
                                <div className="buttons">
                                    <Link className="button is-primary" to="/signup">
                                        <strong>Sign up</strong>
                                    </Link>
                                    <Link className="button is-light" to="/login">
                                        Log in
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default withRouter(Navbar);