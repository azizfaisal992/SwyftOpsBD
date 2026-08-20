const DRAFT_KEY = "swiftopsbd-cms-draft";
const PUBLISHED_KEY = "swiftopsbd-cms-published";

export const defaultCmsContent = {
  home: {
    headline: "Connecting families with quality, local caregivers",
    subheadline: "One membership for every season of life",
    primaryButton: "Search",
  },
  "find-care": {
    headline: "Caregivers in Dhaka",
    subheadline: "Compare verified caregivers, availability, experience, and rates.",
    primaryButton: "Find Care",
  },
  "find-jobs": {
    headline: "Find a job you'll love",
    subheadline: "Whether caregiving is your career or you're looking for part-time work, you'll find opportunities to earn with SwiftOpsBD.",
    primaryButton: "Get started now",
  },
  "care-plan": {
    headline: "Care Plan Builder",
    subheadline: "Configure your personalized home healthcare journey.",
    primaryButton: "Finalize & Request",
  },
  "care-checkout": {
    headline: "Select Payment Method",
    subheadline: "Complete your care booking through a secure payment method.",
    primaryButton: "Pay Securely",
  },
};

const mergeContent = (value = {}) => Object.fromEntries(
  Object.entries(defaultCmsContent).map(([page, defaults]) => [page, { ...defaults, ...(value[page] ?? {}) }]),
);

const read = (key) => {
  try {
    return mergeContent(JSON.parse(localStorage.getItem(key) ?? "{}"));
  } catch {
    return mergeContent();
  }
};

export const cmsContentService = {
  getDraft: () => read(DRAFT_KEY),
  getPublished: () => read(PUBLISHED_KEY),
  saveDraft: (content) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    return content;
  },
  publish: (content) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(content));
    return content;
  },
};

