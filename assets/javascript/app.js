// Bands in town API
var artist = $().attr();
var artistMBID = "";
var tourLink;
var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
$.ajax({
  url: queryURL,
  method: "GET",
}).then(function(response) {
  // Printing the entire object to console
  console.log(response);

  // Artist Monkey Brainz id
  artistMBID = response.mbid;
  // variable to check if there are upcoming events for selected artist
  var eventCount = response.upcoming_event_count;
  if (eventCount > 0) {
    tourLink = $("<a>")
      .attr("href", response.url)
      .text("See Tour Dates");
  }
});
