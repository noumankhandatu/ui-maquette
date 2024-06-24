import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import { LoggedIn } from "./guards/LoggedIn";
import { Authorized } from "./guards/Authorized";
import { Authenticate } from "./guards/Authenticate";
// import { useSelector } from "react-redux";

import Cards from "./pages/Cards";
import SignIn from "./pages/SignIn";
import AdminSignIn from "./pages/AdmnSignIn";
// import CreateCard from "./pages/CreateCard";
import CardView from "./pages/CardView";
import CreateCardNew from "./pages/CreateCardNew";
import SubAccountCreate from "./pages/SubAccountCreate";
import SubAccounts from "./pages/SubAccounts";
import MyContact from "./pages/MyContact";
import HandleVCFQR from "./pages/handleVcfQR";

export default function Router() {
  // const user = useSelector((state) => state);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/sign-in" element={<LoggedIn />}>
          <Route index element={<AdminSignIn />} />
        </Route>
        <Route path="/sign-in" element={<LoggedIn />}>
          <Route index element={<SignIn />} />
        </Route>

        <Route path="/log-out" element={<Authenticate />} />

        <Route path="/cards/view" element={<CardView />} />
        <Route path="/Mes-contacts" element={<MyContact />} />
        <Route path="/vcf-qr" element={<HandleVCFQR/>}/>

        <Route path="/dashboard" element={<Authorized />}>
          <Route path="cards">
            <Route index element={<Cards />} />
            <Route path="new/:id" element={<CreateCardNew />} />
            <Route path="new" element={<CreateCardNew />} />
          </Route>
          <Route path="subaccounts">
            <Route index element={<SubAccounts />} />
            <Route path="create" element={<SubAccountCreate />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard/cards" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard/cards" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
