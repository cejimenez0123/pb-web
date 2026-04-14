// import Paths from "./paths";
import Paths from "./paths";
import { createCollection, addStoryListToCollection, setCollectionInView } from "../actions/CollectionActions"; // adjust import if needed
import {  setPagesInView, clearPagesInView } from "../actions/PageActions"; // adjust import
import checkResult from "../core/checkResult";

const submitCollection = async ({
  formData,
  dispatch,
  router,
  currentProfile,
  initPages = [],
  onClose,
  setFormData,
  setSubmitting,
  setError,
}) => {
  const { name, purpose, isPrivate, isOpenCollaboration } = formData;
console.log("FCIK",formData)
  if (!name?.trim()) {
    setError("Collection name is required.");
    return;
  }
  console.log("Dialog agree clicked");
  setSubmitting(true);
  setError(null);

  try {
    const params = {
      title: name.trim() || "Untitled Collection",
      purpose: purpose.trim() || "",
      isPrivate,
      profileId: currentProfile?.id,
      isOpenCollaboration,
    };

    console.log("Creating collection with params:", params);

    const res = await dispatch(createCollection(params));
    
    const collection = res?.payload?.collection;

    if (!collection) {
      const errorMsg = res?.payload?.error?.message || "Failed to create collection.";
      setError(errorMsg);
      return;
    }

    dispatch(clearPagesInView());

    if (initPages.length > 0) {
      // Add pages to collection
      await dispatch(addStoryListToCollection({ id: collection.id, list: initPages, profile: currentProfile }))
        .then((res) =>
          checkResult(
            res,
            ({ collection, stories }) => {
              dispatch(setCollectionInView({ collection }));
              dispatch(setPagesInView({ pages: stories }));
              router.push(Paths.collection.createRoute(collection.id));
            },
            (err) => console.error("Error adding pages:", err)
          )
        );
    } else {
      dispatch(setCollectionInView({ collection }));
      router.push(Paths.collection.createRoute(collection.id));
    }
console.log("RESSS",res)
    // Reset form data
    setFormData({
      name: "",
      purpose: "",
      isPrivate: true,
      isOpenCollaboration: false,
    });

    // Close dialog if onClose exists
    if (onClose) onClose();

  } catch (err) {
    console.error("Error in submitCollection:", err);
    setError(err.message || "Failed to create collection.");
  } finally {
    setSubmitting(false);
  }
};

export default submitCollection;
