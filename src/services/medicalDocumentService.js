import { apiDownload, apiRequest } from "./apiClient";

export const getMyMedicalDocuments = () =>
  apiRequest("/medical-documents/mine");

export const uploadMedicalDocument = (file, category = "prescription") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  return apiRequest("/medical-documents", {
    method: "POST",
    body: formData,
  });
};

export const saveMedicationInstructions = (instructions) =>
  apiRequest("/medical-documents/instructions", {
    method: "PUT",
    body: JSON.stringify({ instructions }),
  });

export const downloadMedicalDocument = (document) =>
  apiDownload(
    `/medical-documents/${encodeURIComponent(document.documentId)}/download` +
      `?source=${encodeURIComponent(document.source || "medication_portal")}`,
  );
