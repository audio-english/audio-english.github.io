
$(document).ready(function(e) {
  $("#export-dialog").dialog({
    'title': 'Copy the code below',
    autoOpen: false
  });
  $("#export_btn").click(exportRows);
  $("#export_all_btn").click(() => exportRows(true))
});

function exportRows(all) {
  let fullHtml = `<table class="trainer-table">`;
  fullHtml += $('.thead-ctrl').html();
  $(all === true ? '.entry-row' : '.selected-row').each(function() {
    fullHtml += this.outerHTML;
  });
  fullHtml += `</tbody></table>`;
  fullHtml += `
    <style>
        .hide-text * {
            color: transparent !important;
        }
    </style>
    <script type="text/javascript">
        function toggleText(cls, state) {
          $(cls).toggleClass('hide-text', state)
        }
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
        $('.trainer-table a').click(function() {
            window.open($(this).attr('href'), '_blank');
            return false;
        });
    </script>`;
  $('#export-dialog textarea').val(fullHtml).select();
  $('#export-dialog').dialog('open');
}


$.getJSON("https://spreadsheets.google.com/feeds/list/1q59xaSiRIoITL1sCcTITGHDJX07YUVe6CZvkPqYnql4/od6/public/values?alt=json", function(data) {
  const map = {};
  for (const [i, entry] of data.feed.entry.entries()) {
    const key = text(entry, 'urok');
    map[key] = map[key] || [];
    entry.rowNum = i+2;
    map[key].push(entry)
  }
  for (const k of Object.keys(map).sort()) {
    $("#pages").append(`
    <div class="page-link"><a href="#${k}">${k}</a></div>
    `)
  }

  console.log(data);
  console.log(map);
  $("#pages a").click(function(e) {
    renderEntries(map[$(this).text()])
  });

  if (window.location.hash) {
    renderEntries(map[window.location.hash.substr(1)])
  } else {
    renderEntries(map[Object.keys(map)[0]])
  }
});

function renderEntries(entries) {
  $("#demo").html("");
  for (const entry of entries) {
    $("#demo").append(renderEntry(entry));
  }
  $(".trainer-table td").click(function(e) {
    if (event.ctrlKey || event.metaKey) return;
    $(this).toggleClass('hide-text')
  });
  $(".trainer-table .play-btn").click(function(e) {
    const audio_id = $(this).attr('audio');
    playAudio(audio_id);
    e.stopPropagation()
  });
  $(".trainer-table tr").click(function(e) {
    if (event.ctrlKey || event.metaKey) {
      const eid = $(this).attr('eid');
      $(`tr[eid='${eid}']`).toggleClass('selected-row');

      const selectedCount = $(".selected-row").length / 2;
      if (selectedCount) {
        $('#export_btn').text(`Export ${selectedCount} entries`).show()
      } else {
        $('#export_btn').hide()
      }
    }
  })
}

function renderEntry(entry) {
  const isFreqWord = entry.gsx$freqdic && entry.gsx$freqdic.$t === 'TRUE';
  const eid = entryId(entry);
  return `
  <tr class="entry-row entry-top-row ${isFreqWord ? 'freqword' : ''}" eid="entry-${eid}">
  	<td class="aud eng-aud ${isFreqWord ? 'freqword' : ''}">
    	 ${renderPlayer(entry)}
    </td>
  	<td class="eng ${isFreqWord ? 'freqword' : ''}">
    	${isFreqWord ? `<div class="aud-inline">${renderPlayer(entry)}</div>` : ''}
    	${renderRichText(text(entry, 'eng'))}
      ${!isFreqWord ? `<div class="aud-inline">${renderPlayer(entry)}</div>` : ''}
    </td>
    <td class="comment ${isFreqWord ? 'freqword' : ''}" rowspan="2">
    	<div class="row-id" style="position: absolute; top: 0; right: 0;">${entry.rowNum}</div>
    	${renderRichText(text(entry, 'comment'))}</td>
  </tr>
  <tr class="entry-row entry-bottom-row ${isFreqWord ? 'freqword' : ''}" eid="entry-${eid}">
    <td class="aud rus-aud ${isFreqWord ? 'freqword' : ''}"></td>
  	<td class="rus ${isFreqWord ? 'freqword' : ''}">
    	${renderRichText(text(entry, 'rus'))}
    </td>
  </tr>
  `
}

function entryId(entry) {
  const id = entry.id.$t;
  return id.slice(id.length - 9)
}

function text(entry, columnName) {
  const cell = entry[`gsx$${columnName}`];
  if (cell) {
    return cell.$t;
  } else {
    return "";
  }
}

function renderPlayer(entry) {
  const isFreqWord = entry.gsx$freqdic && entry.gsx$freqdic.$t === 'TRUE';
  let result = '';
  let a1 = text(entry, 'na1') || text(entry, 'a1');
  if (a1) {
    result += `<play-btn class="${!isFreqWord ? 'solid' : ''}" src="${a1}"></play-btn> `
  }
  let a2 = text(entry, 'na2') || text(entry, 'a2');
  if (a2) {
    result += `<play-btn class="solid slow" src="${a2}"></play-btn>`
  }
  return result;
}

function renderRichText(text) {
  return `
  	<div class="rich">${text}</div>
  `
}