// $('.menu-item:not(:has([data-content=Vegan]))').hide('fast')

var extension_id = 'hjhkjcpeafpacgopfeapiclffknoabfe';

var banned = [];

var allowed = [];

function isBanned($el) {
  var result = false;

  for(var i in banned) {
    if ($el.is(':has([data-content="' + banned[i] + '"])')) {
      return true;
    }
  }

  return result;
}


function isAllowed($el) {
  var result = false;

  for(var i in allowed) {
    if ($el.is(':has([data-content="' + allowed[i] + '"])')) {
      return true;
    }
  }

  return result;
}

function filter() {
  //$('#menu-main').addClass('cc-menu-filtering');
  $('.menu-item').each(function(i, el) {
    var $el = $(el);

    if (isBanned($el)) { $el.hide(); }
    
    else if (allowed.length > 0 && ! isAllowed($el)) { $el.hide(); }

    else $el.show();

  });
}

function init() {
  // Remove sold-out items
  var soldOutItems = $('.menu-item:has(.mi-soldout)');
  console.log('Cheat Club: Removed ' + soldOutItems.length + ' sold-out items.');
  soldOutItems.remove();

  // Calculate tags

  var tags = {}, counts = {};

  $('[rel=popover][data-content]:has(.tag)').each(function(i, el){
    var $el = $(el), string;

    string = $el.data('content');

    if (typeof tags[string] === 'undefined') {
      // add it to known tags
      tags[string] = $el.html()

      // initialize count
      counts[string] = 1;


    } else {

      counts[string]++;

    }
  });

  // Insert our div
  $('<div id="cheat-club"><table class="cc-filter-table"><tbody id="cc-filter"></tbody></table></div>').insertBefore($('#menu-main'))

  // construct filter
  _.each(_.keys(tags).sort(), function(key){

    // and render it
    $('#cc-filter')
      .append($('<tr class="cc-filter-row" />')
        .data({ccKey: key})
        .append($('<td>')
          .html(tags[key])
        )
        .append($('<td>')
          .text(key + ' (' + counts[key] + ')')
        )
        .append('<td><a href="" class="cc-allow">Allow</a><td>')
        .append('<td><a href="" class="cc-ban">Ban</a><td>')
      );      
  });

  // Set up toggling
  $("#cc-filter")
    .on('click', '.cc-allow', function(e) {
      var $el = $(e.target);

      allowed.push($el.closest('.cc-filter-row').data('ccKey'));

      $el.removeClass('cc-allow').addClass('cc-un-allow');
      filter();
    })
    .on('click', '.cc-ban', function(e) {
      var $el = $(e.target);

      banned.push($el.closest('.cc-filter-row').data('ccKey'));

      $el.removeClass('cc-ban').addClass('cc-un-ban');
      filter();
    })
    .on('click', '.cc-un-allow', function(e) {
      var $el = $(e.target), ccKey = $el.closest('.cc-filter-row').data('ccKey');

      _.remove(allowed, function(word) {return word === ccKey});

      $el.removeClass('cc-un-allow').addClass('cc-allow');
      filter();
    })
    .on('click', '.cc-un-ban', function(e) {
      var $el = $(e.target), ccKey = $el.closest('.cc-filter-row').data('ccKey');

      _.remove(banned, function(word) {return word === ccKey});

      $el.removeClass('cc-un-ban').addClass('cc-ban');
      filter();
    })
    .on('click', 'a', function(e) {
      e.preventDefault();
    });


  // Change logo
  $('.logo-menu').attr('src', 'chrome-extension://'+extension_id+'/cheat-logo.png');

};


var delay = 10;

function tryInitUntilReady() {
  if ($('.menu-item').length > 0) {
    init();
  } else {
    window.setTimeout(tryInitUntilReady, delay);
    delay = delay * 1.1;
  }
}

tryInitUntilReady();
