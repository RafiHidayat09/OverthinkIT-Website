import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showArticle } from "../../../_services/articles";
import { articleImageStorage } from "../../../_api";

export default function ShowArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  // Fetch Article
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await showArticle(id);
        setArticle(data);
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
      }
    };
    fetchData();
  }, [id]);

  // Load Disqus
  useEffect(() => {
    if (!article?.article_id) return;

    const oldScript = document.getElementById("dsq-embed-scr");
    if (oldScript) oldScript.remove();

    window.disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = `article-${article.article_id}`;
    };

    const d = document;
    const s = d.createElement("script");
    s.src = "https://booksales-com.disqus.com/embed.js";
    s.id = "dsq-embed-scr";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);

    return () => {
      const thread = document.getElementById("disqus_thread");
      if (thread) thread.innerHTML = "";
    };
  }, [article]);

  if (!article) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Memuat artikel...
      </div>
    );
  }

  return (
    <section className="py-12 bg-[#f4faf9] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">

        {/* Judul */}
        <h1 className="text-4xl font-bold text-[#163737] dark:text-white mb-4 leading-tight">
          {article.judul}
        </h1>

        {/* Meta Information */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-8 bg-white/70 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p><span className="font-semibold">Kategori:</span> {article.kategori}</p>
          <p><span className="font-semibold">Tanggal:</span> {new Date(article.tanggal).toLocaleDateString()}</p>
          <p><span className="font-semibold">Penulis:</span> {article.penulis?.name}</p>
        </div>

        {/* Gambar */}
        {article.gambar && (
          <div className="mb-8">
            <img
              src={`${articleImageStorage}/${article.gambar}`}
              alt={article.judul}
              className="rounded-xl w-full h-80 object-cover shadow-lg border border-gray-300 dark:border-gray-700"
            />
          </div>
        )}

        {/* Konten */}
        <div
          className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 dark:prose-invert leading-relaxed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-6"
          dangerouslySetInnerHTML={{ __html: article.konten }}
        ></div>

        {/* DISQUS COMMENT */}
        <div className="mt-14 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-[#163737] dark:text-white mb-4">
            Diskusi & Komentar
          </h3>
          <div id="disqus_thread"></div>
        </div>

      </div>
    </section>
  );
}
