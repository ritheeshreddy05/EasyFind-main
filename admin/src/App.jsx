import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Dashboard";
import ApproveItems from "./components/ManageItems";
import GiveToStudent from "./components/GiveToStudent";
import UploadItem from "./components/UploadItem";
// import EditDocuments from "./components/EditDocuments";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approve" element={<ApproveItems />} />
        <Route path="/admin/give" element={<GiveToStudent />} />
        <Route path="/admin/upload" element={<UploadItem />} />
        {/* <Route path="/admin/edit" element={<EditDocuments />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
