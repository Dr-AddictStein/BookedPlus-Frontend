import { useState, useEffect } from "react";

const ScrollToTop = () => {
    const [btnVisibility, setBtnVisibility] = useState('hidden');
    const [strokeOffset, setStrokeOffset] = useState(100);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolledPercentage = (scrolled / totalHeight) * 100;

            if (scrolled > 20) {
                setBtnVisibility('block');
            } else {
                setBtnVisibility('hidden');
            }

            setStrokeOffset(100 - scrolledPercentage);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`${btnVisibility} fixed cursor-pointer z-50 text-white right-10 bottom-10 p-2 rounded-full`}
            title="Go to top"
            onClick={handleScrollToTop}
        >
            <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={strokeOffset}
                    style={{ transition: 'stroke-dashoffset 0.25s ease' }}
                />
                <path
                    d="M12 8L12 16"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 12L12 8L16 12"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default ScrollToTop;
