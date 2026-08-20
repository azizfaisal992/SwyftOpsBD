import { Link } from "react-router-dom";

const JoinOptionCard = ({ image, imageAlt, title, description, buttonLabel, accountType, primary = false }) => (
  <article className="flex flex-col rounded-xl border border-[#c3c6d6] bg-white p-5 sm:p-6">
    <img className="h-64 w-full rounded-lg bg-[#f0f3ff] object-cover sm:h-[328px]" src={image} alt={imageAlt} />
    <div className="flex flex-1 flex-col pt-5 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-base leading-6 text-[#434654]">{description}</p>
      <Link
        className={`mt-5 flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition ${
          primary
            ? "bg-[#003d9b] text-white hover:bg-[#002f78]"
            : "border border-[#003d9b] text-[#003d9b] hover:bg-[#f0f3ff]"
        }`}
        to={`/register?type=${accountType}`}
      >
        {buttonLabel} <span aria-hidden="true">→</span>
      </Link>
    </div>
  </article>
);

export default JoinOptionCard;
