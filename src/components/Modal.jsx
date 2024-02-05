const Modal = ({ isOpen, onClose, title, children }) => {
    const modalStyle = {
      display: isOpen ? 'block' : 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: '1',
    };
  
    const contentStyle = {
      backgroundColor: '#fff',
      margin: '10% auto',
      padding: '20px',
      borderRadius: '5px',
      width: '80%',
      maxWidth: '600px',
    };
  
    return (
      <div style={modalStyle}>
        <div style={contentStyle}>
          <h2>{title}</h2>
          {children}
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
export default Modal