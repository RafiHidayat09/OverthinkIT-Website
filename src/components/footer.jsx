import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1e4d4d] dark:bg-[#0f2828] border-t border-white/10">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-10 text-center">

        {/* Footer Menu */}
        <ul className="flex flex-wrap justify-center items-center gap-6 text-gray-200">
          <li>
            <Link to="/" className="hover:text-[#7eb8b0] transition">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#7eb8b0] transition">About</Link>
          </li>
          <li>
            <Link to="/konsultasi" className="hover:text-[#7eb8b0] transition">Konsultasi</Link>
          </li>
          <li>
            <Link to="/artikel" className="hover:text-[#7eb8b0] transition">Artikel</Link>
          </li>
        </ul>

        {/* Copyright */}
        <div className="mt-6 text-gray-300 text-sm">
          © 2025 OverthinkIT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
