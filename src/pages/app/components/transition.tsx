import {useRouter} from "next/router";
import {AnimatePresence, motion} from "framer-motion";

const variants = {
    inactive: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.1,
            ease: 'easeInOut'
        },
    },
    out: {
        opacity: 0,
        y: -100,
        transition: {
            duration: 0.1,
            ease: 'easeInOut'
        }
    },
    in: {
        y: 100,
        opacity: 0,
        transition: {
            duration: 0.1,
            ease: 'easeInOut'
        }
    },
};


const Transition = ({ children } : any) => {
    const { asPath } = useRouter();

    return (
        <div className="effect-2">
            <AnimatePresence initial={false} mode='wait'>
                <motion.div
                    key={asPath}
                    variants={variants}
                    initial="in"
                    animate="inactive"
                    exit="out"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Transition;