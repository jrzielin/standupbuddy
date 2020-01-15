import React, {Component} from 'react';

class AddForm extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="field">
                    <div className="label">New Item</div>
                    <div className="control">
                        <input  className="input" type="text" value={this.props.newYesterdayText} onChange={this.props.handleChange} autoFocus />
                    </div>
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className={this.props.btnClass} disabled={!this.props.newYesterdayText.length}>Submit</button>
                    </div>
                    <div className="control">
                        <button className="button" type="button" onClick={this.props.handleCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default AddForm;