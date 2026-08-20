const CaregiverCard = ({ children, className = "" }) => (
  <section
    className={`rounded-xl border border-[#c5cad8] bg-white ${className}`}
  >
    {children}
  </section>
);
export default CaregiverCard;
