import { Link } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import JoinOptionCard from "../components/auth/JoinOptionCard";
import familyImage from "../assets/join-family.jpg";
import professionalImage from "../assets/join-professional.jpg";

const JoinNow = () => (
  <AuthShell>
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">How would you like to use CareConnect?</h1>
        <p className="mx-auto mt-2 max-w-xl text-base leading-6 text-[#434654]">
          Choose the path that best describes your needs so we can provide you with the most relevant care experience.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <JoinOptionCard image={familyImage} imageAlt="Family receiving professional care" title="Find a Caregiver" description="I am looking for professional care services for myself or a family member." buttonLabel="Get Started" accountType="family" primary />
        <JoinOptionCard image={professionalImage} imageAlt="Professional caregiver" title="Become a Caregiver" description="I am a qualified care professional looking for meaningful work and opportunities." buttonLabel="Join as Professional" accountType="professional" />
      </div>

      <p className="mt-12 border-t border-[#c3c6d6] pt-6 text-center text-base text-[#434654]">
        Already have an account? <Link className="text-sm font-semibold text-[#003d9b]" to="/login">Log in</Link>
      </p>
    </div>
  </AuthShell>
);

export default JoinNow;
