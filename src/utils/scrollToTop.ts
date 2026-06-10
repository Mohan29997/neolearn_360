/** Smoothly scrolls the page back to the top. Call on route changes or after form submissions. */
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};