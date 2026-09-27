import { memo } from "react";
import search from "../images/icons/search.svg";

const SearchButton = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Search"
    className="
      flex
      items-center
      justify-center
      
      rounded-full
      text-text-secondary
      hover:text-text-primary
      hover:bg-card-background
      transition-all
      duration-150
      focus:outline-none
      focus:ring-2
      focus:ring-button-primary-bg/30
    "
  >
    <h1 className="m-auto text-[2em]">⌕</h1>
    {/* <img
      src={search}
      alt=""
      aria-hidden="true"
      className="
        w-5
        h-5
        opacity-70
        transition-opacity
        duration-150
      "
    /> */}
  </button>
));

export default SearchButton;