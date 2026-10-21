import { memo } from "react";
import search from "../images/icons/search.svg";
import styles from "../styles/style";

const SearchButton = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Search"
    className="bg-transparent text-white mx-auto my-auto bottom-8"
  // className={styles.navbar.mobileItem}
    // className={"bg-transparent text-white bottom-4"}

  >
    <h1 className="h-10 w-10">⌕</h1>

  </button>
));

export default SearchButton;