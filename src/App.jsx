import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PublicLayout from "./layouts/PublicLayout";
import Classrooms from "./pages/public/classroom/Classrooms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<h1>Keren</h1>}></Route>
          <Route path="classrooms" element={<Classrooms />}></Route>
        </Route>
        <Route path="/admin" element={<header>Haloo</header>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
