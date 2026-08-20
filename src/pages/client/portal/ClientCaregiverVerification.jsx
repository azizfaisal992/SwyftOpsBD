import {
  BadgeCheck,
  CalendarClock,
  Check,
  FileBadge,
  IdCard,
  Info,
  LoaderCircle,
  SearchCheck,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AssignedCaregiverPhoto from "../../../components/client/portal/AssignedCaregiverPhoto";
import PortalCard from "../../../components/client/portal/PortalCard";
import {
  getAssignedCaregiverVerification,
  listMyAssignments,
} from "../../../services/assignmentService";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const titleCase = (value = "") =>
  value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const assignmentIsConnected = (assignment) =>
  ["pending_confirmation", "confirmed", "active"].includes(assignment.status);

const ClientCaregiverVerification = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refresh = () =>
      listMyAssignments()
        .then((records) => {
          if (!active) return;
          const connected = records.filter(assignmentIsConnected);
          setAssignments(connected);
          setAssignmentId((current) =>
            connected.some((item) => item.assignmentId === current)
              ? current
              : connected[0]?.assignmentId || "",
          );
          if (!connected.length) {
            setRecord(null);
            setLoading(false);
          }
        })
        .catch((requestError) => {
          if (active) {
            setError(requestError.message);
            setLoading(false);
          }
        });
    void refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    if (!assignmentId) return undefined;
    let active = true;
    getAssignedCaregiverVerification(assignmentId)
      .then((verification) => {
        if (active) {
          setRecord(verification);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [assignmentId]);

  const selectedAssignment = useMemo(
    () =>
      assignments.find(
        (assignment) => assignment.assignmentId === assignmentId,
      ),
    [assignmentId, assignments],
  );

  if (loading) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <LoaderCircle className="size-9 animate-spin text-[#0649ad]" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-[760px] p-5 sm:p-8">
        <PortalCard className="p-8 text-center sm:p-12">
          <UserRoundX className="mx-auto size-14 text-[#748097]" />
          <h1 className="mt-5 text-2xl font-semibold">
            No assigned caregiver verification
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#596174]">
            Verification details will appear here after an approved caregiver
            is assigned and confirms your care request.
          </p>
          {error && (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </PortalCard>
      </div>
    );
  }

  const { profile, verification } = record;
  const approved = verification.status === "approved";
  const identityReviewed =
    verification.identityDocuments.nidFrontReviewed &&
    verification.identityDocuments.nidBackReviewed;

  return (
    <div className="mx-auto max-w-[1050px] p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold">
            <ShieldCheck className="size-7 text-[#0649ad]" />
            Caregiver Verification
          </h1>
          <p className="mt-1 text-sm text-[#596174]">
            Approved information for the caregiver assigned to your care plan.
          </p>
        </div>
        {assignments.length > 1 && (
          <label className="text-xs font-semibold text-[#596174]">
            Care plan
            <select
              className="mt-1 block w-full rounded-lg border border-[#c5cad8] bg-white px-3 py-2 text-sm text-[#101c2d]"
              value={assignmentId}
              onChange={(event) => {
                setLoading(true);
                setAssignmentId(event.target.value);
              }}
            >
              {assignments.map((assignment) => (
                <option
                  value={assignment.assignmentId}
                  key={assignment.assignmentId}
                >
                  {assignment.caregiver?.fullName || "Caregiver"} —{" "}
                  {assignment.careType}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[310px_1fr]">
        <div className="space-y-6">
          <PortalCard className="p-6 text-center">
            <div className="relative mx-auto w-fit">
              <AssignedCaregiverPhoto
                assignmentId={record.assignmentId}
                key={record.assignmentId}
                className={`size-32 rounded-xl border-4 object-cover ${
                  approved ? "border-emerald-400" : "border-amber-300"
                }`}
                name={profile.fullName}
              />
              {approved && (
                <span className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white">
                  <Check className="size-4" />
                </span>
              )}
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{profile.fullName}</h2>
            <p className="font-semibold text-[#4c5261]">
              {selectedAssignment?.careType || "Professional Caregiver"}
            </p>
            <dl className="mt-7 space-y-4 text-sm">
              <Detail
                term="Caregiver ID"
                value={`#${record.caregiverId.slice(0, 10).toUpperCase()}`}
              />
              <Detail
                term="Verified Since"
                value={formatDate(verification.reviewedAt)}
              />
              <Detail
                term="Verification"
                value={titleCase(verification.status)}
                positive={approved}
              />
              <Detail
                term="Assignment"
                value={titleCase(record.assignmentStatus)}
              />
            </dl>
          </PortalCard>

          <PortalCard className="p-6">
            <h2 className="font-semibold">Submitted Credentials</h2>
            <div className="mt-4 space-y-3">
              {verification.licenses.map((license) => (
                <CredentialRow
                  key={license.kind}
                  label={license.label}
                  detail={
                    license.verified
                      ? `Reviewed · ${formatDate(license.uploadedAt)}`
                      : "Awaiting review"
                  }
                  verified={license.verified}
                />
              ))}
              <CredentialRow
                label="Professional resume"
                detail={
                  verification.resumeReviewed
                    ? "Submitted and reviewed"
                    : "Not verified"
                }
                verified={verification.resumeReviewed}
              />
              {!verification.licenses.length && (
                <p className="rounded-lg bg-[#f7f8fb] p-3 text-sm text-[#596174]">
                  No optional professional license was submitted.
                </p>
              )}
            </div>
            <p className="mt-4 text-xs leading-5 text-[#747b8a]">
              Private identity files are reviewed by authorized SwiftOpsBD
              administrators and are not downloadable by clients.
            </p>
          </PortalCard>
        </div>

        <div className="space-y-6">
          <PortalCard className="p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-[#9df2c8]">
                <SearchCheck className="size-7 text-emerald-800" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold">
                    SwiftOpsBD Administrative Review
                  </h2>
                  <StatusBadge approved={approved} status={verification.status} />
                </div>
                <p className="font-semibold text-[#4c5261]">
                  Verification based on the caregiver onboarding information
                  and documents submitted to SwiftOpsBD.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <VerificationBox
                title="Profile Review"
                status={
                  verification.profileCompleted ? "Complete" : "Incomplete"
                }
                detail={`${verification.progress}% onboarding verification progress`}
              />
              <VerificationBox
                title="Identity Documents"
                status={identityReviewed ? "Reviewed" : "Not verified"}
                detail={
                  identityReviewed
                    ? "NID front and back were reviewed during approval."
                    : "Identity document review has not been completed."
                }
              />
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#747b8a]">
              <Info className="size-4" />
              Last administrative review: {formatDate(verification.reviewedAt)}
            </p>
          </PortalCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <PortalCard className="p-6">
              <div className="flex justify-between">
                <IdCard className="size-6 text-[#0649ad]" />
                <StatusBadge
                  approved={identityReviewed}
                  status={identityReviewed ? "reviewed" : "pending"}
                  compact
                />
              </div>
              <h2 className="mt-5 text-lg font-semibold">
                Identity Verification
              </h2>
              <p className="mt-3 font-semibold leading-6 text-[#4c5261]">
                National ID documents were submitted through protected
                onboarding storage.
              </p>
              <p
                className={`mt-4 text-xs font-semibold ${
                  identityReviewed ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {identityReviewed
                  ? "NID documents reviewed by SwiftOpsBD"
                  : "Identity review pending"}
              </p>
            </PortalCard>

            <PortalCard className="p-6">
              <div className="flex justify-between">
                <FileBadge className="size-6 text-[#0649ad]" />
                <StatusBadge
                  approved={verification.credentialsCompleted}
                  status={
                    verification.credentialsCompleted ? "complete" : "pending"
                  }
                  compact
                />
              </div>
              <h2 className="mt-5 text-lg font-semibold">
                Credentials & Assessment
              </h2>
              <p className="mt-3 font-semibold leading-6 text-[#4c5261]">
                Required credentials and caregiver safety assessment status.
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#596174]">
                <CalendarClock className="size-4" />
                Assessment:{" "}
                {verification.assessmentSubmitted ? "Submitted" : "Pending"}
              </p>
            </PortalCard>
          </div>

          <PortalCard className="p-6">
            <h2 className="text-2xl font-semibold">Verification History</h2>
            <ol className="mt-6 space-y-6 border-l-2 border-[#dce8ff] pl-8">
              {[...verification.history].reverse().map((item, index) => (
                <li className="relative" key={`${item.event}-${item.occurredAt}`}>
                  <span
                    className={`absolute -left-[41px] top-1 size-4 rounded-full border-4 border-white ${
                      index === 0 ? "bg-emerald-500" : "bg-[#6c7891]"
                    }`}
                  />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 font-semibold text-[#4c5261]">
                    {formatDate(item.occurredAt)}
                  </p>
                </li>
              ))}
            </ol>
          </PortalCard>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ positive = false, term, value }) => (
  <div className="flex justify-between gap-3 border-b border-[#d8dce7] pb-3">
    <dt className="font-semibold text-[#747b8a]">{term}</dt>
    <dd
      className={`text-right font-bold ${
        positive ? "text-emerald-700" : ""
      }`}
    >
      {value}
    </dd>
  </div>
);

const StatusBadge = ({ approved, compact = false, status }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full font-bold uppercase ${
      compact ? "px-3 py-1 text-[9px]" : "px-4 py-2 text-sm"
    } ${
      approved
        ? "bg-[#9df2c8] text-emerald-800"
        : "bg-amber-100 text-amber-800"
    }`}
  >
    {approved && <BadgeCheck className="size-4" />}
    {titleCase(status)}
  </span>
);

const VerificationBox = ({ detail, status, title }) => (
  <div className="rounded border border-[#c5cad8] bg-[#f7f8fb] p-4">
    <h3 className="font-semibold uppercase tracking-[0.05em] text-[#747b8a]">
      {title}
    </h3>
    <p className="mt-2 font-semibold">Status: {status}</p>
    <p className="mt-3 font-semibold text-[#4c5261]">{detail}</p>
  </div>
);

const CredentialRow = ({ detail, label, verified }) => (
  <div className="flex items-center gap-3 rounded border border-[#c5cad8] p-3 text-sm">
    <ShieldCheck
      className={`size-5 shrink-0 ${
        verified ? "text-emerald-700" : "text-[#747b8a]"
      }`}
    />
    <span className="min-w-0 flex-1">
      <b className="block">{label}</b>
      <small className="text-[#747b8a]">{detail}</small>
    </span>
    {verified && <Check className="size-4 text-emerald-700" />}
  </div>
);

export default ClientCaregiverVerification;
