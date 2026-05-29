import React from "react";
function EmptyState({ text }) {
  return (
    <div className="text-center py-12">
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
export default React.memo(EmptyState)