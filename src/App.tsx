import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./components/Landing";
import ExhibitionDetails from "./pages/ExhibitionDetails";
import Exhibition from "./pages/Exhibition";
import ExhibitionFront from "./pages/ExhibitionFront";
import ExhibitionHolder from "./pages/ExhibitionHolder";
import Guestbook from "./pages/Guestbook";
import CreateExhibition from "./pages/CreateExhibition";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Main />}>
          <Route path="/" element={<Landing />} />
          <Route path="/exhibition/create" element={<CreateExhibition />} />
          <Route
            path="/exhibition/:exhibitionId/details"
            element={<ExhibitionDetails />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ExhibitionHolder />}>
          <Route path="/exhibition/:exhibitionId" element={<Exhibition />} />
          <Route
            path="/exhibition/:exhibitionId/front"
            element={<ExhibitionFront />}
          />
          <Route
            path="/exhibition/:exhibitionId/:paintingIndex"
            element={<Exhibition />}
          />
          <Route
            path="/exhibition/:exhibitionId/guestbook"
            element={<Guestbook />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
