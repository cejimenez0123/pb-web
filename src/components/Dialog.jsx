
const Dialog = ({ text,title, isOpen, onClose,agree}) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 z-10">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-2">{text}</p>
          <div className="mt-4">
            {agree?<button className="btn rounded-full mx-3 bg-gray-300 text-green-900 border-none   " onClick={agree}>Agree</button>:null}
            {onClose?<button className="btn rounded-full bg-emerald-600 text-white border-emerald-500" onClick={onClose}>Disagree</button>:null}
          </div>
        </div>
      </div>
    );
  };

export default Dialog