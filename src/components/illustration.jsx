import React from 'react';
import animation from '../assets/animation.gif'; 
import { Link } from 'react-router-dom';

export default function Illustration() {
  return (
    <section className="bg-gradient-to-br from-[#f0f7f7] to-[#e0f2f1] py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Content Section */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-[#163737] mb-6">
              Journey to <span className="text-[#1e4d4d]">Mental Wellness</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Setiap langkah kecil menuju kesehatan mental adalah pencapaian besar. 
              Mari bersama-sama membangun lingkungan yang mendukung pertumbuhan 
              dan pemulihan mental.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-[#1e4d4d]">85%</div>
                <div className="text-gray-600 text-sm">Merasa lebih baik setelah berbagi</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-[#1e4d4d]">24/7</div>
                <div className="text-gray-600 text-sm">Dukungan tersedia kapan saja</div>
              </div>
            </div>
            
            <Link to="/login">
              <button className="bg-[#1e4d4d] hover:bg-[#163737] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Mulai Perjalanan Anda
              </button>
            </Link>
          </div>

          {/* Your Converted Illustration */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <img 
                src={animation} 
                alt="Mental Health Journey Illustration"
                className="w-full h-auto drop-shadow-lg animate-float"
              />
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="text-center mt-12 pt-8 border-t border-[#1e4d4d]/20">
          <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
            "Kesehatan mental bukan tujuan, melainkan perjalanan - 
            <span className="text-[#1e4d4d] font-semibold"> proses terus-menerus dalam merawat diri</span>"
          </blockquote>
        </div>
      </div>
    </section>
  );
}