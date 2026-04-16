function computePermissions(resource, profile, config = {}) {
  const {
    getOwnerId = (r) => r.profileId,
    getAccessList = (r) => r.roles || [],
    getAccessRole = (entry) => entry.role,
    isPrivate = (r) => r.isPrivate,
    isOpen = (r) => r.isOpenCollaboration,
    canWriteRoles = [],
    canEditRoles = [],
  } = config;

  let canSee = false;
  let canAdd = false;
  let canEdit = false;
  let role = null;

  if (!resource) {
    return { canSee, canAdd, canEdit, role };
  }

  // ------------------ PRIVATE + NO USER ------------------
  if (!profile && isPrivate(resource)) {
    return { canSee: false, canAdd: false, canEdit: false, role: null };
  }

  // ------------------ OWNER ------------------
  if (profile && getOwnerId(resource) === profile.id) {
    return {
      canSee: true,
      canAdd: true,
      canEdit: true,
      role: "owner",
    };
  }

  // ------------------ ACCESS LIST (roles, betaReaders, etc) ------------------
  let found = null;

  if (profile) {
    const accessList = getAccessList(resource);

    found = accessList.find((entry) => entry?.profileId === profile.id);

    if (found) {
      const userRole = getAccessRole(found);
      role = userRole;

      canSee = true;

      if (canWriteRoles.includes(userRole) || isOpen(resource)) {
        canAdd = true;
      }

      if (canEditRoles.includes(userRole)) {
        canEdit = true;
      }

      return { canSee, canAdd, canEdit, role };
    }
  }

  // ------------------ OPEN ACCESS ------------------
  if (isOpen(resource)) {
    canAdd = true;
  }

  // ------------------ PUBLIC ------------------
  if (!isPrivate(resource)) {
    canSee = true;
  }

  return { canSee, canAdd, canEdit, role };
}
export default computePermissions