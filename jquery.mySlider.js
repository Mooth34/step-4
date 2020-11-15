(function ($) {

    $.fn.mySlider = function (options) {
        let settings = $.extend({

        }, options);

        let sliders = this;
        let thumbs = sliders.find('.thumb');
        let thumbMiddle = parseInt(getComputedStyle(thumbs[0]).width) / 2;
        let sliderValue = settings.initValue;

        function adaptThumbPosition(){
            thumbs.css({
            "left": (parseInt(getComputedStyle(sliders[0]).width) * (sliderValue / settings.maxValue))
                - thumbMiddle + "px",
            "display": "block",
        })}

        sliders.css({
            "display" : "block",
        })

        adaptThumbPosition();
        window.addEventListener('resize', onResize);
        function onResize(event) {
            adaptThumbPosition();
        }


        sliders.on('pointerdown', function (event) {
            if (event.target.className==="thumb")
                return;
            let currentSlider = event.target;
            let currentThumb = currentSlider.firstElementChild;
            sliderValue = (event.clientX - currentSlider.getBoundingClientRect().left) /
                currentSlider.getBoundingClientRect().width * settings.maxValue;
            currentThumb.style.left = (event.clientX - currentSlider.getBoundingClientRect().left - thumbMiddle) + 'px';
        });

        thumbs.on('pointerdown', function (event) {
            event.preventDefault();
            let currentThumb = event.target;
            let currentSlider = currentThumb.parentElement;
            sliderValue = (event.clientX - currentSlider.getBoundingClientRect().left) /
                currentSlider.getBoundingClientRect().width * settings.maxValue;

            let shiftX = event.clientX - currentThumb.getBoundingClientRect().left;

            document.addEventListener('pointermove', onMouseMove);
            document.addEventListener('pointerup', onMouseUp);

            function onMouseMove(event) {
                sliderValue = (event.clientX - currentSlider.getBoundingClientRect().left) /
                    currentSlider.getBoundingClientRect().width * settings.maxValue;
                if (sliderValue < 0)
                    sliderValue = 0;
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
            }

            function onMouseUp() {
                document.removeEventListener('pointerup', onMouseUp);
                document.removeEventListener('pointermove', onMouseMove);
            }

        });

        thumbs.ondragstart = () => false;

    }


})(jQuery);