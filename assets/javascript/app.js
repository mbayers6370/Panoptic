var trackList;
var trackNames;
var singer = [];
var artistImg;

//submit button for form
$(document).on("click", "#submit", function(event) {
  event.preventDefault();
  // adding user input to a variable
  var searchTerm = $("#searchTerm").val();
  console.log(searchTerm);

  // pushing user input from variable into singer array
  singer = [];
  singer.push(searchTerm);

  //remove previous buttons
  $(".tracks").remove();
  buttonGen();
  artistData();
});

// This function creates buttons with the search term provided in submit button function
function buttonGen() {
  //setting parameters for call
  $.ajax({
    type: "GET",
    data: {
      apikey: "6973cac2c7ac2498971cc98dc6ae2cb2",
      q_artist: singer[0],
      page_size: 5,
      artist_country: "US",
      s_track_rating: "DESC",
      format: "jsonp",
      callback: "jsonp_callback",
    },
    url: "http://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json",

    //manipulating the data with a for loop to create 5 buttons
  }).then(function(data) {
    //adding the new tracks to trackList array
    trackList = data.message.body.track_list;
    console.log(trackList);

    //for loop appending buttons
    for (var i = 0; i < trackList.length; i++) {
      //pulling song titles from trackList
      trackNames = trackList[i].track.track_name;

      //appending buttons to id here
      $("#here").append(
        "<button class='tracks' id='" + trackNames + "'>" + trackNames + "</button>"
      );
    }
  });
}

function artistData() {
  for (var q = 0; q < singer.length; q++) {
    var index = q;
  }

  var queryURL = "https://rest.bandsintown.com/artists/" + singer[index] + "?app_id=codingbootcamp";
  // bands in town api call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function(response) {
    // Printing the entire object to console
    console.log(response);

    // Artist Monkey Brainz id
    artistImg = `<img src="${response.image_url}" alt="${response.name}" />`;
    // variable to check if there are upcoming events for selected artist
    var eventCount = response.upcoming_event_count;
    if (eventCount > 0) {
      var tourLink = $("<a>")
        .attr("href", response.url)
        .text("See Tour Dates");
    }
    $().append(tourLink);
  });
}

//onclick function to access .track buttons created from buttonGen
$(document).on("click", ".tracks", function() {
  var settings = {
    async: true,
    crossDomain: true,
    url: "",
    method: "GET",
    headers: {
      "x-rapidapi-host": "mourits-lyrics.p.rapidapi.com",
      "x-rapidapi-key": "faff408e65msh83a103691c4efadp11c312jsn26e01bbb0676",
    },
  };

  //accessing button attributes and grabbing song title from id
  var song = $(this).attr("id");

  //setting url to search for song lyrics
  settings.url =
    "https://mourits-lyrics.p.rapidapi.com/?separator=<br>&artist=" + singer + "&song=" + song + "";

  //response from api
  $.ajax(settings).done(function(response) {
    //saving results to to response
    var results = response;

    //if the results are successful print out lyrics, else print error
    if (results.success == true) {
      $("#lyrics").html("<br><p id='lyrics'>" + results.result.lyrics + "</p>");
    } else {
      $("#lyrics").html(
        "<br><p id='lyrics'>We're sorry this song does not exist in our database!</p>"
      );
    }
  });
});
