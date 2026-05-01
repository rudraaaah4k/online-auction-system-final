import React, { useState, useEffect } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook, FaUserCircle } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaFileInvoiceDollar, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";


const NavLink = ({ to, icon, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <li>
      <motion.div whileHover={{ x: 3 }}>
        <Link
          to={to}
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "0.95rem",
            color: active ? "gold" : "white",
            textDecoration: "none",
          }}
        >
          <span>{icon}</span>
          {children}
        </Link>
      </motion.div>
    </li>
  );
};

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= 1024
  );

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const close = () => setShow(false);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Hamburger */}
      <button onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </button>

      {/* Sidebar */}
      <motion.div
        animate={{ x: isDesktop || show ? 0 : -320 }}
        style={{
          width: "250px",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          background: "#111",
          color: "white",
          padding: "20px",
        }}
      >
        <Link to="/" onClick={close}>
          <h2>PrimeBid</h2>
        </Link>

        {/* USER */}
        {isAuthenticated && user && (
          <div>
            <p>{user.userName}</p>
            <p>{user.role}</p>
          </div>
        )}

        <ul>
          <NavLink to="/auctions" icon={<RiAuctionFill />} onClick={close}>
            Auctions
          </NavLink>

          <NavLink to="/leaderboard" icon={<MdLeaderboard />} onClick={close}>
            Leaderboard
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/me" icon={<FaUserCircle />} onClick={close}>
              Profile
            </NavLink>
          )}
        </ul>

        {/* AUTH */}
        {!isAuthenticated ? (
          <>
            <Link to="/sign-up" onClick={close}>
              Sign Up
            </Link>
            <Link to="/login" onClick={close}>
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              dispatch(logoutUser()); // ✅ FIXED
              close();
            }}
          >
            Logout
          </button>
        )}
      </motion.div>
    </>
  );
};

export default SideDrawer;
