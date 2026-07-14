document.addEventListener('DOMContentLoaded', () => {
    
    // ═══════════════════════════════════════════════════════
    // 1. Navigation Progress & Active State Tracking
    // ═══════════════════════════════════════════════════════
    const progressBar = document.getElementById('progress-bar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = Array.from(navLinks).map(link => {
        const targetId = link.getAttribute('href').substring(1);
        return document.getElementById(targetId);
    });

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if(progressBar) progressBar.style.width = scrolled + '%';

        let currentId = '';
        sections.forEach(section => {
            if (section) {
                const sectionTop = section.offsetTop;
                if (winScroll >= (sectionTop - 250)) {
                    currentId = section.getAttribute('id');
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentId) {
                link.classList.add('active');
            }
        });
    });

    // ═══════════════════════════════════════════════════════
    // 2. Count-up Animation Observer
    // ═══════════════════════════════════════════════════════
    const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                // Determine speed based on target so all finish roughly same time
                const speed = Math.max(10, Math.floor(1500 / target)); 
                
                const updateCount = () => {
                    if (count < target) {
                        count++;
                        entry.target.innerText = count;
                        setTimeout(updateCount, speed);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

    // ═══════════════════════════════════════════════════════
    // 3. Validation Bars Animation Observer
    // ═══════════════════════════════════════════════════════
    const barObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scoreFills = entry.target.querySelectorAll('.score-fill');
                scoreFills.forEach(fill => {
                    const score = fill.parentElement.getAttribute('data-score');
                    fill.style.width = score + '%';
                });
                
                const categoryFills = entry.target.querySelectorAll('.category-fill');
                categoryFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width + '%';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const evaluationSection = document.getElementById('evaluation');
    if (evaluationSection) barObserver.observe(evaluationSection);

    // ═══════════════════════════════════════════════════════
    // 4. IntersectionObserver for Scroll Reveals
    // ═══════════════════════════════════════════════════════
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal, .slide-in-left, .slide-in-right');
    revealElements.forEach((el, index) => {
        if (el.classList.contains('framework-card') || el.classList.contains('problem-card') || 
            el.classList.contains('unit-card') || el.classList.contains('timeline-phase') ||
            el.classList.contains('validator-card')) {
            // Add a staggered delay for grid items
            el.style.transitionDelay = `${(index % 4) * 100}ms`;
        }
        scrollObserver.observe(el);
    });

    const cards = document.querySelectorAll('.chapter-row');
    cards.forEach((card, index) => {
        if (!card.classList.contains('scroll-reveal')) {
            card.classList.add('scroll-reveal');
            card.style.transitionDelay = `${(index % 4) * 80}ms`;
            scrollObserver.observe(card);
        }
    });

    // ═══════════════════════════════════════════════════════
    // 5. Research Questions Scroll Logic
    // ═══════════════════════════════════════════════════════
    const rqSection = document.querySelector('.research-questions');
    const rqContent = document.querySelector('.rq-content');
    
    window.addEventListener('scroll', () => {
        if (rqSection && rqContent) {
            const rect = rqSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            const scrollableArea = sectionHeight - windowHeight;
            let progress = 0;
            
            if (sectionTop <= 0) {
                progress = Math.abs(sectionTop) / scrollableArea;
                rqContent.classList.add('active');
            } else {
                rqContent.classList.remove('active');
            }
            
            progress = Math.max(0, Math.min(1, progress));
            
            rqContent.classList.remove('step-1', 'step-2', 'step-3');
            if (progress > 0.1) rqContent.classList.add('step-1');
            if (progress > 0.4) rqContent.classList.add('step-2');
            if (progress > 0.7) rqContent.classList.add('step-3');
        }
    });

    // ═══════════════════════════════════════════════════════
    // 6. V1 Visual Integrations
    // ═══════════════════════════════════════════════════════
    
    // 6A. Populate Masonry Grid (Illustrations)
    const masonryGrid = document.getElementById('masonry-grid');
    const illustrationImages = [
        '8', '9', '15', '21', '28', '35', '36', '41', 
        '47', '54', '62', '63', '70', '77', '84', 
        '93', '100', '108', '115'
    ];
    
    if (masonryGrid) {
        const colCount = window.innerWidth > 900 ? 4 : 2;
        const colImages = Array.from({length: colCount}, () => []);
        
        // Distribute images
        illustrationImages.forEach((imgId, index) => {
            colImages[index % colCount].push(`assets/illus-${imgId}.jpg`);
        });

        colImages.forEach((images, i) => {
            const col = document.createElement('div');
            col.className = `masonry-track track-${i % 2 === 0 ? 'up' : 'down'}`;
            
            const allImages = [...images, ...images];
            allImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'masonry-img';
                img.alt = `Illustration`;
                col.appendChild(img);
            });
            
            masonryGrid.appendChild(col);
        });
    }

    // 6B. Chapter Hover Reveals
    const chapterRows = document.querySelectorAll('.chapter-row');
    const previewImg = document.getElementById('chapter-preview-img');

    chapterRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const newSrc = row.getAttribute('data-image');
            if (previewImg && previewImg.src && !previewImg.src.endsWith(newSrc)) {
                previewImg.style.opacity = '0';
                previewImg.style.transform = 'scale(0.97)';
                
                setTimeout(() => {
                    previewImg.src = newSrc;
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // 6C. iPad Sticky Sequence logic
    const ipadSection = document.querySelector('.ipad-section');
    const ipadImages = document.querySelectorAll('.ipad-image');
    const ipadCaption = document.getElementById('ipad-caption');
    const ipadCaptionDetail = document.getElementById('ipad-caption-detail');
    
    const captions = [
        {
            title: "Vocabulary activities with bilingual support",
            detail: "Schema activation (Hedcock & Ferris, 2018) and background knowledge (Grabe, 2009). Transfers existing knowledge to the second language (Cummins, 2008) and clarifies key vocabulary (Patonah & Irawan, 2022)."
        },
        {
            title: "Reading texts adapted to EasyEnglish format",
            detail: "Approximately 300 words, appropriate for A1–A2 learners. Sufficient for intensive reading, supports grammar and vocabulary awareness (Hedcock & Ferris, 2018). Bolded past-tense verbs as input enhancement (Sharwood Smith, 1993) to draw attention to grammar forms."
        },
        {
            title: "Reading comprehension...",
            detail: "Checks literal comprehension, reinforces key story events, and confirms understanding before language instruction. Guides learners to comprehend the main topics (Hedcock & Ferris, 2018; Nation & Macalister, 2021)."
        },
        {
            title: "...with grammar activities",
            detail: "Develops language skills through integrating grammatical accuracy (Canale & Swain, 1980, in Brandl, 2021). CLT involves grammar within meaningful communication (Brandl, 2021). Learners create their own sentences instead of copying examples."
        },
        {
            title: "Engaging speaking and oral task activities",
            detail: "Communicative tasks (Brandl, 2021) where learners collaborate, negotiate ideas, sequence events, and produce an authentic product as a task outcome (Ellis, 2023)."
        },
        {
            title: "Faith reflections featuring EasyEnglish Bible verses",
            detail: "EasyEnglish Bible verses with simple vocabulary and sentence structure. Interpretive to personal application, moving learners from understanding Scripture to interpreting meaning for personal reflection."
        }
    ];
    
    window.addEventListener('scroll', () => {
        if (ipadSection && ipadImages.length > 0) {
            const rect = ipadSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            const scrollableArea = sectionHeight - windowHeight;
            let progress = 0;
            
            if (sectionTop <= 0) {
                progress = Math.abs(sectionTop) / scrollableArea;
            }
            
            progress = Math.max(0, Math.min(1, progress));
            
            let index = Math.floor(progress * ipadImages.length);
            index = Math.min(index, ipadImages.length - 1);

            ipadImages.forEach((img, i) => {
                if (i === index) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });

            if (ipadCaption && captions[index]) {
                if (ipadCaption.innerText !== captions[index].title) {
                    ipadCaption.style.opacity = 0;
                    if (ipadCaptionDetail) ipadCaptionDetail.style.opacity = 0;
                    setTimeout(() => {
                        ipadCaption.innerText = captions[index].title;
                        if (ipadCaptionDetail) ipadCaptionDetail.innerText = captions[index].detail;
                        ipadCaption.style.opacity = 1;
                        if (ipadCaptionDetail) ipadCaptionDetail.style.opacity = 1;
                    }, 150);
                }
            }
        }
    });
    // ═══════════════════════════════════════════════════════
    // 7. 3D Book Hover Effect
    // ═══════════════════════════════════════════════════════
    const book3dElements = document.querySelectorAll('.book-3d');
    
    book3dElements.forEach(book => {
        const wrapper = book.parentElement;
        
        wrapper.addEventListener('mousemove', (e) => {
            book.style.animation = 'none';
            book.style.transition = 'transform 0.1s ease-out';
            
            const rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            // Invert the axes: mouse right tilts book right, mouse down tilts book down
            const rotateX = y * -15; 
            const rotateY = x * 25;  
            
            // Add base transforms (-15deg Y, 5deg X) to keep it generally facing the right way
            book.style.transform = `rotateX(${rotateX + 5}deg) rotateY(${rotateY - 15}deg)`;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            book.style.transition = 'transform 0.5s ease';
            book.style.transform = 'rotateY(-15deg) rotateX(5deg)';
            
            setTimeout(() => {
                book.style.animation = 'floatBook 6s ease-in-out infinite';
            }, 500);
        });
    });

    // ═══════════════════════════════════════════════════════
    // 8. Scroll Highlight Text Animation
    // ═══════════════════════════════════════════════════════
    const highlightText = document.getElementById('highlight-text');
    if (highlightText) {
        window.addEventListener('scroll', () => {
            const rect = highlightText.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            let progress = 0;
            
            // Start filling when it's 85% down the screen, finish when it's 50% down
            if (rect.top < windowHeight && rect.bottom > 0) {
                const start = windowHeight * 0.85;
                const end = windowHeight * 0.5;
                progress = (start - rect.top) / (start - end);
                progress = Math.max(0, Math.min(1, progress));
            }
            
            const progress1 = Math.min(1, progress * 2);
            const progress2 = Math.max(0, (progress - 0.5) * 2);
            
            const line1 = highlightText.querySelector('.line-1');
            const line2 = highlightText.querySelector('.line-2');
            if(line1) line1.style.setProperty('--scroll-progress', `${progress1 * 100}%`);
            if(line2) line2.style.setProperty('--scroll-progress', `${progress2 * 100}%`);
        });
    }
});
