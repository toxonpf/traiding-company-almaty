const sliderWrapper = document.querySelector('.sliderWrapper');
const originalSlides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dotsContainer');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

// 1. Настройка клонов
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

firstClone.id = 'firstClone';
lastClone.id = 'lastClone';

sliderWrapper.append(firstClone);
sliderWrapper.prepend(lastClone);

const allSlides = document.querySelectorAll('.slide');

let currentIndex = 1;
let isTransitioning = false;

sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

// 2. Точки
originalSlides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    dot.addEventListener('click', () => {
        if (isTransitioning) return;
        goToSlide(index + 1);
    });

    dot.addEventListener('animationend', () => {
        if (dot.classList.contains('active')) {
            handleNext();
        }
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

updateDots(1);
allSlides[1].classList.add('activeSlide');

// 3. Навигация
function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex = index;

    sliderWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    updateActiveSlideClass();
    updateDots(index);
}

function handleNext() {
    if (currentIndex >= allSlides.length - 1) return;
    goToSlide(currentIndex + 1);
}

function handlePrev() {
    if (currentIndex <= 0) return;
    goToSlide(currentIndex - 1);
}

// 4. Бесконечность
sliderWrapper.addEventListener('transitionend', () => {
    isTransitioning = false;

    const currentSlide = allSlides[currentIndex];

    if (currentSlide.id === 'firstClone') {
        sliderWrapper.style.transition = 'none';
        currentIndex = 1;
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        syncTextAnimation(currentIndex);
    }

    if (currentSlide.id === 'lastClone') {
        sliderWrapper.style.transition = 'none';
        currentIndex = allSlides.length - 2;
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        syncTextAnimation(currentIndex);
    }
});

function syncTextAnimation(index) {
    allSlides.forEach(s => s.classList.remove('activeSlide'));
    const target = allSlides[index];
    target.classList.add('activeSlide');
    target.classList.add('noAnimation');
    void target.offsetWidth;
    setTimeout(() => {
        target.classList.remove('noAnimation');
    }, 50);
}

function updateActiveSlideClass() {
    allSlides.forEach(slide => slide.classList.remove('activeSlide'));
    allSlides[currentIndex].classList.add('activeSlide');
}

function updateDots(index) {
    let realIndex;
    if (index === 0) {
        realIndex = originalSlides.length - 1;
    } else if (index === allSlides.length - 1) {
        realIndex = 0;
    } else {
        realIndex = index - 1;
    }

    dots.forEach(dot => {
        dot.classList.remove('active');
        void dot.offsetWidth;
    });

    if (dots[realIndex]) {
        dots[realIndex].classList.add('active');
    }
}

// 5. События
nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);

let startX = 0;
let isDragging = false;

sliderWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

sliderWrapper.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) handleNext();
        else handlePrev();
    }
});
