import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white">
            FundSpark
          </Link>

          <p className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} FundSpark. Empowering ideas through
            community support.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaGithub size={20} />
            </a>

            <a
              href="https://linkedin.com/in/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaLinkedin size={20} />
            </a>

            <a
              href="https://facebook.com/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
