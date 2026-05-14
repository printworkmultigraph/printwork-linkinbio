/* ============================================
   PRINTWORK — Link-in-Bio Script
   Supabase Integration + Animations
   ============================================ */

(function () {
    'use strict';

    // ─── Supabase Configuration ───
    const SUPABASE_URL = 'https://fjlngiuspkyxqvuzeoyu.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbG5naXVzcGt5eHF2dXplb3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjAwMDQsImV4cCI6MjA4ODUzNjAwNH0.nE2ORrdkCus92mDcOMvXbzaRyluqci4SeNyW48t1qTE';

    let supabaseClient = null;

    // ─── Init Supabase with retry ───
    function initSupabase(retries = 3) {
        return new Promise((resolve, reject) => {
            function attempt(n) {
                if (window.supabase && window.supabase.createClient) {
                    try {
                        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        console.log('[Printwork] Supabase connected ✓');
                        resolve(supabaseClient);
                    } catch (err) {
                        console.error('[Printwork] Supabase init error:', err);
                        reject(err);
                    }
                } else if (n > 0) {
                    console.log('[Printwork] Waiting for Supabase CDN... retries left:', n);
                    setTimeout(() => attempt(n - 1), 2000);
                } else {
                    console.error('[Printwork] Supabase CDN failed to load');
                    reject(new Error('Supabase CDN not loaded'));
                }
            }
            attempt(retries);
        });
    }

    // ─── Counter Animation ───
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            let startTime = null;

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function update(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                const current = Math.round(easedProgress * target);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ─── Testimonial Carousel ───
    function initCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.querySelectorAll('.carousel-dot');
        if (!track || dots.length === 0) return;

        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let autoplayInterval = null;
        let touchStartX = 0;
        let touchEndX = 0;

        function goTo(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function next() {
            goTo((currentIndex + 1) % cards.length);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(next, 4000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Dot clicks
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.getAttribute('data-index'), 10));
                resetAutoplay();
            });
        });

        // Touch/swipe
        const carousel = document.getElementById('testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        goTo(Math.min(currentIndex + 1, cards.length - 1));
                    } else {
                        goTo(Math.max(currentIndex - 1, 0));
                    }
                    resetAutoplay();
                }
            }, { passive: true });
        }

        startAutoplay();
    }

    // ─── Click Tracking ───
    function initClickTracking() {
        const trackables = document.querySelectorAll('.link-card, .social-btn');
        trackables.forEach(el => {
            el.addEventListener('click', () => {
                const linkId = el.id;
                if (!linkId || !supabaseClient) return;
                try {
                    supabaseClient.from('click_events').insert({ link_id: linkId }).then(({ error }) => {
                        if (error) console.warn('[Printwork] Click track error:', error.message);
                        else console.log('[Printwork] Click tracked:', linkId);
                    });
                } catch (err) {
                    console.warn('[Printwork] Click tracking failed:', err);
                }
            });
        });
    }

    // ─── Secret Admin Access (5 rapid taps on avatar) ───
    function initSecretAccess() {
        const avatarTrigger = document.getElementById('avatar-trigger');
        if (!avatarTrigger) return;

        let tapCount = 0;
        let tapTimer = null;

        avatarTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            tapCount++;

            if (tapTimer) clearTimeout(tapTimer);

            if (tapCount >= 5) {
                tapCount = 0;
                const pwd = prompt('Enter Admin Password:');
                if (pwd === 'Rifan') {
                    sessionStorage.setItem('printwork_admin_auth', 'true');
                    window.location.href = '../dashboard/index.html';
                } else if (pwd !== null) {
                    alert('Incorrect password');
                }
                return;
            }

            tapTimer = setTimeout(() => {
                tapCount = 0;
            }, 1500);
        });
    }

    // ─── Inquiry Form ───
    function initInquiryForm() {
        const form = document.getElementById('inquiry-form');
        const successEl = document.getElementById('form-success');
        const submitBtn = document.getElementById('btn-submit-inquiry');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!supabaseClient) {
                alert('Connection error. Please refresh the page.');
                return;
            }

            const name = document.getElementById('custName').value.trim();
            const wa = document.getElementById('custWA').value.trim();
            const product = document.getElementById('custProduct').value;
            const honeypot = document.getElementById('botCheck')?.value;

            // Honeypot check for bots
            if (honeypot) {
                console.log('Bot detected, silently ignoring submission.');
                form.style.display = 'none';
                successEl.style.display = 'block';
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successEl.style.display = 'none';
                }, 5000);
                return;
            }

            if (!name || !wa || !product) {
                alert('Please fill all fields.');
                return;
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const { error } = await supabaseClient.from('orders').insert({
                    customer_name: name,
                    whatsapp_number: wa,
                    product_type: product,
                    status: 'pending'
                });

                if (error) throw error;

                // Show success
                form.style.display = 'none';
                successEl.style.display = 'block';

                // Reset form after 5s
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successEl.style.display = 'none';
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 5000);

            } catch (err) {
                console.error('[Printwork] Inquiry submit error:', err);
                alert('Failed to send inquiry. Please try again.');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // ─── Boot ───
    window.addEventListener('load', async () => {
        // Start animations immediately
        animateCounters();
        initCarousel();
        initSecretAccess();

        // Init Supabase (non-blocking for UI)
        try {
            await initSupabase();
            initClickTracking();
            initInquiryForm();
        } catch (err) {
            console.warn('[Printwork] Running without Supabase:', err.message);
            // Still init form with error handling
            initInquiryForm();
        }
    });

})();
