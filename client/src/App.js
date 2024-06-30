import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Demo from './components/auth/ReactLogin';
import Home from "./views/Home";
import { AuthProvider } from "./context/AuthContext";
// import LandingPage from "./views/Landing";
import SignupPage from "./views/Signup";
import AdminPage from "./views/Admin";
import Login from "./views/Login";
// import InterviewPage from "./views/Interview";
import ThankYouPage from "./views/ThankYouPage";
import { NextUIProvider } from "@nextui-org/react";
import Jobs from "./views/Jobs";
import VideoRecorder from "./components/VideoRecorder";
import NewInterview from "./views/NewInterview";
import NewLandingPage from "./views/NewLanding";
import EmployerPage from "./views/EmployerPage";
import LandingPage from "./components/Test";
// import ColorPaletteProvider from './components/ColorPaletteProvider';

function App() {
  return (
    <AuthProvider>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/test" element={<VideoRecorder />} />
            {/* <Route path="/login" element={<Demo />} /> */}
            <Route path="/home" element={<Home />} />
            {/* <Route path="/interview" element={<InterviewPage />} /> */}
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/new-interview" element={<NewInterview />} />
            <Route path="/new-landing" element={<NewLandingPage />} />
            <Route path="/employers" element={<EmployerPage />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
      {/* <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8"> */}

      {/* </div>
    </div> */}
    </AuthProvider>
  );
}

export default App;
