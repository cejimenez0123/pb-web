
import { useContext, useEffect, useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"
import Dialog from "../../components/Dialog"
import { useLocation } from "react-router-dom"
import { IonContent } from "@ionic/react"
import ThankYou from "./ThankYou"
import Context from "../../context"

function ApplyContainer(props) {
  const location = useLocation()
  const { seo, setSeo, setError } = useContext(Context)

  const genres = [
    "Fiction",
    "Non-fiction",
    "Poetry",
    "Drama/Playwriting",
    "Screenwriting",
    "Flash Fiction",
    "Memoir",
    "Short Stories",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Mystery/Thriller",
    "Romance",
    "Young Adult",
    "Children's Literature",
    "Historical Fiction",
    "Satire/Humor",
    "Experimental/Hybrid Forms",
    "Other",
  ]

  // SINGLE SOURCE OF TRUTH
  const [formData, setFormData] = useState({
    igHandle: "",
    fullName: "",
    email: "",
    whyApply: "",
    howFindOut: "",
    otherGenre: "",
    communityNeeds: "",
    workshopPreference: "",
    feedbackFrequency: "",
    selectedGenres: [],
    comfortLevel: 0,
    platformFeatures: "",
  })

  const [user, setUser] = useState(null)

  // Update any field
  const handleChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : value,
    }))
    console.log(JSON.stringify(formData))
  }

  // Update SEO on load
  useEffect(() => {
    if (location.pathname.includes("apply")) {
      let soo = { ...seo }
      soo.title = "Plumbum (Apply)"
      setSeo(soo)
    }
  }, [])

  // Handle genre selection
  const handleGenreSelection = (genre) => {
    setFormData((prev) => {
      const already = prev.selectedGenres.includes(genre)
      return {
        ...prev,
        selectedGenres: already
          ? prev.selectedGenres.filter((g) => g !== genre)
          : [...prev.selectedGenres, genre],
      }
    })

  }

  // Submit
  const onClickApply = (e) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) return

    const finalGenres = formData.selectedGenres.includes("Other")
      ? [
          ...formData.selectedGenres.filter((g) => g !== "Other"),
          formData.otherGenre,
        ]
      : formData.selectedGenres

    const form = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      genres: finalGenres,
    }

    const call = location.pathname.includes("newsletter")
      ? authRepo.applyFromNewsletter(form)
      : authRepo.apply(form)

    call
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch((err) => {
        if (err.message.includes("403")) {
          setError("User Already Exists")
        } else {
          setError(err.message)
        }
      })

    setTimeout(() => setError(null), 4001)
  }

  return (
    <>
      <IonContent fullscreen={true} className="ion-padding">
        <form
          onSubmit={onClickApply}
          className="form-data shadow-sm sm:my-8 md:rounded-lg pb-30 bg-transparent text-emerald-700 flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] mx-auto lg:mt-24"
        >
          <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>

          <div className="w-full my-8 text-center">
            <h3 className="mx-auto text-2xl text-emerald-700 lora-bold my-2 w-fit">Interest Form</h3>
            <h6 className="text-md mont-medium">
              We’re building a space that’s nurturing, focused, and kind...
            </h6>
          </div>

          {/* Preferred Name */}
          <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700 py-8 font-bold mb-4 lg:py-8 bg-transparent border border-emerald-700 flex items-center gap-2">
            Preferred Name
            <input
              type="text"
              className="grow pl-4 text-emerald-700 bg-transparent"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName")(e.target.value)}
              placeholder="Jon Doe"
            />
          </label>

          {/* Email */}
          <label className="input mt-4 mb-2 rounded-full font-bold py-8 bg-transparent border border-emerald-700 text-emerald-700 flex items-center gap-2">
            *<h6 className="font-bold mont-medium text-[0.8rem]"> Email</h6>
            <input
              type="text"
              className="grow text-emerald-700 mont-medium pl-4 bg-transparent"
              value={formData.email}
              onChange={(e) =>
                handleChange("email")(e.target.value.trim())
              }
            />
          </label>

          {formData.email.length > 0 && !validateEmail(formData.email) ? (
            <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
          ) : null}

          {/* IG Handle */}
          <label className="input mt-4 rounded-full mb-8 font-bold py-8 bg-transparent text-emerald-700 border border-emerald-700 flex items-center">
            <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle</h6>
            <input
              type="text"
              className="grow mont-medium text-emerald-700 mx-2"
              value={formData.igHandle}
              onChange={(e) =>
                handleChange("igHandle")(e.target.value.trim())
              }
              placeholder="*****"
            />
          </label>

          {/* Artist Statement */}
          <label className="text-xl font-bold mont-medium text-emerald-700">Artist Statement</label>
          <label className="text-emerald-700 mont-medium text-l mb-2 pb-1 font-bold mt-4">
            What would make a writing space meaningful for you?
          </label>
          <textarea
            value={formData.whyApply}
            onChange={(e) => handleChange("whyApply")(e.target.value)}
            className="textarea bg-transparent w-full text-l h-min-24 border border-emerald-700 text-emerald-700"
          />

          {/* Community Needs */}
          <label className="text-emerald-700 mont-medium text-l mb-2 pb-1 font-bold mt-4">
            What do you look for in a writing community?
          </label>
          <textarea
            value={formData.communityNeeds}
            onChange={(e) => handleChange("communityNeeds")(e.target.value)}
            className="textarea bg-transparent w-full text-l h-min-24 border border-emerald-700 text-emerald-700"
          />

          {/* Genres */}
          <label className="text-emerald-700 text-l mont-medium mb-2 pb-1 font-bold mt-4">
            What genres do you write in?
          </label>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={genre}
                  checked={formData.selectedGenres.includes(genre)}
                  onChange={() => handleGenreSelection(genre)}
                  className="checkbox mx-1 border-black border-1"
                />
                <span className="text-emerald-700 open-sans-medium">{genre}</span>
              </label>
            ))}
          </div>

          {formData.selectedGenres.includes("Other") && (
            <input
              type="text"
              placeholder="Please specify"
              value={formData.otherGenre}
              onChange={(e) => handleChange("otherGenre")(e.target.value)}
              className="bg-transparent border border-emerald-700 py-2 text-emerald-700 text-[1rem] sm:text-xl input mt-4"
            />
          )}

          {/* Comfort Level */}
          <label className="text-emerald-700 text-l mont-medium mb-2 pb-1 font-bold mt-4">
            How comfortable are you sharing your work with others?
          </label>
          <div className="flex flex-col items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={formData.comfortLevel}
              onChange={(e) => handleChange("comfortLevel")(e.target.value)}
              className="range w-full"
            />
            <div className="flex justify-between w-[92%] text-sm text-emerald-700">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div className="flex justify-between w-[100%] text-sm text-emerald-700 mt-2">
              <span className="w-[20%] open-sans-medium text-left">Very Uncomfortable</span>
              <span className="w-[35%] open-sans-medium text-right">Very Comfortable</span>
            </div>
          </div>

          {/* Feedback Frequency */}
          <label className="text-emerald-700 text-l mont-medium mb-2 pb-1 font-bold mt-4">
            How often do you seek feedback on your writing?
          </label>
          <select
            value={formData.feedbackFrequency}
            onChange={(e) => handleChange("feedbackFrequency")(e.target.value)}
            className="select bg-transparent border rounded-full border-emerald-700 text-emerald-700 w-full text-l sm:text-xl"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="occasionally">Occasionally</option>
            <option value="rarely">Rarely</option>
          </select>

          {/* Workshop Preference */}
          <label className="text-emerald-700 mont-medium text-l mb-2 pb-1 mt-4">
            Would you prefer in-person workshops, online, or both?
          </label>
          <select
            value={formData.workshopPreference}
            onChange={(e) => handleChange("workshopPreference")(e.target.value)}
            className="select rounded-full bg-transparent border border-emerald-700 text-emerald-700 w-full text-l sm:text-xl"
          >
            <option value="in-person">In-person</option>
            <option value="online">Online</option>
            <option value="both">Both</option>
          </select>

          {/* How did you find out? */}
          <label className="text-emerald-700 text-l mont-medium mb-2 pb-1 font-bold mt-4">
            How did you find out about Plumbum?
          </label>
          <input
            value={formData.howFindOut}
            onChange={(e) => handleChange("howFindOut")(e.target.value)}
            className="bg-transparent border open-sans-medium border-emerald-700 py-8 text-emerald-700 text-l sm:text-xl input"
          />

          {/* Platform Features */}
          <label className="text-emerald-700 text-l mont-medium mb-2 pb-1 font-bold mt-4">
            What features would make a writing platform most valuable to you?
          </label>
          <textarea
            value={formData.platformFeatures}
            onChange={(e) => handleChange("platformFeatures")(e.target.value)}
            className="textarea bg-transparent w-full open-sans-medium text-l sm:text-xl h-min-24 border border-emerald-700 text-emerald-700"
          />

          <button
            type="submit"
            className={`mont-medium my-8 py-4 text-2xl text-white px-20 mx-auto rounded-full ${
              validateEmail(formData.email)
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-gradient-to-r from-purple-400 to-gray-500"
            } hover:bg-green-400 font-bold border-none shadow-sm`}
          >
            Apply
          </button>
        </form>

        <Dialog
          text={
            <div>
              {user ? (
                <div>
                  <ThankYou user={user} />
                </div>
              ) : (
                <div className="flex">
                  <p className="mx-auto my-auto">Error. Try again later</p>
                </div>
              )}
            </div>
          }
        />
      </IonContent>
    </>
  )
}

export default ApplyContainer
