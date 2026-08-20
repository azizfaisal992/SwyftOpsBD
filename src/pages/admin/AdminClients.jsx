import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  HeartPulse,
  MapPin,
  RefreshCw,
  Search,
  UserPlus,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import BarikoiMap from "../../components/maps/BarikoiMap";
import {
  deleteClientAccount,
  downloadSystemDocument,
  getSystemDocuments,
  getVerifiedClients,
  renewClientCare,
  updateClientDetails,
} from "../../services/adminDirectoryService";
import { openVerificationDocument } from "../../services/adminVerificationService";
import { listAdminAssignments } from "../../services/assignmentService";
import { getAdminFinanceOverview } from "../../services/paymentService";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "—";
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return "—";
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDifference = now.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && now.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age;
};

const isCurrentAssignment = (assignment) =>
  !["cancelled", "completed"].includes(assignment.status);

const toClient = (record, assignments = []) => {
  const clientAssignments = assignments
    .filter(
      (assignment) =>
        assignment.clientId === record.clientId &&
        isCurrentAssignment(assignment),
    )
    .sort((a, b) =>
      String(b.assignedAt || "").localeCompare(String(a.assignedAt || "")),
    );
  return {
  id: record.clientId,
  name: record.profile?.fullName || record.accountEmail || "Client",
  image: null,
  age: calculateAge(record.profile?.dateOfBirth),
  dateOfBirth: record.profile?.dateOfBirth || "Not provided",
  gender: record.profile?.gender || "Not provided",
  phone: record.contact?.phone || "Not provided",
  email: record.contact?.email || record.accountEmail || "Not provided",
  address:
    [record.contact?.house, record.contact?.road, record.contact?.area]
      .filter(Boolean)
      .join(", ") || "Not provided",
  nid: "Verified",
  carePlan: clientAssignments[0]?.careType || "No active care plan",
  bloodGroup: "Not provided",
  language: "Not provided",
  assignments: clientAssignments,
  raw: record,
  };
};

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [nidStatus, setNidStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [records, assignments] = await Promise.all([
        getVerifiedClients(),
        listAdminAssignments(),
      ]);
      setClients(records.map((record) => toClient(record, assignments)));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshDirectory = () => {
      Promise.all([getVerifiedClients(), listAdminAssignments()])
        .then(([records, assignments]) => {
          if (!cancelled) {
            const updated = records.map((record) =>
              toClient(record, assignments),
            );
            setClients(updated);
            setSelected((current) =>
              current
                ? updated.find((item) => item.id === current.id) || current
                : null,
            );
          }
        })
        .catch((requestError) => {
          if (!cancelled) setError(requestError.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    refreshDirectory();
    const refreshTimer = window.setInterval(refreshDirectory, 15000);
    window.addEventListener("focus", refreshDirectory);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refreshDirectory);
    };
  }, []);

  const filtered = useMemo(
    () =>
      clients.filter((client) => {
        const searchable =
          `${client.name} ${client.phone} ${client.id} ${client.address}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (nidStatus === "All" || client.nid === nidStatus)
        );
      }),
    [clients, query, nidStatus],
  );

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold">Clients ({clients.length})</h1>
          <p className="mt-1 text-sm text-[#515867]">
            Manage client information, care plans, and medical records.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-3 py-2.5 text-sm font-semibold text-[#515867]"
            type="button"
            onClick={loadClients}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white"
            type="button"
          >
            <UserPlus className="size-4" /> Add Client
          </button>
        </div>
      </div>

      <section className="mt-5 grid gap-3 rounded-xl border border-[#c5cad8] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_160px_180px_180px]">
        <label className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3">
          <Search className="size-4" />
          <input
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, NID, address..."
          />
        </label>
        <select className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select
          className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none"
          value={nidStatus}
          onChange={(event) => setNidStatus(event.target.value)}
        >
          <option>All</option>
          <option>Verified</option>
          <option>Pending</option>
        </select>
        <select className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none">
          <option>All Zones</option>
          <option>Dhaka North</option>
          <option>Dhaka South</option>
        </select>
      </section>

      {error && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="flex-1">{error}</span>
          <button
            className="font-semibold underline"
            type="button"
            onClick={loadClients}
          >
            Try again
          </button>
        </div>
      )}

      <section className="mt-5 hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-[#c5cad8] bg-[#f0f2fa] text-[#515867]">
              <tr>
                <th className="px-5 py-4">Client Name</th>
                <th className="px-5 py-4">Demographics</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">NID</th>
                <th className="px-5 py-4">Care Plan</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-12 text-center text-[#606878]"
                    colSpan={7}
                  >
                    No verified clients match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((client) => (
                <tr
                  className="border-b border-[#d7dbe7] last:border-0"
                  key={client.id}
                >
                  <td className="px-5 py-4">
                    <button
                      className="flex items-center gap-3 text-left"
                      type="button"
                      onClick={() => setSelected(client)}
                    >
                      <ClientAvatar className="size-10 rounded-full" />
                      <span>
                        <b className="block">{client.name}</b>
                        <small className="text-[#606878]">
                          ID: {client.id.toUpperCase()}
                        </small>
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    {client.age} yrs
                    <small className="block text-[#606878]">
                      {client.gender}
                    </small>
                  </td>
                  <td className="px-5 py-4">{client.phone}</td>
                  <td className="max-w-52 px-5 py-4 text-[#515867]">
                    {client.address}
                  </td>
                  <td className="px-5 py-4">
                    <Status value={client.nid} />
                  </td>
                  <td className="px-5 py-4">{client.carePlan}</td>
                  <td className="px-5 py-4">
                    <button
                      className="font-semibold text-[#0649ad]"
                      type="button"
                      onClick={() => setSelected(client)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#c5cad8] bg-[#f7f8fd] px-5 py-4 text-sm text-[#515867]">
          {loading
            ? "Loading verified clients..."
            : `Showing ${filtered.length} of ${clients.length} verified clients`}
        </div>
      </section>

      <div className="mt-5 grid gap-3 md:hidden">
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-[#c5cad8] bg-white p-8 text-center text-sm text-[#606878]">
            No verified clients match these filters.
          </div>
        )}
        {filtered.map((client) => (
          <article
            className="rounded-xl border border-[#c5cad8] bg-white p-4"
            key={client.id}
          >
            <div className="flex items-center gap-3">
              <ClientAvatar className="size-12 rounded-full" />
              <div className="min-w-0 flex-1">
                <b>{client.name}</b>
                <small className="block text-[#606878]">
                  {client.age} yrs • {client.gender}
                </small>
              </div>
              <Status value={client.nid} />
            </div>
            <div className="mt-4 space-y-2 border-t border-[#e1e4ec] pt-3 text-sm">
              <p>{client.phone}</p>
              <p className="flex gap-2 text-[#515867]">
                <MapPin className="size-4 shrink-0 text-[#0755d3]" />{" "}
                {client.address}
              </p>
              <p>
                <b>Care:</b> {client.carePlan}
              </p>
            </div>
            <button
              className="mt-4 w-full rounded-lg bg-[#0755d3] py-2.5 text-sm font-semibold text-white"
              type="button"
              onClick={() => setSelected(client)}
            >
              View Client Profile
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <ClientDrawer
          client={selected}
          onClose={() => setSelected(null)}
          onUpdated={async () => {
            setSelected(null);
            await loadClients();
          }}
          onDeleted={async () => {
            setSelected(null);
            await loadClients();
          }}
        />
      )}
    </div>
  );
};

const clientTabs = ["Profile", "Medical", "Care Plan", "Payments", "Docs"];

const ClientDrawer = ({
  client,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const editDetails = async () => {
    const fullName = window.prompt("Client full name:", client.name);
    if (!fullName?.trim()) return;
    const phone = window.prompt("Phone number:", client.phone);
    if (phone === null) return;
    const area = window.prompt(
      "Area / neighborhood:",
      client.raw?.contact?.area || "",
    );
    if (area === null) return;
    const road = window.prompt("Road:", client.raw?.contact?.road || "");
    if (road === null) return;
    const house = window.prompt("House / apartment:", client.raw?.contact?.house || "");
    if (house === null) return;
    setBusy("edit");
    setActionError("");
    try {
      await updateClientDetails(client.id, {
        fullName,
        dateOfBirth: client.raw?.profile?.dateOfBirth,
        gender: client.raw?.profile?.gender,
        nidNumber: client.raw?.profile?.nidNumber,
        phone,
        email: client.email,
        area,
        road,
        house,
      });
      await onUpdated?.();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy("");
    }
  };

  const renewCare = async () => {
    if (!window.confirm(
      `Create a new draft using ${client.name}'s most recent care plan?`,
    )) return;
    setBusy("renew");
    setActionError("");
    try {
      const plan = await renewClientCare(client.id);
      setNotice(
        `Renewal draft #${plan.carePlanId.slice(0, 8).toUpperCase()} created. The client can review and pay the new deposit.`,
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy("");
    }
  };

  const deleteClient = async () => {
    const confirmation = window.prompt(
      `Permanent deletion removes this client, authentication account, files, care plans, requests, assignments, visits, payments and messages.\n\nType the client ID to continue:\n${client.id}`,
    );
    if (confirmation !== client.id) {
      if (confirmation !== null) setActionError("Client ID did not match. Nothing was deleted.");
      return;
    }
    setBusy("delete");
    setActionError("");
    try {
      await deleteClientAccount(client.id);
      await onDeleted?.();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <button
        className="fixed inset-0 z-40 bg-slate-950/45"
        type="button"
        onClick={onClose}
        aria-label="Close client profile"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-2xl">
        <header className="flex items-center gap-4 border-b border-[#c5cad8] p-5">
          <ClientAvatar className="size-14 rounded-lg" />
          <div>
            <b className="block">{client.name}</b>
            <span className="flex items-center gap-2">
              <Status value="Verified" />
              <small>{client.id.toUpperCase()}</small>
            </span>
          </div>
          <button className="ml-auto" type="button" onClick={onClose}>
            <X className="size-6" />
          </button>
        </header>
        <nav className="hide-scrollbar flex overflow-x-auto border-b border-[#c5cad8] px-4">
          {clientTabs.map((tab) => (
            <button
              className={`whitespace-nowrap border-b-2 px-3 py-4 text-sm transition duration-200 hover:scale-105 hover:font-semibold hover:text-[#0755d3] ${activeTab === tab ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "Profile" && (
            <>
              <dl className="grid grid-cols-2 gap-6">
                <ProfileField
                  label="Date of Birth"
                  value={client.dateOfBirth}
                />
                <ProfileField label="Gender" value={client.gender} />
                <ProfileField
                  label="Blood Group"
                  value={client.bloodGroup}
                  danger
                />
                <ProfileField label="Language" value={client.language} />
                <ProfileField
                  label="NID number"
                  value={client.raw?.profile?.nidNumber || "Not provided"}
                />
                <ProfileField label="Verification" value="Approved" />
              </dl>
              <section className="mt-7 rounded-lg border border-[#c5cad8] bg-[#f1f3fa] p-4">
                <small className="font-semibold uppercase text-[#515867]">
                  Emergency Contact
                </small>
                <p className="mt-4 text-sm text-[#515867]">
                  Emergency contact has not been collected during onboarding.
                </p>
              </section>
              <section className="mt-7">
                <small className="font-semibold uppercase text-[#515867]">
                  Primary Address
                </small>
                <p className="mt-3 leading-6">{client.address}</p>
                <div className="mt-3 h-56 overflow-hidden rounded-xl">
                  <BarikoiMap
                    className="h-full w-full"
                    center={
                      client.raw?.contact?.latitude
                        && client.raw?.contact?.longitude
                        ? {
                            latitude: Number(client.raw.contact.latitude),
                            longitude: Number(client.raw.contact.longitude),
                          }
                        : null
                    }
                    markers={
                      client.raw?.contact?.latitude
                        && client.raw?.contact?.longitude
                        ? [{
                            latitude: Number(client.raw.contact.latitude),
                            longitude: Number(client.raw.contact.longitude),
                            label: client.name,
                          }]
                        : []
                    }
                    zoom={client.raw?.contact?.latitude ? 15 : 11}
                  />
                </div>
              </section>
            </>
          )}
          {activeTab === "Medical" && <MedicalPanel client={client} />}
          {activeTab === "Care Plan" && <CarePlanPanel client={client} />}
          {activeTab === "Payments" && <PaymentsPanel client={client} />}
          {activeTab === "Docs" && <DocumentsPanel client={client} />}
        </div>
        {(notice || actionError) && (
          <div className={`border-t px-5 py-3 text-sm ${actionError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {actionError || notice}
          </div>
        )}
        <footer className="grid grid-cols-2 gap-3 border-t border-[#c5cad8] bg-[#f7f8fd] p-5">
          <button
            className="rounded-lg border border-[#8c93a2] py-3 font-semibold"
            type="button"
            disabled={Boolean(busy)}
            onClick={renewCare}
          >
            {busy === "renew" ? "Renewing..." : "Renew Previous Care"}
          </button>
          <button
            className="rounded-lg bg-[#0755d3] py-3 font-semibold text-white"
            type="button"
            disabled={Boolean(busy)}
            onClick={editDetails}
          >
            {busy === "edit" ? "Saving..." : "Edit Details"}
          </button>
          <button
            className="col-span-2 rounded-lg border border-red-300 bg-red-50 py-3 font-semibold text-red-700"
            type="button"
            disabled={Boolean(busy)}
            onClick={deleteClient}
          >
            {busy === "delete" ? "Deleting client data..." : "Delete Client Permanently"}
          </button>
        </footer>
      </aside>
    </>
  );
};

const MedicalPanel = ({ client }) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getSystemDocuments()
      .then((records) => {
        if (!active) return;
        setDocuments(
          records.filter(
            (document) =>
              document.ownerId === client.id &&
              document.folder === "Medical Documents",
          ),
        );
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [client.id]);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#c5cad8] bg-[#f8faff] p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-[#0649ad]">
            <HeartPulse className="size-5" />
          </span>
          <div>
            <small className="uppercase text-[#606878]">
              Client Medical Records
            </small>
            <b className="block">
              {documents?.length || 0} uploaded document
              {documents?.length === 1 ? "" : "s"}
            </b>
          </div>
        </div>
      </section>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {documents === null && !error && (
        <p className="text-sm text-[#606878]">Loading medical documents…</p>
      )}
      {documents?.map((document) => (
        <article
          className="flex items-center gap-3 rounded-xl border border-[#c5cad8] p-4"
          key={document.id}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-[#0649ad]">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <b className="block break-all text-sm">{document.name}</b>
            <small className="text-[#606878]">
              {document.type} ·{" "}
              {document.uploadedAt
                ? new Date(document.uploadedAt).toLocaleString()
                : "Upload date unavailable"}
            </small>
          </div>
          <button
            className="text-sm font-semibold text-[#0649ad]"
            type="button"
            onClick={() =>
              downloadSystemDocument(document.id).catch((requestError) =>
                setError(requestError.message),
              )
            }
          >
            View
          </button>
        </article>
      ))}
      {documents?.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#b9c1d2] bg-[#f8faff] p-8 text-center">
          <FileText className="mx-auto size-9 text-[#7b8495]" />
          <h3 className="mt-4 font-semibold">No medical documents</h3>
          <p className="mt-2 text-sm text-[#606878]">
            This client has not uploaded a prescription, medication schedule,
            lab result, or medical report.
          </p>
        </div>
      )}
    </div>
  );
};

const CarePlanPanel = ({ client }) =>
  client.assignments.length === 0 ? (
    <div className="rounded-xl border border-dashed border-[#b9c1d2] bg-[#f8faff] p-8 text-center">
      <CalendarDays className="mx-auto size-9 text-[#0755d3]" />
      <h3 className="mt-4 font-semibold">No caregiver assigned</h3>
      <p className="mt-2 text-sm text-[#606878]">
        This client does not have an active care plan or caregiver assignment.
      </p>
    </div>
  ) : (
  <div className="space-y-5">
    <section className="rounded-xl bg-[#0755d3] p-5 text-white">
      <small className="uppercase text-blue-100">Active Care Plan</small>
      <h3 className="mt-2 text-xl font-semibold">{client.carePlan}</h3>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <CheckCircle2 className="size-4" />
        {client.assignments[0].status.replaceAll("_", " ")}
        {client.assignments[0].assignedAt
          ? ` since ${new Date(client.assignments[0].assignedAt).toLocaleDateString()}`
          : ""}
      </div>
    </section>
    <section className="rounded-xl border border-[#c5cad8] p-4">
      <h3 className="font-semibold">Assigned Caregiver</h3>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-[#0649ad]">
          {client.assignments[0].caregiver?.fullName?.slice(0, 1) || "C"}
        </span>
        <div>
          <b className="block">
            {client.assignments[0].caregiver?.fullName || "Caregiver"}
          </b>
          <small className="text-[#606878]">
            {client.assignments[0].caregiver?.phone || "Phone not provided"}
          </small>
        </div>
      </div>
    </section>
    <section className="rounded-xl border border-[#c5cad8] p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <CalendarDays className="size-5 text-[#0755d3]" /> Weekly Schedule
      </h3>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(client.assignments[0].preferredDays || []).map((day) => (
          <span
            className="rounded-lg bg-[#e5efff] px-3 py-2 text-center text-sm font-semibold text-[#0649ad]"
            key={day}
          >
            {day}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#515867]">
        {client.assignments[0].preferredStartTime ||
          client.assignments[0].preferredTime ||
          "Time not selected"}
        {" • "}
        {client.assignments[0].hoursPerWeek || 0} hours per week
      </p>
      <p className="mt-2 text-xs text-[#606878]">
        Service starts{" "}
        {client.assignments[0].serviceStartDate || "after confirmation"}
      </p>
    </section>
    <section>
      <h3 className="font-semibold">Included Services</h3>
      <ul className="mt-3 space-y-2 text-sm text-[#515867]">
        {(client.assignments[0].tasks || []).map((service) => (
          <li className="flex items-center gap-2" key={service}>
            <CheckCircle2 className="size-4 text-emerald-600" /> {service}
          </li>
        ))}
      </ul>
      {(client.assignments[0].tasks || []).length === 0 && (
        <p className="mt-3 text-sm text-[#606878]">
          No specific tasks were included in this assignment.
        </p>
      )}
    </section>
  </div>
);

const PaymentsPanel = ({ client }) => {
  const [finance, setFinance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminFinanceOverview()
      .then((record) => {
        if (active) setFinance(record);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, [client.id]);

  const invoices = (finance?.invoices || []).filter(
    (invoice) => invoice.clientId === client.id,
  );
  const transactions = (finance?.transactions || [])
    .filter((transaction) => transaction.clientId === client.id)
    .sort((left, right) =>
      String(right.createdAt || right.completedAt || "").localeCompare(
        String(left.createdAt || left.completedAt || ""),
      ),
    );
  const agreements = (finance?.agreements || []).filter(
    (agreement) => agreement.clientId === client.id,
  );
  const outstanding = invoices
    .filter((invoice) =>
      ["pending", "failed", "locked"].includes(invoice.status),
    )
    .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
  const paidToDate = transactions
    .filter((transaction) => transaction.status === "successful")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const activeAgreement = agreements.find(
    (agreement) => agreement.settlementStatus !== "completed",
  );
  const monthlyPlan = Number(activeAgreement?.pricing?.total || 0);

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <section className="rounded-xl bg-[#0755d3] p-5 text-white">
        <div className="flex items-start">
          <div>
            <small className="uppercase text-blue-100">
              Outstanding Balance
            </small>
            <b className="mt-2 block text-3xl">
              ${outstanding.toLocaleString("en-US")}
            </b>
          </div>
          <WalletCards className="ml-auto size-8 text-blue-200" />
        </div>
        <p className="mt-5 text-sm text-blue-100">
          {outstanding > 0 ? "Payment is currently due" : "Nothing due"}
        </p>
      </section>
      <div className="grid grid-cols-2 gap-3">
        <PaymentMetric
          label="Paid to date"
          value={`$${paidToDate.toLocaleString("en-US")}`}
        />
        <PaymentMetric
          label="Current plan"
          value={`$${monthlyPlan.toLocaleString("en-US")}`}
        />
      </div>
      <section>
        <h3 className="font-semibold">Recent Transactions</h3>
        {!finance && !error && (
          <p className="mt-3 text-sm text-[#606878]">Loading payments…</p>
        )}
        {finance && transactions.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-[#b9c1d2] bg-[#f8faff] p-7 text-center text-sm text-[#606878]">
            No invoices or payments have been recorded for this client.
          </div>
        )}
        {transactions.slice(0, 5).map((transaction) => (
          <article
            className="mt-3 flex items-center gap-3 border-b border-[#e1e4ec] py-3 last:border-0"
            key={transaction.transactionId}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755d3]">
              <CreditCard className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <b className="block text-sm">
                {transaction.description || "Client payment"}
              </b>
              <small className="text-[#606878]">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString()
                  : "Date unavailable"}
              </small>
            </div>
            <div className="text-right">
              <b className="block text-sm">
                ${Number(transaction.amount || 0).toLocaleString("en-US")}
              </b>
              <small
                className={
                  transaction.status === "successful"
                    ? "text-emerald-700"
                    : "text-red-700"
                }
              >
                {transaction.status}
              </small>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

const DocumentsPanel = ({ client }) => {
  const documents = client.raw?.documents || {};
  const files = [
    {
      label: "National ID — Front",
      kind: "nidFront",
      metadata: documents.nidFront,
    },
    {
      label: "National ID — Back",
      kind: "nidBack",
      metadata: documents.nidBack,
    },
    ...(documents.medicalReports || []).map((metadata, index) => ({
      label: `Medical report ${index + 1}`,
      kind: "medicalReport",
      metadata,
      fileId: metadata.id,
    })),
  ];

  return (
    <div>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="size-6 shrink-0 text-emerald-700" />
          <div>
            <b className="block">Client verification approved</b>
            <small className="text-emerald-800">
              {client.raw?.reviewedAt
                ? `Reviewed ${new Date(client.raw.reviewedAt).toLocaleString()}`
                : "Approved by the Verification Center"}
            </small>
          </div>
        </div>
      </section>
      <h3 className="mt-7 font-semibold">Onboarding documents</h3>
      <p className="mt-1 text-xs text-[#606878]">
        Original identity and medical files uploaded by this client.
      </p>
      <div className="mt-3 space-y-3">
        {files.map((file) => (
          <ClientDocument
            key={`${file.kind}-${file.fileId || ""}`}
            clientId={client.id}
            {...file}
          />
        ))}
      </div>
    </div>
  );
};

const ClientDocument = ({
  clientId,
  label,
  kind,
  metadata,
  fileId = "",
}) => {
  const [error, setError] = useState("");
  const available = Boolean(metadata?.storagePath);

  return (
    <article className="flex items-center gap-3 rounded-xl border border-[#c5cad8] p-4">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          available
            ? "bg-blue-100 text-[#0755d3]"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block truncate text-sm">{label}</b>
        <small className="block truncate text-[#606878]">
          {available ? metadata.name || "Uploaded file" : "Not uploaded"}
        </small>
        {error && <small className="block text-red-600">{error}</small>}
      </div>
      {available && (
        <button
          className="rounded-lg border border-[#0755d3] px-3 py-2 text-xs font-semibold text-[#0649ad]"
          type="button"
          onClick={async () => {
            setError("");
            try {
              await openVerificationDocument(
                "client",
                clientId,
                kind,
                fileId,
              );
            } catch (requestError) {
              setError(requestError.message);
            }
          }}
        >
          View
        </button>
      )}
    </article>
  );
};

const PaymentMetric = ({ label, value }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-[#f8faff] p-4">
    <small className="uppercase text-[#606878]">{label}</small>
    <b className="mt-2 block text-lg">{value}</b>
  </article>
);
const ClientAvatar = ({ className = "" }) => (
  <span
    className={`${className} grid shrink-0 place-items-center bg-[#f1f3f7] text-[10px] font-medium text-[#687184]`}
    role="img"
    aria-label="Client image"
  >
    Image
  </span>
);
// const Transaction = ({ title, date, amount, status }) => (
//   <article className="mt-3 flex items-center gap-3 border-b border-[#e1e4ec] py-3 last:border-0">
//     <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755d3]">
//       <CreditCard className="size-4" />
//     </span>
//     <div className="min-w-0 flex-1">
//       <b className="block text-sm">{title}</b>
//       <small className="text-[#606878]">{date}</small>
//     </div>
//     <div className="text-right">
//       <b className="block text-sm">{amount}</b>
//       <small
//         className={status === "Pending" ? "text-amber-700" : "text-emerald-700"}
//       >
//         {status}
//       </small>
//     </div>
//   </article>
// );
const Status = ({ value }) => (
  <span
    className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${value === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
  >
    {value}
  </span>
);
const ProfileField = ({ label, value, danger = false }) => (
  <div>
    <dt className="text-[10px] font-semibold uppercase text-[#515867]">
      {label}
    </dt>
    <dd className={`mt-2 ${danger ? "font-semibold text-red-600" : ""}`}>
      {value}
    </dd>
  </div>
);

export default AdminClients;
