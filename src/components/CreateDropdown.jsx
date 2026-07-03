// // src/components/nav/CreateDropdown.jsx
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useIonRouter } from "@ionic/react";
// import { IonImg } from "@ionic/react";
// import CreateIcon from "../images/icons/ink_pen.svg";
// import ImageIcon from "../images/icons/image.svg";
// import LinkIcon from "../images/icons/link.svg";
// import { setHtmlContent, setPageType, setPageInView, setEditingPage } from "../actions/PageActions";
// import { PageType } from "../core/constants";
// import Paths from "../core/paths";
// import CreateCollectionForm from "../components/collection/CreateCollectionForm";

// export default function CreateDropdown({ variant = "horizontal" }) {
//   const dispatch = useDispatch();
//   const router = useIonRouter();
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const { submitCollection, openDialog } = useSelector((state) => state.ui || {});

//   const [isOpen, setIsOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const onDocClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     document.addEventListener("touchstart", onDocClick);
//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("touchstart", onDocClick);
//     };
//   }, []);

//   const handleOpenCreateCollection = ({
//     initPages = [],
//     submitCollection,
//     dispatch,
//     currentProfile,
//     router,
//     formData,
//     setFormData,
//     setSubmitting,
//     openDialog,
//     submitting,
//     setError,
//   }) => {
//     openDialog({
//       height: 90,
//       text: (
//         <CreateCollectionForm
//           initPages={initPages}
//           formData={formData}
//           setFormData={setFormData}
//           error={setError?.()}
//         />
//       ),
//       title: "Create Collection",
//       agree: null,
//       disagreeText: "Cancel",
//       breakpoint: 0.9,
//     });
//   };

//   const handleNavigate = (type) => {
//     setIsOpen(false);
//     switch (type) {
//       case "write":
//         dispatch(setHtmlContent(""));
//         dispatch(setPageInView({ page: null }));
//         dispatch(setEditingPage({ page: null }));
//         dispatch(setPageType({ type: PageType.text }));
//         router.push(Paths.editor.text, "forward");
//         break;
//       case "image":
//         dispatch(setHtmlContent(""));
//         dispatch(setPageInView({ page: null }));
//         dispatch(setEditingPage({ page: null }));
//         dispatch(setPageType({ type: PageType.image }));
//         router.push(Paths.editor.image, "forward");
//         break;
//       case "link":
//         dispatch(setHtmlContent(""));
//         dispatch(setPageInView({ page: null }));
//         dispatch(setEditingPage({ page: null }));
//         dispatch(setPageType({ type: PageType.link }));
//         router.push(Paths.editor.link, "forward");
//         break;
//       case "collection":
//         handleOpenCreateCollection({
//           initPages: [],
//           submitCollection,
//           dispatch,
//           currentProfile,
//           router,
//           formData: { name: "", purpose: "", isPrivate: true, isOpenCollaboration: false },
//           setFormData: () => {},
//           openDialog,
//           setSubmitting: () => {},
//           submitting: false,
//           setError: () => {},
//         });
//         break;
//       default:
//         break;
//     }
//   };

//   const baseButtonClasses =""
//     // "flex items-center justify-center gap-2  text-white no-underline bg-transparent cursor-pointer";

//   const menuClasses =
//     "absolute bg-base-bg dark:bg-text-primary text-soft dark:text-base-surface rounded-xl shadow-lg py-2 z-50";

//   const itemButtonClasses =
//     "w-full text-center px-4 py-2 bg-base-bg dark:bg-text-primary text-sm text-soft dark:text-base-surface hover:bg-card-border dark:hover:bg-button-primary-hover capitalize transition-colors duration-150";

//   // Desktop (top navbar) → menu opens DOWN
//   const desktopMenuClasses = `${menuClasses} top-full left-0 mt-2 w-40`;

//   // Mobile (bottom nav) → menu opens UP
//   const mobileMenuClasses = `${menuClasses} bottom-full left-1/2 -translate-x-1/2 mb-2 w-36`;

//   return (
//     <div ref={ref} className="relative inline-block">
//       {/* Toggle button */}
// {variant === "horizontal" ? (
//   // Desktop: match other nav items’ font/size
//   <a
//     className="text-white no-underline cursor-pointer"
//     onClick={(e) => {
//       e.preventDefault();
//       setIsOpen((p) => !p);
//     }}
//   >
//     Create
//   </a>
// ) : (
//   // Mobile: keep your existing button + size
//   <button
//     onClick={() => setIsOpen((p) => !p)}
//     className={baseButtonClasses}
//     type="button"
//   >
//     <span className="text-[11px]">Create</span>
//   </button>
// )}

