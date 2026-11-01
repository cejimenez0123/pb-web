import { memo } from "react";


const SearchButton = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Search"
    className="bg-transparent -translate-y-1  text-plumb-darkText dark:text-plumb-mintLight"


  >
    <h1 className="max-h-14 my-auto min-h-10 min-w-10 max-w-14">⌕</h1>

  </button>
));

export default SearchButton;