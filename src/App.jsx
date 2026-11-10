import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PublicLayout from "./layouts/PublicLayout";
import Classrooms from "./pages/public/classroom/Classrooms";
import Classroom from "./pages/public/classroom/Classroom";
import ControlPanel from "./pages/public/classroom/ControlPanel";
import Assignments from "./pages/public/assignment/Assignments";
import Members from "./pages/public/member/Members";
import Profile from "./pages/auth/Profile";

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
          <Route index element={<h1>DASHBOARD</h1>}></Route>
          <Route path="classrooms" element={<Classrooms />} />
          <Route path="classrooms/:id" element={<Classroom />}>
            <Route index element={<ControlPanel />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="members" element={<Members />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<header>Haloo</header>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
