document.addEventListener('DOMContentLoaded', () => {
    // Переносим модалку в корень body, чтобы она всегда открывалась строго по центру экрана
    const modalRoot = document.getElementById('photo-modal');
    if (modalRoot) {
        document.body.appendChild(modalRoot);
    }

    const tabButtons = document.querySelectorAll('.main__menu-item');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    const photoItems = Array.from(document.querySelectorAll('.gallery__item'));
    const photoModal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalDesc = document.getElementById('modal-desc');
    const closePhotoBtn = document.getElementById('close-photo-btn');
    
    const prevPhotoBtn = document.getElementById('prev-photo-btn');
    const nextPhotoBtn = document.getElementById('next-photo-btn');
    
    let currentPhotoIndex = 0;

    function updateModalContent(index) {
        const item = photoItems[index];
        if (!item) return;

        const imgTarget = item.querySelector('img');
        const captionTarget = item.querySelector('.gallery__caption');
        const longDescription = item.getAttribute('data-description');

        if (modalImg) {
            modalImg.src = imgTarget.src; 
            modalCaption.innerText = captionTarget ? captionTarget.innerText : ''; 
            modalDesc.innerText = longDescription ? longDescription : ''; 
        }
    }

    // Наполняем обратную сторону карточек и настраиваем 3D-переворот
    photoItems.forEach((item, index) => {
        const captionTarget = item.querySelector('.gallery__caption');
        const longDescription = item.getAttribute('data-description');
        const backTitle = item.querySelector('.gallery__back-title');
        const backText = item.querySelector('.gallery__back-text');
        const zoomBtn = item.querySelector('.zoom-btn');

        // Автоматически берем заголовок и описание из самой карточки
        if (backTitle && captionTarget) {
            backTitle.innerText = captionTarget.innerText;
        }
        if (backText && longDescription) {
            backText.innerText = longDescription;
        }

        // Переворот карточки по клику
        item.addEventListener('click', () => {
            item.classList.toggle('flipped');
        });

        // Открытие модального окна по клику на кнопку "Открыть фото 🔍"
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Чтобы карточка не переворачивалась обратно при нажатии на кнопку
                currentPhotoIndex = index;
                updateModalContent(currentPhotoIndex);
                if (photoModal) {
                    photoModal.classList.add('active');
                }
            });
        }
    });

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photoItems.length) % photoItems.length;
        updateModalContent(currentPhotoIndex);
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoItems.length;
        updateModalContent(currentPhotoIndex);
    }

    if (prevPhotoBtn) {
        prevPhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevPhoto();
        });
    }

    if (nextPhotoBtn) {
        nextPhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextPhoto();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (photoModal && photoModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevPhoto();
            } else if (e.key === 'ArrowRight') {
                showNextPhoto();
            } else if (e.key === 'Escape') {
                photoModal.classList.remove('active');
            }
        }
    });

    if (closePhotoBtn && photoModal) {
        closePhotoBtn.addEventListener('click', () => {
            photoModal.classList.remove('active');
        });
        
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                photoModal.classList.remove('active');
            }
        });
    }

    // --- нажми, если скучаешь ---
    const missBtn = document.getElementById('miss-btn');
    const missPhraseEl = document.getElementById('miss-phrase');

    const missPhrases = [
        "я всегда рядом, даже если мы не пишем друг другу прямо сейчас 🖤",
        "помнишь наши прогулки на краю города? это были одни из лучших дней 🖤",
        "ты самая красивая и особенная, никогда в этом не сомневайся 🖤",
        "спасибо тебе за все наши моменты — и за милые, и за самые ебанутые 🖤💖",
        "включи «фотографирую закат» и просто улыбнись, я мысленно с тобой 💖",
        "я очень рад, что однажды мы познакомились. ты навсегда в моем сердечке 💖",
        "если тебе грустно — вспомни нашу самую ебанутую фотку во вкладке Мы 💖"
    ];

    let lastPhraseIndex = -1;

    if (missBtn && missPhraseEl) {
        missBtn.addEventListener('click', () => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * missPhrases.length);
            } while (randomIndex === lastPhraseIndex && missPhrases.length > 1);

            lastPhraseIndex = randomIndex;

            missPhraseEl.classList.add('fade-out');
            setTimeout(() => {
                missPhraseEl.innerText = missPhrases[randomIndex];
                missPhraseEl.classList.remove('fade-out');
            }, 220);
        });
    }
});