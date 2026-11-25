export const getProfileCollectionId = (currentProfile, type="") => {

  return currentProfile?.profileToCollections?.find(
    (item) => item?.type === type.toLowerCase()
  ).collection ?? null;
};