//       {/* Dropdown menu */}
//       {isOpen && (
//         <div className={variant === "horizontal" ? desktopMenuClasses : mobileMenuClasses}>
//           {["write", "image", "link", "collection"].map((item) => (
//             <button
//               key={item}
//               onClick={() => handleNavigate(item)}
//               className={itemButtonClasses}
//               type="button"
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// src/components/CreateDropdown.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import { setHtmlContent, setPageType, setPageInView, setEditingPage } from "../actions/PageActions";
import { PageType } from "../core/constants";
import Paths from "../core/paths";
import CreateCollectionForm from "../components/collection/CreateCollectionForm";
import { useDialog } from "../domain/usecases/useDialog";

export default function CreateDropdown({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const{openDialog} =useDialog()
  const currentProfile = useSelector((state) => state.users.currentProfile);
//   const { submitCollection, openDialog } = useSelector((state) => state.ui || {});

  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("touchstart", onDocClick);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [isOpen, onClose]);

  const handleOpenCreateCollection = ({
    initPages = [],
    submitCollection,
    dispatch,
    currentProfile,
    router,
    formData,
    setFormData,
    setSubmitting,
    openDialog,
    submitting,
    setError,
  }) => {
    openDialog({
      height: 90,
      text: (
        <CreateCollectionForm
          initPages={initPages}
          formData={formData}
          setFormData={setFormData}
          error={setError?.()}
        />
      ),
      title: "Create Collection",
      agree: null,
      disagreeText: "Cancel",
      breakpoint: 0.9,
    });
  };

  const handleNavigate = (type) => {
    onClose();
    switch (type) {
      case "write":
        dispatch(setHtmlContent(""));
        dispatch(setPageInView({ page: null }));
        dispatch(setEditingPage({ page: null }));
        dispatch(setPageType({ type: PageType.text }));
        router.push(Paths.editor.text, "forward");
        break;
      case "image":
        dispatch(setHtmlContent(""));
        dispatch(setPageInView({ page: null }));
        dispatch(setEditingPage({ page: null }));
        dispatch(setPageType({ type: PageType.image }));
        router.push(Paths.editor.image, "forward");
        break;
      case "link":
        dispatch(setHtmlContent(""));
        dispatch(setPageInView({ page: null }));
        dispatch(setEditingPage({ page: null }));
        dispatch(setPageType({ type: PageType.link }));
        router.push(Paths.editor.link, "forward");
        break;
        case "collection":
  openDialog({
    height: 90,
    text: (
      <CreateCollectionForm initPages={[]} onClose={() => closeDialog()} />
    ),
    title: "Create Collection",
    agree: null,
    disagreeText: "Cancel",
    breakpoint: 0.9,
  });
  break;
    //   case "collection":
        handleOpenCreateCollection({
          initPages: [],
          submitCollection,
          dispatch,
          currentProfile,
          router,
          formData: { name: "", purpose: "", isPrivate: true, isOpenCollaboration: false },
          setFormData: () => {},
          openDialog,
          setSubmitting: () => {},
          submitting: false,
          setError: () => {},
        });
        break;
      default:
        break;
    }
  };

  const menuClasses =
    "absolute bg-base-bg dark:bg-text-primary text-soft dark:text-base-surface rounded-xl shadow-lg py-2 z-50";

  const itemButtonClasses =
    "w-full text-center px-4 py-2 bg-base-bg dark:bg-text-primary text-sm text-soft dark:text-base-surface hover:bg-card-border dark:hover:bg-button-primary-hover capitalize transition-colors duration-150";

  // Desktop: menu opens DOWN
  const desktopMenuClasses = `${menuClasses} top-full left-0 mt-2 w-40`;

  // Mobile: menu opens UP (if you still use it there)
  const mobileMenuClasses = `${menuClasses} bottom-full left-1/2 -translate-x-1/2 mb-2 w-36`;

  return isOpen ? (
    <div ref={ref} className="relative inline-block">
      <div className={desktopMenuClasses}>
        {["write", "image", "link", "collection"].map((item) => (
          <button
            key={item}
            onClick={() => handleNavigate(item)}
            className={itemButtonClasses}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  ) : null;
}