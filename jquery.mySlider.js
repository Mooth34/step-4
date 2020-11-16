(function ($) {

    $.fn.mySlider = function (options) {
        let settings = $.extend({
            "minValue": "0",
            "maxValue" : "10",
            "initValue" : "0",
        }, options);

        let sliders = this;
        let thumbs = sliders.find(".thumb");
        let thumbMiddle = parseInt(getComputedStyle(thumbs[0]).width) / 2;
        let sliderValue = settings.initValue;

        let thumbLabel = document.createElement("div");
        thumbLabel.classList.add("label");
        thumbLabel.textContent = settings.initValue;
        thumbs.append(thumbLabel);

        function adaptThumbPosition() {
            thumbs.css({
                "left": (parseInt(getComputedStyle(sliders[0]).width) *
                    ((sliderValue - settings.minValue) / (settings.maxValue - settings.minValue))) - thumbMiddle + "px",
                "display": "block",
            })
        }

        sliders.css({
            "display": "block",
        })

        adaptThumbPosition();
        window.addEventListener('resize', function () {
            adaptThumbPosition();
        });

        function changeSliderValue(event, currentSlider){
            sliderValue = (event.clientX - currentSlider.getBoundingClientRect().left) /
                currentSlider.getBoundingClientRect().width * (settings.maxValue - settings.minValue);
            sliderValue = +settings.minValue + sliderValue;
        }

        sliders.on('pointerdown', function (event) {
            if (event.target.className === "thumb")
                return;
            event.preventDefault();
            let currentSlider = event.target;
            let currentThumb = currentSlider.firstElementChild;
            currentThumb.style.left = (event.clientX - currentSlider.getBoundingClientRect().left - thumbMiddle) + 'px';
            changeSliderValue(event, currentSlider);
            currentThumb.firstElementChild.textContent = Math.ceil(sliderValue);
        });

        thumbs.on('pointerdown', function (event) {
            event.preventDefault();
            let currentThumb = event.target;
            let currentSlider = currentThumb.parentElement;
            changeSliderValue(event, currentSlider);

            let shiftX = event.clientX - currentThumb.getBoundingClientRect().left;

            document.addEventListener('pointermove', onMouseMove);
            document.addEventListener('pointerup', onMouseUp);

            function onMouseMove(event) {
                changeSliderValue(event, currentSlider);
                if (sliderValue < settings.minValue)
                    sliderValue = settings.minValue;
                if (sliderValue > settings.maxValue)
                    sliderValue = settings.maxValue;

                let newLeft = event.clientX - shiftX - currentSlider.getBoundingClientRect().left;
                // курсор вышел из слайдера => оставить бегунок в его границах.
                if (newLeft < -thumbMiddle)
                    newLeft = -thumbMiddle;
                let rightEdge = currentSlider.offsetWidth - currentThumb.offsetWidth;
                if (newLeft > rightEdge + thumbMiddle)
                    newLeft = rightEdge + thumbMiddle;

                currentThumb.style.left = newLeft + 'px';
                currentThumb.firstElementChild.textContent = Math.ceil(sliderValue);
            }

            function onMouseUp() {
                document.removeEventListener('pointerup', onMouseUp);
                document.removeEventListener('pointermove', onMouseMove);
            }

        });

        thumbs.ondragstart = () => false;

    }


})(jQuery);