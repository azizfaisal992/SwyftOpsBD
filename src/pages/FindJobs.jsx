import {
  ArrowRight,
  Baby,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Home,
  PawPrint,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import caregiverImage from "../assets/caregiver-sarah.jpg";
import childCareImage from "../assets/join-family.jpg";
import resumeImage from "../assets/join-professional.jpg";
import heroReference from "../assets/find-job-hero-reference.png";
import safetyReference from "../assets/find-job-safety-reference.png";

const jobCategories = [
  { label: "Child Care", icon: Baby },
  { label: "Senior Care", icon: HeartHandshake },
  { label: "Pet Care", icon: PawPrint },
  { label: "Housekeeping", icon: Home },
  { label: "Tutoring", icon: GraduationCap },
];

const benefits = [
  {
    title: "Earn your way",
    description: "Choose from thousands of full-time, part-time, or anytime jobs to fit your schedule and lifestyle.",
    icon: CalendarDays,
  },
  {
    title: "Boost your earnings",
    description: "Get your profile in front of thousands of families looking for care for children, seniors, pets and more.",
    icon: CircleDollarSign,
  },
  {
    title: "Build a career",
    description: "We help caregivers build rewarding careers and thrive on the job with resources and professional tools.",
    icon: TrendingUp,
  },
];

const onboardingSteps = [
  {
    title: "Share what you're looking for",
    description: "Add who you are, where you live, and what kinds of jobs you want.",
  },
  {
    title: "Add background check info",
    description: "Provide the details needed to build trust with families and verify your professional profile.",
  },
  {
    title: "Build your profile",
    description: "Show your experience, skills, availability, rates and the kind of care you provide.",
  },
  {
    title: "Start applying for jobs",
    description: "Browse matching opportunities, connect with families and apply for work that suits you.",
  },
];

const resources = [
  {
    title: "Promote yourself as a caregiver",
    description: "Marketing yourself as a nanny or babysitter is much simpler than it sounds. Check out our easy expert advice.",
    image: caregiverImage,
  },
  {
    title: "Exploring child care jobs",
    description: "Exploring child care work but unsure what suits you best? Dive into our comprehensive list for expert guidance.",
    image: childCareImage,
  },
  {
    title: "How to write a caregiver resume",
    description: "Learn what to include on your resume, what to leave off, and how to format it, along with common resume mistakes.",
    image: resumeImage,
  },
];

const faqs = [
  {
    question: "What kind of jobs can I find on SwiftOpsBD?",
    answer: "Find child care, senior care, pet care, housekeeping and tutoring opportunities from families in your area.",
  },
  {
    question: "Why do I need an account to access SwiftOpsBD?",
    answer: "Your account lets us protect your information, save job matches and connect applications to your verified caregiver profile.",
  },
  {
    question: "What is a SwiftOpsBD Background Check?",
    answer: "It is a verification step that helps families make informed choices and supports a safer community for everyone.",
  },
  {
    question: "Where can I find more help on signing up?",
    answer: "Create your professional account and follow the guided profile, credentials and assessment steps. Support is available if you get stuck.",
  },
];

const ProfessionalSignupLink = ({ children, className = "" }) => (
  <Link
    className={`inline-flex items-center justify-center rounded-xl bg-[#0648aa] px-8 py-3.5 font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#003d9b] ${className}`}
    to="/register?type=professional"
  >
    {children}
  </Link>
);

const JobPhonePreview = () => (
  <div className="mx-auto w-[288px] rounded-[48px] border-[12px] border-[#142036] bg-white p-4 shadow-2xl shadow-slate-900/20">
    <div className="mb-5 flex items-center justify-between text-xs font-semibold">
      <span>9:41</span><span className="text-base">Job Details</span><span>•••</span>
    </div>
    <article className="rounded-2xl border border-[#b8c4de] bg-[#f0f3ff] p-4">
      <div className="flex gap-3">
        <span className="size-10 rounded-xl bg-[#d9e2ff]" />
        <div><p className="text-xs font-bold">Sarah M.</p><p className="text-[10px] text-slate-500">Near Central Park</p></div>
      </div>
      <h3 className="mt-3 text-sm font-bold">Afternoon Sitter Needed</h3>
      <p className="mt-1 text-xs text-slate-600">2 kids, 3–5pm weekdays</p>
      <div className="mt-3 flex items-center justify-between">
        <strong className="text-sm text-[#0648aa]">$25/hr</strong>
        <span className="rounded-full bg-[#0648aa] px-3 py-1 text-[10px] text-white">Apply Now</span>
      </div>
    </article>
    <article className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-[10px] font-bold text-emerald-700">NEW MATCH</p>
      <p className="mt-2 text-xs">Golden Retriever Walking</p>
      <p className="text-[10px] text-slate-500">0.8 miles away</p>
    </article>
    <div className="h-40" />
  </div>
);

const FindJobs = () => {
  const [openStep, setOpenStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="overflow-hidden bg-[#f8f9fb] text-[#111c2f]">
      <section className="mx-auto grid min-h-[730px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-4">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-[1.12] tracking-[-0.035em] text-[#0648aa] sm:text-6xl">
            Find a job you&apos;ll love
          </h1>
          <p className="mt-8 text-lg leading-7 text-[#474c5d]">
            Whether caregiving is your career or you&apos;re looking for part-time work, you&apos;ll find lots of opportunities to earn with SwiftOpsBD.
          </p>
          <ProfessionalSignupLink className="mt-7">Get started now</ProfessionalSignupLink>
        </div>
        <div
          className="min-h-[430px] overflow-hidden rounded-[70px] bg-cover bg-right shadow-2xl shadow-[#0648aa]/20 sm:min-h-[600px]"
          style={{ backgroundImage: `url(${heroReference})`, backgroundSize: "200% 100%", backgroundPosition: "right center" }}
          role="img"
          aria-label="Professional caregiver supporting a client at home"
        />
      </section>

      <section className="mx-auto max-w-[1248px] rounded-[48px] border border-[#c3cbe0] bg-[#f0f3ff] px-6 py-16 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight">One platform, so many ways to earn</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-6 text-[#474c5d]">
          More than 2 million families have turned to SwiftOpsBD. Maximize your earning potential with more jobs, across more categories—all on a single platform.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          {jobCategories.map(({ label, icon: Icon }) => (
            <div className="flex flex-col items-center gap-4" key={label}>
              <span className="grid size-20 place-items-center rounded-xl bg-[#0648aa] text-white"><Icon className="size-8" /></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <ProfessionalSignupLink className="mt-14 !px-10">Find a job</ProfessionalSignupLink>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight">Discover thousands of new jobs daily</h2>
        <p className="mt-3 text-[#474c5d]">With a new job posting added every 10 seconds, you&apos;ll be sure to find something that&apos;s right for you.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article className="rounded-3xl border border-[#c3cbe0] bg-white p-8 shadow-sm" key={title}>
              <Icon className="size-9 text-[#0648aa]" />
              <h3 className="mt-5 text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-6 text-[#474c5d]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <blockquote className="text-3xl font-semibold leading-relaxed tracking-tight sm:text-4xl">
            “SwiftOpsBD is such a wonderful app for making extra money. From senior care and tutoring to pet sitting, there are so many meaningful opportunities.”
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#dfe8ff] font-bold text-[#0648aa]">S</span>
            <div className="text-left"><p className="font-semibold">SwiftOpsBD caregiver</p><p className="text-xs tracking-wider text-[#747887]">COMMUNITY REVIEW</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Get started with SwiftOpsBD</h2>
          <p className="mt-3 text-[#474c5d]">Get started enrolling now by following these steps:</p>
          <div className="mt-12 space-y-4">
            {onboardingSteps.map((step, index) => {
              const isOpen = openStep === index;
              return (
                <article className="overflow-hidden rounded-2xl border border-[#c3cbe0] bg-white" key={step.title}>
                  <button className="flex w-full items-center gap-4 p-6 text-left" type="button" aria-expanded={isOpen} onClick={() => setOpenStep(isOpen ? null : index)}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#0648aa] text-sm font-bold text-white">{index + 1}</span>
                    <span className="flex-1 text-lg font-medium">{step.title}</span>
                    <ChevronDown className={`size-5 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-6 pb-6 pl-[72px] leading-6 text-[#474c5d]">{step.description}</p>}
                </article>
              );
            })}
          </div>
          <ProfessionalSignupLink className="mt-12">Get started now</ProfessionalSignupLink>
        </div>
        <JobPhonePreview />
      </section>

      <section className="mx-auto grid max-w-[1232px] overflow-hidden rounded-[48px] bg-[#0648aa] text-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">
        <div
          className="min-h-[420px] bg-cover"
          style={{ backgroundImage: `url(${safetyReference})`, backgroundSize: "200% 100%", backgroundPosition: "left center" }}
          role="img"
          aria-label="Caregiver helping a child safely"
        />
        <div className="p-10 sm:p-16">
          <h2 className="text-4xl font-bold leading-tight">Safety is at the heart of our community</h2>
          <p className="mt-7 leading-6 text-white/85">With CareProtect™, you get access to tools and support that help you avoid scams and have a safer job search.</p>
          <div className="mt-8 space-y-6 text-sm font-semibold">
            <p className="flex gap-4"><ShieldCheck className="size-6 shrink-0" /><span>Always-on monitoring – We flag fraud and remove users who break the rules of our community.</span></p>
            <p className="flex gap-4"><Headphones className="size-6 shrink-0" /><span>Support when you need it – Safety support is available to respond to your concerns.</span></p>
            <p className="flex gap-4"><ShieldCheck className="size-6 shrink-0" /><span>Dedicated safety center – Explore guides, tips and tools for a safer job search.</span></p>
          </div>
          <a className="mt-9 inline-flex rounded-xl bg-white px-8 py-3.5 font-medium text-[#0648aa] hover:bg-slate-50" href="#resources">Visit our safety center</a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24" id="resources">
        <h2 className="text-center text-3xl font-bold tracking-tight">Helpful Resources</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <article className="overflow-hidden rounded-3xl border border-[#c3cbe0] bg-white shadow-sm" key={resource.title}>
              <img className="h-56 w-full object-cover" src={resource.image} alt="" />
              <div className="p-8">
                <h3 className="text-lg font-medium">{resource.title}</h3>
                <p className="mt-4 min-h-24 leading-6 text-[#474c5d]">{resource.description}</p>
                <a className="mt-6 inline-flex items-center gap-2 font-medium text-[#0648aa]" href="#faq">Read article <ArrowRight className="size-4" /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16 text-center"><a className="inline-flex rounded-xl bg-[#0648aa] px-9 py-3.5 text-white" href="#faq">View all resources</a></div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20" id="faq">
        <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-12 divide-y divide-[#c3cbe0] border-b border-[#c3cbe0]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <article key={faq.question}>
                <button className="flex w-full items-center gap-4 py-7 text-left text-lg font-medium" type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span className="flex-1">{faq.question}</span><ChevronDown className={`size-5 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="pb-7 leading-7 text-[#474c5d]">{faq.answer}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-[1248px] rounded-[64px] bg-[#a7edf4] px-6 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-[#0648aa]">Ready to get started?</h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-7 text-[#474c5d]">Join SwiftOpsBD today to start earning with meaningful work you&apos;ll love and make a difference in your community.</p>
        <ProfessionalSignupLink className="mt-10">Find jobs now</ProfessionalSignupLink>
      </section>
    </main>
  );
};

export default FindJobs;
