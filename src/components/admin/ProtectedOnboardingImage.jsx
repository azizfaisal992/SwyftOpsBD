import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getVerificationImageUrl } from "../../services/adminVerificationService";

const ProtectedOnboardingImage = ({
  role,
  userId,
  kind = "profilePhoto",
  className,
  alt = "",
}) => {
  const imageKey = `${role}:${userId}:${kind}`;
  const [resolvedImage, setResolvedImage] = useState({ key: "", source: "" });
  const [loadedImage, setLoadedImage] = useState("");
  const source = resolvedImage.key === imageKey ? resolvedImage.source : "";
  const loaded = Boolean(source) && loadedImage === source;

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    if (!userId) {
      return undefined;
    }

    getVerificationImageUrl(role, userId, kind)
      .then((url) => {
        if (cancelled) {
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url.startsWith("blob:") ? url : "";
        setResolvedImage({ key: imageKey, source: url });
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedImage({ key: imageKey, source: "" });
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageKey, kind, role, userId]);

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden bg-[#eef3fb] text-[#91a0b8] ${className || ""}`}
      role="img"
      aria-label={alt || "Profile image"}
    >
      {!loaded && <ImageIcon className="size-1/2" aria-hidden="true" />}
      {source && (
        <img
          className={`absolute inset-0 size-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          src={source}
          alt=""
          onLoad={() => setLoadedImage(source)}
          onError={() => {
            setResolvedImage({ key: imageKey, source: "" });
            setLoadedImage("");
          }}
        />
      )}
    </span>
  );
};

export default ProtectedOnboardingImage;
