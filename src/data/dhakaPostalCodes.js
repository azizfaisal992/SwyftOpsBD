export const DHAKA_POSTAL_AREAS = {
  1000: "Dhaka GPO (Motijheel, Paltan)",
  1100: "Dhaka Sadar Head Office (Sutrapur)",
  1203: "Wari",
  1204: "Gandaria / Gendaria",
  1205: "New Market / Nilkhet",
  1206: "Dhaka Cantonment / Kochukhet",
  1207: "Mohammadpur Housing Estate",
  1208: "Dhaka Polytechnic / Tejgaon Industrial Area",
  1209: "Jigatola / Dhanmondi",
  1211: "Postagola / Kamrangirchar",
  1212: "Gulshan Model Town",
  1213: "Banani",
  1214: "Bashabo / Sabujbagh",
  1215: "Tejgaon",
  1216: "Mirpur",
  1217: "Shantinagar",
  1218: "Mirpur Bazar",
  1219: "Khilgaon",
  1221: "Mirpur Section-2",
  1222: "Bangabhaban",
  1223: "Dilkusha",
  1225: "Sangsad Bhaban",
  1229: "Khilkhet",
  1230: "Uttara",
  1231: "Uttara Model Town",
  1232: "Dhania (Jatrabari)",
  1236: "Dhonia",
};

export const normalizePostalCode = (value) =>
  String(value || "").match(/\b\d{4}\b/)?.[0] || "";

export const postalArea = (value) =>
  DHAKA_POSTAL_AREAS[normalizePostalCode(value)] || "";

export const postalLocationLabel = (value) => {
  const code = normalizePostalCode(value);
  const area = DHAKA_POSTAL_AREAS[code];
  return area ? `${area}, Dhaka ${code}` : "";
};

