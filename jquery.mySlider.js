(function ($) {

    $.fn.mySlider = function (options) {
        let settings = $.extend({
            "minValue": "0",
            "maxValue": "10",
            "initValue": "0",
            "scale": "1",
            "tickMarks": "true",
        }, options);

        let sliders = this;
        let thumbs = sliders.find(".thumb");
        let thumbMiddle = parseInt(getComputedStyle(thumbs[0]).width) / 2;
        let sliderValue = settings.initValue;

        let thumbLabel = document.createElement("div");
        thumbLabel.classList.add("label");
        thumbLabel.textContent = settings.initValue;
        thumbs.append(thumbLabel);

        function adaptSliderPosition() {
            thumbs.css({
                "left": (sliders[0].getBoundingClientRect().width *
                    ((sliderValue - settings.minValue) / (settings.maxValue - settings.minValue))) - thumbMiddle + "px",
                "display": "block",
            })
        }

        function addTickMarks() {
            let tickMarks = document.createElement("div");
            tickMarks.classList.add("tickMarks");
            sliders.append(tickMarks);
            let deltaMaxMin = settings.maxValue - settings.minValue;
            let tickMarkCount = Math.ceil(Math.log(deltaMaxMin));
            for (let i = 0; i <= tickMarkCount; i++) {
                let tickMark = document.createElement("span");
                let value = +settings.minValue + (deltaMaxMin / tickMarkCount * i);
                tickMark.classList.add("tickMark");
                tickMark.textContent = value;
                tickMark.style.left = (value / deltaMaxMin * sliders[0].getBoundingClientRect().width)
                    + sliders[0].getBoundingClientRect().left - tickMark.getBoundingClientRect().width/2 + "px";
                tickMarks.append(tickMark);
            }
        }

        addTickMarks();
        sliders.css({
            "display": "block",
        })


        adaptSliderPosition();
        window.addEventListener('resize', function () {
            adaptSliderPosition();
        });

        function changeSliderValue(event, currentSlider) {
            sliderValue = (event.clientX - currentSlider.getBoundingClientRect().left) /
                currentSlider.getBoundingClientRect().width * (settings.maxValue - settings.minValue);
            sliderValue = +settings.minValue + sliderValue;
            sliderValue = Math.round(sliderValue / settings.scale) * settings.scale;
            if (sliderValue < settings.minValue)
                sliderValue = settings.minValue;
            if (sliderValue > settings.maxValue)
                sliderValue = settings.maxValue;
            let currentThumb = currentSlider.firstElementChild;
            currentThumb.firstElementChild.textContent = sliderValue;
        }

        sliders.on('pointerdown', function (event) {
            event.preventDefault();
            let currentSlider, currentThumb;
            if (event.target.className === "thumb" || event.target.className === "label")
                return;
            if (event.target.className === "tickMark") {
                currentSlider = event.target.parentElement;
                currentThumb = currentSlider.firstElementChild;
                // currentThumb.style.left =
            }
            else {
                currentSlider = event.target;
                currentThumb = currentSlider.firstElementChild;
                currentThumb.style.left = (event.clientX - currentSlider.getBoundingClientRect().left - thumbMiddle) + 'px';
                changeSliderValue(event, currentSlider);
            }


        });

        thumbs.on('pointerdown', function (event) {
            event.preventDefault();
            let currentThumb;
            if (event.target.className === "label")
                currentThumb = event.target.parentElement;
            else
                currentThumb = event.target;
            let currentSlider = currentThumb.parentElement;
            let shiftX = event.clientX - currentThumb.getBoundingClientRect().left;

            document.addEventListener('pointermove', onMouseMove);
            document.addEventListener('pointerup', onMouseUp);

            function onMouseMove(event) {
                changeSliderValue(event, currentSlider);
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