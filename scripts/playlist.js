/* eslint-env jquery, browser */
/**
 * Client side logic for playlists.
 *
 * - Show/hide playlists.
 * - Keep track of position in playlist.
 */


/**
 * If in lesson of playlist
 */
var playlist = JSON.parse(localStorage.getItem('playlist'))
if (playlist) {
  if (indexOf(playlist.lessons, window.location.href) !== undefined) {
    // current lesson is this very page -> add navigation
    addNavigation(playlist)
  } else {
    // remove playlist from localStorage, we are no longer in a playlist
    localStorage.removeItem('playlist')
  }
}

export default function init () {
  /**
   * show/hide playlist
   */
  $('.playlist > li').click(function () {
    $('.' + this.id).slideToggle()
  })

  /**
   * save playlist to localStorage when clicking lesson in playlist
   */
  $('.playlist a').click(function (event) {
    event.preventDefault()
    var url = $(this).attr('href')
    if (url.search(/^http/) === 0) {
      // external lesson
      return
    }
    var playlist = getPlaylist(this)
    localStorage.setItem('playlist', JSON.stringify(playlist))
    window.location.href = this.attributes.href.value
  })
}

/**
 * Create a playlist object from a playlist lesson link.
 */
function getPlaylist (link) {
  var parent = $(link).parent()
  var res = {}
  res.name = $('.name', parent).text()
  res.lessons = getLessons(parent)
  return res
}

function getLessons (playlist) {
  var base = window.location.href.replace('index.html', '')
  var links = $('a', playlist)
  return $.map(links, function (elm) {
    var url = base + elm.attributes.href.value
    var name = $('> li', elm).text()
    return { url: url, name: name }
  })
}

function addNavigation (playlist) {
  var navigation = '<div class="playlist-navigation">'
  navigation += '<h1>' + playlist.name + '</h1>'

  navigation += '<ul class="pagination">'
  navigation += '<li><a class="prev" title="Forrige">&laquo</a></li>'
  for (var i = 0, l = playlist.lessons.length; i < l; ++i) {
    var lesson = playlist.lessons[i]
    navigation += '<li'
    if (window.location.href === lesson.url) {
      navigation += ' class="active"'
    }
    navigation += '><a href="' + lesson.url + '" '
    navigation += 'title="' + lesson.name + '">'
    navigation += '<span>' + (i + 1) + '</span>'
    navigation += '</a></li>'
  }
  navigation += '<li><a class="next" title="Neste">&raquo</a></li>'
  navigation += '</ul>'
  navigation += '<div class="clearfix"></div></div>'

  $('header').parent().prepend(navigation)
  $('.content').append(navigation)

  $('.playlist-navigation select').change(function () {
    window.location.href = this.value
  })

  $('.playlist-navigation a').click(function () {
    var i = indexOf(playlist.lessons, window.location.href)
    if ($(this).hasClass('prev')) {
      i -= 1
    } else if ($(this).hasClass('next')) {
      i += 1
    } else { return }  // not next/prev button
    if (playlist.lessons[i]) {
      var url = playlist.lessons[i].url
      localStorage.setItem('playlist', JSON.stringify(playlist))
      window.location.href = url
    }
  })
}

function indexOf (lessons, current) {
  for (var i = 0, l = lessons.length; i < l; ++i) {
    if (lessons[i].url === current) {
      return i
    }
  }
}
