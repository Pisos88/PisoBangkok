
document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // CARGAR DATOS DESDE JSON (CMS)
    // ============================================
    
    async function loadCMSData() {
        try {
            // Cargar configuración general
            const settingsRes = await fetch('_data/settings.json');
            const settings = await settingsRes.json();
            
            // Cargar contenido de la página
            const homeRes = await fetch('_data/home.json');
            const home = await homeRes.json();
            
            // Cargar SEO
            try {
                const seoRes = await fetch('_data/seo.json');
                const seo = await seoRes.json();
                applySEO(seo);
            } catch (e) {
                console.log('SEO data not loaded');
            }
            
            // Aplicar datos al HTML
            applySettings(settings);
            applyHomeContent(home);
            
        } catch (error) {
            console.log('CMS data not loaded, using default values:', error);
        }
    }
    
    // Aplicar meta tags SEO dinámicamente
    function applySEO(seo) {
        if (!seo) return;
        
        // Título
        if (seo.title) {
            document.title = seo.title;
            updateMetaTag('name', 'title', seo.title);
            updateMetaTag('property', 'og:title', seo.title);
            updateMetaTag('name', 'twitter:title', seo.title);
        }
        
        // Descripción
        if (seo.description) {
            updateMetaTag('name', 'description', seo.description);
            updateMetaTag('property', 'og:description', seo.description);
            updateMetaTag('name', 'twitter:description', seo.description);
        }
        
        // Keywords
        if (seo.keywords) {
            updateMetaTag('name', 'keywords', seo.keywords);
        }
        
        // URL
        if (seo.site_url) {
            updateMetaTag('property', 'og:url', seo.site_url);
            updateMetaTag('name', 'twitter:url', seo.site_url);
            
            // Actualizar canonical
            let canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                canonical.href = seo.site_url;
            }
        }
        
        // Imagen OG
        if (seo.og_image && seo.site_url) {
            const fullImageUrl = seo.site_url + seo.og_image;
            updateMetaTag('property', 'og:image', fullImageUrl);
            updateMetaTag('name', 'twitter:image', fullImageUrl);
        }
    }
    
    // Helper para actualizar meta tags
    function updateMetaTag(attr, name, content) {
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (meta) {
            meta.setAttribute('content', content);
        }
    }
    
    function applySettings(settings) {
        // Logo / Nombre del edificio
        const logo = document.getElementById('site-logo');
        if (logo && settings.nombre_edificio) {
            logo.textContent = settings.nombre_edificio;
        }
        
        // Email
        const emailBtn = document.getElementById('footer-email-btn');
        const emailLink = document.getElementById('footer-email-link');
        if (settings.email) {
            if (emailBtn) emailBtn.href = `mailto:${settings.email}`;
            if (emailLink) {
                emailLink.href = `mailto:${settings.email}`;
                emailLink.textContent = settings.email;
            }
        }
        
        // Teléfono (mostrar solo si está configurado)
        if (settings.telefono && settings.telefono.trim() !== '') {
            const phoneBtn = document.getElementById('footer-phone-btn');
            const phoneText = document.getElementById('footer-phone-text');
            
            if (phoneBtn) {
                phoneBtn.style.display = 'inline-flex';
                phoneBtn.href = `tel:${settings.telefono.replace(/\s/g, '')}`;
            }
            if (phoneText) {
                phoneText.style.display = 'block';
                phoneText.textContent = settings.telefono;
            }
        }
        
        // WhatsApp (mostrar solo si está configurado)
        if (settings.whatsapp && settings.whatsapp.trim() !== '') {
            const whatsappBtn = document.getElementById('footer-whatsapp-btn');
            
            // Limpiar el número para WhatsApp (solo números y +)
            const cleanNumber = settings.whatsapp.replace(/[^\d+]/g, '');
            
            if (whatsappBtn) {
                whatsappBtn.style.display = 'inline-flex';
                whatsappBtn.href = `https://wa.me/${cleanNumber.replace('+', '')}`;
            }
        }
        
        // Copyright
        const copyright = document.getElementById('footer-copyright');
        if (copyright && settings.year_copyright && settings.nombre_edificio) {
            copyright.innerHTML = `&copy; ${settings.year_copyright} ${settings.nombre_edificio} Residence. All rights reserved.`;
        }
    }
    
    function applyHomeContent(home) {
        // === HERO ===
        if (home.hero) {
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroTitulo = document.getElementById('hero-titulo');
            const heroDesc = document.getElementById('hero-descripcion');
            const heroPrecio = document.getElementById('hero-precio');
            const heroBoton = document.getElementById('hero-boton');
            
            if (heroSubtitle && home.hero.subtitulo) heroSubtitle.textContent = home.hero.subtitulo;
            if (heroTitulo && home.hero.titulo) heroTitulo.textContent = home.hero.titulo;
            if (heroDesc && home.hero.descripcion) heroDesc.textContent = home.hero.descripcion;
            if (heroPrecio && home.hero.precio) heroPrecio.textContent = home.hero.precio;
            if (heroBoton && home.hero.boton_texto) heroBoton.textContent = home.hero.boton_texto;
        }
        
        // === CARACTERÍSTICAS (TARJETAS) ===
        if (home.caracteristicas && home.caracteristicas.length > 0) {
            const detailsContainer = document.getElementById('details-container');
            if (detailsContainer) {
                detailsContainer.innerHTML = ''; // Limpiar
                
                home.caracteristicas.forEach(card => {
                    const div = document.createElement('div');
                    div.className = 'detail-card';
                    div.innerHTML = `
                        <i data-lucide="${card.icono}"></i>
                        <h3>${card.titulo}</h3>
                        <p>${card.descripcion}</p>
                    `;
                    detailsContainer.appendChild(div);
                });
                
                // Recrear iconos de Lucide
                lucide.createIcons();
            }
        }
        
        // === VIDEOS ===
        if (home.videos) {
            const videoSeccion = document.getElementById('video-titulo-seccion');
            const video1Titulo = document.getElementById('video1-titulo');
            const video2Titulo = document.getElementById('video2-titulo');
            
            if (videoSeccion && home.videos.titulo_seccion) videoSeccion.textContent = home.videos.titulo_seccion;
            if (video1Titulo && home.videos.video1_titulo) video1Titulo.textContent = home.videos.video1_titulo;
            if (video2Titulo && home.videos.video2_titulo) video2Titulo.textContent = home.videos.video2_titulo;
        }
        
        // === UBICACIÓN ===
        if (home.ubicacion) {
            const ubicacionTitulo = document.getElementById('ubicacion-titulo');
            const ubicacionDesc = document.getElementById('ubicacion-descripcion');
            const mapsLink = document.getElementById('ubicacion-maps-link');
            
            if (ubicacionTitulo && home.ubicacion.titulo) ubicacionTitulo.textContent = home.ubicacion.titulo;
            if (ubicacionDesc && home.ubicacion.descripcion) ubicacionDesc.textContent = home.ubicacion.descripcion;
            if (mapsLink && home.ubicacion.google_maps_link) {
                mapsLink.href = home.ubicacion.google_maps_link;
            }
        }
        
        // === FOOTER ===
        if (home.footer) {
            const footerTitulo = document.getElementById('footer-titulo');
            const footerDesc = document.getElementById('footer-descripcion');
            const footerEmailBtn = document.getElementById('footer-email-btn');
            
            if (footerTitulo && home.footer.titulo) footerTitulo.textContent = home.footer.titulo;
            if (footerDesc && home.footer.descripcion) footerDesc.textContent = home.footer.descripcion;
            if (footerEmailBtn && home.footer.boton_email) footerEmailBtn.textContent = home.footer.boton_email;
        }
    }
    
    // Cargar datos del CMS
    loadCMSData();
    
    // ============================================
    // GALERÍA DE IMÁGENES (carga desde JSON o usa defaults)
    // ============================================
    
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Función para crear la galería
    function createGallery(photos) {
        galleryGrid.innerHTML = ''; // Limpiar galería existente
        
        photos.forEach((photo, index) => {
            const src = photo.imagen || photo;
            const alt = photo.alt || `Vista del apartamento ${index + 1}`;

            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = src;
            img.alt = alt;
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
                captionText.innerHTML = alt;
                document.body.style.overflow = 'hidden';
            });
        });

        // Refresh icons
        lucide.createIcons();
    }

    // Función para cargar videos desde JSON
    function loadVideos(gallery) {
        if (gallery.video1) {
            const video1 = document.querySelector('#video-tour .video-card:first-child video');
            if (video1) {
                video1.poster = gallery.video1.poster;
                video1.querySelector('source').src = gallery.video1.src;
                video1.load();
            }
        }
        if (gallery.video2) {
            const video2 = document.querySelector('#video-tour .video-card:last-child video');
            if (video2) {
                video2.poster = gallery.video2.poster;
                video2.querySelector('source').src = gallery.video2.src;
                video2.load();
            }
        }
    }

    // Cargar galería desde JSON o usar imágenes por defecto
    async function loadGallery() {
        try {
            const res = await fetch('_data/gallery.json');
            const gallery = await res.json();
            
            if (gallery.fotos && gallery.fotos.length > 0) {
                createGallery(gallery.fotos);
            } else {
                loadDefaultGallery();
            }
            
            // Cargar videos
            loadVideos(gallery);
            
        } catch (error) {
            console.log('Gallery JSON not found, using defaults');
            loadDefaultGallery();
        }
    }

    // Galería por defecto (fallback)
    function loadDefaultGallery() {
        const imageFolder = 'Photos Lumpiny 24';
        const defaultImages = [
            "1758093887917.jpg",
            "1758093893228.jpg",
            "1758093899605.jpg",
            "1758093904034.jpg",
            "1758093908709.jpg",
            "1758093920350.jpg",
            "1758093927362.jpg",
            "1758093928577.jpg",
            "1758093936938.jpg"
        ];
        
        const photos = defaultImages.map((img, i) => ({
            imagen: `${imageFolder}/${img}`,
            alt: `Vista del apartamento ${i + 1}`
        }));
        
        createGallery(photos);
    }

    // Cargar la galería
    loadGallery();

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
