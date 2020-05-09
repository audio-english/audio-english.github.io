import $ from 'jquery';
import PlayBtn from './components/play-btn'
import './global.css'
import 'materialize-css/dist/css/materialize.min.css'

$(document).ready(function(e) {
  $('.course-sidebar .row.lecture-sidebar .course-section .section-item').attr('style', 'border: none !important');
});

window.customElements.define('play-btn', PlayBtn);