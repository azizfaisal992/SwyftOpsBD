import { useContext } from "react";
import CmsContentContext from "../context/cms-content-context";

const useCmsContent = () => {
  const context = useContext(CmsContentContext);
  if (!context) throw new Error("useCmsContent must be used inside CmsContentProvider");
  return context;
};

export default useCmsContent;

