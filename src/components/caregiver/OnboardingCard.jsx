const OnboardingCard = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`min-w-0 rounded-lg border border-[#c3c6d6] bg-white p-4 shadow-sm sm:p-6 ${className}`}>
    {title && (
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold sm:mb-6 sm:text-2xl">
        {Icon && <Icon className="size-5 text-[#003d9b]" />}
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default OnboardingCard;
