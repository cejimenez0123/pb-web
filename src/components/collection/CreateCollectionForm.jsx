import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";

import {
  addStoryListToCollection,
  createCollection,
  setCollectionInView,
} from "../../actions/CollectionActions";

import {
  clearPagesInView,
  setPagesInView,
} from "../../actions/PageActions";

import Paths from "../../core/paths";
import InfoTooltip from "../InfoTooltip";
import checkResult from "../../core/checkResult";

import "../../App.css";

const INITIAL_FORM = {
  name: "",
  purpose: "",
  isPrivate: true,
  isOpenCollaboration: false,
};

function FieldLabel({
  htmlFor,
  eyebrow,
  children,
  description,
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="
          block
          text-[0.68rem]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-soft
        "
      >
        {eyebrow}
      </label>

      <p
        id={`${htmlFor}-description`}
        className="
          mt-1
          text-sm
          leading-5
          text-gray-500
          dark:text-gray-400
        "
      >
        {description}
      </p>
    </div>
  );
}

function SettingRow({
  id,
  title,
  description,
  checked,
  onChange,
  tooltip,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
        rounded-2xl
        border
        border-gray-200
        bg-base-bg
        px-4
        py-4
        dark:border-gray-700
        dark:bg-base-surfaceDark
      "
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            className="
              text-sm
              font-medium
              text-gray-900
              dark:text-cream
            "
          >
            {title}
          </label>

          {tooltip ? (
            <InfoTooltip text={tooltip} />
          ) : null}
        </div>

        <p
          id={`${id}-description`}
          className="
            mt-1
            max-w-xl
            text-xs
            leading-5
            text-gray-500
            dark:text-gray-400
          "
        >
          {description}
        </p>
      </div>

      <label
        className="
          relative
          mt-0.5
          inline-flex
          shrink-0
          cursor-pointer
          items-center
        "
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="
            peer
            sr-only
          "
          aria-describedby={`${id}-description`}
        />

        <span
          aria-hidden="true"
          className="
            h-6
            w-11
            rounded-full
            border
            border-gray-300
            bg-gray-200
            transition
            peer-checked:border-blueSea
            peer-checked:bg-blueSea
            peer-focus-visible:outline
            peer-focus-visible:outline-2
            peer-focus-visible:outline-offset-2
            peer-focus-visible:outline-blueSea
            dark:border-gray-600
            dark:bg-gray-700
          "
        />

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition
            peer-checked:translate-x-5
          "
        />
      </label>
    </div>
  );
}

function ErrorMessage({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="
        rounded-2xl
        border
        border-red-300
        bg-red-50
        px-4
        py-3
        text-sm
        leading-5
        text-red-800
        dark:border-red-900
        dark:bg-red-950/30
        dark:text-red-200
      "
    >
      {typeof error === "string"
        ? error
        : error?.message ||
          "Something went wrong while creating the Room."}
    </div>
  );
}

