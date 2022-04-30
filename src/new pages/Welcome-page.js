// Activate Carousel
$('#carousel-1').carousel();

// Enable Carousel Indicators
$('.carousel-item').click(function () {
  $('#carousel-1').carousel(1);
});

// Enable Carousel Controls
$('.left').click(function () {
  $('#carousel-1').carousel('prev');
});
