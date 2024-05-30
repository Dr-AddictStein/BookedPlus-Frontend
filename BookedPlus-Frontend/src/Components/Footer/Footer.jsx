import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="text-center">
            <Link
                to={"https://instagram.com/booked_plus"}
                className="text-white hover:text-blue-600 transition duration-200"
            >Powered By Bookedplus</Link>
            <div className="signature-line"></div>
        </div>
    );
};

export default Footer;