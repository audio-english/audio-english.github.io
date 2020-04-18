$(document).ready(function(e) {
  $("#rushow").change(function() {
    toggleText(".trainer-table .rus", !this.checked)
  })
  $("#enshow").change(function() {
    toggleText(".trainer-table .eng", !this.checked)
  })
  $("#comshow").change(function() {
    toggleText(".trainer-table .comment", !this.checked)
  })
  $(".trainer-table td").click(function(e) {
    if (event.ctrlKey || event.metaKey) return;
    $(this).toggleClass('hide-text')
  })
  $(".trainer-table .play-btn").click(function(e) {
    const audio_id = $(this).attr('audio');
    playAudio(audio_id)
    e.stopPropagation()
  })
  $('.course-sidebar .row.lecture-sidebar .course-section .section-item').attr('style', 'border: none !important');
})

function toggleText(cls, state) {
  $(cls).toggleClass('hide-text', state)
}

function playAudio(audio) {
  new Audio(audio).play();
  return false;
}