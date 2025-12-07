import { useEffect, useState } from "react";
import { getArticles } from "../../../_services/articles";
import { Link } from "react-router-dom";
import { articleImageStorage } from "../../../_api";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [data] = await Promise.all([getArticles()]);
      setArticles(data);
    };
    fetchData();
  }, []);

  // Filter pencarian berdasarkan judul
  const filteredArticles = articles.filter((a) =>
    a.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-[#1a3c3c]/20 py-16">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#163737] mb-6 text-center">
          Artikel Psikologi
        </h1>

        {/* Search Centered */}
        <div className="mb-12 flex justify-center">
          <input
            type="text"
            placeholder="Cari artikel berdasarkan judul..."
            className="w-full sm:w-96 px-5 py-3 rounded-2xl border border-[#1e4d4d]/40 
                       focus:ring-2 focus:ring-[#1e4d4d]/50 outline-none bg-white text-gray-700 
                       shadow-md transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid Article */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-left">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.article_id}
                className="bg-white rounded-2xl shadow-lg border border-[#1e4d4d]/20 
                           hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
                           overflow-hidden flex flex-col"
              >
                {/* Cover */}
                <Link to={`/articles/show/${article.article_id}`}>
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={
                        article.gambar
                          ? `${articleImageStorage}/${article.gambar}`
                          : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/placeholder.png"
                      }
                      alt={article.judul}
                      className="w-full h-full object-cover hover:scale-110 
                                 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  
                  {/* Judul */}
                  <Link
                    to={`/articles/show/${article.article_id}`}
                    className="text-xl font-semibold text-[#163737] hover:underline leading-snug"
                  >
                    {article.judul}
                  </Link>

                  {/* Kategori & Tanggal */}
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                    <span className="bg-[#1e4d4d]/10 text-[#1e4d4d] px-2 py-1 
                                   rounded-md text-xs font-medium">
                      {article.kategori}
                    </span>
                    <span>{new Date(article.tanggal).toLocaleDateString()}</span>
                  </div>

                  {/* Konten Singkat */}
                  <p className="mt-4 text-gray-600 text-sm line-clamp-3 flex-grow">
                    {article.konten.slice(0, 130)}...
                  </p>

                  {/* Link */}
                  <Link
                    to={`/articles/show/${article.article_id}`}
                    className="mt-5 inline-flex items-center text-[#1e4d4d] 
                               hover:underline text-sm font-medium"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-left">Tidak ada artikel ditemukan.</p>
          )}
        </div>
      </div>
    </section>
  );
}
