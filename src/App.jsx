import { Route, Routes } from "react-router-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Authentication from "./pages/Authentication";
import CaregiverOnboardingRoute from "./components/caregiver/CaregiverOnboardingRoute";
import ClientOnboardingRoute from "./components/client/ClientOnboardingRoute";
import CaregiverAssessment from "./pages/caregiver/CaregiverAssessment";
import CaregiverCredentials from "./pages/caregiver/CaregiverCredentials";
import CaregiverProfileSetup from "./pages/caregiver/CaregiverProfileSetup";
import CaregiverReview from "./pages/caregiver/CaregiverReview";
import Home from "./pages/Home";
import FindCare from "./pages/FindCare";
import FindJobs from "./pages/FindJobs";
import JoinNow from "./pages/JoinNow";
import ClientContactSetup from "./pages/client/ClientContactSetup";
import ClientProfileSetup from "./pages/client/ClientProfileSetup";
import ClientVerification from "./pages/client/ClientVerification";
import CareCheckout from "./pages/client/CareCheckout";
import CarePlanBuilder from "./pages/client/CarePlanBuilder";
import ClientPortalLayout from "./components/client/portal/ClientPortalLayout";
import ClientPortalRoute from "./components/client/portal/ClientPortalRoute";
import ClientAttendance from "./pages/client/portal/ClientAttendance";
import ClientCaregiverVerification from "./pages/client/portal/ClientCaregiverVerification";
import ClientDashboard from "./pages/client/portal/ClientDashboard";
import ClientMedicationUpload from "./pages/client/portal/ClientMedicationUpload";
import ClientMessages from "./pages/client/portal/ClientMessages";
import ClientPayments from "./pages/client/portal/ClientPayments";
import CaregiverPortalLayout from "./components/caregiver/portal/CaregiverPortalLayout";
import CaregiverPortalRoute from "./components/caregiver/portal/CaregiverPortalRoute";
import CaregiverActiveVisit from "./pages/caregiver/portal/CaregiverActiveVisit";
import CaregiverAssignedClients from "./pages/caregiver/portal/CaregiverAssignedClients";
import CaregiverClientDetail from "./pages/caregiver/portal/CaregiverClientDetail";
import CaregiverDashboard from "./pages/caregiver/portal/CaregiverDashboard";
import CaregiverNotifications from "./pages/caregiver/portal/CaregiverNotifications";
import CaregiverPayments from "./pages/caregiver/portal/CaregiverPayments";
import CaregiverReports from "./pages/caregiver/portal/CaregiverReports";
import CaregiverRequestDetail from "./pages/caregiver/portal/CaregiverRequestDetail";
import CaregiverRequestedClients from "./pages/caregiver/portal/CaregiverRequestedClients";

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
    <Route path="/care-plan" element={<CarePlanBuilder />} />
    <Route path="/care-checkout" element={<CareCheckout />} />
    <Route element={<ClientOnboardingRoute />}>
      <Route path="/client/profile-setup" element={<ClientProfileSetup />} />
      <Route path="/client/contact-setup" element={<ClientContactSetup />} />
      <Route path="/client/verification" element={<ClientVerification />} />
    </Route>
    <Route element={<ClientPortalRoute />}>
      <Route element={<ClientPortalLayout />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/medications" element={<ClientMedicationUpload />} />
        <Route path="/client/attendance" element={<ClientAttendance />} />
        <Route path="/client/caregiver-verification" element={<ClientCaregiverVerification />} />
        <Route path="/client/payments" element={<ClientPayments />} />
        <Route path="/client/messages" element={<ClientMessages />} />
      </Route>
    </Route>
    <Route element={<CaregiverOnboardingRoute />}>
      <Route path="/caregiver/profile-setup" element={<CaregiverProfileSetup />} />
      <Route path="/caregiver/credentials" element={<CaregiverCredentials />} />
      <Route path="/caregiver/assessment" element={<CaregiverAssessment />} />
      <Route path="/caregiver/review" element={<CaregiverReview />} />
    </Route>
    <Route element={<CaregiverPortalRoute />}>
      <Route element={<CaregiverPortalLayout />}>
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        <Route path="/caregiver/assigned-clients" element={<CaregiverAssignedClients />} />
        <Route path="/caregiver/assigned-clients/:clientId" element={<CaregiverClientDetail />} />
        <Route path="/caregiver/requested-clients" element={<CaregiverRequestedClients />} />
        <Route path="/caregiver/requested-clients/:clientId" element={<CaregiverRequestDetail />} />
        <Route path="/caregiver/notifications" element={<CaregiverNotifications />} />
        <Route path="/caregiver/payments" element={<CaregiverPayments />} />
        <Route path="/caregiver/reports" element={<CaregiverReports />} />
      </Route>
      <Route path="/caregiver/visit/:clientId" element={<CaregiverActiveVisit />} />
    </Route>
  </Routes>
);

export default App;
