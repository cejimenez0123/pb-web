import { useNavigate } from 'react-router-dom';
import { IonInput, IonText, IonLabel } from '@ionic/react';
import Paths from '../../core/paths';
import { isNative } from 'lodash';
import DeviceCheck from '../../components/DeviceCheck';
import { Capacitor } from '@capacitor/core';

export default function ThankYou({ user }) {
  const navigate = useNavigate();
  const isNative = DeviceCheck()
  const inputWrapperStyle = {
    width: '100%',
    borderRadius: '9999px',
    border: '2px solid #059669', // emerald-600
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    transition: 'border-color 0.2s',
    marginBottom: '1rem',
  };

  // Inline styles for IonInput to override Ionic Shadow DOM styles
  const inputStyle = {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    '--background': 'transparent',
    fontSize: '1.125rem',
    fontFamily: 'inherit',
    fontWeight: 600,
    color: 'inherit',
    boxShadow: 'none',
    padding: 0,
    textAlign: 'right',
  };

  // Button style wrapped with IonText for consistent styling
  const buttonClassNames = "bg-emerald-600 rounded-full px-6 py-2 cursor-pointer select-none";

  return (
    <div
      id="welcome"
      className="p-8 text-left leading-[1.5em] text-emerald-600 overflow-scroll max-w-xl mx-auto"
    >
      <div
  id="welcome"
  className="p-8 text-left leading-relaxed text-emerald-700 max-w-xl mx-auto rounded-2xl shadow-md bg-white/70 backdrop-blur-sm"
>
  <p className="text-2xl font-semibold mb-4">
    Welcome aboard, {user.preferredName}! 🌿
  </p>

  <p className="text-lg mb-6">
    You’re officially part of the <span className="font-medium text-emerald-800">Plumbum beta</span> — a growing community of writers who believe in creating with honesty, sharing with courage, and growing together.
  </p>

  <p className="text-lg mb-6">
    Plumbum isn’t just an app — it’s a shared space for discovery. Here, you’ll help us shape what writing can feel like when connection, curiosity, and care come first.
  </p>

  

  <p className="text-lg mb-6">
    Stay tuned for updates through our Instagram
    {' '}
    <a
      href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-emerald-800 hover:text-emerald-600"
    >
      @plumbumapp
    </a>
    {' '}
    or our partners at
    {' '}
    <a
      href="https://www.instagram.com/bxwriters?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-emerald-800 hover:text-emerald-600"
    >
      @bxwriters
    </a>.
  </p>

  <p className="text-lg mb-6">
    We’re so grateful you’re here — your ideas, feedback, and voice will help us build something that truly belongs to its writers.
  </p>

  <p className="text-lg font-medium mb-8">
    Let’s take our time, build something lasting, and make our story — together.
  </p>

  <div className="text-right mt-8 border-t border-emerald-200 pt-4">
    <p className="font-semibold text-emerald-800">— Sol Emilio Christian</p>
    <p className="text-sm text-emerald-600">Founder, Plumbum</p>
  </div>
</div>

      {/* <p className='text-[1.4rem]'>
        Thank You {user.preferredName}! You’re In—Welcome to the Journey!
      </p>
      <br />
      <h6>
        Congratulations! You’re officially on board as a beta user for Plumbum, where we’re redefining what it means to create, connect, and grow as a writer.
      </h6>
      <br />
      <h6>
        This is more than just an app. Together, we’re building a space where writers like you can test ideas, share stories, and discover the confidence to take your work to the next level.
      </h6>
      <br />
      <h6>
        We’ll start onboarding beta users at the end of February, and we can’t wait to celebrate with you at our Launch Party! Details are on the way, so stay tuned through{' '}
        our instagram{' '}
        <a
          href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          className="underline"
        >
          @plumbumapp
        </a>{' '}
        or through our partners{' '}
        <a
          href="https://www.instagram.com/bxwriters?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          className="underline"
        >
          @bxwriters.
        </a>
      </h6>
      <br />
      <h6>
        Thank you for joining this exciting journey. Your insights and creativity will help shape Plumbum into a community where creativity thrives.
      </h6>
      <br />
      <h6>Let’s make our story, together!</h6>
      <br />
      <h6>
        -Sol Emilio Christian,
        <br />
        Founder of Plumbum
      </h6> */}


    
      <div className="flex flex-row justify-between mt-6 gap-4">
        {!Capacitor.isNativePlatform()? <IonText
          onClick={() => navigate(Paths.about())}
          className={buttonClassNames}
          style={{ width: '8em', margin:"auto",textAlign:"center", color: 'white', userSelect: 'none' }}
        >
          Go to About
        </IonText>:null}
        <IonText
          onClick={() => navigate(Paths.discovery())}
          className={buttonClassNames}
          style={{ width: '8em', textAlign: 'center', color: 'white', userSelect: 'none' }}
        >
          Go to Discover
        </IonText>
      </div>
    </div>
  );
}
