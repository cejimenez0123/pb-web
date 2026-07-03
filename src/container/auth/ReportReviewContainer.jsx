
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IonContent } from "@ionic/react";

// import { useDialog } from "../../domain/usecases/useDialog";
// import { banUser, dismissReports, getPendingReports } from "../../actions/ModerationAcitons";
// import ErrorBoundary from "../../ErrorBoundary";
// import ReportProfileDialog from "../../components/auth/ReportProfileDialog";
// const ReportsReviewPage = () => {
//   const dispatch = useDispatch();
//   const { openDialog, closeDialog } = useDialog();

//   const { reports = [], loading, error, actioningId, actionError } = useSelector(
//     (state) => state.moderation
//   );
// console.log(reports)
//   useEffect(() => {
//     dispatch(getPendingReports());
//   }, [dispatch]);

//   const removeGroup = (reportedProfileId) => {
//     closeDialog();
//   };

//   const handleBan = (reportedProfileId, reportIds) => {
//     dispatch(banUser({ reportedProfileId, reportIds }))
//       .unwrap()
//       .then(() => removeGroup(reportedProfileId))
//       .catch((err) => {
//         alert(err?.message || "Ban failed — try again.");
//       });
//   };

//   const handleDismiss = (reportedProfileId, reportIds) => {
//     dispatch(dismissReports({ reportIds }))
//       .unwrap()
//       .then(() => {
//         dispatch(getPendingReports());
//         removeGroup(reportedProfileId);
//       })
//       .catch((err) => {
//         alert(err?.message || "Dismiss failed — try again.");
//       });
//   };
// const openReportDialog = (group) => {
//   const reportIds = group.reports.map((r) => r.id);

//   openDialog({
//     title: `@${group.username}`,
//     height: "60",
//     text: () => (
//       <div className="text-left space-y-3">
//         {group.reports.map((r) => (
//           <div key={r.id} className="text-[1.15rem]">
//             <div className="font-semibold text-soft">
//               {r.contentType} — {r.reason}
//             </div>
//             <div className="mt-1 text-sm text-slate-500 dark:text-cream/70">
//               {r.reasonDetails?.trim()
//                 ? r.reasonDetails
//                 : "No additional details provided."}
//             </div>
//           </div>
//         ))}
//       </div>
//     ),
//     agree: () => handleBan(group.reportedProfileId, reportIds),
//     agreeText: "Ban User",
//     disagree: () => handleDismiss(group.reportedProfileId, reportIds),
//     disagreeText: "Dismiss Reports",
//   });
// };
//   // const openReportDialog = (group) => {
//   //   const reportIds = group.reports.map((r) => r.id);
//   //   openDialog({
//   //     title: `@${group.username}`,
//   //     height: "55",
//   //     text: () => (
//   //       <ul className="text-left space-y-2">
//   //         {group.reports.map((r) => (
//   //           <li key={r.id} className="text-[1.2rem]">
//   //             <strong>{r.contentType}</strong> — {r.reason}
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     ),
//   //     agree: () => handleBan(group.reportedProfileId, reportIds),
//   //     agreeText: "Ban User",
//   //     disagree: () => handleDismiss(group.reportedProfileId, reportIds),
//   //     disagreeText: "Dismiss Reports",
//   //   });
//   // };

//   return (
//     <IonContent className="page-content" scrollY={true}>
//       <ErrorBoundary>
//         <div className="p-4 max-w-lg mx-auto">
//           <h1 className="text-xl font-semibold text-soft mb-4">
//             Pending Reports ({reports.length})
//           </h1>

//           {loading && <div className="p-6 text-soft">Loading reports…</div>}

//           {!loading && error && (
//             <div className="p-6 text-red-500">{error}</div>
//           )}

//           {!loading && !error && reports.length === 0 && (
//             <div className="p-6 text-soft">No pending reports. 🎉</div>
//           )}

//           {!loading && !error && reports.length > 0 && (
//             <div className="flex flex-col gap-2">
//               {reports.map((group) => (
//                 <button
//                   key={group.reportedProfileId}
//                   onClick={() => openReportDialog(group)}
//                   disabled={actioningId === group.reportedProfileId}
//                   className="flex items-center justify-between px-4 py-3 rounded-2xl bg-cream dark:bg-base-bgDark border border-soft/20 text-left active:scale-[0.98] transition"
//                 >
//                   <span className="text-soft font-medium">@{group.username}</span>
//                   <span className="text-sm text-soft/60">
//                     {group.reports.length} report{group.reports.length > 1 ? "s" : ""}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}

