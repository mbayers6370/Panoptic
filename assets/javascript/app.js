var trackList;
var trackNames;
var singer = [];
var artistImg;
var song;

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
  $("#here").empty();
  $("#lyrics").empty();
  $("#musicVideo").empty();
  $("#profile").empty();

  //create new buttons, add artist image, bio, & tour dates
  buttonGen();
  artistData();
  wikiCall();
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
    url: "https://api.musixmatch.com/ws/1.1/track.search",
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
        "<button class='tracks waves-effect waves-light btn-large teal darken-2' id='" +
          trackNames +
          "'>" +
          trackNames +
          "</button>"
      );
    }
  });
}

function artistData() {
  var queryURL = "https://rest.bandsintown.com/artists/" + singer[0] + "?app_id=codingbootcamp";
  // bands in town api call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function(response) {
    // Artist Monkey Brainz id
    artistImg = $(
      "<img src='" + response.image_url + "' alt='" + response.name + "' id='profPic'/>"
    );
    $("#profile").prepend(artistImg);
    // variable to check if there are upcoming events for selected artist
    var eventCount = response.upcoming_event_count;
    if (eventCount > 0) {
      var tourLink = $("<a id='tour'>")
        .attr("href", response.url)
        .text("See Tour Dates");
    }
    $("#profile").append("<br>");
    $("#profile").append(tourLink);
  });
}

//onclick function to access .track buttons created from buttonGen
$(document).on("click", ".tracks", function() {
  $("#musicVideo").empty();
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
  song = $(this).attr("id");

  //setting url to search for song lyrics
  settings.url =
    "https://mourits-lyrics.p.rapidapi.com/?separator=<br>&artist=" + singer + "&song=" + song + "";

  //response from api
  $.ajax(settings).done(function(response) {
    //saving results to to response
    var results = response;

    console.log(results.result.lyrics);
    //if the results are successful print out lyrics, else print error
    if (results.success == true) {
      $("#lyrics").html("<br><p id='lyrics'>" + results.result.lyrics + "</p>");
    } else {
      $("#lyrics").html(
        "<br><p id='lyrics'>We're sorry this song does not exist in our database!</p>"
      );
    }
  });
  execute();
});

/*Youtube API*/

function loadClient() {
  gapi.client.setApiKey("AIzaSyCAF4pMYhzN4ME5qh70L49ztFxV9mnMclw");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest").then(
    function() {
      console.log("GAPI client loaded for API");
    },
    function(err) {
      console.error("Error loading GAPI client for API", err);
    }
  );
}
// Make sure the client is loaded before calling this method.
function execute() {
  return gapi.client.youtube.search
    .list({
      part: "snippet",
      maxResults: 1,
      q: song + " " + singer[0] + " music video",
      type: "video",
    })
    .then(
      function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        var results = response.result.items[0];
        var container = $("<div>").attr("class", "video-container");
        var video = $("<iframe>")
          .attr("width", "420")
          .attr("height", "315")
          .attr("src", "https://www.youtube.com/embed/" + results.id.videoId);
        container.append(video);
        $("#musicVideo").append(container);
      },
      function(err) {
        console.error("Execute error", err);
      }
    );
}
gapi.load("client");

/*
end of youtube api call
*/

//====================================================================================================================================
// WIKIPEDIA API

// the main endpoint. In this case it is English Wikipedia.

function wikiCall() {
  var url = "https://en.wikipedia.org/w/api.php";

  var params = {
    // action=query means fetch data from wiki.
    action: "query",
    // list=search means get list of pages matching a criteria
    list: "search",
    // srsearch=Craig%20Noone indicates the page title to search for. The %20 indicates a space character in a URL.
    srsearch: singer[0],
    // indicates JSON output, which is the recommended output format.
    format: "json",
  };

  //Keyess API
  url = url + "?origin=*";
  Object.keys(params).forEach(function(key) {
    url += "&" + key + "=" + params[key];
  });

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      // add response singer to variable
      var singerSearch = response.query.search[0].title;

      //compare singer[0] to response singer - both set to lower case
      // if true append bio with a link to wikipedia page, if not log error
      if (singerSearch.toLowerCase() === singer[0].toLowerCase()) {
        console.log(response.query.search[0].snippet);
        $("#profile").append("<br>");
        $("#profile").append(response.query.search[0].snippet);
        $("#profile").append("<a href='https://en.wikipedia.org/wiki/" + singer[0] + "'>...</a>");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// =======================================================================================================
