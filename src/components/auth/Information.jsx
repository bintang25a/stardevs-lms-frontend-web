import {
  FaEnvelope,
  FaGithub,
  FaGraduationCap,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import stardevsLogo from "/Logo only transparant.png";

export default function Information() {
  const explains = [
    "Sistem LMS ini hadir sebagai platform praktikum pemrograman yang modern, interaktif, dan terpercaya.",
    "Website ini mendukung kompilasi kode langsung serta penilaian otomatis untuk mempermudah mahasiswa dan asisten.",
    "Dirancang dengan fokus pada efisiensi dan pengalaman pengguna, platform ini menjadi langkah nyata menuju pembelajaran pemrograman yang lebih cepat dan tepat.",
  ];

  const socials = [
    {
      icon: <FaLinkedin className="shrink-0" />,
      link: "https://linkedin.com/in/bintang25a",
      user: "Bintang Al Fizar",
      title: "LinkedIn",
    },
    {
      icon: <FaGithub className="shrink-0" />,
      link: "https://github.com/bintang25a",
      user: "bintang25a",
      title: "Github",
    },
    {
      icon: <FaInstagram className="shrink-0" />,
      link: "https://instagram.com/bintang_alfizar_",
      user: "bintang_alfizar_",
      title: "Instagram",
    },
    {
      icon: <FaEnvelope className="shrink-0" />,
      link: "mailto:bintangalfizar25@gmail.com",
      user: "bintangalfizar25@gmail.com",
      title: "Contact email",
    },
    {
      icon: <img src={stardevsLogo} className="w-8 h-8 object-contain" />,
      link: "https://stardevs.my.id",
      user: "Stardevs",
      title: "Portfolio",
    },
  ];

  return (
    <div
      className={cn(
        "h-full w-full xl:w-1/2",
        "bg-linear-to-br from-thirdnary to-primary",
        "flex flex-col justify-center items-center gap-8",
        "p-8 md:p-12 xl:p-16 rounded-r-xl"
      )}
    >
      <header
        className={cn(
          "w-full",
          "flex justify-start items-center gap-2",
          "hover:scale-105 hover:rotate-2 transition-all"
        )}
      >
        <div className={cn("text-white")}>
          <FaGraduationCap size={80} />
        </div>
        <div className={cn("text-white")}>
          <h1 className={cn("text-2xl font-semibold")}>
            Stardevs Learning Management System
          </h1>
          <h2 className={cn("text-xl font-semibold")}>
            Improve Your Assessment Experience!
          </h2>
        </div>
      </header>
      <main className={cn("w-full")}>
        <ul
          className={cn("list-disc", "pl-8", "text-white text-base font-light")}
        >
          {explains.map((item, i) => (
            <li key={i} className="hover:scale-105 transition-all">
              {item}
            </li>
          ))}
        </ul>
      </main>
      <footer
        className={cn(
          "w-full",
          "flex flex-col justify-center items-center gap-4"
        )}
      >
        <h2 className={cn("text-white text-2xl font-semibold")}>
          Get to Know, Bintang Al Fizar
        </h2>
        <div
          className={cn(
            "w-full",
            "flex flex-wrap justify-center items-center gap-4",
            "text-white text-xl"
          )}
        >
          {socials.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              title={item.title}
              className={cn(
                "min-w-fit",
                "flex justify-center items-center gap-1",
                "truncate font-medium",
                "hover:scale-105 hover:text-thirdnary transition-all",
                item.user === "Stardevs" ? "text-orange-400" : "text-white"
              )}
            >
              {item.icon}
              <span className="truncate">{item.user}</span>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