//           {!loading && !error && actionError && (
//             <div className="mt-4 text-red-500 text-sm">{actionError}</div>
//           )}
//         </div>
//       </ErrorBoundary>
//     </IonContent>
//   );
// };

// export default ReportsReviewPage;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonContent } from "@ionic/react";

import { useDialog } from "../../domain/usecases/useDialog";
import { banUser, dismissReports, getPendingReports } from "../../actions/ModerationAcitons";
import ErrorBoundary from "../../ErrorBoundary";

const ReportsReviewPage = () => {
  const dispatch = useDispatch();
  const { openDialog, closeDialog } = useDialog();

  const { reports = [], loading, error, actioningId, actionError } = useSelector(
    (state) => state.moderation
  );

  useEffect(() => {
    dispatch(getPendingReports());
  }, [dispatch]);

  const removeGroup = (reportedProfileId) => {
    closeDialog();
  };

  const handleBan = (reportedProfileId, reportIds) => {
    dispatch(banUser({ reportedProfileId, reportIds }))
      .unwrap()
      .then(() => removeGroup(reportedProfileId))
      .catch((err) => {
        alert(err?.message || "Ban failed — try again.");
      });
  };

  const handleDismiss = (reportedProfileId, reportIds) => {
    dispatch(dismissReports({ reportIds }))
      .unwrap()
      .then(() => {
        dispatch(getPendingReports());
        removeGroup(reportedProfileId);
      })
      .catch((err) => {
        alert(err?.message || "Dismiss failed — try again.");
      });
  };

  const handleDismissSingle = (reportedProfileId, reportId) => {
    dispatch(dismissReports({ reportIds: [reportId] }))
      .unwrap()
      .then(() => {
        dispatch(getPendingReports());
      })
      .catch((err) => {
        alert(err?.message || "Dismiss failed — try again.");
      });
  };

  const openUserDialog = (group) => {
    const allReportIds = group.reports.map((r) => r.id);

    openDialog({
      title: `@${group.username}`,
      height: "70",
      text: () => (
        <div className="text-left space-y-4">
          {/* Ban section */}
          <div className="text-[1.15rem] text-soft">
            Tap below to ban this user and remove all their reports.
          </div>

          {/* Reports subsection */}
          <div>
            <div className="text-sm uppercase tracking-wide text-slate-500 dark:text-cream/60 mb-2">
              Reports
            </div>
            <div className="space-y-3">
              {group.reports.map((r) => (
                <div key={r.id} className="text-[1.15rem]">
                  <div className="font-semibold text-soft">
                    {r.contentType} — {r.reason}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-cream/70">
                    {r.reasonDetails?.trim()
                      ? r.reasonDetails
                      : "No additional details provided."}
                  </div>
                  <button
                    onClick={() => handleDismissSingle(group.reportedProfileId, r.id)}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Dismiss this report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      agree: () => handleBan(group.reportedProfileId, allReportIds),
      agreeText: `Ban @${group.username}`,
      disagree: () => handleDismiss(group.reportedProfileId, allReportIds),
      disagreeText: "Dismiss all reports",
    });
  };

  return (
    <IonContent className="page-content" scrollY={true}>
      <ErrorBoundary>
        <div className="p-4 max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-soft mb-4">
            Pending Reports ({reports.length})
          </h1>

          {loading && <div className="p-6 text-soft">Loading reports…</div>}

          {!loading && error && (
            <div className="p-6 text-red-500">{error}</div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="p-6 text-soft">No pending reports. 🎉</div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="flex flex-col gap-2">
              {reports.map((group) => (
                <button
                  key={group.reportedProfileId}
                  onClick={() => openUserDialog(group)}
                  disabled={actioningId === group.reportedProfileId}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-cream dark:bg-base-bgDark border border-soft/20 text-left active:scale-[0.98] transition"
                >
                  <span className="text-soft font-medium">@{group.username}</span>
                  <span className="text-sm text-soft/60">
                    {group.reports.length} report{group.reports.length > 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && actionError && (
            <div className="mt-4 text-red-500 text-sm">{actionError}</div>
          )}
        </div>
      </ErrorBoundary>
    </IonContent>
  );
};

export default ReportsReviewPage;