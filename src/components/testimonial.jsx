export default function Testimonial() {
  return (
    <section className="bg-[#1a3c3c]/20 py-16">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#163737] mb-8">
          Pentingnya Menjaga Kesehatan Mental
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Kesehatan mental adalah pondasi kesejahteraan hidup. Dengan pikiran
          yang tenang dan perasaan yang stabil, kita dapat menghadapi
          tantangan hidup dengan lebih bijak dan penuh makna.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Blok 1 */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-brain text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">
              Sadari Kesehatan Pikiran
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Mengenali kondisi mental sendiri membantu kita memahami batas
              diri, mengelola stres, dan membangun keseimbangan emosi.
            </p>
          </div>

          {/* Blok 2 */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-hand-holding-heart text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">
              Bangun Dukungan Sosial
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Berbagi perasaan dengan teman, keluarga, atau komunitas dapat
              membantu kita merasa didengar dan mengurangi beban pikiran.
            </p>
          </div>

          {/* Blok 3 */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#1e4d4d]/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-14 h-14 bg-[#1e4d4d] text-white flex items-center justify-center rounded-xl mb-5 mx-auto">
              <i className="fa-solid fa-seedling text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-[#163737] mb-3">
              Rawat Diri Setiap Hari
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Luangkan waktu untuk aktivitas positif yang menenangkan seperti
              membaca, berjalan santai, atau bermeditasi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
