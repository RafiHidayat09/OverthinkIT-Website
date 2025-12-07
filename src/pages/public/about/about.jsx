export default function About() {
  return (
    <section className="bg-[#1a3c3c]/20 py-16">
      <div className="max-w-screen-xl mx-auto px-6 text-center">

        {/* Judul */}
        <h2 className="text-3xl font-bold text-[#163737] mb-8">
          About OverthinkIT
        </h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
          OverthinkIT hadir sebagai ruang edukasi dan layanan untuk membantu 
          masyarakat memahami pentingnya kesejahteraan mental serta memberikan 
          solusi berbasis teknologi yang mudah diakses, aman, dan ramah pengguna.
        </p>

        {/* 3 Blok Konten */}
        <div className="grid gap-8 md:grid-cols-3">

          {/* Misi */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 
                          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center 
                            justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-bullseye text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">Misi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Menyediakan informasi dan layanan edukatif seputar kesehatan mental 
              agar masyarakat lebih sadar, peduli, dan mampu merawat diri.
            </p>
          </div>

          {/* Visi */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 
                          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center 
                            justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-eye text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Menjadi platform edukasi kesehatan mental terpercaya yang berfokus 
              pada penyebaran pengetahuan dan dukungan emosional.
            </p>
          </div>

          {/* Nilai */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 
                          hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center 
                            justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-heart text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">Nilai Utama</h3>
            <p className="text-gray-600 leading-relaxed">
              Empati, edukasi, dan keberlanjutan adalah dasar kami dalam membangun 
              layanan yang berdampak positif bagi masyarakat.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-10 border border-[#1e4d4d]/20 
                        max-w-2xl mx-auto hover:shadow-lg transition-all duration-300">

        <h3 className="text-2xl font-semibold text-[#163737] mb-4">
            Hubungi Kami
        </h3>

        <p className="text-gray-600 mb-6">
            Jika Anda memiliki pertanyaan atau membutuhkan bantuan, 
            kami siap membantu.
        </p>

        <div className="space-y-3 text-gray-700">

            {/* Email */}
            <a 
            href="mailto:support@overthinkit.com" 
            className="flex items-center justify-center hover:text-[#1e4d4d] transition"
            >
            <i className="fa-solid fa-envelope mr-2 text-[#1e4d4d] no-underline"></i> 
            <span className="hover:underline underline-offset-4"> 
                support@overthinkit.com
            </span>
            </a>

            {/* Phone */}
            <a 
            href="https://wa.me/6281234567890" 
            target="_blank"
            className="flex items-center justify-center hover:text-[#1e4d4d] transition"
            >
            <i className="fa-solid fa-phone mr-2 text-[#1e4d4d] no-underline"></i> 
            <span className="hover:underline underline-offset-4"> 
                +62 812-3456-7890
            </span>
            </a>

            {/* Maps */}
            <a 
            href="https://www.google.com/maps?q=Surabaya" 
            target="_blank"
            className="flex items-center justify-center hover:text-[#1e4d4d] transition"
            >
            <i className="fa-solid fa-location-dot mr-2 text-[#1e4d4d] no-underline"></i> 
            <span className="hover:underline underline-offset-4"> 
                Surabaya, Indonesia
            </span>
            </a>

        </div>
        </div>


      </div>
    </section>
  );
}
