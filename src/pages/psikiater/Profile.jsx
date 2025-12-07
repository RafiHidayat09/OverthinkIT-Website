import React, { useEffect, useState } from "react";
import { psikologImageStorage } from "../../_api";
import { getPsikologProfile } from "../../_services/psikolog";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPsikologProfile();

        console.log("HASIL API:", data);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-2xl">Loading profil...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-2xl">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Foto */}
        <div className="md:w-1/3 bg-blue-50 flex flex-col items-center p-10">
          <img
            className="w-56 h-56 rounded-full border-4 border-blue-400 object-cover mb-6"
            src={
              profile?.profile?.foto
                ? `${psikologImageStorage}/${profile.profile.foto}`
                : "https://via.placeholder.com/150?text=No+Photo"
            }
            alt="Foto Psikiater"
          />
          <h2 className="text-3xl font-bold mb-2 text-center">{profile?.user?.name}</h2>
          <p className="text-gray-700 text-center">{profile?.user?.email}</p>
        </div>

        {/* Konten Profil */}
        <div className="md:w-2/3 p-12">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Spesialisasi</h3>
            <p className="text-lg text-gray-800">{profile?.profile?.spesialisasi}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Pengalaman</h3>
            <p className="text-lg text-gray-700">{profile?.profile?.pengalaman}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Deskripsi</h3>
            <p className="text-lg text-gray-600">{profile?.profile?.deskripsi}</p>
          </div>

          {/* Bisa ditambahkan card tambahan seperti LinkedIn */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <h4 className="font-semibold mb-2">Kontak</h4>
              <p>Email: {profile?.user?.email}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
