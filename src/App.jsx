import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/public";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Home from "./pages/public";
import Forums from "./pages/public/forums";
import QuizPage from "./pages/public/QuizPage";
import ResultPage from "./pages/public/ResultPage";
import ChatMain from "./pages/public/chat/ChatMain";
import PsychologistList from "./pages/psychologist/psychologistList";
import PaymentGateway from "./pages/public/wallet/PaymentGateway";
import Wallet from "./pages/public/wallet/wallet";
import GoogleAuthCallback from "./pages/auth/GoogleAuthCallback";
import PsychologistLayout from "./layouts/psychologist";
import PsychologistConsultations from "./pages/psychologist/PsychologistConsultations";
import PsychologistChatMain from "./pages/psychologist/chat/ChatMain";
import ProtectedRoute from "./components/ProtectedRoute";
import PsikiaterLayout from "./layouts/PsikiaterLayout";
import Dashboard from "./pages/psikiater/Dashboard";
import QuizResults from "./pages/psikiater/QuizResults";
import UserDetail from "./pages/psikiater/UserDetail";
import Profile from "./pages/psikiater/Profile";
import Articles from "./pages/public/articles";
import ShowArticle from "./pages/public/articles/show";
import PsikiaterArticles from "./pages/psikiater/articles";
import CreateArticles from "./pages/psikiater/articles/create";
import EditArticles from "./pages/psikiater/articles/edit";
import AdminLayout from "./layouts/admin";
import AdminDashboard from "./pages/admin";
import PsikiaterIndex from "./pages/admin/psikiater";
import CreatePsikiater from "./pages/admin/psikiater/create";
import EditPsikiater from "./pages/admin/psikiater/edit";
import LayananPsikiater from "./pages/public/layanan";
import ShowPsikiater from "./pages/public/layanan/show";
import UserIndex from "./pages/admin/user";
import About from "./pages/public/about/about";
import PsikiaterDashboard from "./pages/psikiater/Dashboard";
import PsikiaterWallet from "./pages/psikiater/wallet/wallet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================
            Public Layout Routes
        ======================== */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} /> {/* path="/" */}

          {/* Route dari kode teman */}
          <Route path="/about" element={<About />} />
          <Route path="artikel" element={<Articles />} />
          <Route path="articles/show/:id" element={<ShowArticle />} />
          <Route path="layanan" element={<LayananPsikiater />} />
          <Route path="layanan/show/:id" element={<ShowPsikiater />} />

          {/* Route dari kode Anda */}
          <Route path="forums" element={<Forums />} />
          <Route path="konsultasi" element={<PsychologistList />} />
          <Route path="wallet" element={<Wallet />} />

          {/* 🔒 Protected Routes - hanya user login */}
          <Route
            path="quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =======================
            Auth Routes
        ======================== */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/callback" element={<GoogleAuthCallback />} />

        {/* =======================
            Chat & Payment Routes (User)
        ======================== */}
        <Route path="chat" element={<ChatMain />} />
        <Route path="chat/:consultationId" element={<ChatMain />} />
        <Route path="payment/:consultationId" element={<PaymentGateway />} />

        {/* =======================
            Psikiater Routes (dari kode teman)
        ======================== */}
        <Route
          path="/psikiater"
          element={
            <ProtectedRoute role="psikiater">
              <PsikiaterLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="results" element={<QuizResults />} />
          <Route path="results/:id" element={<UserDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<PsikiaterWallet />} />

          {/* CRUD ARTIKEL PSIKIATER */}
          <Route path="artikel" element={<PsikiaterArticles />} />
          <Route path="artikel/create" element={<CreateArticles />} />
          <Route path="artikel/edit/:id" element={<EditArticles />} />
        </Route>

        {/* =======================
            Psychologist Routes (dari kode Anda)
        ======================== */}
        <Route path="psychologist" element={<PsikiaterLayout />}>
          <Route index element={<PsikiaterDashboard />} />
          <Route path="consultations" element={<PsychologistConsultations />} />
          <Route path="wallet" element={<PsikiaterWallet />} />
        </Route>

        {/* Chat Routes untuk Psychologist */}
        <Route path="psychologist/chat" element={<PsychologistChatMain />} />
        <Route path="psychologist/chat/:consultationId" element={<PsychologistChatMain />} />

        {/* =======================
            Admin Routes (dari kode teman)
        ======================== */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="psikiater" element={<PsikiaterIndex />} />
          <Route path="psikiater/create" element={<CreatePsikiater />} />
          <Route path="psikiater/edit/:id" element={<EditPsikiater />} />
          <Route path="user" element={<UserIndex />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;