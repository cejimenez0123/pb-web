import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import authRepo from "../../data/authRepo";
import validateEmail from "../../core/validateEmail";
import Context from "../../context";
import clear from "../../images/icons/clear.svg";
import { initGA, sendGAEvent } from "../../core/ga4";
import { IonContent} from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";
import { useDialog } from "../../domain/usecases/useDialog";

function NewsletterContainer() {
  const { setError } = useContext(Context);
  const { seo, setSeo } = useContext(Context);
const{openDialog,closeDialog,dialog}=useDialog()
  const selectRef = useRef(null);

  // ---------- GA INITIALIZATION ----------
  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Newsletter Apply Page", "View Newsletter Apply Page:", "", 0, false);
  }, []);

  // ---------- FORM STATE ----------
  const [formData, setFormData] = useState({
    preferredName: "",
    igHandle: "",
    email: "",
    frequency: 1,
    thirdPlaces: [],
    thirdPlace: "",
    eventInterests: [],
    newsletterContent: [],
    writingRole: [],
    otherInputs: {
      eventInterests: "",
      newsletterContent: "",
      writingRole: "",
    },
  });

  const [user, setUser] = useState(null);

  // ---------- SEO ----------
  useEffect(() => {
    if (location.pathname.includes("newsletter")) {
      setSeo({ ...seo, title: "Plumbum (Newsletter Apply)" });
    }
  }, [location.pathname]);

  // ---------- AUTO CLEAR ERROR ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // ---------- CHECKBOX HANDLER ----------
  const handleCheckboxChange = (event, field) => {
    const value = event.target.value;

    setFormData((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
      };
    });
  };

  // ---------- HANDLE OTHER INPUTS ----------
  const handleOtherInputChange = (category, e) => {
    setFormData((prev) => ({
      ...prev,
      otherInputs: { ...prev.otherInputs, [category]: e.target.value },
    }));
  };

  // ---------- GENERAL FIELD HANDLER ----------
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ---------- APPLY / SUBMIT ----------
  const onClickApply = async (e) => {
    e.preventDefault();

    sendGAEvent("Apply for Newsletter", "Apply for Newsletter", "Subscribe", 0, false);

    if (!validateEmail(formData.email)) {
      setError("Please use valid email");
      return;
    }

    try {
      const payload = { ...formData, frequency: Number(formData.frequency) };
      const data = await authRepo.newsletter(payload);
console.log(data)

      if (data.user)
        { setUser(data.user)
          openDialog({
  isOpen: true,
  title: "Welcome!",
  text: (
    <div className="p-6">
      <p>Thank You {data.user.preferredName}! You’re In—Welcome to the Journey!</p>
      <br />
      <p>You’re officially on board as a beta user for Plumbum.</p>
      <br />
      <p>- Sol Emilio Christian, Founder of Plumbum</p>
    </div>
  ),
  disagreeText: "Close",
  onClose: () => closeDialog()
});
        }

      // Reset form
      setFormData({
        fullName: "",
        igHandle: "",
        email: "",
        frequency: 1,
        thirdPlaces: [],
        thirdPlace: "",
        eventInterests: [],
        newsletterContent: [],
        writingRole: [],
        otherInputs: { eventInterests: "", newsletterContent: "", writingRole: "" },
      });
    } catch (e) {
      if (e.status === 409) {
        setUser({ message: "User has already applied" });

        setFormData({
          fullName: "",
          igHandle: "",
          email: "",
          frequency: 1,
          thirdPlaces: [],
          thirdPlace: "",
          eventInterests: [],
          newsletterContent: [],
          writingRole: [],
          otherInputs: { eventInterests: "", newsletterContent: "", writingRole: "" },
        });
      } else {
        setError(e.message);
      }
    }
  };

  // ---------- CLOSE DIALOG ----------
  const handleClose = () => setUser(null);

  // ---------- EVENT OPTIONS ----------
  const eventOptions = [
    "Workshops & Classes",
    "Open Mics & Readings",
    "Casual Writing Meetups",
    "Panel Discussions",
    "Concerts",
    "Art Shows",
    "Film Screenings",
    "Mixers",
    "Dance Nights",
    "Other",
  ];

  const contentOptions = [
    "Writing prompts",
    "Literary event announcements",
    "Interviews with writers",
    "Book/poetry recommendations",
    "Opportunities (grants, submissions, fellowships, workshops)",
    "Other",
  ];

  const writingRoles = [
    "It’s my profession",
    "It’s my creative outlet",
    "It helps me process emotions",
    "It’s a way to connect with others",
    "Other",
  ];

  // ---------- THIRD PLACES INPUT ----------
  const renderThirdPlaces = () => (
    <>
      <label className="block mt-4 lg:text-xl text-emerald-700 mont-medium font-semibold mb-2">
        Where do you hang out outside of work/school?
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex">
          <input
            type="text"
            className="input bg-transparent text-emerald-700 border-emerald-300 border-1 rounded-full mt-2 mb-4 grow"
            value={formData.thirdPlace}
            onChange={(e) => handleChange("thirdPlace", e.target.value)}
            placeholder="Enter a location"
          />

          <button
            type="button"
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2 ml-2"
            onClick={() => {
              const place = formData.thirdPlace.trim();
              if (place && !formData.thirdPlaces.includes(place)) {
                setFormData((prev) => ({
                  ...prev,
                  thirdPlaces: [...prev.thirdPlaces, place],
                  thirdPlace: "",
                }));
              }
            }}
          >
            Add
          </button>
        </div>

        {formData.thirdPlaces.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.thirdPlaces.map((place, i) => (
              <div
                key={i}
                className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full flex items-center"
              >
                <span>{place}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      thirdPlaces: prev.thirdPlaces.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="ml-2 text-red-500"
                >
                  <img src={clear} alt="remove" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <IonContent fullscreen={true}>
      <ErrorBoundary>
        <div className="bg-cream min-h-screen pb-20">
          <form
            onSubmit={onClickApply}
            className="form-data shadow-sm md:rounded-lg pb-40 bg-cream bg-opacity-70 flex flex-col px-6 md:max-w-[48rem] mx-auto"
          >
            {/* HEADER */}
            <h6 className="text-emerald-700 lora-bold text-sm mt-6">* Required</h6>

            <div className="w-full text-center text-emerald-700 mb-8">
              <h3 className="mx-auto text-2xl mont-medium my-8">Newsletter Sign Up</h3>
              <h5 className="mont-medium">Keep up with our events, workshops, growth, and development.</h5>
              <h6 className="mont-medium">Joining does not make you a user. You can join later.</h6>
            </div>

            {/* Preferred Name */}
            <label className="input rounded-full mt-4 text-emerald-700 py-8 border border-emerald-300 flex items-center gap-2">
              Preferred Name
              <input
                type="text"
                className="grow pl-4 text-emerald-700"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Jon Doe"
              />
            </label>

            {/* Email */}
            <label className="input rounded-full mt-4 py-8 border border-emerald-300 text-emerald-700 flex items-center gap-2">
              <h6 className="font-bold mont-medium flex min-w-[3.8em] text-sm">* Email</h6>
              <input
                type="text"
                name="email"
                className="grow pl-4 text-emerald-700"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value.trim())}
              />
            </label>

            {formData.email.length > 0 &&
              !validateEmail(formData.email) && (
                <h6 className="text-sm mont-medium text-red-500">
                  Please use a valid email
                </h6>
              )}

            {/* IG Handle */}
            <label className="input rounded-full mt-4 py-8 border border-emerald-300 text-emerald-700 flex items-center">
              <h6 className="font-bold mont-medium text-sm">IG Handle</h6>
              <input
                type="text"
                className="grow mx-2 text-emerald-700"
                value={formData.igHandle}
                onChange={(e) => handleChange("igHandle", e.target.value.trim())}
              />
            </label>

            {/* EVENT INTERESTS */}
            <label className="block mt-6 text-emerald-700 font-semibold">
              What kinds of events help you grow as a writer or creative?
            </label>

            {eventOptions.map((option) => (
              <label key={option} className="flex items-center text-emerald-700 mb-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.eventInterests.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "eventInterests")}
                  className="mr-2 checkbox border-emerald-300"
                />
                {option}
              </label>
            ))}

            {formData.eventInterests.includes("Other") && (
              <input
                type="text"
                placeholder="Specify"
                className="input bg-transparent text-emerald-700 border-emerald-300 rounded-full mt-2 mb-4"
                value={formData.otherInputs.eventInterests}
                onChange={(e) => handleOtherInputChange("eventInterests", e)}
              />
            )}

            {/* NEWSLETTER CONTENT */}
            <label className="block mt-6 text-emerald-700 font-semibold">
              What type of content do you want from Plumbum’s newsletter?
            </label>

            {contentOptions.map((option) => (
              <label key={option} className="flex items-center text-emerald-700 mb-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.newsletterContent.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "newsletterContent")}
                  className="mr-2 checkbox border-emerald-300"
                />
                {option}
              </label>
            ))}

            {formData.newsletterContent.includes("Other") && (
              <input
                type="text"
                placeholder="Specify Other"
                className="input bg-transparent text-emerald-700 border-emerald-300 rounded-full mt-2 mb-4"
                value={formData.otherInputs.newsletterContent}
                onChange={(e) => handleOtherInputChange("newsletterContent", e)}
              />
            )}

            {/* WRITING ROLE */}
            <label className="block mt-6 text-emerald-700 font-semibold">
              What role does writing or storytelling play in your life?
            </label>

            {writingRoles.map((option) => (
              <label key={option} className="flex items-center text-emerald-700 mb-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.writingRole.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "writingRole")}
                  className="mr-2 checkbox border-emerald-300"
                />
                {option}
              </label>
            ))}

            {formData.writingRole.includes("Other") && (
              <input
                type="text"
                placeholder="Specify Other"
                className="input bg-transparent text-emerald-700 border-emerald-300 rounded-full mt-2 mb-4"
                value={formData.otherInputs.writingRole}
                onChange={(e) => handleOtherInputChange("writingRole", e)}
              />
            )}

            {renderThirdPlaces()}

            {/* EMAIL FREQUENCY */}
            <div className="flex justify-between mt-8 mb-4">
              <label className="text-emerald-700 my-auto font-semibold">
                Email Frequency
              </label>

              <select
                ref={selectRef}
                name="frequency"
                className="bg-white text-emerald-700 select select-bordered"
                value={formData.frequency}
                onChange={(e) => handleChange("frequency", Number(e.target.value))}
              >
                <option value={1}>Daily</option>
                <option value={3}>Every 3 days</option>
                <option value={7}>Weekly</option>
                <option value={14}>Every 2 weeks</option>
                <option value={30}>Monthly</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className={`mont-medium mt-8 mb-16 py-4 text-2xl text-white px-20 mx-auto rounded-full shadow-md 
                ${validateEmail(formData.email)
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-700"
                  : "bg-gradient-to-r from-purple-500 to-gray-400"
                }`}
            >
              Subscribe
            </button>
          </form>

          {/* SUCCESS / ERROR DIALOG */}
          {/* <Dialog
            open={!!user}
            onClose={handleClose}
            text={
              <div className="p-6">
                {!user ? (
                  <p>Error. Try again later.</p>
                ) : user.message ? (
                  <div className="text-center lora-medium">
                    <p>User already applied</p>
                    <br />
                    <p>
                      Message{" "}
                      <a href="https://www.instagram.com/plumbumapp" target="_blank">
                        @plumbumapp
                      </a>
                      {" "}or email plumbumapp@gmail.com
                    </p>
                    <br />
                    <p>Subject: I want to be an alpha user!</p>
                  </div>
                ) : (
                  <div className="lora-medium leading-relaxed">
                    <p>Thank You {user.preferredName}! You’re In—Welcome to the Journey!</p>
                    <br />
                    <p>
                      You’re officially on board as a beta user for Plumbum. This is more than
                      an app—we’re building a community where stories grow and writers rise.
                    </p>
                    <br />
                    <p>Let’s make our story, together.</p>
                    <br />
                    <p>- Sol Emilio Christian, Founder of Plumbum</p>
                  </div>
                )}
              </div>
            }
          /> */}
        </div>
      </ErrorBoundary>
 </IonContent>
  );
}

export default NewsletterContainer;
