import { BadgeCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import OnboardingCard from "../../components/caregiver/OnboardingCard";
import OnboardingLayout from "../../components/caregiver/OnboardingLayout";
import useCaregiverOnboarding from "../../hooks/useCaregiverOnboarding";

const hygieneOptions = [
  "Thorough hand washing (20+ sec)",
  "Sanitizing equipment used",
  "Wearing fresh disposable gloves",
  "Updating the digital care log",
];

const CaregiverAssessment = () => {
  const navigate = useNavigate();
  const { record, saveAssessment, submitOnboarding } = useCaregiverOnboarding();
  const [answers, setAnswers] = useState(record.assessment);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const wordCount = useMemo(
    () => answers.ethics.trim().split(/\s+/).filter(Boolean).length,
    [answers.ethics],
  );

  if (!record.profileCompleted)
    return <Navigate replace to="/caregiver/profile-setup" />;
  if (!record.credentialsCompleted)
    return <Navigate replace to="/caregiver/credentials" />;
  if (record.assessmentSubmitted)
    return <Navigate replace to="/caregiver/review" />;

  const toggleHygiene = (option) => {
    setAnswers((current) => ({
      ...current,
      hygiene: current.hygiene.includes(option)
        ? current.hygiene.filter((item) => item !== option)
        : [...current.hygiene, option],
    }));
  };

  const saveDraft = async () => {
    setSaving(true);
    setError("");
    await saveAssessment(answers);
    setNotice("Assessment draft saved.");
    setSaving(false);
  };

  const submitAssessment = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (wordCount < 50) {
      setError(
        `Your ethical conduct response needs at least 50 words. You currently have ${wordCount}.`,
      );
      return;
    }
    if (answers.hygiene.length !== hygieneOptions.length) {
      setError("Select every mandatory hygiene practice before submitting.");
      return;
    }

    setSaving(true);
    try {
      await saveAssessment(answers);
      await submitOnboarding();
      navigate("/caregiver/review");
    } catch (submitError) {
      setError(submitError.message);
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout activeStep="assessment">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Competency & Skills Assessment
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-6 text-[#434654]">
          This assessment evaluates your knowledge of caregiving standards and
          safety protocols. Please answer honestly and thoroughly.
        </p>
      </header>

      <form className="space-y-4" onSubmit={submitAssessment}>
        <OnboardingCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Step 3 of 3</h2>
              <p className="text-sm text-[#434654]">
                Final Onboarding Assessment
              </p>
            </div>
            <span className="rounded-full bg-[#d0f5a3] px-3 py-1 text-xs font-bold text-[#005235]">
              REQUIRED
            </span>
          </div>
        </OnboardingCard>

        <OnboardingCard>
          <p className="mb-4 text-sm font-semibold">
            <span className="question-number">1</span> Emergency Protocols
          </p>
          <p className="mb-4">
            In the event of a client experiencing sudden shortness of breath and
            chest pain, what is the immediate first step?
          </p>
          <div className="space-y-3">
            {[
              "Contact the family immediately and wait for instructions.",
              "Call emergency services immediately and stay with the client.",
              "Administer over-the-counter pain medication.",
            ].map((option) => (
              <label className="assessment-option" key={option}>
                <input
                  type="radio"
                  name="emergency"
                  value={option}
                  checked={answers.emergency === option}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      emergency: event.target.value,
                    }))
                  }
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </OnboardingCard>

        <OnboardingCard>
          <p className="mb-4 text-sm font-semibold">
            <span className="question-number">2</span> Ethical Conduct Scenarios
          </p>
          <p className="mb-4">
            A client offers you a significant monetary gift as a “thank you” for
            your care. How do you handle this according to SwiftOpsBD&apos;s
            professional ethics?
          </p>
          <textarea
            className="onboarding-input min-h-32 resize-y"
            value={answers.ethics}
            onChange={(event) =>
              setAnswers((current) => ({
                ...current,
                ethics: event.target.value,
              }))
            }
            placeholder="Describe your response and the rationale behind it..."
            required
          />
          <p
            className={`mt-2 text-xs ${wordCount >= 50 ? "text-emerald-700" : "text-[#434654]"}`}
          >
            {wordCount}/50 words minimum
          </p>
        </OnboardingCard>

        <OnboardingCard>
          <p className="mb-4 text-sm font-semibold">
            <span className="question-number">3</span> Hygiene and Care
            Standards
          </p>
          <p className="mb-4">
            Select all hygiene practices that are mandatory before and after
            every client interaction:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {hygieneOptions.map((option) => (
              <label className="assessment-option" key={option}>
                <input
                  type="checkbox"
                  checked={answers.hygiene.includes(option)}
                  onChange={() => toggleHygiene(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </OnboardingCard>

        {error && (
          <p
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            role="status"
          >
            {notice}
          </p>
        )}

        <section className="rounded-lg border border-[#003d9b]/20 bg-[#0052cc]/5 p-6 sm:p-8">
          <div className="flex flex-col gap-4 min-[420px]:flex-row">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#dee9ff]">
              <BadgeCheck className="size-6 text-[#003d9b]" />
            </span>
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Ready to Submit?</h2>
              <p className="mt-2 text-sm leading-6 text-[#434654]">
                After submission, your information will be locked while our
                compliance team reviews it. You will see the latest status on
                the review page.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
            <button
              className="secondary-action"
              type="button"
              onClick={() => navigate("/caregiver/credentials")}
            >
              Review Previous Sections
            </button>
            <button
              className="secondary-action"
              type="button"
              disabled={saving}
              onClick={saveDraft}
            >
              {saving ? "Saving…" : "Save Progress"}
            </button>
            <button
              className="onboarding-action disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </section>
      </form>
    </OnboardingLayout>
  );
};

export default CaregiverAssessment;
