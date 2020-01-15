import React, {Component} from 'react';
import './StandupList.css';
import Navbar from './Navbar';
import DateStepper from './DateStepper';
import AddForm from './AddForm';
import EditForm from './EditForm';
import Card from './Card';
import moment from 'moment';

class StandupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            yesterday: [],
            today: [],
            yesterdayForm: false,
            todayForm: false,
            newYesterdayText: '',
            newTodayText: '',
            editModal: false,
            editId: null,
            editTitle: '',
            editDescription: '',
            editCompleted: false,
            editYesterday: false,
            error: false,
            errorMsg: ''
        };
    }

    componentDidMount() {
        document.title = 'Standup Buddy | Items';
        this.fetchItems(this.state.date);
    }

    fetchItems = (date) => {
        let temp = date.clone();
        const dateString = temp.hours(23).minutes(59).seconds(59).utc().format();
        const url = '/api/items?item_date=' + dateString;

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: data.error
                });
                return;
            }

            let yesterday = [];
            let today = [];

            for(var i = 0; i < data.items.length; ++i) {
                const item = data.items[i];
                const itemDate = moment(item.item_date).format('YYYY-MM-DD');
                let tempString = date.clone();
                tempString = tempString.subtract(1, 'days');
                const todayString = date.format('YYYY-MM-DD');
                const yesterdayString = tempString.format('YYYY-MM-DD');
                
                if(todayString === itemDate) {
                    today.push(item);
                }
                else if(yesterdayString === itemDate) {
                    yesterday.push(item);
                }
                console.log({todayString, yesterdayString, itemDate});
            }
            
            this.setState({
                yesterday: yesterday,
                today: today
            });
        })
        .catch(error => {
            this.setState({
                error: true,
                errorMsg: 'Unable to fetch items'
            });
        });
    }

    yesterdayClick = (e) => {
        this.setState({
            yesterdayForm: true,
            todayForm: false
        });
    }

    todayClick = (e) => {
        this.setState({
            todayForm: true,
            yesterdayForm: false
        });
    }

    cancelYesterday = (e) => {
        this.setState({yesterdayForm: false});
    }

    cancelToday = (e) => {
        this.setState({todayForm: false});
    }

    yesterdayChange = (e) => {
        this.setState({newYesterdayText: e.target.value});        
    }

    todayChange = (e) => {
        this.setState({newTodayText: e.target.value});      
    }

    yesterdaySubmit = (e) => {
        e.preventDefault();
        const tempDate = this.state.date.clone();
        const yesterdayItemDate = tempDate.subtract(1, 'days').utc().format();

        if(!this.state.newYesterdayText.length) {
            return;
        }

        const url = '/api/items';

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.newYesterdayText,
                item_date: yesterdayItemDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: data.error,
                    yesterdayForm: false
                });
                return;
            }

            const item = data.item;
            let yesterday = this.state.yesterday;
            
            yesterday.push(item);

            this.setState({
                yesterday: yesterday,
                newYesterdayText: '',
                yesterdayForm: false
            });
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to add item',
                yesterdayForm: false
            });
        });
    }

    todaySubmit = (e) => {
        e.preventDefault();
        const tempDate = this.state.date.clone();
        const dateString = tempDate.utc().format();

        if(!this.state.newTodayText.length) {
            return;
        }

        const url = '/api/items';

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.newTodayText,
                item_date: dateString
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: data.error,
                    todayForm: false
                });
                return;
            }

            const item = data.item;
            let today = this.state.today;
            
            today.push(item);

            this.setState({
                today: today,
                newTodayText: '',
                todayForm: false
            });
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to add item',
                todayForm: false
            });
        });
    }

    backwardStep = (e) => {
        const tempDate = this.state.date.clone();
        let date = tempDate.subtract(1, 'days');
        this.setState({
            date: date,
            dateInputShow: false
        });
        this.fetchItems(date);
    }

    forwardStep = (e) => {
        const tempDate = this.state.date.clone();
        let date = tempDate.add(1, 'days');
        this.setState({
            date: date,
            dateInputShow: false
        });
        this.fetchItems(date);
    }

    editYesterdayClick = (e) => {
        const id = parseInt(e.target.id);

        for(let i = 0; i < this.state.yesterday.length; ++i) {
            const item = this.state.yesterday[i];
            if(item.id === id) {
                this.setState({
                    editId: item.id,
                    editTitle: item.title,
                    editDescription: item.description,
                    editCompleted: item.completed,
                    editModal: true,
                    editYesterday: true
                });
                return;
            }
        }
    }

    editTodayClick = (e) => {
        const id = parseInt(e.target.id);

        for(let i = 0; i < this.state.today.length; ++i) {
            const item = this.state.today[i];
            if(item.id === id) {
                this.setState({
                    editId: item.id,
                    editTitle: item.title,
                    editDescription: item.description,
                    editCompleted: item.completed,
                    editModal: true,
                    editYesterday: false
                });
                return;
            }
        }
    }

    closeModal = (e) => {
        this.clearEditState();
    }

    handleEditYesterdaySubmit = (e) => {
        e.preventDefault();

        if(!this.state.editTitle.length) {
            return;
        }

        const url = '/api/items/' + this.state.editId;
        
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.editTitle,
                description: this.state.editDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: data.error
                });
                this.clearEditState();
                return;
            }

            const item = data.item;
            let yesterday = this.state.yesterday;
            for(let i = 0; i < yesterday.length; ++i) {
                if(yesterday[i].id === item.id) {
                    yesterday[i] = item;
                    break;
                }
            }

            this.setState({
                yesterday: yesterday
            });
            this.clearEditState();
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to edit item'
            });
            this.clearEditState();
            return;
        });
    }

    handleEditTodaySubmit = (e) => {
        e.preventDefault();

        if(!this.state.editTitle.length) {
            return;
        }

        const url = '/api/items/' + this.state.editId;
        
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.editTitle,
                description: this.state.editDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: data.error
                });
                this.clearEditState();
                return;
            }

            const item = data.item;
            let today = this.state.today;
            for(let i = 0; i < today.length; ++i) {
                if(today[i].id === item.id) {
                    today[i] = item;
                    break;
                }
            }

            this.setState({
                today: today
            });
            this.clearEditState();
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to edit item'
            });
            this.clearEditState();
            return;
        });
    }

    handleEditChange = (e) => {
        if(e.target.id === 'title') this.setState({editTitle: e.target.value});
        if(e.target.id === 'description') this.setState({editDescription: e.target.value});
    }

    closeMessage = (e) => {
        this.setState({
            error: false,
            errorMsg: ''
        });
    }

    deleteItemCall = (id) => {
        const url = '/api/items/' + id;

        if(!window.confirm('Are you sure?')) {
            return;
        }
        
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: response.error
                });
                this.clearEditState();
                return;
            }
            this.clearEditState();

            this.fetchItems(this.state.date);
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to delete item'
            });
            this.clearEditState();
        })
    }

    quickDeleteItem = (id) => {
        this.deleteItemCall(id);
    }

    deleteItem = (e) => {
        const id = this.state.editId;
        this.deleteItemCall(id);
    }

    clearEditState = () => {
        this.setState({
            editModal: false,
            editId: null,
            editTitle: '',
            editDescription: '',
            editCompleted: false,
        });
    }

    quickCompleteItem = (id) => {
        this.completeItemCall(id, true);
    }

    completeItem = (e) => {
        const id = this.state.editId;
        this.completeItemCall(id, true);
    }

    completeItemCall = (id, completedValue) => {
        const url = '/api/items/' + id;
        
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: completedValue
            })
        })
        .then(response => response.json())
        .then(response => {
            if(response.hasOwnProperty('error')) {
                this.setState({
                    error: true,
                    errorMsg: response.error
                });
                this.clearEditState();
                return;
            }
            this.clearEditState();
            this.fetchItems(this.state.date);
        })
        .catch(error => {
            this.setState({
                error: true, 
                errorMsg: 'Unable to complete item'
            });
            this.clearEditState();
        });
    }

    quickUncompleteItem = (id) => {
        this.completeItemCall(id, false);
    }

    uncompleteItem = (e) => {
        const id = this.state.editId;
        this.completeItemCall(id, false);
    }

    render() {
        const styles = {
            primary: {
                background: 'hsl(171, 100%, 41%)', 
                color: 'white'
            },
            info: {
                background: 'hsl(204, 86%, 53%)', 
                color: 'white'
            },
            padTop: {
                paddingTop: '10px'
            },
            fullWidth: {
                width: '100%'
            }
        };

        const buttonClasses = {
            yesterday: "button is-primary",
            today: "button is-info"
        };

        return (
            <div>
                <Navbar authenticated={true} />
                {this.state.editModal && 
                    <div className="modal is-active">
                        <div className="modal-background" onClick={this.closeModal}></div>
                        <div className="modal-content">
                            <div className="box">
                                <EditForm 
                                    handleSubmit={this.state.editYesterday ? this.handleEditYesterdaySubmit : this.handleEditTodaySubmit}
                                    title={this.state.editTitle}
                                    description={this.state.editDescription}
                                    completed={this.state.editCompleted}
                                    handleEdit={this.handleEditChange}
                                    buttonClass={this.state.editYesterday ? buttonClasses.yesterday : buttonClasses.today}
                                    close={this.closeModal}
                                    complete={this.completeItem}
                                    uncomplete={this.uncompleteItem}
                                    delete={this.deleteItem}
                                />
                            </div>
                        </div>
                        <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                    </div>
                }
                <section className="section">
                    <div className="container">
                        {this.state.error && 
                            <div className="notification is-danger" style={{textAlign: 'center'}}>
                                <button className="delete" onClick={this.closeMessage} />
                                {this.state.errorMsg}
                            </div>
                        }
                        <DateStepper 
                            date={this.state.date.format('YYYY-MM-DD')}
                            prettyDate={this.state.date.format('dddd MMM D')}
                            forwardStep={this.forwardStep}
                            backwardStep={this.backwardStep}
                            dateInputShow={this.state.dateInputShow}
                        />
                        <div className="columns">
                            <div className="column">
                                <Card 
                                    style={styles.primary}
                                    items={this.state.yesterday}
                                    handleClick={this.editYesterdayClick}
                                    title="Yesterday"
                                    complete={this.quickCompleteItem}
                                    uncomplete={this.quickUncompleteItem}
                                    delete={this.quickDeleteItem}
                                />
                                <div style={styles.padTop}>
                                    { this.state.yesterdayForm && 
                                        <AddForm 
                                            handleSubmit={this.yesterdaySubmit}
                                            handleChange={this.yesterdayChange}
                                            handleCancel={this.cancelYesterday}
                                            newYesterdayText={this.state.newYesterdayText}
                                            btnClass="button is-primary"
                                        />
                                    }
                                    { !this.state.yesterdayForm && 
                                        <button className="button is-primary" style={styles.fullWidth} onClick={this.yesterdayClick}>Add</button>
                                    }
                                </div>
                            </div>
                            <div className="column">
                                <Card 
                                    style={styles.info}
                                    items={this.state.today}
                                    handleClick={this.editTodayClick}
                                    title="Today"
                                    complete={this.quickCompleteItem}
                                    uncomplete={this.quickUncompleteItem}
                                    delete={this.quickDeleteItem}
                                />
                                <div style={styles.padTop}>
                                    { this.state.todayForm && 
                                        <AddForm 
                                            handleSubmit={this.todaySubmit}
                                            handleChange={this.todayChange}
                                            handleCancel={this.cancelToday}
                                            newYesterdayText={this.state.newTodayText}
                                            btnClass="button is-info"
                                        />
                                    }
                                    { !this.state.todayForm && 
                                        <button className="button is-info" style={styles.fullWidth} onClick={this.todayClick}>Add</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default StandupList;