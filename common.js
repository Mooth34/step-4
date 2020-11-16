$(document).ready(function() {
    $("#first").mySlider({
        "maxValue" : "200",
        "minValue": "-100",
        "initValue" : "100",
    });
    $("#second").mySlider({
        "maxValue" : "100",
        "initValue" : "50",
    });
    $("#third").mySlider({
        "maxValue" : "50",
        "initValue" : "10",
    });

});