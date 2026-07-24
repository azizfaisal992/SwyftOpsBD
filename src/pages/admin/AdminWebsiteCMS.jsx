import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  FileEdit,
  Globe2,
  GripVertical,
  Image,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  Monitor,
  MoreVertical,
  Plus,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Star,
  ToggleLeft,
  ToggleRight,
  UploadCloud,
  UserCog,
} from "lucide-react";
import { useMemo, useState } from "react";
import caregiverAllexus from "../../assets/caregiver-allexus.jpg";
import caregiverKelly from "../../assets/caregiver-kelly.jpg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import Footer from "../../layout/footer";
import Header from "../../layout/header";
import CareCheckout from "../CareCheckout";
import CarePlanBuilder from "../CarePlanBuilder";
import FindCare from "../FindCare";
import FindJobs from "../FindJobs";
import Home from "../Home";
import useCmsContent from "../../hooks/useCmsContent";

const pageSections = [
  {
    id: "hero",
    name: "Hero Banner",
    description: "Main headline and call to action",
    visible: true,
  },
  {
    id: "services",
    name: "Care Services",
    description: "Public service categories",
    visible: true,
  },
  {
    id: "caregivers",
    name: "Featured Caregivers",
    description: "Verified public profiles",
    visible: true,
  },
  {
    id: "trust",
    name: "Trust & Safety",
    description: "Verification and security message",
    visible: true,
  },
  {
    id: "testimonials",
    name: "Client Stories",
    description: "Approved testimonials",
    visible: true,
  },
  {
    id: "cta",
    name: "Join SwiftOpsBD",
    description: "Client and caregiver registration",
    visible: true,
  },
];

const sitePages = [
  { id: "home", label: "Home", route: "/" },
  { id: "find-care", label: "Find Care", route: "/find-care" },
  { id: "find-jobs", label: "Find Jobs", route: "/find-jobs" },
  { id: "care-plan", label: "Care Plan Builder", route: "/care-plan" },
  { id: "care-checkout", label: "Care Checkout", route: "/care-checkout" },
];

const pageSectionsByPage = {
  home: pageSections,
  "find-care": [
    {
      id: "care-search",
      name: "Care Search",
      description: "Location and service search",
      visible: true,
    },
    {
      id: "care-filters",
      name: "Caregiver Filters",
      description: "Service, availability, and price",
      visible: true,
    },
    {
      id: "care-results",
      name: "Caregiver Results",
      description: "Verified public caregiver cards",
      visible: true,
    },
    {
      id: "care-map",
      name: "Location Map",
      description: "Caregiver coverage and proximity",
      visible: true,
    },
  ],
  "find-jobs": [
    {
      id: "jobs-hero",
      name: "Jobs Hero",
      description: "Caregiver opportunity headline",
      visible: true,
    },
    {
      id: "job-search",
      name: "Job Search",
      description: "Role and location controls",
      visible: true,
    },
    {
      id: "job-benefits",
      name: "Caregiver Benefits",
      description: "Platform benefits and trust",
      visible: true,
    },
    {
      id: "job-safety",
      name: "Safety & Support",
      description: "Caregiver protection content",
      visible: true,
    },
  ],
  "care-plan": [
    {
      id: "plan-care",
      name: "Care Customization",
      description: "Care type and medical tasks",
      visible: true,
    },
    {
      id: "plan-schedule",
      name: "Service Schedule",
      description: "Hours and preferred times",
      visible: true,
    },
    {
      id: "plan-logistics",
      name: "Final Logistics",
      description: "Gender, budget, and transport",
      visible: true,
    },
    {
      id: "plan-estimate",
      name: "Monthly Estimate",
      description: "Dynamic care-plan pricing",
      visible: true,
    },
  ],
  "care-checkout": [
    {
      id: "checkout-method",
      name: "Payment Method",
      description: "Card and mobile wallet options",
      visible: true,
    },
    {
      id: "checkout-summary",
      name: "Order Summary",
      description: "Caregiver and service charges",
      visible: true,
    },
    {
      id: "checkout-security",
      name: "Payment Security",
      description: "Compliance and encryption",
      visible: true,
    },
    {
      id: "checkout-help",
      name: "Payment Assistance",
      description: "Transaction support details",
      visible: true,
    },
  ],
};

