import heroImage from "../assets/hero.png";
import sarahImage from "../assets/caregiver-sarah.jpg";
import allexusImage from "../assets/caregiver-allexus.jpg";
import kellyImage from "../assets/caregiver-kelly.jpg";
import { Link } from "react-router-dom";

const Icon = ({ name, className = "size-6" }) => {
  const paths = {
    child: <><circle cx="12" cy="8" r="3" /><path d="M7 21v-4a5 5 0 0 1 10 0v4M9 13l-3 3m9-3 3 3" /></>,
    senior: <><circle cx="12" cy="5" r="2.5" /><path d="M9 21v-7l-2 3m8 4v-7l2 3M9 10h6M12 8v6" /></>,
    adult: <><circle cx="9" cy="8" r="3" /><circle cx="16" cy="10" r="2" /><path d="M4 21v-3a5 5 0 0 1 10 0v3m0-6a4 4 0 0 1 6 3.5V21" /></>,
    home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    pet: <><circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" /><circle cx="5" cy="13" r="2" /><circle cx="19" cy="13" r="2" /><path d="M8 18c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 2-2 1-4 0-4-2Z" /></>,
    book: <><path d="M3 5h7a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H3Z" /><path d="M21 5h-7a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h7Z" /></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></>,
    post: <><path d="M5 4h14v16H5Z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m0-6a4 4 0 0 1 6 3.5V21" /></>,
    review: <><path d="M4 4h16v12H8l-4 4Z" /><path d="m9 10 2 2 4-4" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const services = [
  ["child", "Child care"],
  ["senior", "Senior care"],
  ["adult", "Adult care"],
  ["home", "Housekeeping"],
  ["pet", "Pet care"],
  ["book", "Tutoring"],
];

const caregivers = [
  {
    name: "Sarah",
    role: "Nanny • 5 years experience",
    rating: "4.8",
    image: sarahImage,
    quote: "Sarah is amazing! She is very interactive with the kids. They ask for her to come back over and over again.",
    author: "Jennifer M.",
    tags: ["Meal prep", "Light cleaning"],
  },
  {
    name: "Allexus",
    role: "Nanny • 3 years experience",
    rating: "5.0",
    image: allexusImage,
    quote: "Allexus was wonderful with our twins. Active, knowledgeable, playful, loving, responsible—she would hire her again.",
    author: "Amy K.",
    tags: ["Newborn care", "Laundry"],
  },
  {
    name: "Kelly",
    role: "Nanny, caregiver • 10 years experience",
    rating: "4.8",
    image: kellyImage,
    quote: "Kelly is a very kind and compassionate caregiver. I am very satisfied with the level of care she provides for my mother.",
    author: "Gail M.",
    tags: ["Dementia care", "Transportation"],
  },
];

const steps = [
  ["post", "Post a job", "Tell us exactly what you need, and let caregivers apply directly to your position."],
  ["people", "Compare profiles", "From experience and ratings to location and pay, see it all in one clear view."],
  ["review", "Read reviews", "No need to ask around, see what other local families have said about their experience."],
];

const Home = () => (
  <>
    <section className="relative isolate flex min-h-[500px] items-center justify-center overflow-hidden bg-[#f0f3ff]">
      <img className="absolute inset-0 -z-20 size-full object-cover object-center" src={heroImage} alt="Family spending time with a caregiver" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-white/40 to-white/10" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-20 text-center">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.02em] text-[#101c2d] sm:text-5xl">
          Connecting families with quality, local caregivers
        </h1>
        <form className="mt-5 flex w-full max-w-xl items-center rounded-full border border-[#c3c6d6] bg-white p-2 shadow-2xl" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="postal-code">Enter Postal Code</label>
          <input id="postal-code" className="min-w-0 flex-1 bg-transparent px-5 py-3 text-base outline-none" placeholder="Enter Postal Code" />
          <button className="primary-button flex items-center gap-2" type="submit">
            Search <Icon name="search" className="size-[18px]" />
          </button>
        </form>
        <p className="mt-6 text-xl font-semibold text-[#101c2d] sm:text-2xl">One membership for every season of life</p>
      </div>
    </section>

    <section id="services" className="border-b border-[#c3c6d6] bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {services.map(([icon, label]) => (
          <a className="group flex flex-col items-center gap-3 text-sm font-semibold text-[#101c2d]" href="#caregivers" key={label}>
            <span className="grid size-20 place-items-center rounded-full bg-[#f0f3ff] text-[#003d9b] transition group-hover:-translate-y-1 group-hover:bg-[#d7e3fb]">
              <Icon name={icon} />
            </span>
            {label}
          </a>
        ))}
      </div>
    </section>

    <section className="border-y border-[#c3c6d6] bg-[#d7e3fb] py-7">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 px-6 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-4">
          <Icon name="shield" className="size-7 shrink-0 text-[#003d9b]" />
          <div>
            <h2 className="text-sm font-semibold">Your Security is Our Priority</h2>
            <p className="text-sm text-[#434654]">Every caregiver undergoes a rigorous background check process.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <span className="text-emerald-700">● Background Checked</span>
          <span className="text-emerald-700">● Identity Verified</span>
          <a className="font-semibold text-[#003d9b]" href="#safety">Learn more</a>
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold text-[#434654]/80 sm:text-3xl">
        Over 5 million families and caregivers have turned to SwiftOpsBD
      </h2>
    </section>

    <section id="caregivers" className="bg-[#f0f3ff] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-12 text-center text-base text-[#101c2d]">Meet our top-rated caregivers</p>
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {caregivers.map((caregiver) => (
            <article className="overflow-hidden rounded-xl border border-[#c3c6d6] bg-white shadow-sm" key={caregiver.name}>
              <div className="relative h-72 overflow-hidden">
                <img className="size-full object-cover" src={caregiver.image} alt={`${caregiver.name}, verified caregiver`} />
                <span className="absolute right-4 top-4 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ● Verified
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{caregiver.name}</h3>
                    <p className="text-xs text-[#434654]">{caregiver.role}</p>
                  </div>
                  <span className="text-sm font-semibold">★ {caregiver.rating}</span>
                </div>
                <blockquote className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-[#434654]">
                  “{caregiver.quote}”
                  <cite className="mt-2 block font-semibold text-[#003d9b]">— {caregiver.author}</cite>
                </blockquote>
                <p className="mt-5 text-[10px] uppercase tracking-wider text-slate-500">Can help with</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {caregiver.tags.map((tag) => <span className="rounded-full border border-[#c3c6d6] bg-[#f0f3ff] px-3 py-1 text-xs" key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="how-it-works" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Find care on your terms</h2>
        <p className="mt-2 text-sm text-[#434654]">We’ve simplified the process to get you the support you need faster.</p>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {steps.map(([icon, title, description]) => (
            <article className="flex flex-col items-center" key={title}>
              <span className="mb-6 grid size-16 place-items-center rounded-full bg-[#003d9b] text-white shadow-lg">
                <Icon name={icon} />
              </span>
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#434654]">{description}</p>
            </article>
          ))}
        </div>
        <Link id="join" className="primary-button mt-14 inline-block !px-12 !py-4 text-lg" to="/join">Get started</Link>
      </div>
    </section>
  </>
);

export default Home;
