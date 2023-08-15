import './DeleteDialogbox.css';

const DeleteDialogbox = ({ message, onDeleteConfirm, onDeleteCancel }) => {
    
    return ( 
        <div className="main-dialog">
            <div className="main-dialog-box">
                <h4>{message}</h4>
                <div className="main-dialog-buttonbox">
                    <button className="main-dialog-button-yes" onClick={onDeleteConfirm}>Yes</button>
                    <button className="main-dialog-button-no" onClick={onDeleteCancel}>No</button>
                </div>
            </div>
        </div>
     );
}
 
export default DeleteDialogbox;