const eligibleCaregivers = [
  {
    id: "CR-88294",
    name: "Rahima Khatun",
    title: "Senior Home Care Specialist",
    image: caregiverSarah,
    rating: 4.9,
    reviews: 124,
    experience: "8 years",
    verification: "Clear",
    nid: "Verified",
    published: true,
    featured: true,
    services: ["Senior Care", "Post-Op Care"],
  },
  {
    id: "CR-77120",
    name: "Farhana Akhter",
    title: "Registered Nurse",
    image: caregiverAllexus,
    rating: 4.8,
    reviews: 96,
    experience: "6 years",
    verification: "Clear",
    nid: "Verified",
    published: true,
    featured: false,
    services: ["Nursing", "Medication"],
  },
  {
    id: "CR-55310",
    name: "Mofizul Kader",
    title: "Companion Care Professional",
    image: caregiverKelly,
    rating: 4.7,
    reviews: 82,
    experience: "5 years",
    verification: "Clear",
    nid: "Verified",
    published: false,
    featured: false,
    services: ["Companion Care"],
  },
  {
    id: "CR-77412",
    name: "Arifur Rahman",
    title: "Professional Caregiver",
    image: caregiverKelly,
    rating: 3.8,
    reviews: 21,
    experience: "2 years",
    verification: "Pending",
    nid: "Pending",
    published: false,
    featured: false,
    services: ["Mobility Support"],
  },
];

const cmsStaff = [
  {
    id: 1,
    name: "Farhana Islam",
    email: "farhana.v@swiftops.bd",
    role: "Content Manager",
    permissions: ["Edit pages", "Manage media", "Publish"],
    active: true,
  },
  {
    id: 2,
    name: "Rahat Ahmed",
    email: "rahat.ops@swiftops.bd",
    role: "Website Administrator",
    permissions: [
      "Edit pages",
      "Manage media",
      "Caregiver profiles",
      "Publish",
      "Staff access",
    ],
    active: true,
  },
  {
    id: 3,
    name: "Tanzila Karim",
    email: "tanzila.a@swiftops.bd",
    role: "Content Reviewer",
    permissions: ["Edit pages", "Preview"],
    active: true,
  },
];

const tabs = [
  { id: "editor", label: "Page Editor", icon: FileEdit },
  { id: "caregivers", label: "Caregiver Directory", icon: BadgeCheck },
  { id: "staff", label: "Staff Access", icon: UserCog },
  { id: "settings", label: "Site Settings", icon: Settings2 },
];

