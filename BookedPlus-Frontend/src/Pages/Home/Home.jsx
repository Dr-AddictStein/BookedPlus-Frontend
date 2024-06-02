import { useEffect, useRef, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

// Ensure that RECAPTCHA_TOKEN is correctly imported
const reCaptchaToken = import.meta.env.VITE_RECAPTCHA_TOKEN;
console.log("🚀 ~ reCaptchaToken:", reCaptchaToken)

const Home = () => {
  const captchaRef = useRef(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    restaurantName: "",
    email: "",
    phoneNumber: "",
    captcha: "",
  });
  const [errors, setErrors] = useState({});
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  useEffect(() => {
    console.log("ReCAPTCHA sitekey:", reCaptchaToken);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^(\+?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    return re.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    let newErrors = {};

    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full Name is required";
      valid = false;
    }

    if (formData.restaurantName.trim() === "") {
      newErrors.restaurantName = "Restaurant Name is required";
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setShowCaptcha(true);
    }
  };

  const onReCAPTCHAChange = async (captchaValue) => {
    if (captchaValue) {
      setDisabled(false);

      const firstname = formData.fullName.split(' ')[0];
      const lastname = formData.fullName.split(' ')[1];
      const email = formData.email;
      const restaurant = formData.restaurantName;
      const phone = formData.phoneNumber;

      const data = {
        firstname,
        lastname,
        email,
        restaurant,
        phone,
        captcha: captchaValue,
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/api/user/",
          data
        );

        console.log("Form submitted successfully!", response.data);
        setShowThankYouMessage(true);
      } catch (error) {
        if (error.response.status === 409) {
          alert("Data already exists");
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="container mx-auto text-center py-24 px-4">
      <h2 className="text-3xl font-bold mb-4 fade-in-up md:text-5xl">
        Catering Reservations Simplified
      </h2>
      <p className="text-lg mb-8 fade-in-up">
        Join our waitlist now to get an automatic 3-month free trial at our
        launch, or a chance to win a 6-month trial!
      </p>
      {!showThankYouMessage ? (
        <div className="waitlist-box fade-in-up">
          <form id="waitlistForm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.fullName ? "invalid" : ""}`}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? "invalid" : ""}`}
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.phoneNumber ? "invalid" : ""}`}
            />
            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant / Catering Name"
              value={formData.restaurantName}
              onChange={handleChange}
              className={`w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.restaurantName ? "invalid" : ""}`}
            />

            {showCaptcha && (
              <ReCAPTCHA
                sitekey={reCaptchaToken}
                onChange={onReCAPTCHAChange}
              />
            )}

            <button
              type="submit"
              className={`w-full py-2 transition duration-200 ${showCaptcha && disabled ? "captcha-button" : ""}`}
            >
              Sign me up!
            </button>
          </form>
        </div>
      ) : (
        <div id="thankYouMessage" className="text-center">
          <div className="w-full">
            <img src="koala5.jpeg" alt="Koala" className="mx-auto rounded-none mb-4 w-1/3 h-1/3" />
          </div>
          <p className="text-lg">Woohoo! You're In! 🎉</p>
        </div>
      )}

      <div className="mt-8 fade-in-up">
        <Link
          to={"/blogs"}
          className="bg-transparent border border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-blue-700 transition duration-200"
        >
          Learn About Online Catering
        </Link>
      </div>
    </div>
  );
};

export default Home;
