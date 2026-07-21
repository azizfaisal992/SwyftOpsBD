import { CheckCircle2, Clock3, FileCheck2, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import OnboardingCard from "../../components/caregiver/OnboardingCard";
import OnboardingLayout from "../../components/caregiver/OnboardingLayout";
import useAuth from "../../hooks/useAuth";
import useCaregiverOnboarding from "../../hooks/useCaregiverOnboarding";

const statusContent = {
  under_review: {
    title: "Your onboarding is under review",
    description: "Our compliance team is checking your profile, credentials and assessment. Reviews normally take 24–48 business hours.",
    color: "text-amber-700",
    background: "bg-amber-50",
    icon: Clock3,
  },
  changes_required: {
    title: "Updates are required",
    description: "The compliance team needs additional information. Review the requested sections and resubmit your onboarding.",
    color: "text-red-700",
    background: "bg-red-50",
    icon: FileCheck2,
  },
  approved: {
    title: "You are approved",
    description: "Your caregiver profile is verified and ready to be matched with families and job opportunities.",
    color: "text-emerald-700",
    background: "bg-emerald-50",
    icon: CheckCircle2,
  },
};

const CaregiverReview = () => {
  const { user } = useAuth();
  const { record, progress, refresh } = useCaregiverOnboarding();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  if (!record.assessmentSubmitted) return <Navigate replace to="/caregiver/assessment" />;

  const content = statusContent[record.verificationStatus] || statusContent.under_review;
  const StatusIcon = content.icon;

  const refreshStatus = async () => {
    setRefreshing(true);
    setRefreshError("");
    try {
      await refresh();
    } catch (error) {
      setRefreshError(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <OnboardingLayout activeStep="review">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Onboarding Status</h1>
        <p className="mt-2 text-sm text-[#434654]">Track the verification of your caregiver account.</p>
      </header>

      <OnboardingCard className={content.background}>
        <div className="py-5 text-center">
          <StatusIcon className={`mx-auto size-16 ${content.color}`} />
          <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">{content.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#434654]">{content.description}</p>
          <span className={`mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold ${content.color}`}>{progress}% complete</span>
          <div><button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#003d9b] disabled:opacity-60" type="button" disabled={refreshing} onClick={refreshStatus}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />{refreshing ? "Checking…" : "Refresh status"}</button></div>
          {refreshError && <p className="mt-3 text-sm text-red-700" role="alert">{refreshError}</p>}
        </div>
      </OnboardingCard>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          ["Profile completed", record.profileCompleted, CheckCircle2],
          ["Credentials uploaded", record.credentialsCompleted, FileCheck2],
          ["Assessment submitted", record.assessmentSubmitted, ShieldCheck],
        ].map(([label, completed, Icon]) => (
          <article className="rounded-xl border border-[#c3c6d6] bg-white p-5" key={label}>
            <Icon className={`size-7 ${completed ? "text-emerald-600" : "text-slate-400"}`} />
            <p className="mt-3 font-semibold">{label}</p>
            <p className="mt-1 text-xs text-[#737685]">{completed ? "Completed" : "Pending"}</p>
          </article>
        ))}
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-xl border border-[#c3c6d6] bg-white p-6 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f0f3ff]"><Mail className="size-6 text-[#003d9b]" /></span>
        <div className="flex-1">
          <h2 className="font-semibold">We will notify you by email</h2>
          <p className="mt-1 break-words text-sm text-[#434654]">Updates will be sent to {user.email}. You can also return to this page anytime.</p>
        </div>
        <Link className="secondary-action text-center" to="/">Return home</Link>
      </section>
    </OnboardingLayout>
  );
};

export default CaregiverReview;
