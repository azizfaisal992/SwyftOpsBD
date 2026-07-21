import {
  BadgeCheck,
  BriefcaseMedical,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  Heart,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import mapImage from "../assets/find-care-map.jpg";
import { caregivers } from "../data/findCareData";

const filterChips = [
  {
    id: "service",
    label: "Service",
    options: [
      "All Services",
      "Senior Care",
      "Child Care",
      "Home Nursing",
      "Companion Care",
      "Physiotherapy",
      "Dementia Care",
    ],
  },
  {
    id: "rate",
    label: "Hourly Rate",
    options: ["Any Rate", "Up to ৳700", "Up to ৳850", "Up to ৳1,000"],
  },
  {
    id: "gender",
    label: "Gender",
    options: ["Any Gender", "Female", "Male"],
  },
  {
    id: "experience",
    label: "Experience",
    options: ["Any Experience", "5+ Years", "7+ Years", "8+ Years"],
  },
  {
    id: "rating",
    label: "Rating",
    options: ["Any Rating", "4.7+", "4.8+", "4.9+"],
  },
];

const FindCareFooter = () => (
  <footer className="border-t border-[#c3c6d6] bg-[#d7e3fb]">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-[1fr_auto_auto]">
      <div className="max-w-xs">
        <h2 className="text-sm font-bold text-[#003d9b]">SwiftOpsBD Dhaka</h2>
        <p className="mt-4 text-sm leading-6 text-[#434654]">
          Providing compassionate, professional care across Dhaka. DGHS
          Certified Facility with verified professional network.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-bold">Support</h3>
        <p className="mt-3 text-xs text-[#434654]">Help Center</p>
        <p className="mt-3 text-xs text-[#434654]">Emergency Support</p>
      </div>
      <div>
        <h3 className="text-sm font-bold">Legal</h3>
        <p className="mt-3 text-xs text-[#434654]">Privacy Policy</p>
        <p className="mt-3 text-xs text-[#434654]">Terms of Service</p>
      </div>
    </div>
    <p className="mx-auto max-w-7xl border-t border-[#c3c6d6]/40 px-6 py-4 text-xs text-[#434654]/70">
      © 2026 SwiftOpsBD Dhaka. DGHS Certified Facility. All Rights Reserved.
    </p>
  </footer>
);

const FindCare = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [service, setService] = useState("Senior Care");
  const [location, setLocation] = useState("Gulshan, Dhaka 1212");
  const [maxRate, setMaxRate] = useState("");
  const [search, setSearch] = useState({
    service: "",
    location: "",
    maxRate: "",
  });
  const [chipFilters, setChipFilters] = useState({
    service: "All Services",
    rate: "Any Rate",
    gender: "Any Gender",
    experience: "Any Experience",
    rating: "Any Rating",
  });

  const visibleCaregivers = useMemo(
    () =>
      caregivers.filter((caregiver) => {
        const matchesService =
          !search.service ||
          caregiver.tags.some((tag) =>
            tag.toLowerCase().includes(search.service.toLowerCase()),
          ) ||
          caregiver.role.toLowerCase().includes(search.service.toLowerCase());
        const matchesLocation =
          !search.location ||
          caregiver.location
            .toLowerCase()
            .includes(search.location.split(",")[0].toLowerCase()) ||
          search.location.toLowerCase().includes("dhaka");
        const matchesRate =
          !search.maxRate || caregiver.rate <= Number(search.maxRate);
        const matchesChipService =
          chipFilters.service === "All Services" ||
          caregiver.tags.includes(chipFilters.service) ||
          caregiver.role
            .toLowerCase()
            .includes(chipFilters.service.toLowerCase());
        const chipRate = Number(
          chipFilters.rate.match(/\d[\d,]*/)?.[0]?.replace(",", "") || 0,
        );
        const matchesChipRate = !chipRate || caregiver.rate <= chipRate;
        const matchesGender =
          chipFilters.gender === "Any Gender" ||
          caregiver.gender === chipFilters.gender;
        const experienceMinimum = Number(
          chipFilters.experience.match(/\d+/)?.[0] || 0,
        );
        const matchesExperience =
          !experienceMinimum || caregiver.experienceYears >= experienceMinimum;
        const ratingMinimum = Number(
          chipFilters.rating.match(/\d\.\d/)?.[0] || 0,
        );
        const matchesRating =
          !ratingMinimum || caregiver.rating >= ratingMinimum;
        return (
          matchesService &&
          matchesLocation &&
          matchesRate &&
          matchesChipService &&
          matchesChipRate &&
          matchesGender &&
          matchesExperience &&
          matchesRating
        );
      }),
    [chipFilters, search],
  );

  const filtersAreActive = Object.entries(chipFilters).some(
    ([key, value]) =>
      ({
        service: "All Services",
        rate: "Any Rate",
        gender: "Any Gender",
        experience: "Any Experience",
        rating: "Any Rating",
      })[key] !== value,
  );

  const resetChipFilters = () =>
    setChipFilters({
      service: "All Services",
      rate: "Any Rate",
      gender: "Any Gender",
      experience: "Any Experience",
      rating: "Any Rating",
    });

  const selected =
    caregivers.find((caregiver) => caregiver.id === selectedId) ||
    visibleCaregivers[0] ||
    caregivers[0];

  const submitSearch = (event) => {
    event.preventDefault();
    setSearch({ service, location, maxRate });
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  };

  return (
    <>
      <section className="sticky top-16 z-30 border-b border-[#c3c6d6] bg-white/95 py-4 shadow-sm backdrop-blur-md">
        <form
          className="mx-auto max-w-7xl px-5 sm:px-6"
          onSubmit={submitSearch}
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr_0.7fr_auto]">
            <label className="find-care-search-field">
              <BriefcaseMedical className="size-5" />
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option>Senior Care</option>
                <option>Child Care</option>
                <option>Home Nursing</option>
                <option>Companion Care</option>
              </select>
            </label>
            <label className="find-care-search-field">
              <MapPin className="size-5" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
              />
            </label>
            <label className="find-care-search-field">
              <CalendarDays className="size-5" />
              <input type="date" aria-label="Select date" />
            </label>
            <label className="find-care-search-field">
              <CircleDollarSign className="size-5" />
              <input
                type="number"
                min="0"
                value={maxRate}
                onChange={(event) => setMaxRate(event.target.value)}
                placeholder="Max hourly rate"
              />
            </label>
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-[#003d9b] px-7 py-3 font-semibold text-white hover:bg-[#002f78]"
              type="submit"
            >
              <Search className="size-5" />
              Find Care
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {filterChips.map((chip) => {
              const defaultValue = chip.options[0];
              const active = chipFilters[chip.id] !== defaultValue;
              return (
                <label
                  className={`relative flex shrink-0 items-center rounded-full border px-4 py-2 text-xs font-medium ${
                    active
                      ? "border-[#003d9b] bg-[#003d9b] text-white"
                      : "border-[#c3c6d6] bg-[#f0f3ff]"
                  }`}
                  key={chip.id}
                >
                  <span className="pointer-events-none mr-1">
                    {active ? chipFilters[chip.id] : chip.label}
                  </span>
                  <ChevronDown className="pointer-events-none size-3" />
                  <select
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={`Filter by ${chip.label}`}
                    value={chipFilters[chip.id]}
                    onChange={(event) =>
                      setChipFilters((current) => ({
                        ...current,
                        [chip.id]: event.target.value,
                      }))
                    }
                  >
                    {chip.options.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
            {filtersAreActive && (
              <button
                className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-[#003d9b] hover:bg-[#f0f3ff]"
                type="button"
                onClick={resetChipFilters}
              >
                Clear filters
              </button>
            )}
            <span className="mx-1 h-8 w-px shrink-0 bg-[#c3c6d6]" />
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#9df5c5] px-4 py-2 text-xs font-medium text-[#10734d]">
              <ShieldCheck className="size-4" />
              Background Checked
            </span>
          </div>
        </form>
      </section>

      <main className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:px-6 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {visibleCaregivers.length || 0} Caregivers in Dhaka
            </h1>
            <span className="whitespace-nowrap text-xs text-[#737685]">
              Sort by: Recommended
            </span>
          </div>
          <div className="space-y-4">
            {visibleCaregivers.map((caregiver) => (
              <article
                className={`relative flex cursor-pointer gap-4 rounded-lg border bg-white p-4 transition ${selected.id === caregiver.id ? "border-2 border-[#003d9b] shadow-lg" : "border-[#c3c6d6] hover:border-[#003d9b]/50"}`}
                key={caregiver.id}
                onClick={() => setSelectedId(caregiver.id)}
              >
                <img
                  className="size-24 shrink-0 rounded object-cover"
                  src={caregiver.image}
                  alt={caregiver.name}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-medium text-[#003d9b]">
                        {caregiver.name}
                      </h2>
                      <p className="text-xs text-[#737685]">
                        {caregiver.location} • {caregiver.distance}
                      </p>
                    </div>
                    <button
                      className="p-1"
                      type="button"
                      aria-label={`Favorite ${caregiver.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(caregiver.id);
                      }}
                    >
                      <Heart
                        className={`size-5 ${favorites.includes(caregiver.id) ? "fill-red-500 text-red-500" : "text-[#737685]"}`}
                      />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <b>{caregiver.rating}</b>
                    <span className="text-[#737685]">
                      ({caregiver.reviews} reviews)
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs">{caregiver.role}</p>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {caregiver.tags.map((tag) => (
                        <span
                          className="rounded-sm bg-[#f0f3ff] px-2 py-1 text-[10px] font-semibold uppercase"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <strong className="whitespace-nowrap text-[#003d9b]">
                      ৳{caregiver.rate}/hr
                    </strong>
                  </div>
                </div>
              </article>
            ))}
            {!visibleCaregivers.length && (
              <div className="rounded-lg border border-[#c3c6d6] bg-white p-8 text-center text-[#434654]">
                No caregivers match these filters.
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center gap-2 text-xs">
            <button className="rounded border px-3 py-2">‹</button>
            <button className="rounded bg-[#003d9b] px-3 py-2 text-white">
              1
            </button>
            <button className="rounded border px-3 py-2">2</button>
            <button className="rounded border px-3 py-2">3</button>
            <button className="rounded border px-3 py-2">›</button>
          </div>
        </section>

        <aside className="overflow-hidden rounded-xl border border-[#c3c6d6] bg-white shadow-sm lg:col-span-7 lg:sticky lg:top-[218px] lg:self-start">
          <div className="h-32 bg-[#003d9b]" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-16 flex items-end justify-between gap-4">
              <img
                className="size-28 rounded-xl border-4 border-white object-cover shadow-md"
                src={selected.image}
                alt={selected.name}
              />
              <button
                className="mb-2"
                type="button"
                aria-label={`Favorite ${selected.name}`}
                onClick={() => toggleFavorite(selected.id)}
              >
                <Heart
                  className={`size-6 ${favorites.includes(selected.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                />
              </button>
            </div>
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="flex items-center gap-2 text-3xl font-semibold">
                  {selected.name}
                  <BadgeCheck className="size-5 fill-[#003d9b] text-white" />
                </h2>
                <p className="mt-1 text-[#737685]">{selected.role}</p>
                <p className="mt-2 flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-4 text-[#003d9b]" />
                    {selected.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-4 text-[#003d9b]" />
                    BSN Graduate
                  </span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <strong className="text-4xl text-[#003d9b]">
                  ৳{selected.rate}
                </strong>
                <span>/hr</span>
                <p className="text-xs text-[#737685]">
                  Average response: 2 hrs
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <section className="rounded-lg border border-[#c3c6d6] bg-[#f0f3ff] p-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="size-5 text-[#003d9b]" />
                  Certifications
                </h3>
                <ul className="mt-3 space-y-2 text-xs">
                  {selected.certifications.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>
              <section className="rounded-lg border border-[#c3c6d6] bg-[#f0f3ff] p-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <CalendarDays className="size-5 text-[#016c47]" />
                  Weekly Availability
                </h3>
                <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[10px]">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div key={`${day}-${index}`}>
                      <span>{day}</span>
                      <span
                        className={`mt-2 block aspect-square rounded-sm ${index < 5 ? "bg-[#003d9b]" : "bg-[#c3c6d6]"}`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="relative mt-4 overflow-hidden rounded-lg border border-[#c3c6d6] p-4">
              <img
                className="absolute inset-0 size-full object-cover opacity-45"
                src={mapImage}
                alt=""
              />
              <div className="relative">
                <h3 className="flex items-center gap-2 font-medium">
                  <MapPin className="size-5 text-[#003d9b]" />
                  Service Area
                </h3>
                <p className="mt-1 text-xs font-medium">
                  Primary: Gulshan 1212, Banani, Baridhara
                </p>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="font-medium">Biography</h3>
              <p className="mt-4 text-sm leading-7 text-[#434654]">
                {selected.biography}
              </p>
            </section>
            <div className="mt-7 grid gap-3 border-t border-[#c3c6d6]/40 pt-5 sm:grid-cols-2">
              <Link
                className="flex items-center justify-center gap-2 rounded-lg bg-[#003d9b] px-5 py-4 text-center font-semibold text-white"
                to={`/care-plan?caregiver=${selected.id}`}
              >
                <BadgeCheck className="size-5" />
                Create Care Plan →
              </Link>
              {/* <Link
                className="flex items-center justify-center rounded-lg border-2 border-[#003d9b] px-5 py-4 text-center font-semibold text-[#003d9b]"
                to={`/care-plan?caregiver=${selected.id}&intent=book`}
              >
                Book Caregiver
              </Link> */}
              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#003d9b] px-5 py-4 font-semibold text-[#003d9b]">
                <MessageSquareText className="size-5" />
                Message
              </button>
            </div>
          </div>
        </aside>
      </main>
      <FindCareFooter />
    </>
  );
};

export default FindCare;
