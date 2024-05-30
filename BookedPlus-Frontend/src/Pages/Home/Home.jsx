import { useEffect, useRef, useState } from 'react';
import './Home.css'
import { Link } from 'react-router-dom';
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

const Home = () => {
    const captchaRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        loadCaptchaEnginge(6);
    }, [])

    const handleValidateCaptcha = () => {
        const userCaptchaValue = captchaRef.current.value;
        // console.log(userCaptchaValue)
        if(validateCaptcha(userCaptchaValue)) {
            setDisabled(false)
        }
        else if(!validateCaptcha(userCaptchaValue)){
            setDisabled(true);
        }
    }
    return (
        <div className="container mx-auto text-center py-24 px-4">
            <h2 className="text-3xl font-bold mb-4 fade-in-up md:text-5xl">
                Catering Reservations Simplified
            </h2>
            <p className="text-lg mb-8 fade-in-up">
                Join our waitlist now to get an automatic 3-month free trial at our
                launch, or a chance to win a 6-month trial!
            </p>
            <div className="waitlist-box fade-in-up">
                <form>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className='text-left'>
                        <LoadCanvasTemplate />
                        <input ref={captchaRef} onBlur={handleValidateCaptcha} type="text" name='captcha' placeholder='Type the above captcha' className="w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <button disabled={disabled} type="submit" className={`w-full py-2 transition duration-200 ${disabled ? 'captcha-button' : ''}`}>
                        Sign me up!
                    </button>
                </form>
            </div>
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