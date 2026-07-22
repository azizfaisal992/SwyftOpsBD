import { ArrowLeft, ArrowRight, ContactRound, LocateFixed, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mapImage from "../../assets/find-care-map.jpg";
import ClientOnboardingLayout from "../../components/client/ClientOnboardingLayout";
import ClientProgress from "../../components/client/ClientProgress";
import useAuth from "../../hooks/useAuth";
import useClientOnboarding from "../../hooks/useClientOnboarding";

const ClientContactSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { record, saveContact } = useClientOnboarding();
  const [locationPinned, setLocationPinned] = useState(record.contact.locationPinned);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveContact({
      phone: formData.get("phone"),
      email: formData.get("email"),
      area: formData.get("area"),
      road: formData.get("road"),
      house: formData.get("house"),
      locationPinned,
    });
    navigate("/client/verification");
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
                <span className="client-label">Area / Neighborhood</span>
                <select className="client-input" name="area" defaultValue={record.contact.area} required>
                  <option value="" disabled>Select an area...</option>
                  <option>Dhanmondi</option>
                  <option>Gulshan</option>
                  <option>Banani</option>
                  <option>Uttara</option>
                  <option>Mirpur</option>
                  <option>Mohammadpur</option>
                  <option>Bashundhara</option>
                </select>
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
              <div className="relative h-50 overflow-hidden rounded border border-[#c5cad8]">
                <img className="h-full w-full object-cover" src={mapImage} alt="Map of Dhaka for selecting a precise location" />
                <button
                  className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl bg-white px-5 py-2 text-xs shadow-lg ${
                    locationPinned ? "text-emerald-700" : "text-[#111c2c]"
                  }`}
                  type="button"
                  onClick={() => setLocationPinned((value) => !value)}
                >
                  <LocateFixed className={`size-7 ${locationPinned ? "text-emerald-600" : "fill-[#06449d] text-[#06449d]"}`} />
                  {locationPinned ? "Location pinned" : "Pin precise location"}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-7 flex justify-between border-t border-[#c5cad8] pt-3">
          <button className="flex items-center gap-2 bg-[#e7efff] px-4 py-2.5 text-sm font-semibold" type="button" onClick={() => navigate("/client/profile-setup")}>
            <ArrowLeft className="size-5" /> Back
          </button>
          <button className="flex items-center gap-3 bg-[#0047a8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#003781]" type="submit">
            Next: Verification <ArrowRight className="size-5" />
          </button>
        </div>
      </form>
    </ClientOnboardingLayout>
  );
};

export default ClientContactSetup;
