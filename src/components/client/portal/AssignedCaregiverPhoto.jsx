import { useEffect, useState } from "react";
import { apiDownload } from "../../../services/apiClient";

const AssignedCaregiverPhoto = ({ assignmentId, className = "", name = "" }) => {
  const [source, setSource] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    apiDownload(
      `/assignments/${encodeURIComponent(assignmentId)}/caregiver-photo`,
    )
      .then(({ blob }) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setSource(objectUrl);
      })
      .catch(() => {
        if (active) setSource("");
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [assignmentId]);

  if (source) {
    return <img className={className} src={source} alt={name} />;
  }
  return (
    <span
      className={`${className} grid place-items-center bg-[#f3f4f7] text-xs font-medium text-[#687184]`}
      role="img"
      aria-label={`${name || "Caregiver"} image`}
    >
      Image
    </span>
  );
};

export default AssignedCaregiverPhoto;
