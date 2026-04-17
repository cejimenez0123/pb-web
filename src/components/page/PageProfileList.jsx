import Paths from "../../core/paths";
import ListPill from "./ListPill";

const PageProfileList = ({ items,type, router }) => (
    <div className="space-y-2">
    {items.map((p) => (
      <ListPill item={p} router={router} type={type}/>

    ))}
  </div>
);

export default PageProfileList