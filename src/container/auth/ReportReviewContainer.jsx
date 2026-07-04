
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IonContent } from "@ionic/react";

// import { useDialog } from "../../domain/usecases/useDialog";
// import { banUser, dismissReports, getPendingReports } from "../../actions/ModerationAcitons";
// import ErrorBoundary from "../../ErrorBoundary";

// const ReportsReviewPage = () => {
//   const dispatch = useDispatch();
//   const { openDialog, closeDialog } = useDialog();

//   const { reports = [], loading, error, actioningId, actionError } = useSelector(
//     (state) => state.moderation
//   );

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

//   const handleDismissSingle = (reportedProfileId, reportId) => {
//     dispatch(dismissReports({ reportIds: [reportId] }))
//       .unwrap()
//       .then(() => {
//         dispatch(getPendingReports());
//       })
//       .catch((err) => {
//         alert(err?.message || "Dismiss failed — try again.");
//       });
//   };

//   const openUserDialog = (group) => {
//     const allReportIds = group.reports.map((r) => r.id);

//     openDialog({
//       title: `@${group.username}`,
//       height: "70",
//       text: () => (
//         <div className="text-left space-y-4">
//           {/* Ban section */}
//           <div className="text-[1.15rem] text-soft">
//             Tap below to ban this user and remove all their reports.
//           </div>

//           {/* Reports subsection */}
//           <div>
//             <div className="text-sm uppercase tracking-wide text-slate-500 dark:text-cream/60 mb-2">
//               Reports
//             </div>
//             <div className="space-y-3">
//               {group.reports.map((r) => (
//                 <div key={r.id} className="text-[1.15rem]">
//                   <div className="font-semibold text-soft">
//                     {r.contentType} — {r.reason}
//                   </div>
//                   <div className="mt-1 text-sm text-slate-500 dark:text-cream/70">
//                     {r.reasonDetails?.trim()
//                       ? r.reasonDetails
//                       : "No additional details provided."}
//                   </div>
//                   <button
//                     onClick={() => handleDismissSingle(group.reportedProfileId, r.id)}
//                     className="mt-2 text-xs text-red-600 hover:underline"
//                   >
//                     Dismiss this report
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ),
//       agree: () => handleBan(group.reportedProfileId, allReportIds),
//       agreeText: `Ban @${group.username}`,
//       disagree: () => handleDismiss(group.reportedProfileId, allReportIds),
//       disagreeText: "Dismiss all reports",
//     });
//   };

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
//                   onClick={() => openUserDialog(group)}
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonContent } from "@ionic/react";

import { useDialog } from "../../domain/usecases/useDialog";
import { banUser, dismissReports, getBlockEvents, getPendingReports } from "../../actions/ModerationAcitons";
// NOTE: assumed action names — swap these for whatever you actually name

import ErrorBoundary from "../../ErrorBoundary";

const TABS = {
  REPORTS: "reports",
  BLOCKS: "blocks",
};

const ReportsReviewPage = () => {
  const dispatch = useDispatch();
  const { openDialog, closeDialog } = useDialog();
  const [activeTab, setActiveTab] = useState(TABS.REPORTS);
const {
  blockEvents = [],
  blockEventsLoading: blocksLoading,
  blockEventsError: blocksError,
} = useSelector((state) => state.moderation);
  const { reports = [], loading, error, actioningId, actionError } = useSelector(
    (state) => state.moderation
  );

((state) => state.blocks || {});

  useEffect(() => {
    dispatch(getPendingReports());
    dispatch(getBlockEvents());
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

  const handleAcknowledgeBlock = (eventId) => {
    dispatch(acknowledgeBlockEvent({ eventId }))
      .unwrap()
      .then(() => {
        dispatch(getBlockEvents());
        closeDialog();
      })
      .catch((err) => {
        alert(err?.message || "Couldn't update this block event — try again.");
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

  const openBlockDialog = (event) => {
    openDialog({
      title: `Block: @${event.blockerUsername} → @${event.blockedUsername}`,
      height: "55",
      text: () => (
        <div className="text-left space-y-4">
          <div className="text-[1.15rem] text-soft">
            @{event.blockerUsername} blocked @{event.blockedUsername}
            {event.createdAt
              ? ` on ${new Date(event.createdAt).toLocaleString()}`
              : ""}
            .
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-slate-500 dark:text-cream/60 mb-2">
              Reason given by blocker
            </div>
            <div className="text-[1.15rem] text-soft">
              {event.reason?.trim() ? event.reason : "No reason provided."}
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-cream/70">
            Blocking already hid @{event.blockedUsername}'s content from @
            {event.blockerUsername}'s feed. Use this to decide whether the
            underlying content or user also needs action.
          </div>
        </div>
      ),
      agree: () => handleAcknowledgeBlock(event.id),
      agreeText: "Mark reviewed",
      disagree: closeDialog,
      disagreeText: "Close",
    });
  };

  return (
    <IonContent className="page-content" scrollY={true}>
      <ErrorBoundary>
        <div className="p-4 max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-soft mb-4">Moderation</h1>

          {/* Tab toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab(TABS.REPORTS)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === TABS.REPORTS
                  ? "bg-soft text-cream"
                  : "bg-cream dark:bg-base-bgDark border border-soft/20 text-soft"
              }`}
            >
              Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab(TABS.BLOCKS)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === TABS.BLOCKS
                  ? "bg-soft text-cream"
                  : "bg-cream dark:bg-base-bgDark border border-soft/20 text-soft"
              }`}
            >
              Blocks ({blockEvents.length})
            </button>
          </div>

          {activeTab === TABS.REPORTS && (
            <>
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
            </>
          )}

          {activeTab === TABS.BLOCKS && (
            <>
              {blocksLoading && <div className="p-6 text-soft">Loading blocks…</div>}

              {!blocksLoading && blocksError && (
                <div className="p-6 text-red-500">{blocksError}</div>
              )}

              {!blocksLoading && !blocksError && blockEvents.length === 0 && (
                <div className="p-6 text-soft">No block events. 🎉</div>
              )}

              {!blocksLoading && !blocksError && blockEvents.length > 0 && (
                <div className="flex flex-col gap-2">
                  {blockEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => openBlockDialog(event)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl bg-cream dark:bg-base-bgDark border border-soft/20 text-left active:scale-[0.98] transition"
                    >
                      <span className="text-soft font-medium">
                        @{event.blockerUsername} → @{event.blockedUsername}
                      </span>
                      <span className="text-sm text-soft/60">
                        {event.acknowledged ? "Reviewed" : "New"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </IonContent>
  );
};

export default ReportsReviewPage;