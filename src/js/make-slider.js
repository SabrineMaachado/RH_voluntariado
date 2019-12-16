'use strict';

function MakeSlider(element) {
    element.classList.add('make-slider');

    var currentIndex = 0;
    var slides = Array.prototype.slice.call(element.children);
    var nextButtons = Array.prototype.slice.call(element.querySelectorAll('.ms-next'));
    var prevButtons = Array.prototype.slice.call(element.querySelectorAll('.ms-prev'));

    var slidesHolder = document.createElement('div');
    slidesHolder.classList.add('slides-holder');

    var buttonNext = document.createElement('div');
    buttonNext.classList.add('control');
    buttonNext.classList.add('button');
    buttonNext.classList.add('button-next');

    var buttonPrev = document.createElement('div');
    buttonPrev.classList.add('control');
    buttonPrev.classList.add('button');
    buttonPrev.classList.add('button-prev');

    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.add('slide');
        slides[i].classList.add('out');
        slidesHolder.appendChild(slides[i]);
    }

    if (slides.length < 2) {

        buttonNext.classList.add('button-hidden');
        buttonPrev.classList.add('button-hidden');
    }

    element.appendChild(slidesHolder);
    element.appendChild(buttonPrev);
    element.appendChild(buttonNext);

    function goTo(index) {
        if (index <= -1 || index >= slides.length) {
            return;
        }

        var lastIndex = currentIndex;
        var currentSlide = slides[lastIndex];
        var nextSlide = slides[index];
        currentIndex = index;
        if (nextSlide) {
            updateSlidesStates(index, lastIndex, currentSlide, nextSlide);
        }
        buttonPrev.classList.remove('button-hidden');
        buttonNext.classList.remove('button-hidden');
        if (index == 0) {
            buttonPrev.classList.add('button-hidden');
        }
        if (index == slides.length - 1) {
            buttonNext.classList.add('button-hidden');
        }
    }

    function updateSlidesStates(index, lastIndex, currentSlide, nextSlide) {

        if (index < lastIndex) {
            currentSlide.classList.remove('in');
        } else if (index > lastIndex) {
            currentSlide.classList.add('in');
        }

        currentSlide.classList.add('out');
        nextSlide.classList.remove('out');
        nextSlide.classList.add('in');
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    buttonPrev.addEventListener('click', prev);
    buttonNext.addEventListener('click', next);

    nextButtons.forEach(function (element) {
        return element.addEventListener('click', next);
    });
    prevButtons.forEach(function (element) {
        return element.addEventListener('click', prev);
    });

    goTo(currentIndex);

    return {
        goTo: goTo, next: next, prev: prev
    };
}