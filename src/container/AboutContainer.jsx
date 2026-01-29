import "../styles/About.css"
import { useMediaQuery } from "react-responsive"
import Paths from "../core/paths"
import BookCarousel from "../components/collection/BookCarousel"
import al from "../images/workshop/al-1.jpg"
import duo from "../images/workshop/Duo-1.jpg"
import vemilo from "../images/workshop/vemilo-1.jpg"
import vemilo2 from "../images/workshop/speak.png"
import mixer from "../images/workshop/crowd-mixer.png"
import balcony from "../images/workshop/mixer-balcony.png"
import crowd from "../images/workshop/openmic-crowd.jpg"
import evolution from "../images/workshop/grouptable.png"
import out from "../images/workshop/out-1.jpg"
import out2 from "../images/workshop/out-2.jpg"
import table1 from "../images/workshop/table-1.jpg"
import table2 from "../images/workshop/table-2.jpg"
import table3 from "../images/workshop/table-3.jpg"
import { useLayoutEffect, useContext } from "react"
import events from "../images/icons/event.svg"
import table5 from "../images/workshop/table-5.jpg"
import table7 from "../images/workshop/table-7.jpg"
import books1 from "../images/workshop/books-1.jpg"
import { initGA, sendGAEvent } from "../core/ga4"
import Context from "../context"
import ScrollDown from "../components/ScrollDownButton"
import useScrollTracking from "../core/useScrollTracking"

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonTitle,
  useIonRouter,
} from '@ionic/react';
import ig from "../images/icons/instagram icon.png"
let firstImages = [out, al, crowd, duo,balcony, vemilo,  table7];
let secImages = [table3,out2,evolution,  vemilo2, table2, table5];
import { useState,useRef,useEffect } from "react"
export default function AboutContainer() {

  const { setSeo, currentProfile } = useContext(Context);
  const md = useMediaQuery({ query: '(min-width: 750px)' });
  const router = useIonRouter()
useScrollTracking({
  contentType: "about",
  contentId: "about_page",
  enableCompletion: true,
  completionEvent: "about_read_complete",
});

useLayoutEffect(() => {
  initGA();
}, []);
useLayoutEffect(() => {
  setSeo({
    title: "About Plumbum — A Writing Community Built with Care",
    description:
      "Plumbum is a writer-led community for sharing work, getting thoughtful feedback, and growing through workshops and real connection.",
    name: "Plumbum",
    type: "website",
  });
}, [setSeo]);

  


  // function apply() {
    function apply(source = "about_page") {
  sendGAEvent("apply_click", {
    source,
    location: "about",
  });


    router.push(Paths.onboard);
  }

  const whyMembership = () => (
    <div>
      <h1 className="lora-bold">Why Membership?</h1>
      <p>
        Too many places call themselves “the public square,” but they feel more like oceans—vast, anonymous, and impossible to hold. We’re building a teacup: something small enough to share, strong enough to hold heat, and made for real connection.
      </p>
      <br />
      <ul className="text-left">
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>People Who Care Only –</strong> No trolls. Just writers who give thoughtful feedback that builds you up.
          </h6>
        </li>
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>Compassionate Community –</strong> Writers can be passionate, but we also lead with compassion.
          </h6>
        </li>
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>NYC + Beyond –</strong> We’re rooted in the Bronx—a place that doesn’t fake it. We keep it real, and we want you to do the same.
          </h6>
        </li>
      </ul>
    </div>
  );

  const applicationProcess = () => (
    <div className="">
      <h1 className="lora-bold mb-4">How the Application Works</h1>
      <p>We’re building a space with intention. Here’s how to join.</p>
      <ol className="list-decimal list-inside open-sans-regular space-y-3 text-[1rem]">
        <li>
          <strong>Apply Online –</strong> Fill out a short form to tell us about your writing and what you're looking for.
        </li>
        <li>
          <strong>We Review –</strong> Our team reads every application. We’ll either invite you in now or let you know we’re keeping your application on file for the next round.
        </li>
        <li>
          <strong>You're In –</strong> If accepted, you'll get an email with a link to complete your registration and join the community.
        </li>
      </ol>
    </div>
  );

  const findCreatives = () => (
    <div className="text-emerald-800 rounded-lg p-4 h-full">
      <div className="text-center">
        <h2 className="lora-medium font-bold text-[2rem] mb-4">Find Your Creative Community</h2>
        <div className="text-left">
          <h2 className="text-[1rem] leading-loose open-sans-medium mb-4">
            Plumbum is a space for writers to share work, get feedback, and connect with like-minded creatives. Whether you're refining your next piece or just starting out, you'll find support, inspiration, and the right audience here.
          </h2>
          <a onClick={()=>apply("find_creatives")} className="text-[1rem] cursor-pointer inline-block">[→ Join the Beta]</a>
        </div>
      </div>
    </div>
  );

  const writingJourney = () => (
    <div className="text-center py-9  text-emerald-800 leading-loose">
      <h1 className="lora-bold text-left">Why Plumbum Works?</h1>
      <br/>
      <ul className="text-left">
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>Writer-Driven Feedback –</strong> Get real, constructive responses from fellow writers.
          </h6>
        </li>
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>Curated Discovery –</strong> Curate your space and discover others curated collections and add them to your space of inspiration.
          </h6>
        </li>
        <li className="text-[1rem] my-1">
          <h6 className="open-sans-medium">
            <strong>Workshops & Events –</strong> Take your craft further with live workshops and community gatherings.
          </h6>
        </li>
      </ul>
      <div className="text-left">
        <a onClick={() =>{

    sendGAEvent("navigation_click", {
      destination: "discovery",
      source: "about_why_plumbum",
    });
    router.push(Paths.discovery());
  }}
 className="text-[1rem] cursor-pointer inline-block">[→ Explore More]</a>
      </div>
    </div>
  );

  const howItWorks = () => (
    <div className="py-2 leading-loose text-emerald-700 flex flex-col max-w-full">
      <h1 className="lora-bold text-left text-emerald-800 text-4xl mt-4 py-4">How It Works</h1>
      <ul className="list-disc open-sans-medium list-inside open-sans-regular space-y-3 text-[1rem]">
        <li>
          <strong>Get Feedback –</strong> Share your drafts and receive thoughtful, constructive responses from writers who care.
        </li>
        <li>
          <strong>Join Live Workshops –</strong> Hop into real-time sessions online or around NYC for direct feedback and collaboration.
        </li>
        <li>
          <strong>Share Your Work –</strong> Publish pieces-in-progress or notes-app gems in a space for experimentation.
        </li>
        <li>
          <strong>Find Fresh Voices –</strong> Discover new writers and connect through shared creativity and weirdness.
        </li>
      </ul>
    </div>
  );

  const stayInLoop = () => (
    <div className="p-3 flex flex-col">
      <h1 className="text-[3rem] mx-auto lora-bold">Stay in the Loop</h1>
      <h2 className="mx-4 my-2 open-sans-medium text-l">Be the first to know about new features, workshops, and events.</h2>
      <h2 className="mx-4 my-2 open-sans-medium text-l">Follow the Journey</h2>
      <a
        onClick={() =>
    sendGAEvent("outbound_click", {
      destination: "instagram_channel",
      source: "about_stay_in_loop",
    })
  }
        className="flex flex-col text-center my-4 mx-auto cursor-pointer"
        href="https://www.instagram.com/channel/AbaI9yaoN4KfPze_/"
        target="_blank" rel="noreferrer"
      >
        <p className="open-sans-medium mx-4 my-4 text-emerald-600">Join the Instagram Channel. Today!</p>
        <img  className="mx-auto w-[8em]" src={ig} alt="Slack invite" />
      </a>
      <p
        className="flex open-sans-medium my-4 mx-auto text-center cursor-pointer"
        onClick={() => goToCalendar("about_text_link")}
      >
        Check out the Calendar for NYC Writing Scene
      </p>
      <img
        onClick={() => goToCalendar("about_icon")}
        className="h-[8em] mx-auto w-[8em] cursor-pointer"
        src={events}
        alt="Calendar icon"
      />
      <div className="flex my-4 open-sans-medium mx-auto text-lg text-left leading-loose tracking-loose">
        <p>
          <a href="https://www.instagram.com/plumbumapp" target="_blank" rel="noreferrer">@plumbumapp</a> | <a href="https://www.instagram.com/bxwriters" target="_blank" rel="noreferrer">@bxwriters</a>
        </p>
      </div>
      
    </div>
  );
  

const TESTIMONIALS = [
  {
    quote:
      "Plumbum.app Workshops have been impactful in helping me build community and connect with poets across NYC and the Tri-State area. I leave with quality feedback and new ways of thinking about my work.",
    author: "Rob P.",
  },
  {
    quote:
      "Sol Emilio brought together poets who understand that craft means sitting in a room and doing the work together.",
    author: "Faust S.",
  },
  {
    quote:
      "Such a fulfilling workshop ... in the Bronx.",
    author: "Kay P.",
  },
];

function userTestimonials() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true); // controls fade in/out
  const intervalRef = useRef(null);

  useEffect(() => {
    const nextSlide = () => {
      setFade(false); // start fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TESTIMONIALS.length); // update index
        setFade(true); // fade in new quote
      }, 500); // match fade duration
    };

    intervalRef.current = setInterval(nextSlide, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const stop = () => clearInterval(intervalRef.current);
  const start = () => {
    intervalRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setFade(true);
      }, 500);
    }, 5000);
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      <h1 className="lora-bold mb-6 text-center">
        Real Writers,
        <br />
        Real Growth
      </h1>

      <div
        className="relative overflow-hidden"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <h6 className="lora-medium text-[1rem] lg:text-[1.2rem] text-center leading-relaxed">
            <em>“{TESTIMONIALS[index].quote}”</em>
          </h6>
          <div className="mt-3 text-sm opacity-80 text-center">
            — {TESTIMONIALS[index].author}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {TESTIMONIALS.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "bg-black scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// function userTestimonials() {
//   const [index, setIndex] = useState(0);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
//     }, 5000); // change slide every 5s

//     return () => clearInterval(intervalRef.current);
//   }, []);

//   return (
//     <div className="max-w-xl">
//       <h6 className="text-[1.8rem] lg:text-[2rem] lora-bold mb-4">
//         Real Writers,
//         <br />
//         Real Growth
//       </h6>

//       <div
//         className="relative overflow-hidden px-4"
//         onMouseEnter={() => clearInterval(intervalRef.current)}
//         onMouseLeave={() => {
//           intervalRef.current = setInterval(() => {
//             setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
//           }, 5000);
//         }}
//       >
//         <div
//           className="transition-all duration-700 ease-in-out"
//           key={index}
//         >
//           <h6 className="lora-medium text-[1rem] lg:text-[1.2rem]">
//             <em>“{TESTIMONIALS[index].quote}”</em>
//           </h6>
//           <div className="mt-2 text-sm opacity-80">
//             — {TESTIMONIALS[index].author}
//           </div>
//         </div>
//       </div>

//       {/* Dots */}
//       <div className="flex gap-2 mt-4 px-4">
//         {TESTIMONIALS.map((_, i) => (
//           <span
//             key={i}
//             className={`h-2 w-2 rounded-full transition-all ${
//               i === index ? "bg-black" : "bg-gray-300"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


const goToCalendar = (source="about_page") => {
  sendGAEvent("navigation_click", {
    destination: "calendar",
    source,
  });

  router.push(Paths.calendar());
};
  return (
    <IonContent fullscreen={true}   scrollY={true} className="">
     <div className="pt-8 w-[94vw] mx-auto">

        {/* <IonGrid> */}
          <IonRow className="my-10">
            <IonCol  className="ion-text-center">
              <div className="flex-col flex">
              <IonText color="primary" className="lora-bold text-emerald-800" style={{ fontSize: '3rem', margin: "auto", paddingTop: '2rem' }}>
                Plumbum
              </IonText>
              <IonText className="mx-auto text-emerald-600" color="primary" style={{ fontSize: '1.3rem', margin: "auto" }}>
                Share your Weirdness
              </IonText>
              <br />
              <IonText className=" mx-auto text-emerald-600" color="primary">
                Get thoughtful feedback • Grow through workshops
              </IonText>
              </div>
            </IonCol>
          </IonRow>

          <IonRow className="items-center"> 
            {md && (
              <>
               <IonCol>
                <div ><BookCarousel images={secImages} /></div>
                {findCreatives()}
               </IonCol>
              </>
            )}
            <IonCol >
             <div ><BookCarousel images={firstImages} /></div> 
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size={md ? "6" : "12"}>
              {howItWorks()}
            </IonCol>
            <IonCol size={md ? "6" : "12"}>
              {writingJourney()}
            </IonCol>

            <IonCol size={md ? "4" : "12"}>
              {userTestimonials()}
            </IonCol>
            <IonCol size={md ? "4" : "12"}>
              {whyMembership()}
            </IonCol>
            <IonCol size={md ? "4" : "12"}>
              {applicationProcess()}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className="ion-text-center">
              {stayInLoop()}
            </IonCol>
          </IonRow>

          <IonRow className="my-8 mx-auto items-center">
            <IonCol size="12" className="ion-text-center">
              <IonText
                style={{
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  background: 'linear-gradient(to right, #34d399, #059669)', // emerald gradient
                  borderRadius: '9999px',
                  padding: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.5)',
                  cursor: 'pointer',
                  display: 'inline-block',
                  userSelect: 'none'
                }}
                onClick={() => {
                  apply("footer_cta")
                  router.push(Paths.onboard)}}
              >
                Become Part of our Writers' Circle
              </IonText>
            </IonCol>
          </IonRow>
          <div className="mb-24">
          <IonRow className="ion-padding-bottom">
            <IonCol size="12" className="ion-text-center pb-12">
              <IonText>
                Any requests for features, feedback, or encouragement&nbsp;
                <IonText
                  fill="clear"
                  size="small"
                  style={{
                    color: '#047857', // emerald-700
                    fontSize: '1rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    textDecoration: 'underline',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                  onClick={() => router.push(Paths.feedback())}
                >
                  click here
                </IonText>
              </IonText>
              <div>
              <IonText className="ion-padding-top" color="medium">
                © Plumbum 2025
              </IonText>
              </div>
            </IonCol>
          </IonRow>
          </div>
        
        {/* </IonGrid> */}
        {!currentProfile && <ScrollDown text="↓Apply Below" visible={true} />}
             </div>

</IonContent>
  )
}




const TESTIMONIALS = [
  {
    quote: `Plumbum.app Workshops have been impactful in helping me to build community and network with poets from across New York City and the Tri-State area. I walk away with quality feedback and new ways to think about my work.`,
    author: "Rob P.",
  },
  {
    quote: `The feedback I received was thoughtful, generous, and sharp. I left feeling more confident and more curious about my own writing.`,
    author: "Workshop Participant",
  },
  {
    quote: `Plumbum creates a rare space where writers feel taken seriously while still being supported. That balance is everything.`,
    author: "NYC Writer",
  },
];

