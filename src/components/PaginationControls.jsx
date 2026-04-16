// import { useEffect, useState } from "react";

// const PaginationControls = ({ page, totalPages, setPage }) => {
//   const [input, setInput] = useState(page);

//   useEffect(() => {
//     setInput(page);
//   }, [page]);

//   const goToPage = () => {
//     const p = Number(input);
//     if (p >= 1 && p <= totalPages) {
//       setPage(p);
//     } else {
//       setInput(page); // reset if invalid
//     }
//   };

//   return (
//     <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-base-bg/60 backdrop-blur-md border border-gray-200 shadow-sm">
      
//       {/* Prev */}
//       <button
//         disabled={page === 1}
//         onClick={() => setPage(page - 1)}
//         className={`px-3 py-1.5 rounded-full text-sm font-medium transition
//           ${page === 1 
//             ? "text-gray-300" 
//             : "text-seaBlue active:scale-95"}
//         `}
//       >
//         ‹
//       </button>

//       {/* Center (page indicator + input) */}
//       <div className="flex items-center gap-2 text-sm">
//         <span className="text-gray-500">Page</span>

//         <input
//           type="number"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onBlur={goToPage}
//           onKeyDown={(e) => e.key === "Enter" && goToPage()}
//           className="w-12 text-center bg-transparent border-b border-gray-300 focus:border-seaBlue outline-none"
//         />

//         <span className="text-gray-400">of {totalPages}</span>
//       </div>

//       {/* Next */}
//       <button
//         disabled={page === totalPages}
//         onClick={() => setPage(page + 1)}
//         className={`px-3 py-1.5 rounded-full text-sm font-medium transition
//           ${page === totalPages 
//             ? "text-gray-300" 
//             : "text-seaBlue active:scale-95"}
//         `}
//       >
//         ›
//       </button>
//     </div>
//   );
// };
// export default PaginationControls
import { useEffect, useState } from "react";

const PaginationControls = ({
  page,
  totalPages,
  setPage,
  className = "",
}) => {
  const [input, setInput] = useState(page);

  useEffect(() => {
    setInput(page);
  }, [page]);

  const goToPage = () => {
    const p = Number(input);

    if (p >= 1 && p <= totalPages) {
      setPage(p);
    } else {
      setInput(page);
    }
  };

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-2xl bg-base-bg/60 backdrop-blur-md border border-gray-200 shadow-sm ${className}`}>
      
      {/* Prev */}
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
          ${page <= 1 
            ? "text-gray-300" 
            : "text-emerald-700 active:scale-95"}
        `}
      >
        ‹
      </button>

      {/* Input */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Page</span>

        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={goToPage}
          onKeyDown={(e) => e.key === "Enter" && goToPage()}
          className="w-12 text-center bg-transparent border-b border-gray-300 focus:border-emerald-700 outline-none"
        />

        <span className="text-gray-400">of {totalPages}</span>
      </div>

      {/* Next */}
      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
          ${page >= totalPages 
            ? "text-gray-300" 
            : "text-emerald-700 active:scale-95"}
        `}
      >
        ›
      </button>
    </div>
  );
};

export default PaginationControls;