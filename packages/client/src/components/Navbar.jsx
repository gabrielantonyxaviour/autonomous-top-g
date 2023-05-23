import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import TateLogo from "../assets/tate.jpg";
export default function Navbar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const NavElement = ({ to, label, isSmall = false }) => {
    return (
      <li className=" px-5 text-lg font-semibold text-[#A9A9A9] hover:text-white">
        <Link
          className="select-none"
          to={to}
          onClick={() => {
            if (isSmall) setNav(!nav);
          }}
        >
          {label}
        </Link>
      </li>
    );
  };
  return (
    <div className="p-4 my-4 py-6 flex justify-center items-center max-w-[1400px] bg-gradient-to-r from-[#181818] via-black to-[#181818] mx-auto rounded-lg">
      <div className="flex ">
        <img
          src={TateLogo}
          width={35}
          height={35}
          className="select-none"
        ></img>
        <h1
          className=" pl-3 text-lg  md:text-2xl font-bold text-[#c79c2f] select-none hover:text-white cursor-pointer ease-in-out duration-500"
          // style={{ color: "#c79c2f", hover: "white" }}
        >
          <Link
            className="select-none   text-sm sm:text-base lg:text-xl "
            to="/"
          >
            TopGChess
          </Link>
        </h1>
      </div>

      <div className="block lg:hidden">
        {nav ? (
          <FontAwesomeIcon
            className="text-white"
            icon={faTimes}
            width={20}
            onClick={handleNav}
          />
        ) : (
          <FontAwesomeIcon
            className="text-white"
            width={20}
            icon={faBars}
            onClick={handleNav}
          />
        )}
      </div>
      <div
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "fixed left-[-100%] top-0 w-[60%] h-full ease-in-out duration-500"
        }
      >
        <h1
          className="w-full text-2xl font-bold text-[#DAA520] m-4 hover:text-white cursor-default ease-in-out duration-500"
          style={{ color: "#DAA520" }}
        >
          <Link
            className="select-none   text-sm sm:text-base lg:text-xl "
            to="/"
          >
            Super Offers
          </Link>
        </h1>

        <ul className="p-5 uppercase text-xs sm:text-base">
          <NavElement to="/" label="Home" isSmall={true} />
          <NavElement to="/create" label="Create" isSmall={true} />
          <NavElement to="/youroffers" label="Your offers" isSmall={true} />
          <NavElement
            to="/notifications"
            label="Notifications"
            isSmall={true}
          />
        </ul>
      </div>
    </div>
  );
}
