
document.addEventListener('DOMContentLoaded', () => {
    // Gallery Image List (Updated after deletions)
    const imageFolder = 'Photos Lumpiny 24';
    const images = [
        "1758093887917.jpg",
        "1758093893228.jpg",
        "1758093897991.jpg",
        "1758093899605.jpg",
        "1758093904034.jpg",
        "1758093908709.jpg",
        "1758093918349.jpg",
        "1758093920350.jpg",
        "1758093927362.jpg",
        "1758093928577.jpg",
        "1758093930464.jpg",
        "1758093936938.jpg"
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Populate Gallery
    images.forEach((imgName, index) => {
        const src = `${imageFolder}/${imgName}`;

        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `Lumpini Residence View ${index + 1}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';

        // Add zoom icon
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'zoom-in');
        overlay.appendChild(icon);

        item.appendChild(img);
        item.appendChild(overlay);
        galleryGrid.appendChild(item);

        // Lightbox Click Event
        item.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = src;
            captionText.innerHTML = `Lumpini Residence View ${index + 1}`;
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    // Refresh icons
    lucide.createIcons();

    // Close Lightbox
    closeBtn.onclick = function () {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto'; // Enable scroll
    }

    // Close on outside click
    lightbox.onclick = function (event) {
        if (event.target === lightbox) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    // Close on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in effect
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});
