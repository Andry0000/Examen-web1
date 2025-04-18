document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});


const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});


const text = "Maîtriser la dactylographie";
const typingText = document.getElementById('typing-text');
let i = 0;
let isDeleting = false;
let speed = 100; 

function typeWriter() {
    if (i < text.length && !isDeleting) {
        typingText.innerHTML = text.substring(0, i+1);
        i++;
        setTimeout(typeWriter, speed);
    } else if (i > 0 && isDeleting) {
        typingText.innerHTML = text.substring(0, i-1);
        i--;
        setTimeout(typeWriter, speed/2);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            speed = 100 + Math.random() * 100; 
        } else {
            speed = 50; 
        }
        setTimeout(typeWriter, 500); 
    }
}


setTimeout(typeWriter, 1000);