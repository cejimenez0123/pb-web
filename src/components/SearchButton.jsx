import { IonImg } from '@ionic/react';
import { memo } from 'react';
import search from "../images/icons/search.svg";
import Enviroment from '../core/Enviroment';

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
        '--background': Enviroment.palette.base.soft,
    '--color': Enviroment.palette.base.text || '#000'}
        }
    />
    {/* <h6 className="text-emerald-800 text-xs mt-1">Search</h6> */}
  </div>
));

export default SearchButton;