import { IonImg } from '@ionic/react';
import { memo } from 'react';
import search from "../images/icons/search.svg";

const SearchButton = memo(({ onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col my-auto items-center cursor-pointer"
  >
    <IonImg
      src={search}
      style={{
        width: "2.5em",
        height: "2.5em",
        filter:
          "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)"
      }}
    />
    {/* <h6 className="text-emerald-800 text-xs mt-1">Search</h6> */}
  </div>
));

export default SearchButton;