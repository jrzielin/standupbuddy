import React from 'react';

function EditForm(props) {
        const styles = {
            icon: {
                height: 'inherit',
                paddingLeft: '10px'
            }
        };

    return (
        <form onSubmit={props.handleSubmit}>
            <div className="field">
                <div className="label">Title</div>
                <div className="control">
                    <input className="input" type="text" id="title" value={props.title} onChange={props.handleEdit} />
                </div>
            </div>
            <div className="field">
                <div className="label">Description</div>
                <div className="control">
                    <textarea className="textarea" id="description" value={props.description} onChange={props.handleEdit} />
                </div>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button type="submit" className={props.buttonClass} disabled={!props.title.length}>Submit</button>
                </div>
                <div className="control">
                    <button className="button" type="button" onClick={props.close}>Cancel</button>
                </div>
                <span className="icon" style={styles.icon} onClick={props.delete}>
                    <i className="fas fa-trash"></i>
                </span>
                {!props.completed && 
                    <span className="icon" style={styles.icon} onClick={props.complete}>
                        <i className="fas fa-check"></i>
                    </span>
                }
                {props.completed && 
                    <span className="icon" style={styles.icon} onClick={props.uncomplete}>
                        <i className="fas fa-check"></i>
                    </span>
                }
            </div>
        </form>
    );
}

export default EditForm;