import caregiverAllexus from "../assets/caregiver-allexus.jpg";
import caregiverKelly from "../assets/caregiver-kelly.jpg";
import caregiverSarah from "../assets/caregiver-sarah.jpg";
import findCareKelly from "../assets/find-care-kelly.jpg";
import findCareSarah from "../assets/find-care-sarah.jpg";

export const adminAccount = {
  name: "Md. Sazzad",
  role: "Super Admin",
  email: "admin@swiftops.bd",
  image: caregiverKelly,
};

export const adminCaregivers = [
  {
    id: "cr-88294",
    name: "Rahima Khatun",
    image: caregiverSarah,
    phone: "+880 1712 345678",
    nid: "Verified",
    verification: "Clear",
    trust: 98,
    clients: 12,
    rating: 4.9,
    active: true,
    tone: "green",
  },
  {
    id: "cr-77412",
    name: "Arifur Rahman",
    image: caregiverKelly,
    phone: "+880 1823 889900",
    nid: "Pending",
    verification: "Pending",
    trust: 45,
    clients: 2,
    rating: 3.8,
    active: false,
    tone: "amber",
  },
  {
    id: "cr-66421",
    name: "Fatema Begum",
    image: caregiverAllexus,
    phone: "+880 1511 223344",
    nid: "Verified",
    verification: "Flagged",
    trust: 22,
    clients: 0,
    rating: 2.1,
    active: false,
    tone: "red",
  },
  {
    id: "cr-55310",
    name: "Mofizul Kader",
    image: findCareKelly,
    phone: "+880 1911 001122",
    nid: "Verified",
    verification: "Clear",
    trust: 85,
    clients: 8,
    rating: 4.5,
    active: true,
    tone: "green",
  },
];

export const adminClients = [
  {
    id: "cl-90234",
    name: "Abdul Karim",
    image: findCareKelly,
    age: 72,
    gender: "Male",
    phone: "+880 1711 223344",
    address: "House 23, Road 10, Dhanmondi",
    nid: "Verified",
    carePlan: "Post-Op Recovery",
    bloodGroup: "O Positive (O+)",
    language: "Bengali, English",
  },
  {
    id: "cl-90235",
    name: "Fatema Begum",
    image: findCareSarah,
    age: 65,
    gender: "Female",
    phone: "+880 1822 554433",
    address: "Block C, Bashundhara R/A",
    nid: "Pending",
    carePlan: "Dementia Care",
    bloodGroup: "B Positive (B+)",
    language: "Bengali",
  },
];

export const adminUsers = [
  { id: 1, name: "Rahat Ahmed", email: "rahat.ops@swiftops.bd", role: "Super Admin", lastLogin: "2 mins ago", active: true, image: caregiverKelly },
  { id: 2, name: "Farhana Islam", email: "farhana.v@swiftops.bd", role: "Operations Manager", lastLogin: "Oct 12, 09:44 AM", active: true, image: caregiverSarah },
  { id: 3, name: "Sadiqur Rahman", email: "sadiq.fin@swiftops.bd", role: "Finance Officer", lastLogin: "Oct 11, 14:12 PM", active: true, image: findCareKelly },
  { id: 4, name: "Tanzila Karim", email: "tanzila.a@swiftops.bd", role: "Analyst", lastLogin: "Oct 09, 18:22 PM", active: false, image: caregiverAllexus },
];

