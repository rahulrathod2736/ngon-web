import { NavLink, useNavigate } from "react-router-dom";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-8">
        <div className="text-xs">
          <NavLink to="/privacy-policy" target="_blank">
            Privacy Policy
          </NavLink>
        </div>
        <div className="text-xs">Terms & Conditions</div>
      </div>
      <div className="flex gap-8 items-center">
        <NavLink
          to="https://www.instagram.com/ngon_dimension"
          target="_blank"
          className="!text-black"
        >
          <BsInstagram />
        </NavLink>
        <NavLink
          to="https://www.linkedin.com/company/ngon-dimensions-and-intelligence"
          target="_blank"
          className="!text-black"
        >
          <FaLinkedinIn />
        </NavLink>
        {/* <NavLink
          to="https://www.instagram.com/ngon_dimension"
          target="_blank"
          className="!text-black"
        >
          <BsTwitter />
        </NavLink> */}
      </div>
    </div>
  );
};
