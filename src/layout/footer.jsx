import logoImage from "../assets/F.png";

const footerGroups = [
  {
    title: (
      <img
        src={logoImage}
        className="block h-auto w-40 max-w-full object-contain object-left"
        alt="SwiftOpsBD"
      />
    ),
    links: ["About us", "Newsroom", "Careers", "Terms of use", "Privacy policy"],
  },
  {
    title: "Popular topics",
    links: ["Child care", "Senior care", "Pet care", "Tutoring", "Housekeeping"],
  },
  {
    title: "Discover",
    links: ["HomePay™ Nanny Tax", "List your business", "Care for business", "Safety center", "Articles & Guides"],
  },
  {
    title: "Get help",
    links: ["Contact Us", "Help Center"],
  },
];

const Footer = () => (
  <footer className="bg-[#253143] text-[#ebf1ff]">
    <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:pt-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {footerGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.08em] text-white">
              {group.title}
            </h2>
            <ul className="space-y-4 text-sm text-[#ebf1ff]/80">
              {group.links.map((link) => (
                <li key={link}>
                  <a className="transition hover:text-white" href="#footer">{link}</a>
                </li>
              ))}
            </ul>
            {group.title === "Get help" && (
              <div className="mt-7 flex gap-4 text-lg" aria-label="Social links">
                <a href="#facebook" aria-label="Facebook">◉</a>
                <a href="#instagram" aria-label="Instagram">◎</a>
                <a href="#linkedin" aria-label="LinkedIn">▣</a>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-[#c3c6d6]/30 pt-8 text-xs text-[#ebf1ff]/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 SwiftOpsBD Management System. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#sitemap">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
