import {
  FaEnvelope,
  FaGithub,
  FaGraduationCap,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { cn } from "../_utilities/cn";

export default function AuthLayout() {
  return (
    <div className={cn("flex h-screen w-screen", "p-10", "mt-1")}>
      <div className="bg-primary h-full w-1/2">
        <header>
          <div className="icon">
            <FaGraduationCap />
          </div>
          <div className="title">
            <h1>Stardevs Learning Management System</h1>
            <h2>Improve Your Assessment Experience!</h2>
          </div>
        </header>
        <main>
          <ul>
            <li>
              Sistem LMS ini hadir sebagai platform praktikum pemrograman yang
              modern, interaktif, dan terpercaya.
            </li>
            <li>
              Website ini mendukung kompilasi kode langsung serta penilaian
              otomatis untuk mempermudah mahasiswa dan asisten.
            </li>
            <li>
              Dirancang dengan fokus pada efisiensi dan pengalaman pengguna,
              platform ini menjadi langkah nyata menuju pembelajaran pemrograman
              yang lebih cepat dan tepat.
            </li>
          </ul>
        </main>
        <footer>
          <h2>Get to Know, Bintang Al Fizar</h2>
          <div>
            <div>
              <FaLinkedin /> Bintang Al Fizar
            </div>
            <div>
              <FaGithub /> bintang25a
            </div>
            <div>
              <FaInstagram /> bintang_alfizar_
            </div>
            <div>
              <FaEnvelope /> bintangalfizar25@gmail.com
            </div>
          </div>
        </footer>
      </div>
      <div className="h-full w-1/2">
        <header>Mantap</header>
      </div>
    </div>
  );
}
