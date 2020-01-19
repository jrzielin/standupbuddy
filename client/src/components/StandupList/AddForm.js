import React from 'react';

function AddForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="field">
                <div className="label">New Item</div>
                <div className="control">
                    <input  className="input" type="text" value={props.newYesterdayText} onChange={props.handleChange} autoFocus />
                </div>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button type="submit" className={props.btnClass} disabled={!props.newYesterdayText.length}>Submit</button>
                </div>
                <div className="control">
                    <button className="button" type="button" onClick={props.handleCancel}>Cancel</button>
                </div>
            </div>
        </form>
    );
}

export default AddForm;