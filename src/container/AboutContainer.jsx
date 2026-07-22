
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
import appleLogo from "../images/logo/Applelogo.png"
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

import { useEffect, useRef, useState } from "react";
// import { sendGAEvent } from "../core/ga4";

// Set this to your real launch instant.
// Using an explicit UTC offset avoids "environment default timezone" bugs.
const LAUNCH_DATE_ISO = "2026-07-23T06:00:00-04:00"; // 6:00 AM America/New_York (EDT)
const APP_STORE_URL = "https://apps.apple.com/us/app/plumbum-writers/id6751230895"
function getTimeRemaining(target) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="lora-bold text-[2rem] leading-none text-emerald-700 tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="open-sans-medium text-[0.65rem] tracking-widest uppercase text-zinc-400 mt-1">
        {label}
      </span>
    </div>
  );
}

function AppStoreLaunch() {
  const launchDate = useRef(new Date(LAUNCH_DATE_ISO)).current;
  const [remaining, setRemaining] = useState(() => getTimeRemaining(launchDate));

  useEffect(() => {
    // No need to tick every second if we're more than a minute out —
    // but for a launch countdown, per-second feels intentional, so keep it simple.
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(launchDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  const handleDownloadClick = () => {
    sendGAEvent("app_store_click", "Click Download", "App Store Launch CTA", 0, false);
  };

  const isLive = remaining === null;

  return (
    <div className="py-4">
      <div className="mb-2 text-center">
        <span className="open-sans-medium text-xs tracking-widest uppercase text-zinc-400">
          {isLive ? "Now Available" : "Coming Soon"}
        </span>
      </div>

      <h2 className="lora-bold text-[2rem] leading-tight text-zinc-900 mb-2 text-center">
        Plumbum {!isLive?"wiil be on the App Store":"is on the App Store"}
      </h2>

      <p className="open-sans-medium text-[1rem] leading-loose text-zinc-500 mb-8 text-center">
        {isLive
          ? "Download the app and join your first workshop today."
          : "Launching July 23 at 6:00 AM ET."}
      </p>

      <div className={`flex flex-col items-center rounded-2xl  ${!isLive?" bg-white border border-zinc-200 ":""} p-8 max-w-md mx-auto`}>
        {!isLive ? (
          <>
            <div className="flex gap-6 mb-6">
              <CountdownUnit value={remaining.days} label="Days" />
              <CountdownUnit value={remaining.hours} label="Hrs" />
              <CountdownUnit value={remaining.minutes} label="Min" />
              <CountdownUnit value={remaining.seconds} label="Sec" />
            </div>
           
          </>
        ) : (
          <a
          href={APP_STORE_URL}
  target="_blank"
  rel="noreferrer"
  onClick={handleDownloadClick}
  className="inline-flex items-center gap-2 bg-black text-white rounded-xl px-6 py-3 hover:bg-zinc-800 transition-colors"
>
  <img
    src={appleLogo}
    alt=""
    className="max-h-8 max-w-8"
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
  <span className="open-sans-medium text-sm leading-tight text-left">
    <span className="block text-[0.6rem] text-zinc-300">Download on the</span>
    <span className="block text-base font-semibold">App Store</span>
  </span>
</a>
  

        )}
      </div>
    </div>
  );
}

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

  const { currentProfile } = useContext(Context);
  const md = useMediaQuery({ query: '(min-width: 750px)' });
  const router = useIonRouter()

  useScrollTracking({ name: "About" });
  useLayoutEffect(() => {
    initGA();
    sendGAEvent("Page View", "View About Page");
  }, []);
  


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
// function BetaDownload() {
//   const steps = [
//     {
//       step: "Step 1",
//       icon: "📲",
//       name: "Download TestFlight",
//       body: "Plumbum runs through TestFlight, Apple's beta installer. Grab it from the App Store first — it's free and takes a second.",
//       cta: {
//         label: "Get TestFlight",
//         href: "https://apps.apple.com/app/testflight/id899247664",
//         variant: "ghost",
//       },
//       gaStep: "1_download_testflight",
//     },
//     {
//       step: "Step 2",
//       icon: "🪶",
//       name: "Install Plumbum",
//       body: "Once TestFlight is installed, come back here and tap below. It'll open in TestFlight and drop Plumbum onto your phone.",
//       cta: {
//         label: "Install Plumbum →",
//         href: "https://testflight.apple.com/join/nBJJb98f",
//         variant: "solid",
//       },
//       gaStep: "2_install_plumbum",
//     },
//   ];

//   return (
//     <>
//     <div className="py-4">
//       <div className="mb-2">
//         <span className="open-sans-medium text-xs tracking-widest uppercase text-zinc-400">
//           The Beta
//         </span>
//       </div>
//       <h2 className="lora-bold text-[2rem] leading-tight text-zinc-900 mb-2">
//         Get Plumbum on your iPhone.
//       </h2>
//       <p className="open-sans-medium text-[1rem] leading-loose text-zinc-500 mb-8">
//         Two steps. Grab TestFlight, then come back here to install Plumbum.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {steps.map((s) => (
//           <div
//             key={s.step}
//             className={`flex flex-col rounded-2xl p-6 bg-white ${
//               s.cta.variant === "solid"
//                 ? "border-2 border-emerald-600"
//                 : "border border-zinc-200"
//             }`}
//           >
//             <span className="text-2xl mb-4" role="img" aria-label={s.name}>
//               {s.icon}
//             </span>

//             <p
//               className={`open-sans-medium text-xs tracking-widest uppercase mb-2 ${
//                 s.cta.variant === "solid" ? "text-emerald-600" : "text-zinc-400"
//               }`}
//             >
//               {s.step}
//             </p>

//             <h3 className="lora-bold text-[1.1rem] leading-snug text-zinc-900 mb-3">
//               {s.name}
//             </h3>

//             <p className="open-sans-medium text-sm leading-relaxed text-zinc-500 mb-6 flex-1">
//               {s.body}
//             </p>
// <a
            
//               href={s.cta.href}
//               target="_blank"
//               rel="noreferrer"
//               onClick={() =>
//                 sendGAEvent("beta_step", { step: s.gaStep, source: "about_page" })
//               }
//               className={`open-sans-medium text-sm font-medium text-center rounded-full px-5 py-3 transition-colors ${
//                 s.cta.variant === "solid"
//                   ? "bg-emerald-600 text-white hover:bg-emerald-700"
//                   : "border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
//               }`}
//             >
//               {s.cta.label}
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// }
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
                    {<AppStoreLaunch/>}
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