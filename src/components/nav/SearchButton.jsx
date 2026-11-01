import { memo } from "react";


const SearchButton = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Search"
    className="bg-transparent pb-5 text-white "


  >
    <h1 className="h-8 max-h-14 my-auto w-14">⌕</h1>

  </button>
));

export default SearchButton;