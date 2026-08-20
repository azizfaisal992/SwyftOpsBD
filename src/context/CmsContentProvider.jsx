import { useMemo, useState } from "react";
import CmsContentContext from "./cms-content-context";
import { cmsContentService } from "../services/cmsContentService";

const CmsContentProvider = ({ children }) => {
  const [draftContent, setDraftContent] = useState(() =>
    cmsContentService.getDraft(),
  );
  const [publishedContent, setPublishedContent] = useState(() =>
    cmsContentService.getPublished(),
  );

  const value = useMemo(
    () => ({
      draftContent,
      publishedContent,
      updateDraftPage: (page, patch) =>
        setDraftContent((current) => ({
          ...current,
          [page]: { ...current[page], ...patch },
        })),
      saveDraft: () => cmsContentService.saveDraft(draftContent),
      publishContent: () => {
        const published = cmsContentService.publish(draftContent);
        setPublishedContent({ ...published });
        return published;
      },
    }),
    [draftContent, publishedContent],
  );

  return (
    <CmsContentContext.Provider value={value}>
      {children}
    </CmsContentContext.Provider>
  );
};

export default CmsContentProvider;
