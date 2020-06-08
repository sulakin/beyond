import SimpleScrollbar from 'simple-scrollbar';

var el = document.querySelector('main.container');
SimpleScrollbar.initEl(el);

$('.subscribe-button').click(function () {
  $('.subscribe-overlay form').removeClass();
  $('.subscribe-email').val('');
});
