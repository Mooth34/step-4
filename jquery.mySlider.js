(function ($) {

    $.fn.mySlider = function (options) {
        let settings = $.extend({

        }, options);

        let sliders = this;
        let thumbs = sliders.find('.thumb');
        let thumbMiddle = parseInt(getComputedStyle(thumbs[0]).width) / 2;

        function adaptThumbPosition(){ thumbs.css({
            "left": (parseInt(getComputedStyle(sliders[0]).width) * (settings.initValue / settings.maxValue))
                - thumbMiddle + "px",
            "display": "block",
        })}

        sliders.css({
            "display" : "block",
        })

        adaptThumbPosition();
        window.onresize = function (event) {
            adaptThumbPosition();
        };


        sliders.on('pointerdown', function (event) {
            let currentSlider = event.target;
            let currentThumb = currentSlider.firstElementChild;
            currentThumb.style.left = (event.clientX - currentSlider.getBoundingClientRect().left - thumbMiddle) + 'px';
        });

        thumbs.on('pointerdown', function (event) {
            event.preventDefault();
            let currentThumb = event.target;
            let currentSlider = currentThumb.parentElement;

            let shiftX = event.clientX - currentThumb.getBoundingClientRect().left;

            document.addEventListener('pointermove', onMouseMove);
            document.addEventListener('pointerup', onMouseUp);

            function onMouseMove(event) {
                let newLeft = event.clientX - shiftX - currentSlider.getBoundingClientRect().left;

                // курсор вышел из слайдера => оставить бегунок в его границах.
                if (newLeft < -thumbMiddle) {
                    newLeft = -thumbMiddle;
                }
                let rightEdge = currentSlider.offsetWidth - currentThumb.offsetWidth;
                if (newLeft > rightEdge + thumbMiddle) {
                    newLeft = rightEdge + thumbMiddle;
                }

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