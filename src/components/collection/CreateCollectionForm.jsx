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
import checkResult from "../../core/checkResult";

import "../../App.css";
import { useDialog } from "../../domain/usecases/useDialog";

import styles from "../../styles/style";

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
  // onClose,
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );
const {closeDialog}=useDialog()
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
      closeDialog()
      // if (onClose) {
      //   onClose();
      // }

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
                bg-transparent
            w-[100%]
            rounded-xl
            border
            border-gray-300
     
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
     dark:text-plumb-darkText
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
            w-[100%]
            bg-transparent
         
            dark:text-plumb-darkText
            resize-y
            rounded-xl
            border
            border-gray-300
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
           bg-transparent
            dark:text-cream
          "
        />
      </div>

      {/* Visibility */}
      <fieldset className="       bg-transparent
            dark:text-plumb-darkText">
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
              bg-transparent
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
           
              px-4
              py-4
              
              dark:border-gray-700
            dark:text-plumb-darkText
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
            bg-transparent
            dark:text-plumb-darkText
           
                accent-blueSea
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
              "
            />

            <span className="min-w-0">
              <span className="block text-sm  dark:text-plumb-darkText font-medium text-gray-900 dark:text-cream">
                Only me and people I give access to
              </span>

              <span className="mt-1 block  dark:text-plumb-darkText text-xs leading-5 text-gray-500 dark:text-gray-400">
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
dark:bg-transparent
       
            dark:text-plumb-darkText
              px-4
              py-4
              dark:bg-plumb-surface Dark
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
              bg-transparent
                accent-blueSea
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
              "
            />

            <span className="min-w-0   bg-transparent ">
              <span className="block text-sm dark:text-plumb-darkText font-medium text-gray-900">
                Anyone who can find it
              </span>

              <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-plumb-darkText
       ">
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
title="Open collaboration"
 description="People who can find this Room can add to it when collaboration is open."
 action={ 
   <input
        id="open-collaboration"
        type="checkbox"
        name="isOpenCollaboration"
        checked={formData.isOpenCollaboration}
        onChange={(event) =>
          setFormData((previous) => ({
            ...previous,
            isOpenCollaboration: event.target.checked,
          }))
        }
        aria-label="Enable open collaboration"
        className="
          checkbox checkbox-md
          border-plumb-borderStrong
          [--chkbg:theme(colors.green.700)]
          [--chkfg:white]
          checked:border-plumb-mint
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-plumb-focus
          focus-visible:ring-offset-2
          dark:border-plumb-darkBorderStrong
          dark:checked:border-plumb-mintLight
          dark:focus-visible:ring-plumb-mintLight
        "/>
    // <input
    //           type="checkbox"
    //           name="visibility"
    //           value="private"
    //           checked={
    //             formData.isPrivate === true
    //           }
    //       onChange={() =>
    //         setFormData((previous) => ({
    //           ...previous,
    //           isOpenCollaboration:
    //             !previous.isOpenCollaboration,
    //         }))
    //       }
    //           className="
    //             h-4
    //             w-4
    //             dark:bg-base-bg
    //         dark:text-plumb-darkText
           
    //             accent-blueSea
    //             focus-visible:outline
    //             focus-visible:outline-2
    //             focus-visible:outline-offset-2
    //             focus-visible:outline-blueSea
    //           "
    //         />
}
          // checked={
          // id="open-collaboration"
          // title="Open collaboration"
          // description="People who can find this Room can add to it when collaboration is open."
          // checked={
          //   formData.isOpenCollaboration
          // }
          
          // tooltip="Open collaboration controls whether people can contribute without you assigning them a writing or editing role first."
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
            dark:bg-plumb-surface Dark
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
      <div
        type="submit"
        disabled={submitting}
        className={styles.button.base+" "+styles.button.primary+ " hover:bg-plumb-mintLight/40 dark:border-plumb-mintLight dark:border dark:border-1"}
       onClick={handleSubmit}
        // className="
        //   flex
        //   min-h-[3.5rem]
        //   w-full
        //   items-center
        //   justify-center
        //   rounded-full
        //   bg-button-secondary-bg
        //   px-6
        //   py-3
        //   text-base
        //   font-semibold
        //   text-white
        //   shadow-sm
        //   transition
        //   hover:brightness-95
        //   focus-visible:outline
        //   focus-visible:outline-2
        //   focus-visible:outline-offset-2
        //   focus-visible:outline-blueSea
        //   active:scale-[0.99]
        //   disabled:cursor-not-allowed
        //   disabled:opacity-60
        // "
      >
        {submitting
          ? "Making your Room..."
          : "Make it"}
      </div>
    </form>
  );
}
function SettingRow({
  title,
  description,
  action,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-card-border
        p-4
        dark:border-white/10
      "
    >
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        <div className="min-w-0">
          <h3 className="text-sm font-medium text-text-primary dark:text-cream">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        <div className="shrink-0 ">
          {action}
        </div>

      </div>
    </div>
  );
}