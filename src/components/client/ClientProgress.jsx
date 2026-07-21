const steps = [
  { number: 1, label: "Profile Details" },
  { number: 2, label: "Contact & Location" },
  { number: 3, label: "Verification" },
];

const ClientProgress = ({ activeStep }) => (
  <div className="relative mx-auto mt-9 max-w-[770px]">
    <div className="absolute left-4 right-4 top-5 h-1 rounded-full bg-[#c7ccda]">
      <div
        className="h-full rounded-full bg-[#06449d] transition-all"
        style={{ width: activeStep === 1 ? "34%" : activeStep === 2 ? "67%" : "100%" }}
      />
    </div>
    <ol className="relative grid grid-cols-3">
      {steps.map((step) => (
        <li className={`flex flex-col ${step.number === 1 ? "items-start" : step.number === 3 ? "items-end" : "items-center"}`} key={step.number}>
          <span className={`grid size-10 place-items-center rounded-xl border-2 bg-white text-sm font-semibold ${
            step.number <= activeStep ? "border-[#06449d] bg-[#06449d] text-white" : "border-[#c7ccda] text-[#434654]"
          }`}>
            {step.number}
          </span>
          <span className={`mt-1 text-[11px] font-semibold sm:text-xs ${step.number === activeStep ? "text-[#06449d]" : "text-[#434654]"}`}>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  </div>
);

export default ClientProgress;
