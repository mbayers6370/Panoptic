var trackList;
var trackNames;
var singer = [];
var artistImg;

//submit button for form
$(document).on("click", "#submit", function (event) {
    event.preventDefault();
    // adding user input to a variable
    var searchTerm = $("#searchTerm").val();
    console.log(searchTerm)

    // pushing user input from variable into singer array
    singer = [];
    singer.push(searchTerm);

    //remove previous buttons
    $("#here").empty();
    $("#lyrics").empty();
    $("#musicVideo").empty();
    $("#profile").empty();
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
        "<button class='tracks waves-effect waves-light btn-large teal darken-4' id='" +
          trackNames +
          "'>" +
          trackNames +
          "</button>"
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
    artistImg = `<img src="${response.image_url}" alt="${response.name}" id="profPic"/>`;
    $("#profile").append(artistImg);
    // variable to check if there are upcoming events for selected artist
    var eventCount = response.upcoming_event_count;
    if (eventCount > 0) {
      var tourLink = $("<a id='tour'>")
        .attr("href", response.url)
        .text("See Tour Dates");
    }
    $("#profile").append(tourLink);
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

/*
 YouTube Api 
 
 this line goes on html doc
 <script src="https://apis.google.com/js/api.js"></script>
 */


function loadClient() {
  gapi.client.setApiKey("AIzaSyC8ON2ihQcVmdOPUKgwnn3uwVGGo4YIli4");
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
      q: "one metallica music video",
      type: "video",
    })
    .then(
      function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        var results = response.result.items[0];
        var title = `<p>${results.snippet.title}</p>`;
        var video = `
                      <iframe width="420" height="315"
                      src="https://www.youtube.com/embed/${results.id.videoId}">
                      </iframe>`;
        // $("#video")
        //   .append(title)
        //   .append(video);
      },
      function(err) {
        console.error("Execute error", err);
      }
    );
}
// gapi.load("client"); 

/*
end of youtube api call

We need to figure out a way to perform the load client function 
I was going to add it to the first button click event
other than that the list portion of the api is where we need to input variables
more specifically just the value for "q"

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
        srsearch: "singer",
        // indicates JSON output, which is the recommended output format.
        format: "json"
    };


    //Keyess API 
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
      .then(function(response){return response.json();})
        .then(function(response) {
            if (response.query.search[0].title === "singer"){
            console.log("Your search page 'singer' exists on English Wikipedia" );
            //console.log(response)
              }
        })
        .catch(function(error){console.log(error);});

      };

// =======================================================================================================