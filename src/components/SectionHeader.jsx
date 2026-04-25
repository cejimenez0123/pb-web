import { IonText } from "@ionic/react";
import React from "react";

const SectionHeader = ({ title, right }) => (
  <div className="flex items-center justify-between px-4 mb-2 mt-6">
    <h1 className="text-lg  px-2 text-soft dark:text-cream">
      {title}
    </h1>
    {right}
  </div>
);
 export default React.memo( SectionHeader)