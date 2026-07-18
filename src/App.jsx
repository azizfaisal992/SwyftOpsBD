import { Route, Routes } from "react-router-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Authentication from "./pages/Authentication";
import CaregiverOnboardingRoute from "./components/caregiver/CaregiverOnboardingRoute";
import CaregiverAssessment from "./pages/caregiver/CaregiverAssessment";
import CaregiverCredentials from "./pages/caregiver/CaregiverCredentials";
import CaregiverProfileSetup from "./pages/caregiver/CaregiverProfileSetup";
import CaregiverReview from "./pages/caregiver/CaregiverReview";
import Home from "./pages/Home";
import FindCare from "./pages/FindCare";
import FindJobs from "./pages/FindJobs";
import JoinNow from "./pages/JoinNow";

const HomeLayout = () => (
  <div className="min-h-screen bg-white text-slate-900">
    <Header />
    <main><Home /></main>
    <Footer />
  </div>
);

const FindCareLayout = () => (
  <div className="min-h-screen bg-[#f9f9ff] text-slate-900">
    <Header />
    <FindCare />
  </div>
);

const FindJobsLayout = () => (
  <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
    <Header />
    <FindJobs />
    <Footer />
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<HomeLayout />} />
    <Route path="/find-care" element={<FindCareLayout />} />
    <Route path="/find-jobs" element={<FindJobsLayout />} />
    <Route path="/join" element={<JoinNow />} />
    <Route path="/login" element={<Authentication mode="login" />} />
    <Route path="/register" element={<Authentication mode="register" />} />
    <Route element={<CaregiverOnboardingRoute />}>
      <Route path="/caregiver/profile-setup" element={<CaregiverProfileSetup />} />
      <Route path="/caregiver/credentials" element={<CaregiverCredentials />} />
      <Route path="/caregiver/assessment" element={<CaregiverAssessment />} />
      <Route path="/caregiver/review" element={<CaregiverReview />} />
    </Route>
  </Routes>
);

export default App;
