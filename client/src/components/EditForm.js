import React, {Component} from 'react';

class EditForm extends Component {
    render() {
        const styles = {
            icon: {
                height: 'inherit',
                paddingLeft: '10px'
            }
        };

        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="field">
                    <div className="label">Title</div>
                    <div className="control">
                        <input className="input" type="text" id="title" value={this.props.title} onChange={this.props.handleEdit} />
                    </div>
                </div>
                <div className="field">
                    <div className="label">Description</div>
                    <div className="control">
                        <textarea className="textarea" id="description" value={this.props.description} onChange={this.props.handleEdit} />
                    </div>
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className={this.props.buttonClass} disabled={!this.props.title.length}>Submit</button>
                    </div>
                    <div className="control">
                        <button className="button" type="button" onClick={this.props.close}>Cancel</button>
                    </div>
                    <span className="icon" style={styles.icon} onClick={this.props.delete}>
                        <i className="fas fa-trash"></i>
                    </span>
                    {!this.props.completed && 
                        <span className="icon" style={styles.icon} onClick={this.props.complete}>
                            <i className="fas fa-check"></i>
                        </span>
                    }
                    {this.props.completed && 
                        <span className="icon" style={styles.icon} onClick={this.props.uncomplete}>
                            <i className="fas fa-check"></i>
                        </span>
                    }
                </div>
            </form>
        );
    }
}

export default EditForm;