const $ = window.$;
window.addEventListener('DOMContentLoaded', (event) => {
  // clear checkbox in page reload
  $('input[type="checkbox"]').each(function () {
    $(this).prop('checked', false);
  });

  // requests the server api status
  $.get('http://0.0.0.0:5001/api/v1/status/')
    .done(function (response) {
      if (response.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    })
    .fail(function () {
      $('#api_status').removeClass('available');
    });

  // ----------------------------------------------
  // SETUP Amenities filter
  // ----------------------------------------------

  // fill the checked boxes in object
  const amenityDict = {};
  $('.amenities input[type=checkbox]').change(function () {
    if (this.checked) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });
  // ----------------------------------------------
  // SETUP States filter
  // ----------------------------------------------

  // fill the checked boxes in object
  const statesDict = {};
  $('.statebox').change(function () {
    if (this.checked) {
      console.log(statesDict);
      statesDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete statesDict[$(this).attr('data-id')];
    }
    const newList = $.merge(Object.values(statesDict), Object.values(citiesDict));
    $('.locations h4').text(newList.join(', '));
  });

  // ----------------------------------------------
  // SETUP Cities filter
  // ----------------------------------------------

  // fill the checked boxes in object
  const citiesDict = {};
  $('.citybox').change(function () {
    if (this.checked) {
      console.log(citiesDict);
      citiesDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete citiesDict[$(this).attr('data-id')];
    }
    const newList = $.merge(Object.values(statesDict), Object.values(citiesDict));
    $('.locations h4').text(newList.join(', '));
  });
  // retrieve all places from the api server on first page load
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    error: function (e) {
      console.log(e);
    },
    success: fillHtmlTemplate,
    dataType: 'json',
    contentType: 'application/json'
  });
  // retrieve places depends the list of picked amenities, states and cities
  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({
        amenities: Object.keys(amenityDict),
        states: Object.keys(statesDict),
        cities: Object.keys(citiesDict)
      }),
      error: function (e) {
        console.log(e);
      },
      success: fillHtmlTemplate,
      dataType: 'json',
      contentType: 'application/json'
    });
  });
  // fulfill articele tag with a template of places
  function fillHtmlTemplate (response) {
    $('section.places').empty();
    for (const place of response) {
      $('SECTION.places').append(
        '<ARTICLE>' +
        '<div class= "title_box">' +
        '<h2>' + place.name + '</h2>' +
        '<div class="price_by_night">$' + place.price_by_night +
        '</div>' +
        '</div>' +
        '<div class="information">' +
        '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') +
        '</div>' +
        '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') +
        '</div>' +
        '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') +
        '</div>' +
        '</div>' +
        '<div class="user">' +
        '<div class="description">' + place.description + '</div>' +
        '</ARTICLE>'
      );
    }
  }
});
