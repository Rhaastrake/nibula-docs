export function initBurgerMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const navLinks = document.getElementById('nav-links');

    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burgerBtn.classList.toggle('active');
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                navLinks.classList.remove('open');
                burgerBtn.classList.remove('active');
            }
        });
    }
}