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
})

function toggleText(cls, state) {
  $(cls).toggleClass('hide-text', state)
}

