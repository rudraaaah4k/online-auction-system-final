import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SubmitCommission from "./pages/SubmitCommission";
import { useDispatch } from "react-redux";
import { fetchLeaderboard, fetchUser } from "./store/slices/userSlice";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import Leaderboard from "./pages/Leaderboard";
import Auctions from "./pages/Auctions";
import AuctionItem from "./pages/AuctionItem";
import CreateAuction from "./pages/CreateAuction";
import ViewMyAuctions from "./pages/ViewMyAuctions";
import ViewAuctionDetails from "./pages/ViewAuctionDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./custom-components/AnimatedPage";

const RouteContainer = ({ children }) => <AnimatedPage>{children}</AnimatedPage>;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    // Route-level page transitions without touching business logic/state.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RouteContainer><Home /></RouteContainer>} />
        <Route path="/sign-up" element={<RouteContainer><SignUp /></RouteContainer>} />
        <Route path="/login" element={<RouteContainer><Login /></RouteContainer>} />
        <Route path="/submit-commission" element={<RouteContainer><SubmitCommission /></RouteContainer>} />
        <Route path="/how-it-works-info" element={<RouteContainer><HowItWorks /></RouteContainer>} />
        <Route path="/about" element={<RouteContainer><About /></RouteContainer>} />
        <Route path="/leaderboard" element={<RouteContainer><Leaderboard /></RouteContainer>} />
        <Route path="/auctions" element={<RouteContainer><Auctions /></RouteContainer>} />
        <Route path="/auction/item/:id" element={<RouteContainer><AuctionItem /></RouteContainer>} />
        <Route path="/create-auction" element={<RouteContainer><CreateAuction /></RouteContainer>} />
        <Route path="/view-my-auctions" element={<RouteContainer><ViewMyAuctions /></RouteContainer>} />
        <Route path="/auction/details/:id" element={<RouteContainer><ViewAuctionDetails /></RouteContainer>} />
        <Route path="/dashboard" element={<RouteContainer><Dashboard /></RouteContainer>} />
        <Route path="/contact" element={<RouteContainer><Contact /></RouteContainer>} />
        <Route path="/me" element={<RouteContainer><UserProfile /></RouteContainer>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, []);
  return (
    <Router>
      <SideDrawer />
      <AnimatedRoutes />
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
