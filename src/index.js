import $ from 'jquery';
import PlayBtn from './components/play-btn'
import './global.css'
import 'materialize-css/dist/css/materialize.min.css'

$(document).ready(function(e) {
  $("#rushow").change(function() {
    toggleText(".trainer-table .rus", !this.checked)
  });
  $("#enshow").change(function() {
    toggleText(".trainer-table .eng", !this.checked)
  });
  $("#comshow").change(function() {
    toggleText(".trainer-table .comment", !this.checked)
  });
  $(".trainer-table td").click(function(e) {
    if (e.ctrlKey || e.metaKey) return;
    $(this).toggleClass('hide-text')
  });
  $(".trainer-table .play-btn").click(function(e) {
    const audio_id = $(this).attr('audio');
    playAudio(audio_id);
    e.stopPropagation()
  });
  $('.course-sidebar .row.lecture-sidebar .course-section .section-item').attr('style', 'border: none !important');
});

function toggleText(cls, state) {
  $(cls).toggleClass('hide-text', state)
}

async function playAudio(audio) {
  await new Audio(audio).play();
  return false;
}

window.customElements.define('play-btn', PlayBtn);