export default function CreateCollectionForm({
  initPages = [],
  onClose,
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const name = formData.name.trim();
    const purpose =
      formData.purpose.trim();

    if (!name) {
      setError(
        "Give your Room a title before creating it."
      );
      return;
    }

    if (!currentProfile?.id) {
      setError(
        "We couldn't determine your profile. Please try again."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(
        createCollection({
          title: name,
          purpose,
          isPrivate:
            formData.isPrivate,
          profileId:
            currentProfile.id,
          isOpenCollaboration:
            formData.isOpenCollaboration,
        })
      );

      const collection =
        result?.payload?.collection;

      if (!collection?.id) {
        const message =
          result?.payload?.error?.message ||
          "Failed to create Room.";

        throw new Error(message);
      }

      /*
       * If this Room was created from an existing
       * Story, add those Stories before navigating.
       */
      if (initPages?.length > 0) {
        const addResult =
          await dispatch(
            addStoryListToCollection({
              id: collection.id,
              list: initPages,
              profile:
                currentProfile,
            })
          );

        await new Promise(
          (resolve, reject) => {
            checkResult(
              addResult,
              (payload) => {
                dispatch(
                  setCollectionInView({
                    collection:
                      payload?.collection ||
                      collection,
                  })
                );

                dispatch(
                  setPagesInView({
                    pages:
                      payload?.stories ||
                      initPages,
                  })
                );

                resolve(payload);
              },
              (addError) => {
                reject(
                  addError ||
                    new Error(
                      "The Room was created, but the initial writing could not be added."
                    )
                );
              }
            );
          }
        );
      } else {
        dispatch(
          setCollectionInView({
            collection,
          })
        );
      }

      /*
       * Only clear the previous page state after
       * the complete creation flow has succeeded.
       */
      dispatch(clearPagesInView());

      /*
       * Reset local form state before leaving.
       */
      setFormData(INITIAL_FORM);

      /*
       * Let the Dialog close itself.
       */
      if (onClose) {
        onClose();
      }

      router.push(
        Paths.collection.createRoute(
          collection.id
        )
      );
    } catch (submitError) {
      console.error(
        "Error creating collection:",
        submitError
      );

      setError(
        submitError?.message ||
          "Something went wrong while creating the Room."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-7"
    >
      {/* Title */}
      <div>
        <FieldLabel
          htmlFor="collection-name"
          eyebrow="Title"
          description="Give this Room a name you'll recognize later."
        />

        <input
          id="collection-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Winter pieces"
          autoComplete="off"
          autoFocus
          aria-describedby="collection-name-description"
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-base-bg
            px-4
            py-4
            text-lg
            text-gray-900
            shadow-sm
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blueSea
            focus:ring-2
            focus:ring-blueSea/20
            dark:border-gray-700
            dark:bg-base-surfaceDark
            dark:text-cream
          "
        />
      </div>

      {/* Purpose */}
      <div>
        <FieldLabel
          htmlFor="collection-purpose"
          eyebrow="What is it for?"
          description="You can change your mind later."
        />

        <textarea
          id="collection-purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="What do you want to gather here?"
          rows={4}
          aria-describedby="collection-purpose-description"
          className="
            min-h-[7rem]
            w-full
            resize-y
            rounded-xl
            border
            border-gray-300
            bg-base-bg
            px-4
            py-4
            text-base
            leading-6
            text-gray-900
            shadow-sm
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blueSea
            focus:ring-2
            focus:ring-blueSea/20
            dark:border-gray-700
            dark:bg-base-surfaceDark
            dark:text-cream
          "
        />
      </div>

      {/* Visibility */}
      <fieldset>
        <legend
          className="
            mb-2
            block
            text-[0.68rem]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-soft
          "
        >
          Who can read it?
        </legend>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            dark:border-gray-700
          "
        >
          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              border-b
              border-gray-200
              bg-base-bg
              px-4
              py-4
              dark:border-gray-700
              dark:bg-base-surfaceDark
            "
          >
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={
                formData.isPrivate === true
              }
              onChange={() =>
                setFormData((previous) => ({
                  ...previous,
                  isPrivate: true,
                }))
              }
              className="
                h-4
                w-4
                accent-blueSea
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
              "
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-gray-900 dark:text-cream">
                Only me and people I give access to
              </span>

              <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                Keep the Room private. You can add people
                through its roles later.
              </span>
            </span>
          </label>

          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              bg-base-bg
              px-4
              py-4
              dark:bg-base-surfaceDark
            "
          >
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={
                formData.isPrivate === false
              }
              onChange={() =>
                setFormData((previous) => ({
                  ...previous,
                  isPrivate: false,
                }))
              }
              className="
                h-4
                w-4
                accent-blueSea
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
              "
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-gray-900 dark:text-cream">
                Anyone who can find it
              </span>

              <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                The Room isn't private.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {/* Collaboration */}
      <fieldset>
        <legend
          className="
            mb-3
            block
            text-[0.68rem]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-soft
          "
        >
          Collaboration
        </legend>

        <SettingRow
          id="open-collaboration"
          title="Open collaboration"
          description="People who can find this Room can add to it when collaboration is open."
          checked={
            formData.isOpenCollaboration
          }
          onChange={() =>
            setFormData((previous) => ({
              ...previous,
              isOpenCollaboration:
                !previous.isOpenCollaboration,
            }))
          }
          tooltip="Open collaboration controls whether people can contribute without you assigning them a writing or editing role first."
        />
      </fieldset>

      {/* Initial writing */}
      {initPages?.length > 0 ? (
        <section
          className="
            rounded-2xl
            border
            border-blueSea/20
            bg-softBlue/20
            px-4
            py-4
            dark:bg-base-surfaceDark
          "
          aria-labelledby="initial-writing-title"
        >
          <p
            id="initial-writing-title"
            className="
              text-[0.68rem]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-blueSea
            "
          >
            Starting with your writing
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-300">
            {initPages.length === 1
              ? "The selected Story will be added to this Room when you create it."
              : `${initPages.length} selected Stories will be added to this Room when you create it.`}
          </p>
        </section>
      ) : null}

      {/* Error */}
      <ErrorMessage error={error} />

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="
          flex
          min-h-[3.5rem]
          w-full
          items-center
          justify-center
          rounded-full
          bg-button-secondary-bg
          px-6
          py-3
          text-base
          font-semibold
          text-white
          shadow-sm
          transition
          hover:brightness-95
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-blueSea
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {submitting
          ? "Making your Room..."
          : "Make it"}
      </button>
    </form>
  );
}

// import { useState } from "react";
// import {
//   IonLabel,
//   IonNote,
//   useIonRouter,
// } from "@ionic/react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addStoryListToCollection,
//   createCollection,
//   setCollectionInView,
// } from "../../actions/CollectionActions";
// import { clearPagesInView, setPagesInView } from "../../actions/PageActions";
// import Paths from "../../core/paths";
// import InfoTooltip from "../InfoTooltip";
// import "../../App.css";
// import checkResult from "../../core/checkResult";
// import { useDialog } from "../../domain/usecases/useDialog";

// export default function CreateCollectionForm({ initPages, onClose }) {
//   const dispatch = useDispatch();
//   const router = useIonRouter();
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const { openDialog, dialog,closeDialog,resetDialog} = useDialog();

//   const [formData, setFormData] = useState({
//     name: "",
//     purpose: "",
//     isPrivate: true,
//     isOpenCollaboration: false,
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // --- handle input change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // --- toggle boolean fields
//   const toggleField = (key) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // --- handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     if (submitting) return;

//     const { name, purpose, isPrivate, isOpenCollaboration } = formData;

//     if (!name.trim()) {
//       setError("Collection name is required.");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const params = {
//         title: name.trim() || "Untitled Collection",
//         purpose: purpose.trim() || "",
//         isPrivate,
//         profileId: currentProfile?.id,
//         isOpenCollaboration,
//       };

 

//       const res = await dispatch(createCollection(params));

//       if (res?.payload?.collection) {
//         const collection = res.payload.collection;
//         dispatch(clearPagesInView());

//         if (initPages && initPages.length > 0) {
//           await dispatch(
//             addStoryListToCollection({
//               id: collection.id,
//               list: initPages,
//               profile: currentProfile,
//             })
//           ).then((res) =>
//             checkResult(
//               res,
//               ({ collection, stories }) => {
//                 dispatch(setCollectionInView({ collection }));
//                 dispatch(setPagesInView({ pages: stories }));
//               },
//               (err) => console.error("Error adding stories:", err)
//             )
//           );
//         } else {
//           dispatch(setCollectionInView({ collection }));
//         }

//         router.push(Paths.collection.createRoute(collection.id));
//         if (onClose) onClose();

//         // close dialog
//         openDialog({ ...dialog, isOpen: false });

//         // reset form
//         setFormData({
//           name: "",
//           purpose: "",
//           isPrivate: true,
//           isOpenCollaboration: false,
//         });
//       } else if (res?.payload?.error) {
//         setError(res.payload.error.message || "Failed to create collection.");
//       }
//     } catch (err) {
//       console.error("Error creating collection:", err);
//       setError(err.message || "Failed to create collection.");
//     } finally {
//       setSubmitting(false);
//     }
//     resetDialog()
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//       {/* Collection Name */}
//       <div className="flex flex-col space-y-1">
//         <IonLabel className="text-blueSea font-medium">Collection Name</IonLabel>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           placeholder="Enter collection name"
//           onChange={handleChange}
//           required
//           className="rounded-lg border-blueSea dark:bg-base-surfaceDark dark:text-cream bg-base-bg  border-2 shadow-sm border-opacity-30 sm:w-full w-full p-3 text-blueSea"
//         />
//       </div>

//       {/* Purpose */}
//       <div className="flex flex-col space-y-1">
//         <IonLabel className="text-blueSea font-medium">Purpose</IonLabel>
//         <textarea
//           name="purpose"
//           value={formData.purpose}
//           placeholder="What is this collection for?"
//           onChange={handleChange}
//           className="rounded-lg border-blueSea border-2 bg-base-bg dark:bg-base-surfaceDark dark:bg-cream shadow-sm border-opacity-30 sm:w-full w-full min-h-[6em] text-blueSea p-3"
//         />
//       </div>

//       {/* Private / Open Collaboration */}
//       <div className="flex flex-col space-y-3">
//         {/* Private */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <InfoTooltip text="Collection will only be visible to you and those with roles" />
//             <span className="text-soft dark:text-cream font-medium">Private</span>
//           </div>
//           <p
//             onClick={() => toggleField("isPrivate")}
//             className="bg-blueSea bg-opacity-50 px-4 py-1 rounded-full text-white font-medium cursor-pointer text-center min-w-[3rem]"
//           >
//             {formData.isPrivate ? "Yes" : "No"}
//           </p>
//         </div>

//         {/* Open Collaboration */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <InfoTooltip text="Anyone who finds this collection can add to it if it's open" />
//             <span className="text-soft dark:text-cream font-medium">Open Collaboration</span>
//           </div>
//           <p
//             onClick={() => toggleField("isOpenCollaboration")}
//             className="bg-blueSea bg-opacity-50 px-4 py-1 rounded-full text-white font-medium cursor-pointer text-center min-w-[3rem]"
//           >
//             {formData.isOpenCollaboration ? "Yes" : "No"}
//           </p>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <IonNote color="danger" className="text-sm font-medium">
//           {error}
//         </IonNote>
//       )}

//       {/* Submit */}
//       <div
//         type="submit"
//         onClick={handleSubmit}
//         className="rounded-full flex justify-center items-center shadow-sm px-6 py-2 border-2 border-blueSea bg-blueSea bg-opacity-90 text-white font-bold text-[1rem] w-fit mx-auto"
//       >
//         {submitting ? "Creating..." : "Create"}
//       </div>
//     </form>
//   );
// }
