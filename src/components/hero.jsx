import { Link } from "react-router-dom";
import banner from "./bannerhero.png";

export default function Hero() {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <section className="relative w-full bg-gray-900 overflow-hidden h-[380px] md:h-[480px]">
      
      <img
        src={banner}
        alt="OverthinkIT Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute inset-0 flex items-center justify-end pr-6 md:pr-16">
        <div className="w-full md:w-1/2 text-right text-white drop-shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Jaga Kesehatan Mentalmu Hari Ini
          </h1>
          <p className="text-base md:text-lg mb-5 text-gray-200">
            Kesehatan mental sama pentingnya dengan kesehatan fisik.
          </p>

          <Link
            to={isLoggedIn ? "/quiz" : "/login"}
            className="inline-block px-5 py-2 bg-[#5ba8a0] hover:bg-[#4a9990] text-white rounded-full font-semibold shadow-md transition-all"
          >
            Mulai Asesment Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
