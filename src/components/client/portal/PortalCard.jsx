const PortalCard = ({ children, className = "" }) => (
  <section className={`rounded-xl border border-[#c5cad8] bg-white shadow-sm ${className}`}>{children}</section>
);

export default PortalCard;
