import allexus from "../assets/caregiver-allexus.jpg";
import kelly from "../assets/caregiver-kelly.jpg";
import sarah from "../assets/caregiver-sarah.jpg";
import findKelly from "../assets/find-care-kelly.jpg";
import findSarah from "../assets/find-care-sarah.jpg";

export const caregiverAccount = { name: "Sarah Jenkins", role: "Senior Caregiver", image: sarah };

export const assignedClients = [
  { id: "jahanara", name: "Mrs. Jahanara Begum", shortName: "Mrs. Begum", age: 75, gender: "Female", area: "Gulshan 2, Dhaka", care: "Post-Op Recovery", status: "On Duty", image: findSarah },
  { id: "nasrin", name: "Nasrin Begum", age: 65, gender: "Female", area: "Banani, Dhaka", care: "Dementia Care", status: "Available", image: allexus },
  { id: "zahirul", name: "Zahirul Islam", age: 80, gender: "Male", area: "Dhanmondi, Dhaka", care: "Cardiac Monitoring", status: "Urgent Visit", image: kelly },
  { id: "fatima", name: "Fatima Zohra", age: 68, gender: "Female", area: "Uttara Sector 4, Dhaka", care: "Mobility Support", status: "Available", image: findKelly },
  { id: "mustafa", name: "Mustafa Ahmed", age: 75, gender: "Male", area: "Baridhara DOHS, Dhaka", care: "Chronic Pain Mgmt", status: "On Duty", image: caregiverAccount.image },
];

export const requestedClients = [
  { id: "rabeya", name: "Mrs. Rabeya Begum", age: 72, gender: "Female", area: "Gulshan 2, Dhaka", care: "Elder Care", rate: "৳850 / Visit", schedule: ["Mon (09:00 - 12:00)", "Wed (09:00 - 12:00)", "Fri (09:00 - 12:00)"], image: findSarah },
  { id: "kamal", name: "Mr. Kamal Ahmed", age: 58, gender: "Male", area: "Uttara Sector 4, Dhaka", care: "Chronic Care", rate: "৳1,200 / Visit", schedule: ["Daily (18:00 - 21:00)"], image: kelly },
  { id: "nusrat", name: "Ms. Nusrat Jahan", age: 29, gender: "Female", area: "Banani, Dhaka", care: "Post-Surgery", rate: "৳950 / Visit", schedule: ["Tue (10:00 - 14:00)", "Thu (10:00 - 14:00)", "Sat (10:00 - 14:00)"], image: allexus },
  { id: "zahid", name: "Mr. Zahid Hussain", age: 84, gender: "Male", area: "Dhanmondi 27, Dhaka", care: "Dementia Care", rate: "৳1,500 / Visit", schedule: ["Daily (14:00 - 17:00)"], image: caregiverAccount.image },
];
