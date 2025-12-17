function toggleLike(btn) {
    btn.classList.toggle('active');
    // Добавляем простую анимацию нажатия
    btn.style.transform = "scale(0.8)";
    setTimeout(() => {
        // ВАЖНО: Очищаем инлайн-стиль, чтобы CSS-правила (hover) снова заработали
        btn.style.transform = "";
    }, 150);
}