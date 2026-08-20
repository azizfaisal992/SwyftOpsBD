import { ArrowLeft, ArrowRight, ContactRound, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientOnboardingLayout from "../../components/client/ClientOnboardingLayout";
import ClientProgress from "../../components/client/ClientProgress";
import BarikoiMap from "../../components/maps/BarikoiMap";
import useAuth from "../../hooks/useAuth";
import useClientOnboarding from "../../hooks/useClientOnboarding";
import {
  getBrowserLocation,
  reverseGeocode,
  searchMapPlaces,
} from "../../services/mapService";

const ClientContactSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { record, saveContact } = useClientOnboarding();
  const [area, setArea] = useState(record.contact.area || "");
  const [searchTerm, setSearchTerm] = useState(record.contact.area || "");
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(
    Number.isFinite(Number(record.contact.latitude))
      && Number.isFinite(Number(record.contact.longitude))
      ? {
          latitude: Number(record.contact.latitude),
          longitude: Number(record.contact.longitude),
        }
      : null,
  );
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length < 3 || query === area) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      searchMapPlaces(query)
        .then(setSuggestions)
        .catch((searchError) => setError(searchError.message));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [area, searchTerm]);

  const pinLocation = async (coordinates) => {
    setLocating(true);
    setError("");
    try {
      const place = await reverseGeocode(coordinates);
      const nextArea = place.area || place.city || place.address;
      setLocation({
        latitude: Number(place.latitude ?? coordinates.latitude),
        longitude: Number(place.longitude ?? coordinates.longitude),
      });
      if (nextArea) {
        setArea(nextArea);
        setSearchTerm(nextArea);
      }
      setSuggestions([]);
    } catch (locationError) {
      setLocation(coordinates);
      setError(`${locationError.message} The pin was kept; confirm the address fields.`);
    } finally {
      setLocating(false);
    }
  };

  const selectSuggestion = (place) => {
    const nextArea = place.area || place.city || place.address;
    setArea(nextArea);
    setSearchTerm(nextArea);
    setLocation({
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
    });
    setSuggestions([]);
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    setError("");
    try {
      await pinLocation(await getBrowserLocation());
    } catch (locationError) {
      setError(locationError.message);
      setLocating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submittedArea = (area || searchTerm).trim();
    const hasValidLocation = location
      && Number.isFinite(Number(location.latitude))
      && Number.isFinite(Number(location.longitude))
      && Number(location.latitude) >= 20.5
      && Number(location.latitude) <= 26.8
      && Number(location.longitude) >= 88
      && Number(location.longitude) <= 92.8;
    if (!hasValidLocation) {
      setError("Select an address or click the map to pin the precise care location.");
      return;
    }
    if (!submittedArea) {
      setError("Enter the area or neighborhood for this care location.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    try {
      await saveContact({
        phone: formData.get("phone"),
        email: formData.get("email"),
        area: submittedArea,
        road: formData.get("road"),
        house: formData.get("house"),
        locationPinned: true,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      navigate("/client/verification");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientOnboardingLayout wide>
      <header>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#06449d]">Contact &amp; Location</h1>
        <p className="mt-2 text-lg text-[#4c5261]">Step 2 of 3 in setting up your profile.</p>
      </header>
      <ClientProgress activeStep={2} />

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-lg border border-[#c5cad8] bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-[#c5cad8] pb-2 text-2xl font-semibold">
              <ContactRound className="size-6 fill-[#111c2c]" /> Contact Information
            </h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="client-label">Phone Number</span>
                <span className="flex">
                  <span className="grid place-items-center border border-r-0 border-[#c5cad8] bg-[#f5f6f8] px-3 text-[#4c5261]">+880</span>
                  <input className="client-input min-w-0 rounded-l-none" name="phone" defaultValue={record.contact.phone} inputMode="tel" placeholder="1XXXXXXXXX" required />
                </span>
              </label>
              <label className="block">
                <span className="client-label">Email Address</span>
                <input className="client-input" name="email" type="email" defaultValue={record.contact.email || user?.email || ""} placeholder="client@example.com" required />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-[#c5cad8] bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-[#c5cad8] pb-2 text-2xl font-semibold">
              <MapPin className="size-6 fill-[#111c2c]" /> Precise Address
            </h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="client-label">Search area / neighborhood</span>
                <span className="relative block">
                  <input
                    className="client-input"
                    value={searchTerm}
                    placeholder="Search a Dhaka address..."
                    autoComplete="off"
                    required
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setArea("");
                      setSuggestions([]);
                    }}
                  />
                  {suggestions.length > 0 && (
                    <span className="absolute z-20 mt-1 block max-h-52 w-full overflow-y-auto rounded-lg border border-[#c5cad8] bg-white shadow-xl">
                      {suggestions.map((place) => (
                        <button
                          className="flex w-full items-start gap-2 border-b px-3 py-3 text-left text-sm hover:bg-[#eef3ff]"
                          key={`${place.id}-${place.latitude}-${place.longitude}`}
                          type="button"
                          onClick={() => selectSuggestion(place)}
                        >
                          <MapPin className="mt-0.5 size-4 shrink-0 text-[#0755d3]" />
                          <span>{place.address}<small className="block text-[#687184]">{[place.area, place.city].filter(Boolean).join(", ")}</small></span>
                        </button>
                      ))}
                    </span>
                  )}
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="client-label">Road Number / Name</span>
                  <input className="client-input" name="road" defaultValue={record.contact.road} placeholder="e.g. Road 11" required />
                </label>
                <label>
                  <span className="client-label">House / Apt Number</span>
                  <input className="client-input" name="house" defaultValue={record.contact.house} placeholder="e.g. House 42, Apt 3B" required />
                </label>
              </div>
              <div className="relative h-64 overflow-hidden rounded border border-[#c5cad8]">
                <BarikoiMap
                  center={location}
                  markers={location ? [{ ...location, label: "Care location" }] : []}
                  onLocationSelect={pinLocation}
                  className="h-full w-full"
                  zoom={location ? 16 : 12}
                />
                <button
                  className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#06449d] shadow-lg disabled:opacity-60"
                  type="button"
                  disabled={locating}
                  onClick={useCurrentLocation}
                >
                  <LocateFixed className="size-5" />
                  {locating ? "Finding location..." : "Use my location"}
                </button>
              </div>
              <p className={`text-xs ${location ? "text-emerald-700" : "text-amber-700"}`}>
                {location
                  ? `Pinned: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                  : "Search for an address or click directly on the map to set the care location."}
              </p>
            </div>
          </section>
        </div>

        {error && <p className="mt-6 rounded bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

        <div className="mt-7 flex justify-between border-t border-[#c5cad8] pt-3">
          <button className="flex items-center gap-2 bg-[#e7efff] px-4 py-2.5 text-sm font-semibold" type="button" disabled={saving} onClick={() => navigate("/client/profile-setup")}>
            <ArrowLeft className="size-5" /> Back
          </button>
          <button className="flex items-center gap-3 bg-[#0047a8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#003781] disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Next: Verification"} <ArrowRight className="size-5" />
          </button>
        </div>
      </form>
    </ClientOnboardingLayout>
  );
};

export default ClientContactSetup;
