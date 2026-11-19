const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const modal = document.getElementById('success-modal');
const closeBtn = document.getElementById('close-btn');
const card = document.querySelector('.card');
const bgMusic = document.getElementById('bg-music'); // Переменная на самом верху, чтобы всё работало без ошибок

// Убегание кнопки строго внутри границ полупрозрачной карточки
function moveButton(e) {
    if (e) e.preventDefault(); // Защита от стандартного клика и зума на смартфонах

    const cardWidth = card.clientWidth;
    const cardHeight = card.clientHeight;

    const btnWidth = noBtn.offsetWidth || 100;
    const btnHeight = noBtn.offsetHeight || 45;

    // Случайные координаты внутри карточки
    const x = Math.random() * (cardWidth - btnWidth - 40) + 20;
    const y = Math.random() * (cardHeight - btnHeight - 40) + 20;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.right = 'auto';
}

// Слушатели для кнопки ПК и мобильных
noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('touchstart', moveButton, { passive: false });

// Действие при клике на "Да" + Взрыв праздничного конфетти
yesBtn.addEventListener('click', () => {
    // Прячем кнопку "Нет", чтобы она своими абсолютными координатами не перекрывала модалку
    noBtn.style.display = 'none';

    // Гарантированный запуск музыки с плавным нарастанием громкости
    if (bgMusic && bgMusic.paused) {
        bgMusic.currentTime = 20;
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            const fadeIn = setInterval(() => {
                if (bgMusic.volume < 0.4) {
                    bgMusic.volume = Math.min(0.4, bgMusic.volume + 0.02);
                } else {
                    clearInterval(fadeIn);
                }
            }, 100);
        }).catch(error => console.log("Браузер заблокировал звук:", error));
    }

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff477e', '#ff70a6', '#ffccd5', '#ffffff']
        });
    }
    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    // Возвращаем кнопку "Нет" на место при закрытии окна
    noBtn.style.display = 'inline-block';
});

// --- АНИМАЦИЯ ПАДАЮЩИХ СЕРДЕЧЕК НА ФОНЕ ---
const canvas = document.getElementById('hearts-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let hearts = [];

    // Подстраиваем под размер экрана
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Heart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.hue = Math.random() * 20 + 340;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y / 30) * 0.5;

            if (this.y > canvas.height + this.size) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
        }
    }

    function initHearts() {
        for (let i = 0; i < 40; i++) {
            hearts.push(new Heart());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animate);
    }

    initHearts();
    animate();
}

// --- ИНТЕРАКТИВНЫЕ ИСКОРКИ ЗА ПАЛЬЦЕМ / МЫШКОЙ (ИСПРАВЛЕННАЯ КРУГЛАЯ ВЕРСИЯ) ---
const sparkleColors = ['#ff477e', '#ff70a6', '#9ef01a', '#70e000'];

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Делаем кружочки поменьше и аккуратнее
    const size = Math.random() * 6 + 3;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    // Выбираем цвет
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.backgroundColor = color;
    
    // Добавляем сильное размытие и свечение, чтобы убрать эффект квадратов
    sparkle.style.boxShadow = `0 0 8px ${color}, 0 0 15px ${color}`;
    sparkle.style.filter = 'blur(1px)';
    
    // Позиционируем
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    // Заставляем искорки чуть-чуть разлетаться в случайные стороны, чтобы они не липли в одну линию
    const destinationX = (Math.random() - 0.5) * 30;
    const destinationY = (Math.random() - 0.5) * 30;
    sparkle.style.setProperty('--destination-x', `${destinationX}px`);
    sparkle.style.setProperty('--destination-y', `${destinationY}px`);
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => { sparkle.remove(); }, 600); // Исчезают чуть быстрее
}

// Движение мыши на ПК
window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.2) {
        createSparkle(e.clientX, e.clientY);
    }
});

// Свайп пальцем на Смартфоне
window.addEventListener('touchmove', (e) => {
    if (Math.random() < 0.2 && e.touches && e.touches.length > 0) {
        const touch = e.touches[0]; 
        createSparkle(touch.clientX, touch.clientY);
    }
});

// --- АВТОЗАПУСК ФОНОВОЙ МУЗЫКИ ПРИ ПЕРВОМ КАСАНИИ ---
function playMusic() {
    if (bgMusic && bgMusic.paused) {
        bgMusic.currentTime = 20; // Перематываем на 20 секунд вперед
        bgMusic.volume = 0; // Начинаем с полной тишины
        bgMusic.play().then(() => {
            // Плавно поднимаем громкость до 0.4 за 2 секунды
            const fadeIn = setInterval(() => {
                if (bgMusic.volume < 0.4) {
                    bgMusic.volume = Math.min(0.4, bgMusic.volume + 0.02); // Шаг увеличения
                } else {
                    clearInterval(fadeIn); // Останавливаем таймер, когда дошли до 0.4
                }
            }, 100); // Повторяем каждые 100 мс
        }).catch(error => console.log("Браузер заблокировал звук:", error));
        
        // Удаляем слушатели после первого запуска, чтобы музыка не перезапускалась при каждом движении
        window.removeEventListener('mousemove', playMusic);
        window.removeEventListener('touchstart', playMusic);
    }
}

// Ждем малейшего движения мыши или тапа пальцем, чтобы включить трек
window.addEventListener('mousemove', playMusic);
window.addEventListener('touchstart', playMusic);

// --- КНОПКА УПРАВЛЕНИЯ ЗВУКОМ (ВКЛ/ВЫКЛ) ---
const muteBtn = document.getElementById('mute-btn');

if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (bgMusic) {
            if (bgMusic.paused) {
                bgMusic.play().catch(error => console.log("Браузер заблокировал звук:", error));
                muteBtn.innerText = '🔊';
            } else {
                bgMusic.pause();
                muteBtn.innerText = '🔇';
            }
        }
    });
}

if (bgMusic) {
    bgMusic.addEventListener('play', () => {
        if (muteBtn) muteBtn.innerText = '🔊';
    });
    bgMusic.addEventListener('pause', () => {
        if (muteBtn) muteBtn.innerText = '🔇';
    });
}