
import { Capacitor } from '@capacitor/core';
import MobileNavbar from '../components/nav/MobileNavbar';
import BrowserMobileNavbar from '../components/nav/BrowserMobileNavbar';
import DesktopNavbar from '../components/nav/DesktopNavbar';
import Paths from '../core/paths';


export default function NavbarContainer({ showBack,hideNavbar,isDesktop,pathname,currentProfile }) {



  const isSearchPage = pathname === '/search';
  const isNative = Capacitor.isNativePlatform();



  const showSearch = !isSearchPage;


  if (!isNative) {

      if(isDesktop){
return (
      <DesktopNavbar
        currentProfile={currentProfile}

        showSearch={showSearch}
      />
    );
    }else{
         return <BrowserMobileNavbar
        pathname={pathname}
     
      hideNavbar={hideNavbar}
      showBack={showBack}
      currentProfile={currentProfile}
      showSearch={showSearch}
    />
    }
    
  }



      return<MobileNavbar
      pathname={pathname}
      hideNavbar={hideNavbar}
      showBack={showBack}
        currentProfile={currentProfile}
        showSearch={showSearch}
      />
 
}


