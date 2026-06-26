
// import "../styles/About.css"
// import { useMediaQuery } from "react-responsive"
// import Paths from "../core/paths"
// import BookCarousel from "../components/collection/BookCarousel"
// import al from "../images/workshop/al-1.jpg"
// import duo from "../images/workshop/Duo-1.jpg"
// import vemilo from "../images/workshop/vemilo-1.jpg"
// import vemilo2 from "../images/workshop/speak.png"
// import mixer from "../images/workshop/crowd-mixer.png"
// import balcony from "../images/workshop/mixer-balcony.png"
// import crowd from "../images/workshop/openmic-crowd.jpg"
// import evolution from "../images/workshop/grouptable.png"
// import out from "../images/workshop/out-1.jpg"
// import out2 from "../images/workshop/out-2.jpg"
// import table1 from "../images/workshop/table-1.jpg"
// import table2 from "../images/workshop/table-2.jpg"
// import table3 from "../images/workshop/table-3.jpg"
// import { useLayoutEffect, useContext } from "react"
// import events from "../images/icons/event.svg"
// import table5 from "../images/workshop/table-5.jpg"
// import table7 from "../images/workshop/table-7.jpg"
// import books1 from "../images/workshop/books-1.jpg"
// import { initGA, sendGAEvent } from "../core/ga4"
// import Context from "../context"
// import ScrollDown from "../components/ScrollDownButton"
// import useScrollTracking from "../core/useScrollTracking"

// import {
//   IonContent,
//   IonRow,
//   IonCol,
//   useIonRouter,
// } from '@ionic/react';
// import ig from "../images/icons/instagram icon.png"

// import { useState,useRef,useEffect } from "react"
// export default function AboutContainer() {

//   const { setShowNav,setSeo, currentProfile } = useContext(Context);
//   const md = useMediaQuery({ query: '(min-width: 750px)' });
//   const router = useIonRouter()
// useScrollTracking({
//   contentType: "about",
//   contentId: "about_page",
//   enableCompletion: true,
//   completionEvent: "about_read_complete",
// });

// useLayoutEffect(() => {
 
//   initGA();
// }, []);
// useLayoutEffect(() => {
//   setSeo({
//     title: "About Plumbum — A Writing Community Built with Care",
//     description:
//       "Plumbum is a writer-led community for sharing work, getting thoughtful feedback, and growing through workshops and real connection.",
//     name: "Plumbum",
//     type: "website",
//   });
// }, [setSeo]);

  
//     function logIn(source = "about_page") {
//   sendGAEvent("login_onboard", {
//     source,
//     location: "about",
//   });


//     router.push(Paths.login);
//   }





//   const stayInLoop = () => (
//     <div className="p-3 flex flex-col text-soft text-center ">
//       <div className="py-12">
//        <a
//         onClick={() =>
//     sendGAEvent("nav click", {
//       destination: "link tree",
//       source: "about_stay_in_loop",
//     })
//   }
//         className="flex flex-col text-center my-4 mx-auto cursor-pointer"
//         href="https://plumbum.app/links"
//         target="_blank" rel="noreferrer"
//       >
//         <h6 className="open-sans-bold text-[1.6rem] mx-4 my-4  text-soft ">
//   Everything Plumbum 🔗
// </h6>
        
//       </a>
//            <p
//         className=" mx-auto px-4 my-4 mx-auto text-center cursor-pointer"
//         onClick={() => goToCalendar("about_text_link")}
//       >
//         Check out the Calendar of NYC events for writer and creatives
//       </p> 
//      <img
//   onClick={() => goToCalendar("about_icon")}
//   className="h-[8em] mx-auto w-[8em] cursor-pointer filter invert brightness-125 sepia saturate-50 hue-rotate-30"
//   src={events}
//   alt="Calendar icon"
// />

//       <div className="flex my-4 open-sans-medium mx-auto text-lg text-left leading-loose tracking-loose">
//         <p className="mx-auto">
//           <a className="text-soft "href="https://www.instagram.com/plumbumapp" target="_blank" rel="noreferrer">@plumbumapp</a> 
//         </p>
//       </div>
//       </div>
//     </div>
//   );
  const testimonials = [
  {
    quote:
      "Plumbum Workshops have been impactful in helping me build community and network with poets from across NYC and the Tri-State area. I walk away with quality feedback and new ways to think about my work.",
    author: "Rob P.",
  },
  {
    quote:
      "6 writers together is better than a café alone.",
    author: "Bertrand I..",
    featured: true,
  },
  {
    quote:
      "Such a fulfilling workshop — in the Bronx.",
    author: "Kay P.",
  },
];

