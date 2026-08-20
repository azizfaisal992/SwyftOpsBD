import caregiverAllexus from "../assets/caregiver-allexus.jpg";
import caregiverKelly from "../assets/caregiver-kelly.jpg";
import caregiverSarah from "../assets/caregiver-sarah.jpg";

export const connectedCaregiver = {
  id: "CR-88294",
  name: "Elena Rodriguez",
  role: "Senior Home Care Specialist",
  shortRole: "Senior Nurse",
  image: caregiverSarah,
  verifiedSince: "Oct 2022",
  trustScore: 98,
  phone: "+880 1712-345678",
  status: "Active",
};

export const portalCaregivers = {
  elena: connectedCaregiver,
  marcus: { name: "Marcus T.", image: caregiverKelly },
  linda: { name: "Linda W.", image: caregiverAllexus },
};

export const careSchedule = [
  { date: "Tomorrow", time: "09:00 AM", service: "Morning Routine", caregiver: portalCaregivers.elena },
  { date: "Oct 27", time: "02:30 PM", service: "Specialist Escort", caregiver: portalCaregivers.marcus },
  { date: "Oct 28", time: "08:00 AM", service: "Post-Op Recovery", caregiver: portalCaregivers.linda },
];

export const serviceReports = [
  { date: "Yesterday, 4:15 PM", title: "Afternoon Medication & Physiotherapy", note: "Patient was responsive and completed the planned routine." },
  { date: "Oct 24, 10:00 AM", title: "Daily Hygiene & Breakfast Prep", note: "Standard routine followed. Appetite was normal." },
  { date: "Oct 23, 4:30 PM", title: "Vital Signs Check - Stable", note: "Blood pressure recorded at 120/80." },
];

export const transactions = [
  { id: "TRX-98231", service: "Weekly Home Care - Nurse Alpha", date: "Oct 24, 2024", amount: "৳ 4,500.00", status: "Successful" },
  { id: "INV-88712", service: "Monthly Premium Subscription", date: "Nov 01, 2024", amount: "৳ 2,900.00", status: "Pending" },
  { id: "TRX-98210", service: "Medical Supplies Delivery", date: "Oct 20, 2024", amount: "৳ 1,250.00", status: "Successful" },
];