const AdminWebsiteCMS = () => {
  const {
    draftContent,
    publishContent,
    saveDraft: saveCmsDraft,
    updateDraftPage,
  } = useCmsContent();
  const [tab, setTab] = useState("editor");
  const [selectedPage, setSelectedPage] = useState("home");
  const [sectionsByPage, setSectionsByPage] = useState(pageSectionsByPage);
  const [selectedSection, setSelectedSection] = useState("hero");
  const [caregivers, setCaregivers] = useState(eligibleCaregivers);
  const [staff, setStaff] = useState(cmsStaff);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [siteStatus, setSiteStatus] = useState("Published");
  const [lastSaved, setLastSaved] = useState("10:42 AM");
  const [notice, setNotice] = useState("");
  const sections = sectionsByPage[selectedPage];
  const pageDraft = draftContent[selectedPage];

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const saveDraft = () => {
    saveCmsDraft();
    setSiteStatus("Draft changes");
    setLastSaved(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    flash("Website draft saved locally and is ready for the CMS API.");
  };

  const publishSite = () => {
    publishContent();
    setSiteStatus("Published");
    flash("Website changes published to the local preview.");
  };

  const toggleSection = (id) =>
    setSectionsByPage((current) => ({
      ...current,
      [selectedPage]: current[selectedPage].map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section,
      ),
    }));

  const moveSection = (id, direction) =>
    setSectionsByPage((current) => {
      const pageSectionsList = current[selectedPage];
      const index = pageSectionsList.findIndex((item) => item.id === id);
      const target = index + direction;
      if (target < 0 || target >= pageSectionsList.length) return current;
      const next = [...pageSectionsList];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, [selectedPage]: next };
    });

  const changePage = (pageId) => {
    setSelectedPage(pageId);
    setSelectedSection(pageSectionsByPage[pageId][0].id);
  };

  const updatePageField = (field, value) => {
    updateDraftPage(selectedPage, { [field]: value });
    setSiteStatus("Draft changes");
  };

  const toggleCaregiver = (id) => {
    setCaregivers((current) =>
      current.map((caregiver) => {
        if (caregiver.id !== id) return caregiver;
        if (
          caregiver.verification !== "Clear" ||
          caregiver.nid !== "Verified"
        ) {
          flash(
            "This caregiver must complete verification before website publishing.",
          );
          return caregiver;
        }
        return { ...caregiver, published: !caregiver.published };
      }),
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7fc]">
      {notice && (
        <div className="fixed left-1/2 top-20 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm whitespace-nowrap text-white shadow-xl">
          <Check className="size-4" />
          {notice}
        </div>
      )}

      <header className="border-b border-[#c8cfde] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Website CMS</h1>
              <span
                className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${siteStatus === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
              >
                ● {siteStatus}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#606878]">
              Edit the public website, publish caregivers, and control staff
              access.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 xl:ml-auto">
            <span className="flex items-center gap-2 px-2 text-xs text-[#687184]">
              <Clock3 className="size-4" />
              Saved {lastSaved}
            </span>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#b9c1d1] bg-white px-4 py-2.5 text-sm font-semibold sm:flex-none"
              type="button"
              onClick={() =>
                flash("Public website preview opened in CMS mode.")
              }
            >
              <Eye className="size-4" />
              Preview Site
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#0755b7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0755b7] sm:flex-none"
              type="button"
              onClick={saveDraft}
            >
              <Save className="size-4" />
              Save Draft
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-5 py-2.5 text-sm font-semibold text-white sm:flex-none"
              type="button"
              onClick={publishSite}
            >
              <Globe2 className="size-4" />
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] p-4 sm:p-6">
        <nav className="hide-scrollbar flex gap-2 overflow-x-auto rounded-xl border border-[#c8cfde] bg-white p-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === id ? "bg-[#0755b7] text-white" : "text-[#515867] hover:bg-[#f1f4f9]"}`}
              type="button"
              key={id}
              onClick={() => setTab(id)}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>

        {tab === "editor" && (
          <PageEditor
            sections={sections}
            selectedPage={selectedPage}
            setSelectedPage={changePage}
            selected={selectedSection}
            setSelected={setSelectedSection}
            toggleSection={toggleSection}
            moveSection={moveSection}
            headline={pageDraft.headline}
            setHeadline={(value) => updatePageField("headline", value)}
            subheadline={pageDraft.subheadline}
            setSubheadline={(value) => updatePageField("subheadline", value)}
            primaryButton={pageDraft.primaryButton}
            setPrimaryButton={(value) =>
              updatePageField("primaryButton", value)
            }
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            onAction={flash}
          />
        )}
        {tab === "caregivers" && (
          <CaregiverDirectory
            caregivers={caregivers}
            setCaregivers={setCaregivers}
            toggleCaregiver={toggleCaregiver}
            onAction={flash}
          />
        )}
        {tab === "staff" && (
          <StaffAccess staff={staff} setStaff={setStaff} onAction={flash} />
        )}
        {tab === "settings" && <SiteSettings onAction={flash} />}
      </div>
    </div>
  );
};

