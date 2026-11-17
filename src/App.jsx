import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PublicLayout from "./layouts/PublicLayout";
import Classrooms from "./pages/public/classroom/Classrooms";
import Classroom from "./pages/public/classroom/Classroom";
import ControlPanel from "./pages/public/panel/ControlPanel";
import Assignments from "./pages/public/assignment/Assignments";
import Assignment from "./pages/public/assignment/Assignment";
import Members from "./pages/public/member/Members";
import Profile from "./pages/auth/Profile";
import Dashboard from "./pages/public/panel/Dashboard";
import Material from "./pages/public/material/Material";
import Submission from "./pages/public/submission/Submission";
import Submissions from "./pages/public/submission/Submissions";
import Assesment from "./pages/public/assesment/Assesment";

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
          <Route index element={<Dashboard />} />
          <Route path="classrooms" element={<Classrooms />} />
          <Route path="classrooms/:id" element={<Classroom />}>
            <Route index element={<ControlPanel />} />
            <Route path="members" element={<Members />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="assesments" element={<Assesment />} />
            <Route path="assignments/:assignmentId" element={<Assignment />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="submissions/:submissionId" element={<Submission />} />
            <Route path="materials/:materialId" element={<Material />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<header>Haloo</header>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
