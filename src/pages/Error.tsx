import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";

function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
    return (
        <motion.div
            className="absolute rounded-full bg-green-700/10"
            style={{ width: size, height: size, left: `${x}%` }}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{
                y: "-10vh",
                opacity: [0, 0.6, 0],
                x: [0, Math.sin(x) * 30, 0],
            }}
            transition={{
                duration: 8 + Math.random() * 6,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

function BookIllustration() {
    return (
        <motion.svg
            viewBox="0 0 200 240"
            className="w-48 h-56 md:w-56 md:h-64"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Shadow under book */}
            <motion.ellipse
                cx="100" cy="228" rx="70" ry="8"
                fill="#15803d" opacity="0.1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            />

            {/* Back cover */}
            <motion.rect
                x="45" y="20" width="110" height="190" rx="3"
                fill="#15803d"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 0 }}
            />

            {/* Pages (side view stack) */}
            <rect x="48" y="24" width="104" height="182" rx="2" fill="#fef3c7" />
            <line x1="52" y1="50" x2="140" y2="50" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />
            <line x1="52" y1="65" x2="130" y2="65" stroke="#d4a574" strokeWidth="0.5" opacity="0.3" />
            <line x1="52" y1="80" x2="136" y2="80" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />
            <line x1="52" y1="95" x2="120" y2="95" stroke="#d4a574" strokeWidth="0.5" opacity="0.3" />
            <line x1="52" y1="125" x2="140" y2="125" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />
            <line x1="52" y1="140" x2="125" y2="140" stroke="#d4a574" strokeWidth="0.5" opacity="0.3" />
            <line x1="52" y1="155" x2="138" y2="155" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />

            {/* "404" on the page */}
            <motion.text
                x="100" y="115"
                textAnchor="middle"
                fontSize="32"
                fontWeight="bold"
                fill="#15803d"
                opacity="0.15"
                fontFamily="Georgia, serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ delay: 1, duration: 1 }}
            >
                404
            </motion.text>

            {/* Front cover */}
            <motion.g
                style={{ transformOrigin: "45px 115px" }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -35 }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
                <rect x="40" y="18" width="112" height="194" rx="3" fill="#166534" />
                <rect x="40" y="18" width="112" height="194" rx="3" fill="url(#bookGrain)" opacity="0.3" />

                {/* Cover decoration - border */}
                <rect
                    x="50" y="28" width="92" height="174" rx="2"
                    fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5"
                />
                <rect
                    x="54" y="32" width="84" height="166" rx="1"
                    fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3"
                />

                {/* Cover title area */}
                <rect x="60" y="55" width="72" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
                <rect x="70" y="62" width="52" height="1.5" rx="1" fill="#fbbf24" opacity="0.4" />

                {/* Book icon on cover */}
                <g transform="translate(78, 85)" opacity="0.5">
                    <path d="M0 30 L0 5 Q0 0 5 0 L18 0 L18 25 Q18 30 13 30 Z" fill="#fbbf24" />
                    <path d="M36 30 L36 5 Q36 0 31 0 L18 0 L18 25 Q18 30 23 30 Z" fill="#fbbf24" />
                    <line x1="18" y1="2" x2="18" y2="28" stroke="#166534" strokeWidth="1" />
                </g>

                {/* Author line */}
                <rect x="68" y="145" width="56" height="1.5" rx="1" fill="#fbbf24" opacity="0.4" />

                {/* Spine highlight */}
                <rect x="40" y="18" width="6" height="194" rx="1" fill="#0f5127" opacity="0.3" />
            </motion.g>

            {/* Floating question mark */}
            <motion.text
                x="155" y="40"
                fontSize="24"
                fill="#15803d"
                opacity="0.4"
                fontFamily="Georgia, serif"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 30, opacity: 0.4 }}
                transition={{
                    delay: 1.5,
                    duration: 0.8,
                    y: { repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }
                }}
            >
                ?
            </motion.text>

            {/* Grain pattern */}
            <defs>
                <filter id="bookGrain">
                    <feTurbulence baseFrequency="0.9" numOctaves="4" type="fractalNoise" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </defs>
        </motion.svg>
    );
}

export default function Error() {
    const navigate = useNavigate();
    const error = useRouteError();

    const is404 = isRouteErrorResponse(error) && error.status === 404;
    const title = is404 ? "Page Not Found" : "Something Went Wrong";
    const message = is404
        ? "This page seems to have wandered off the shelf. Perhaps it was returned to the wrong section?"
        : "We hit an unexpected chapter. Let's get you back to familiar shelves.";

    const particles = Array.from({ length: 8 }, (_, i) => ({
        delay: i * 1.2,
        x: 10 + (i * 11),
        size: 4 + Math.random() * 8,
    }));

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-green-50/80 via-white to-amber-50/40 px-4">
            {/* Background texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #166534 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Floating particles */}
            {particles.map((p, i) => (
                <FloatingParticle key={i} {...p} />
            ))}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
                <BookIllustration />

                <motion.div
                    className="mt-8 space-y-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1
                        className="text-4xl md:text-5xl font-bold text-green-900 tracking-tight"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        {title}
                    </h1>

                    <p className="text-base md:text-lg text-green-800/70 leading-relaxed max-w-md mx-auto">
                        {message}
                    </p>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-3 mt-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-base font-semibold shadow-lg shadow-green-700/20 transition-all hover:shadow-xl hover:shadow-green-700/30 hover:-translate-y-0.5"
                    >
                        Back to Home
                    </Button>
                    <Button
                        onClick={() => navigate("/book/search")}
                        variant="outline"
                        className="border-green-700/30 text-green-800 hover:bg-green-50 px-8 py-3 text-base font-semibold transition-all hover:-translate-y-0.5"
                    >
                        Search Books
                    </Button>
                </motion.div>

                <motion.p
                    className="mt-12 text-sm text-green-700/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
                >
                    "Not all who wander are lost — but this page might be."
                </motion.p>
            </div>
        </div>
    );
}
