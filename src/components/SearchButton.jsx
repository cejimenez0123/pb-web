import { memo } from "react";
import search from "../images/icons/search.svg";
import styles from "../styles/style";

const SearchButton = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Search"
    className="bg-transparent pb-5 text-white "


  >
    <h1 className="h-8 max-h-10  my-auto w-8">⌕</h1>

  </button>
));

export default SearchButton;