function TestimonialTriptych() {
  return (
    <div className="py-4">
      <div className="mb-2">
        <span className="open-sans-medium text-xs tracking-widest uppercase text-zinc-400">
          Real Writers
        </span>
      </div>
      <h2 className="lora-bold text-[2rem] leading-tight text-zinc-900 mb-8">
        Real Growth
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`flex flex-col rounded-2xl p-6 ${
              t.featured
                ? "bg-emerald-600 border-2 border-emerald-600"
                : "bg-white border border-zinc-200"
            }`}
          >
            <span
              className={`lora-bold text-[3rem] leading-none mb-4 ${
                t.featured ? "text-emerald-300" : "text-emerald-200"
              }`}
            >
              "
            </span>

            <p
              className={`lora-medium text-[1rem] leading-relaxed flex-1 mb-6 ${
                t.featured ? "text-white" : "text-zinc-700"
              }`}
            >
              <em>{t.quote}</em>
            </p>

            <p
              className={`open-sans-medium text-xs tracking-widest uppercase ${
                t.featured ? "text-emerald-200" : "text-zinc-400"
              }`}
            >
              — {t.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// const TESTIMONIALS = [
//   {
//     quote:
//       "Plumbum.app Workshops have been impactful in helping me build community and connect with poets across NYC and the Tri-State area. I leave with quality feedback and new ways of thinking about my work.",
//     author: "Rob P.",
//   },
//   {
//     quote:
//       "Sol Emilio brought together poets who understand that craft means sitting in a room and doing the work together.",
//     author: "Faust S.",
//   },
//   {
//     quote:
//       "Such a fulfilling workshop ... in the Bronx.",
//     author: "Kay P.",
//   },
// ];
// let firstImages = [out, al, crowd, duo,balcony, vemilo,  table7,TESTIMONIALS[2]];
// let secImages = [table3,out2,evolution, TESTIMONIALS[0], vemilo2, table2, table5,TESTIMONIALS[1]];
// function userTestimonials() {
//   const [index, setIndex] = useState(0);
//   const [fade, setFade] = useState(true); // controls fade in/out
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     const nextSlide = () => {
//       setFade(false); // start fade out
//       setTimeout(() => {
//         setIndex((prev) => (prev + 1) % TESTIMONIALS.length); // update index
//         setFade(true); // fade in new quote
//       }, 500); // match fade duration
//     };

//     intervalRef.current = setInterval(nextSlide, 5000);

//     return () => clearInterval(intervalRef.current);
//   }, []);


import "../styles/About.css"
import { useMediaQuery } from "react-responsive"

import Paths from "../core/paths"
import { useDispatch } from 'react-redux'
import slack from "../images/icons/slack.svg"
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
  IonLabel,
} from '@ionic/react';
import ig from "../images/icons/instagram icon.png"
let firstImages = [out, al, crowd, duo,balcony, vemilo,  table7];
let secImages = [table3,out2,evolution,  vemilo2, table2, table5];

export default function AboutContainer() {

  const { setSeo, currentProfile } = useContext(Context);
  const md = useMediaQuery({ query: '(min-width: 750px)' });
  const router = useIonRouter()

  useScrollTracking({ name: "About" });
  useLayoutEffect(() => {
    initGA();
    sendGAEvent("Page View", "View About Page");
  }, []);
  
  useLayoutEffect(() => {
    setSeo({
      title: "Plumbum (About) - Your Writing, Your Community",
      description: "Explore events, workshops, and writer meetups on Plumbum.",
      name: "Plumbum",
      type: "",
    });
  }, [setSeo]);

  function apply() {
    sendGAEvent("Apply to be user", "Click Apply", "Apply to Join Today", 0, false);
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

  // const applicationProcess = () => (
  //   <div className="my-8">
  //     <h1 className="lora-bold mb-4">How the Application Works</h1>
  //     <p>We’re building a space with intention. Here’s how to join.</p>
  //     <ol className="list-decimal list-inside open-sans-regular space-y-3 text-[1rem]">
  //       <li>
  //         <strong>Apply Online –</strong> Fill out a short form to tell us about your writing and what you're looking for.
  //       </li>
  //       <li>
  //         <strong>We Review –</strong> Our team reads every application. We’ll either invite you in now or let you know we’re keeping your application on file for the next round.
  //       </li>
  //       <li>
  //         <strong>You're In –</strong> If accepted, you'll get an email with a link to complete your registration and join the community.
  //       </li>
  //     </ol>
  //   </div>
  // );

  // const findCreatives = () => (
  //   <div className="text-emerald-800 rounded-lg p-4 h-full">
  //     <div className="text-center">
  //       <h2 className="lora-medium font-bold text-[2rem] mb-4">Find Your Creative Community</h2>
  //       <div className="text-left">
  //         <h2 className="text-[1rem] leading-loose open-sans-medium mb-4">
  //           Plumbum is a space for writers to share work, get feedback, and connect with like-minded creatives. Whether you're refining your next piece or just starting out, you'll find support, inspiration, and the right audience here.
  //         </h2>
  //         <a onClick={apply} className="text-[1rem] cursor-pointer inline-block">[→ Join the Beta]</a>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const writingJourney = () => (
  //   <div className="text-center py-9  text-emerald-800 leading-loose">
  //     <h1 className="lora-bold text-left">Why Plumbum Works?</h1>
  //     <br/>
  //     <ul className="text-left">
  //       <li className="text-[1rem] my-1">
  //         <h6 className="open-sans-medium">
  //           <strong>Writer-Driven Feedback –</strong> Get real, constructive responses from fellow writers.
  //         </h6>
  //       </li>
  //       <li className="text-[1rem] my-1">
  //         <h6 className="open-sans-medium">
  //           <strong>Curated Discovery –</strong> Curate your space and discover others curated collections and add them to your space of inspiration.
  //         </h6>
  //       </li>
  //       <li className="text-[1rem] my-1">
  //         <h6 className="open-sans-medium">
  //           <strong>Workshops & Events –</strong> Take your craft further with live workshops and community gatherings.
  //         </h6>
  //       </li>
  //     </ul>
  //     <div className="text-left">
  //       <a onClick={() => router.push(Paths.discovery())} className="text-[1rem] cursor-pointer inline-block">[→ Explore More]</a>
  //     </div>
  //   </div>
  // );

  // const howItWorks = () => (
  //   <div className="py-2 leading-loose text-emerald-700 flex flex-col max-w-full">
  //     <h1 className="lora-bold text-left text-emerald-800 text-4xl mt-4 py-4">How It Works</h1>
  //     <ul className="list-disc open-sans-medium list-inside open-sans-regular space-y-3 text-[1rem]">
  //       <li>
  //         <strong>Get Feedback –</strong> Share your drafts and receive thoughtful, constructive responses from writers who care.
  //       </li>
  //       <li>
  //         <strong>Join Live Workshops –</strong> Hop into real-time sessions online or around NYC for direct feedback and collaboration.
  //       </li>
  //       <li>
  //         <strong>Share Your Work –</strong> Publish pieces-in-progress or notes-app gems in a space for experimentation.
  //       </li>
  //       <li>
  //         <strong>Find Fresh Voices –</strong> Discover new writers and connect through shared creativity and weirdness.
  //       </li>
  //     </ul>
  //   </div>
  // );
 function FoundingCohort() {
  const tiers = [
  {
    eyebrow: "Standard",
    name: "Community",
    price: "Free to join",
    description:
      "Get in the room. Access public events, workshops, and the Plumbum app. No commitment, no pressure — just show up.",
    benefits: [
      "Access to open events and workshops",
      "Plumbum app with daily prompts and community feed",
      "Peer feedback on your writing",
    ],
    cta: { label: "Join Free", href: "#", variant: "ghost" },
    featured: false,
  },
  {
    eyebrow: "Founding Cohort",
    badge: "Limited — 200 spots",
    name: "Founding Cohort",
    price: "50% off events & subscriptions — permanently",
    description:
      "For the people who show up early. Not because they need convincing, but because they already get it.",
    benefits: [
      "50% off all future events and subscriptions — permanently",
      "Early access to new features before anyone else",
      "A direct voice in shaping what Plumbum becomes",
    ],
    cta: { label: "Claim Your Spot →", href: "https://tally.so/r/44zJ55", variant: "solid" },
    featured: true,
  },
  {
    eyebrow: "Supporters",
    name: "The Alchemists",
    price: "Donor tier",
    description:
      "You believe in where this is going. The Alchemists donors help fund the infrastructure — events, tools, and the team building it.",
    benefits: [
      "Everything in Founding Cohort",
      "Name in the credits as a founding supporter",
      "Invites to private donor gatherings",
    ],
    cta: { label: "Learn More", href: "https://tally.so/r/44zJ55", variant: "ghost" },
    featured: false,
  },
  ]


  return (
    <div>
      
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`flex flex-col rounded-2xl p-6 bg-white ${
            tier.featured
              ? "border-2 border-emerald-600"
              : "border border-zinc-200"
          }`}
        >
          {tier.badge && (
            <span className="open-sans-medium inline-block self-start text-[0.65rem] tracking-widest uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md mb-3">
              {tier.badge}
            </span>
          )}

          <p
            className={`open-sans-medium text-xs tracking-widest uppercase mb-2 ${
              tier.featured ? "text-emerald-600" : "text-zinc-400"
            }`}
          >
            {tier.eyebrow}
          </p>

          <h2 className="lora-bold text-xl leading-tight text-zinc-900 mb-2">
            {tier.name}
          </h2>

          <p className="open-sans-medium text-sm text-zinc-500 mb-4">
            {tier.price}
          </p>

          <hr className="border-zinc-100 mb-4" />

          <p className="open-sans-medium text-sm leading-relaxed text-zinc-500 mb-5 flex-1">
            {tier.description}
          </p>

          <ul className="space-y-2 mb-6">
            {tier.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm open-sans-medium text-zinc-800">
                <span className="text-emerald-500 mt-0.5">→</span>
                {benefit}
              </li>
            ))}
          </ul>

          <a
            href={tier.cta.href}
            target={tier.cta.href.startsWith("http") ? "_blank" : undefined}
            rel={tier.cta.href.startsWith("http") ? "noreferrer" : undefined}
            className={`open-sans-medium text-sm font-medium text-center rounded-full px-5 py-3 transition-colors ${
              tier.cta.variant === "solid"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            {tier.cta.label}
          </a>
        </div>
      ))}
    </div>
    </div>
  );

}

function ProblemTriptych() {
  const problems = [
  {
    icon: "🎓",
    category: "Writing Schools",
    headline: "They teach craft. Not belonging.",
    body: "MFAs and workshops cost $20K–$60K. Acceptance rates at top journals are still 1–5%, and most MFA grads never publish at the scale they hoped.",
    failure: "No community after graduation.",
  },
  {
    icon: "📱",
    category: "Social Media",
    headline: "Visibility without growth.",
    body: "Algorithms optimize for engagement, not virtuosity. Facebook posts reach ~1–2% of followers. Writing is slow and reflective. Social is fast and reactive.",
    failure: "Reach without resonance.",
  },
  {
    icon: "✍🏽",
    category: "Writing Platforms",
    headline: "Nearly impossible to grow.",
    body: "Substack and Medium solved publishing — but not discovery or income. Only a tiny fraction of writers earn meaningfully. Success is concentrated at the very top.",
    failure: "Easy to post. Nearly impossible to grow.",
  },
];
  return (
    <div className="py-4">
      <div className="mb-2">
        <span className="open-sans-medium text-xs tracking-widest uppercase text-zinc-400">
          The Problem
        </span>
      </div>
      <h2 className="lora-bold text-[2rem] leading-tight text-zinc-900 mb-2">
        Writers have options. None of them work.
      </h2>
      <p className="open-sans-medium text-[1rem] leading-loose text-zinc-500 mb-8">
        Three systems exist for writers. Each solves something. None solve the right thing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {problems.map((p) => (
          <div
            key={p.category}
            className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <span className="text-2xl mb-4" role="img" aria-label={p.category}>
              {p.icon}
            </span>

            <p className="open-sans-medium text-xs tracking-widest uppercase text-zinc-400 mb-2">
              {p.category}
            </p>

            <h3 className="lora-bold text-[1.1rem] leading-snug text-zinc-900 mb-3">
              {p.headline}
            </h3>

            <p className="open-sans-medium text-sm leading-relaxed text-zinc-500 mb-5 flex-1">
              {p.body}
            </p>

            <div className="border-t border-zinc-100 pt-4">
              <p className="open-sans-medium text-sm text-red-500 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">✗</span>
                {p.failure}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  // const stayInLoop = () => (
  //   <div className="p-3 flex flex-col">
  //     <h1 className="text-[3rem] mx-auto lora-bold">Stay in the Loop</h1>
  //     <h2 className="mx-4 my-2 open-sans-medium text-l">Be the first to know about new features, workshops, and events.</h2>
  //     <h2 className="mx-4 my-2 open-sans-medium text-l">Follow the Journey</h2>
  //     <a
  //       className="flex flex-col text-center my-4 mx-auto cursor-pointer"
  //       href="https://www.instagram.com/channel/AbaI9yaoN4KfPze_/"
  //       target="_blank" rel="noreferrer"
  //     >
  //       <p className="open-sans-medium mx-4 my-4 text-emerald-600">Join the Instagram Channel. Today!</p>
  //       <img className="mx-auto w-[8em]" src={ig} alt="Slack invite" />
  //     </a>
  //     <p
  //       className="flex open-sans-medium my-4 mx-auto text-center cursor-pointer"
  //       onClick={() => router.push(Paths.calendar())}
  //     >
  //       Check out the Calendar for NYC Writing Scene
  //     </p>
  //     <img
  //       onClick={() => router.push(Paths.calendar())}
  //       className="h-[8em] mx-auto w-[8em] cursor-pointer"
  //       src={events}
  //       alt="Calendar icon"
  //     />
  //     <div className="flex my-4 open-sans-medium mx-auto text-lg text-left leading-loose tracking-loose">
  //       <p>
  //         <a href="https://www.instagram.com/plumbumapp" target="_blank" rel="noreferrer">@plumbumapp</a> 
  //       </p>
  //     </div>
  
  //   </div>
  // );

  const userTestimonial = () => (
    <div>
      <h6 className="text-[1.8rem] lg:text-[2rem] lora-bold">Real Writers, <br />Real Growth</h6>
      <div className="px-4 my-4">
        <h6 className="lora-medium text-[1rem] lg:text-[1.2rem]">
          <em>
            "Plumbum.app Workshops have been impactful in helping me to build community and network with poets from across the New York City and the Tri-State area. I walk away from these workshops with quality feedback and so many new ways
            to think about my work. Plumbum’s goal of supporting writers with their craft is clear and quite effective with the supportive environment to match."
          </em>
        </h6>
        — [Rob P.]
      </div>
    </div>
  );

  return (
      <IonContent color="light" fullscreen={true} className="ion-padding page-content">
        <div className="pt-8 w-[94vw] mx-auto ">
        {/* <IonGrid> */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem 1rem', textAlign: 'center' }}>
  <h1 className="lora-bold text-emerald-800" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', margin: 0, lineHeight: 1.2 }}>
    Plumbum
  </h1>
  <p className="text-emerald-600" style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', margin: 0 }}>
    Share your Weirdness
  </p>
  <p className="text-emerald-600" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', margin: 0 }}>
    Get thoughtful feedback • Grow through workshops
  </p>
</div>

          {/* <IonRow className="items-center">  */}
            {/* {md && (
              <>
               <IonCol>
                <div ><BookCarousel images={secImages} /></div>
                {findCreatives()}
               </IonCol>
              </>
            )} */}
            {/* <IonCol > */}
             <div ><BookCarousel images={firstImages} /></div> 
            {/* </IonCol>
            
          </IonRow> */}
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
                onClick={() => router.push(Paths.onboard)}
              >
                Become Part of our Writers' Circle
              </IonText>
            </IonCol>
          </IonRow>
                  <div className="flex flex-col items-center text-center mt-12">
          <IonLabel><h1 className=""><b></b></h1></IonLabel>
{<ProblemTriptych />}
</div>
<TestimonialTriptych/>
          <div className="flex flex-col items-center text-center mt-12">
          <IonLabel><h1 className=""><b>Join Plumbum</b></h1></IonLabel>
{<FoundingCohort/>}
</div>
          {/* <IonRow> */}
            {/* <IonCol size={md ? "6" : "12"}>
              {howItWorks()}
            </IonCol>
            <IonCol size={md ? "6" : "12"}>
              {writingJourney()}
            </IonCol>

            <IonCol size={md ? "4" : "12"}>
              {userTestimonial()}
            </IonCol>
            {/* <IonCol size={md ? "4" : "12"}>
              {whyMembership()}
            </IonCol> */}
            {/* <IonCol size={md ? "4" : "12"}>
              {applicationProcess()}
            </IonCol>
            <IonCol size={md ? "4" : "12"}>
              {foundingCohort()}
            </IonCol>
          </IonRow> */}

          {/* <IonRow>
            <IonCol size="12" className="ion-text-center">
              {stayInLoop()}
            </IonCol>
          </IonRow>  */}

  

          <IonRow>
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
                 <h6><a className="text-soft" onClick={() => router.push("/privacy")}>Privacy Policy</a></h6>
               <h6><a className="text-soft"  onClick={() => router.push("/terms")}>Terms of Service</a></h6>
              <IonText className="ion-padding-top" color="medium">
                © Plumbum 2025
              </IonText>
              </div>
            </IonCol>
          </IonRow>
        {/* </IonGrid> */}
        {!currentProfile && <ScrollDown text="↓Apply Below" visible={true} />}
             </div>
      </IonContent>

  )
}