const PageEditor = ({
  headline,
  moveSection,
  onAction,
  previewMode,
  primaryButton,
  sections,
  selected,
  selectedPage,
  setHeadline,
  setPreviewMode,
  setPrimaryButton,
  setSelected,
  setSelectedPage,
  setSubheadline,
  subheadline,
  toggleSection,
}) => (
  <>
    <section className="sticky top-16 z-20 mt-5 rounded-xl border-2 border-[#8db3eb] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0755b7]">
            Editing Page
          </p>
          <h2 className="font-semibold">Choose which public page to manage</h2>
        </div>
        <label className="flex min-w-0 items-center gap-3 rounded-lg border border-[#0755b7] bg-[#eaf2ff] px-3 sm:min-w-[260px] lg:ml-auto">
          <Globe2 className="size-5 shrink-0 text-[#0755b7]" />
          <select
            className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[#0755b7] outline-none"
            value={selectedPage}
            onChange={(event) => setSelectedPage(event.target.value)}
          >
            {sitePages.map((page) => (
              <option value={page.id} key={page.id}>
                {page.label} — {page.route}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto border-t border-[#d8dde7] pt-3">
        {sitePages.map((page) => (
          <button
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${selectedPage === page.id ? "bg-[#0755b7] text-white" : "border border-[#c8cfde] bg-white text-[#515867]"}`}
            type="button"
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </div>
    </section>
    <section className="mt-5 grid gap-5 xl:grid-cols-[300px_380px_minmax(0,1fr)]">
      <article className="overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
        <header className="flex items-center border-b bg-[#f1f4fa] px-4 py-4">
          <div>
            <h2 className="font-semibold">
              {sitePages.find((page) => page.id === selectedPage)?.label}{" "}
              Sections
            </h2>
            <p className="text-xs text-[#687184]">
              Select, reorder, or hide sections
            </p>
          </div>
          <button
            className="ml-auto grid size-8 place-items-center rounded border bg-white text-[#0755b7]"
            type="button"
            onClick={() =>
              onAction(
                "Custom section creation is ready for CMS API integration.",
              )
            }
          >
            <Plus className="size-4" />
          </button>
        </header>
        <div className="divide-y divide-[#d8dde7]">
          {sections.map((section) => (
            <button
              className={`flex w-full items-center gap-2 p-3 text-left ${selected === section.id ? "bg-[#eaf2ff]" : "hover:bg-[#f8f9fc]"}`}
              type="button"
              key={section.id}
              onClick={() => setSelected(section.id)}
            >
              <GripVertical className="size-4 shrink-0 text-[#8b93a3]" />
              <span className="min-w-0 flex-1">
                <b
                  className={`block text-sm ${selected === section.id ? "text-[#0755b7]" : ""}`}
                >
                  {section.name}
                </b>
                <small className="block truncate text-[#687184]">
                  {section.description}
                </small>
              </span>
              <span className="flex flex-col">
                <span
                  className="text-[10px]"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveSection(section.id, -1);
                  }}
                >
                  ▲
                </span>
                <span
                  className="text-[10px]"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveSection(section.id, 1);
                  }}
                >
                  ▼
                </span>
              </span>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSection(section.id);
                }}
              >
                {section.visible ? (
                  <Eye className="size-4 text-emerald-600" />
                ) : (
                  <EyeOff className="size-4 text-[#8b93a3]" />
                )}
              </span>
            </button>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#c8cfde] bg-white p-5">
        <div className="flex items-center">
          <div>
            <h2 className="font-semibold">
              Edit {sections.find((item) => item.id === selected)?.name}
            </h2>
            <p className="text-xs text-[#687184]">Content and appearance</p>
          </div>
          <MoreVertical className="ml-auto size-5" />
        </div>
        {selected === sections[0]?.id ? (
          <div className="mt-5 space-y-4">
            <EditorField label="Headline">
              <textarea
                className="min-h-24"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
              />
            </EditorField>
            <EditorField label="Supporting text">
              <textarea
                className="min-h-24"
                value={subheadline}
                onChange={(event) => setSubheadline(event.target.value)}
              />
            </EditorField>
            <EditorField label="Primary button">
              <input
                value={primaryButton}
                onChange={(event) => setPrimaryButton(event.target.value)}
              />
            </EditorField>
            <EditorField label="Button destination">
              <select>
                <option>/find-care</option>
                <option>/join</option>
                <option>/care-plan</option>
              </select>
            </EditorField>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#b9c1d1] px-4 py-4 text-sm font-semibold text-[#0755b7]"
              type="button"
              onClick={() => onAction("Hero media library opened.")}
            >
              <Image className="size-5" />
              Replace Hero Image
            </button>
          </div>
        ) : (
          <SectionEditor section={selected} onAction={onAction} />
        )}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[.08em] text-[#687184]">
            SEO & Accessibility
          </h3>
          <EditorField label="Section label">
            <input
              defaultValue={sections.find((item) => item.id === selected)?.name}
            />
          </EditorField>
          <label className="mt-3 flex items-center gap-2 text-xs">
            <input type="checkbox" defaultChecked />
            Allow search-engine indexing
          </label>
        </div>
      </article>

      <article className="min-w-0 overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
        <header className="flex items-center border-b bg-[#f1f4fa] px-4 py-3">
          <b className="text-sm">Live Website Preview</b>
          <div className="ml-auto flex rounded-lg border bg-white p-1">
            <button
              className={`rounded p-1.5 ${previewMode === "desktop" ? "bg-blue-100 text-[#0755b7]" : ""}`}
              type="button"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="size-4" />
            </button>
            <button
              className={`rounded p-1.5 ${previewMode === "mobile" ? "bg-blue-100 text-[#0755b7]" : ""}`}
              type="button"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="size-4" />
            </button>
          </div>
        </header>
        <div className="hide-scrollbar overflow-auto bg-[#dfe4ec] p-3 sm:p-5">
          <div
            className={`mx-auto h-[720px] overflow-auto rounded-lg bg-white shadow-xl transition-all ${previewMode === "mobile" ? "w-[320px]" : "w-full"}`}
          >
            <div
              className="bg-white"
              style={
                previewMode === "mobile"
                  ? { width: "390px", zoom: 0.82 }
                  : { width: "1280px", zoom: 0.5 }
              }
            >
              <WebsitePagePreview page={selectedPage} />
            </div>
          </div>
          <p className="mx-auto mt-3 max-w-lg text-center text-[10px] text-[#687184]">
            Direct component preview for{" "}
            {sitePages.find((page) => page.id === selectedPage)?.route}. Draft
            CMS fields will update the page after the shared content API is
            connected.
          </p>
        </div>
      </article>
    </section>
  </>
);

const WebsitePagePreview = ({ page }) => {
  if (page === "find-care")
    return (
      <>
        <Header />
        <FindCare />
      </>
    );
  if (page === "find-jobs")
    return (
      <>
        <Header />
        <FindJobs />
        <Footer />
      </>
    );
  if (page === "care-plan") return <CarePlanBuilder />;
  if (page === "care-checkout") return <CareCheckout />;
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
};

const SectionEditor = ({ onAction, section }) => (
  <div className="mt-5 space-y-4">
    <EditorField label="Section heading">
      <input
        defaultValue={
          section === "caregivers"
            ? "Meet our trusted caregivers"
            : "Professional care you can trust"
        }
      />
    </EditorField>
    <EditorField label="Description">
      <textarea
        className="min-h-24"
        defaultValue="Update the public content shown in this section."
      />
    </EditorField>
    <EditorField label="Content source">
      <select>
        <option>CMS-managed content</option>
        <option>Verified database records</option>
        <option>Latest approved items</option>
      </select>
    </EditorField>
    <button
      className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold text-[#0755b7]"
      type="button"
      onClick={() => onAction(`${section} content manager opened.`)}
    >
      <LayoutDashboard className="size-4" />
      Manage Section Items
    </button>
  </div>
);

const CaregiverDirectory = ({
  caregivers,
  onAction,
  setCaregivers,
  toggleCaregiver,
}) => {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      caregivers.filter((item) =>
        `${item.name} ${item.id} ${item.services.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [caregivers, query],
  );
  const toggleFeatured = (id) =>
    setCaregivers((current) =>
      current.map((item) =>
        item.id === id && item.published
          ? { ...item, featured: !item.featured }
          : item,
      ),
    );
  return (
    <section className="mt-5">
      <header className="flex flex-col gap-3 rounded-xl border border-[#c8cfde] bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Public Caregiver Directory</h2>
          <p className="text-sm text-[#687184]">
            Only fully verified caregivers can be published to the website.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border bg-[#f8f9fc] px-3 py-2.5 sm:ml-auto">
          <Search className="size-4" />
          <input
            className="bg-transparent text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search caregivers..."
          />
        </label>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((caregiver) => {
          const eligible =
            caregiver.verification === "Clear" && caregiver.nid === "Verified";
          return (
            <article
              className={`overflow-hidden rounded-xl border bg-white ${!eligible ? "border-amber-300" : "border-[#c8cfde]"}`}
              key={caregiver.id}
            >
              <div className="flex gap-4 p-4">
                <img
                  className="size-16 rounded-xl object-cover"
                  src={caregiver.image}
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <div className="flex">
                    <b className="truncate">{caregiver.name}</b>
                    {eligible && (
                      <BadgeCheck className="ml-1 size-4 fill-emerald-600 text-white" />
                    )}
                  </div>
                  <p className="text-xs text-[#687184]">{caregiver.title}</p>
                  <small className="mt-1 flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {caregiver.rating} ({caregiver.reviews}) ·{" "}
                    {caregiver.experience}
                  </small>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 px-4">
                {caregiver.services.map((service) => (
                  <span
                    className="rounded bg-[#eef2f8] px-2 py-1 text-[9px]"
                    key={service}
                  >
                    {service}
                  </span>
                ))}
              </div>
              {!eligible && (
                <p className="mx-4 mt-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <LockKeyhole className="mr-1 inline size-3" />
                  Verification pending—website publishing locked.
                </p>
              )}
              <footer className="mt-4 flex items-center border-t bg-[#f8f9fc] p-3">
                <button
                  className="text-xs font-semibold text-[#0755b7]"
                  type="button"
                  onClick={() =>
                    onAction(
                      `Website profile preview opened for ${caregiver.name}.`,
                    )
                  }
                >
                  <Eye className="mr-1 inline size-4" />
                  Preview
                </button>
                <button
                  className={`ml-auto flex items-center gap-2 text-xs font-semibold ${caregiver.published ? "text-emerald-700" : eligible ? "text-[#515867]" : "cursor-not-allowed text-[#9aa1af]"}`}
                  type="button"
                  onClick={() => toggleCaregiver(caregiver.id)}
                >
                  {caregiver.published ? (
                    <ToggleRight className="size-7" />
                  ) : (
                    <ToggleLeft className="size-7" />
                  )}
                  {caregiver.published ? "Published" : "Hidden"}
                </button>
              </footer>
              {caregiver.published && (
                <button
                  className={`w-full border-t py-2 text-xs font-semibold ${caregiver.featured ? "bg-amber-50 text-amber-700" : "text-[#687184]"}`}
                  type="button"
                  onClick={() => toggleFeatured(caregiver.id)}
                >
                  <Star
                    className={`mr-1 inline size-3.5 ${caregiver.featured ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                  {caregiver.featured
                    ? "Featured on homepage"
                    : "Add to homepage"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

const StaffAccess = ({ onAction, setStaff, staff }) => {
  const toggleActive = (id) =>
    setStaff((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
      <header className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">CMS Staff & Permissions</h2>
          <p className="text-sm text-[#687184]">
            Control who can edit, review, or publish website content.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white sm:ml-auto"
          type="button"
          onClick={() => onAction("Staff invitation form opened.")}
        >
          <Plus className="size-4" />
          Invite Staff Member
        </button>
      </header>
      <div className="divide-y divide-[#d8dde7]">
        {staff.map((member) => (
          <article
            className="grid gap-4 p-4 sm:grid-cols-[1.2fr_1fr_1.5fr_auto] sm:items-center sm:px-6"
            key={member.id}
          >
            <div>
              <b className="block">{member.name}</b>
              <small className="text-[#687184]">{member.email}</small>
            </div>
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#0755b7]">
              {member.role}
            </span>
            <div className="flex flex-wrap gap-1">
              {member.permissions.slice(0, 3).map((permission) => (
                <span
                  className="rounded bg-[#eef1f6] px-2 py-1 text-[9px]"
                  key={permission}
                >
                  {permission}
                </span>
              ))}
              {member.permissions.length > 3 && (
                <span className="rounded bg-[#eef1f6] px-2 py-1 text-[9px]">
                  +{member.permissions.length - 3}
                </span>
              )}
            </div>
            <button
              className={`flex items-center gap-2 text-xs font-semibold ${member.active ? "text-emerald-700" : "text-[#8b93a3]"}`}
              type="button"
              onClick={() => toggleActive(member.id)}
            >
              {member.active ? (
                <ToggleRight className="size-7" />
              ) : (
                <ToggleLeft className="size-7" />
              )}
              {member.active ? "Active" : "Disabled"}
            </button>
          </article>
        ))}
      </div>
      <footer className="border-t bg-[#f4f6fb] px-5 py-3 text-xs text-[#687184]">
        <ShieldCheck className="mr-1 inline size-4" />
        All CMS edits and publishing actions are recorded in the audit log.
      </footer>
    </section>
  );
};

const SiteSettings = ({ onAction }) => (
  <section className="mt-5 grid gap-5 lg:grid-cols-2">
    <SettingsCard title="Site Identity" icon={Globe2}>
      <EditorField label="Website name">
        <input defaultValue="SwiftOpsBD" />
      </EditorField>
      <EditorField label="Public URL">
        <input defaultValue="https://swiftopsbd.com" />
      </EditorField>
      <EditorField label="Support email">
        <input defaultValue="support@swiftops.bd" />
      </EditorField>
    </SettingsCard>
    <SettingsCard title="Search & Social" icon={Search}>
      <EditorField label="Default page title">
        <input defaultValue="SwiftOpsBD | Trusted Home Healthcare" />
      </EditorField>
      <EditorField label="Meta description">
        <textarea
          className="min-h-20"
          defaultValue="Find verified caregivers and trusted home healthcare services across Dhaka."
        />
      </EditorField>
      <EditorField label="Social share image">
        <button
          className="flex items-center justify-center gap-2"
          type="button"
        >
          <UploadCloud className="size-4" />
          Upload image
        </button>
      </EditorField>
    </SettingsCard>
    <SettingsCard title="Navigation" icon={Link2}>
      <div className="space-y-2">
        {["Home", "Find Care", "Find Jobs", "About Us", "Contact"].map(
          (item) => (
            <div
              className="flex items-center gap-2 rounded-lg border p-3 text-sm"
              key={item}
            >
              <GripVertical className="size-4 text-[#8b93a3]" />
              {item}
              <ChevronRight className="ml-auto size-4" />
            </div>
          ),
        )}
      </div>
    </SettingsCard>
    <SettingsCard title="Publishing Safety" icon={ShieldCheck}>
      <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
        <input type="checkbox" defaultChecked />
        Require approval before publishing
      </label>
      <label className="mt-2 flex items-center gap-3 rounded-lg border p-3 text-sm">
        <input type="checkbox" defaultChecked />
        Prevent unverified caregiver profiles
      </label>
      <label className="mt-2 flex items-center gap-3 rounded-lg border p-3 text-sm">
        <input type="checkbox" defaultChecked />
        Keep revision history for 90 days
      </label>
      <button
        className="mt-4 w-full rounded-lg bg-[#0755b7] px-4 py-3 text-sm font-semibold text-white"
        type="button"
        onClick={() => onAction("Website settings saved.")}
      >
        Save Site Settings
      </button>
    </SettingsCard>
  </section>
);

const SettingsCard = ({ children, icon: Icon, title }) => (
  <article className="rounded-xl border border-[#c8cfde] bg-white p-5">
    <header className="mb-5 flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755b7]">
        <Icon className="size-5" />
      </span>
      <h2 className="font-semibold">{title}</h2>
    </header>
    {children}
  </article>
);
const EditorField = ({ children, label }) => (
  <label className="mt-3 block text-xs font-semibold text-[#515867]">
    {label}
    <span className="mt-1 block [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:border-[#c8cfde] [&>*]:bg-white [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:text-[#111c2c] [&>*]:outline-none focus-within:[&>*]:border-[#0755d3]">
      {children}
    </span>
  </label>
);

export default AdminWebsiteCMS;
