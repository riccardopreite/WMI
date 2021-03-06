const maxKey = "AIzaSyAin9iPCpvqsNVWEVtsJhpUemBcoIWFGbo";
const guiKey = "AIzaSyBFXSS4CBQKDc8yJtAdEruvXgAEHNwg8ko";
const rickyKey = "AIzaSyBEpETjNZc18OP9L603YkzOvotslkQiBGI";
var first = true;
var speecIstance = window.speechSynthesis;
function getVideoId(poi) {
  var search = "";
  search += OpenLocationCode.encode(
    poi.coords.latitudeCenter,
    poi.coords.longitudeCenter,
    4
  );
  search += "-";
  
  search += OpenLocationCode.encode(
    poi.coords.latitudeCenter,
    poi.coords.longitudeCenter,
    6
  );
  search += "-";
  search += OpenLocationCode.encode(
    poi.coords.latitudeCenter,
    poi.coords.longitudeCenter
  );
  $("#infoTitolo").text(poi.name.toString());
  if (poi.img !== "NF") {
    $("#imgOnLocation").attr("src", poi.img);
    $("#imgOnLocation").show();
  } else {
    $("#imgOnLocation").attr("src", "");
    $("#imgOnLocation").hide();
  }
  if (poi.description.en !== "NOT FOUND") {
    var languageSelector = $("#language");
    var c = languageSelector[0].selectedOptions[0].text.toLowerCase().substring(0,languageSelector[0].selectedOptions[0].text.toLowerCase().length - 1)
   
    for( var s in poi.description){
		if(s == c){
			$("#descriptionOnLocation").text(poi.description[s]);
			$("#descriptionOnLocation").show();
		}
	}
    
  } else {
    $("#descriptionOnLocation").text("");
    $("#descriptionOnLocation").hide();
  }
  if (poi.img !== "NF" || poi.description.en !== "NOT FOUND") {
    $("#dividerOnLocation").show();
  } else {
    $("#dividerOnLocation").hide();
  }
  searchByKeyword(search);
}

function searchByKeyword(query) {
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/youtube/v3/search",
    data: {
      key: "AIzaSyBSPJDbM1FMEGLP_FU7HtAEx37O7G1avjg",
      q: query,
      part: "snippet",
      maxResults: 50,
      type: "video",
      videoEmbeddable: true
    },
    success: function(data) {
      var item = data["items"];
      var iframe;
      var iCont = document.getElementById("iframeContainer");
      first = true;
      for (video in item) {
        var audio_tag = document.createElement("audio");
        videoId = item[video].id.videoId;
        // iframe.src = "https://www.youtube.com/watch?v="+videoId;
        // iframe.controls = true;
        // iframe.width="0";
        // iframe.height="0";
        // iframe.frameborder="0";
        // $("#iframeContainer").append(iframe)
        onYouTubeIframeAPIReady(videoId, item[video].snippet.title, item[video].snippet.description, item[video].snippet.channelTitle);
      }
      var div = document.getElementById("clipContainer");
      div.hidden = false;
      $('#reviewContainer').hide();	
      $('#iframeContainer').show();	
      setCSSAttribute("#popupContainer", {
      "z-index": "-1",
      height: "0px"
    });
    $("#upDown").attr("class", "fa fa-angle-up d-flex");
      infoPopupState = "open";  
      if(data["items"].length == 0){
		$("#iframeContainer").append("<p id='cliperror'>Unable to load any clip</p>");
	  }
    },
    error: function(response) {
      console.log("Request Failed");
    }
  });
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var playerYT;
function onYouTubeIframeAPIReady(videoId, titolo, descrizione, channelTitle) {
  if (videoId == undefined) {
    return;
  }  
  var der = descrizione.split(":");
  var motivo ="";
  for(var n in der){
		if(der[n] == "why"){
			motivo = "why";
		}else if(der[n] == "how"){
			motivo = "how";
		}else if(der[n] == "what"){
			motivo = "what";
		}else if(der[n] == "who"){
			motivo = "why";
		}
		}
	
  if(first == false){	
	  $("#iframeContainer").append(
	  "<hr style='margin-top: 2em;'id='dividerOnLocation'><div style='margin-top: 1em;'><div  ><p style='margin-bottom:1em!important'><b>Utente: </b>"+channelTitle +" &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp<b>Categoria: </b>" +motivo+ "</p></div>"+
		"<div  style='margin:0px!important;width: auto;'>"+
		"<div style='float:left;display: inline-block;width: auto;margin-left:4em;'><i id='controller" + videoId + "'class='fas fa-play' style='font-size: 30px;'></i></div>"+
	   "<div style='float:right;display: inline-block; width: auto;margin-right:0.5em;'><button class='btn btn-outline-success' id='btn" + videoId + "' onclick='openReviewModal(this.id, "+'"'+channelTitle+'"'+")'>Lascia un recensione</button></div></div>"
	  );
	}else{
	  first = false;
	$("#iframeContainer").append(
	  "<div><div  ><p style='margin-bottom:1em!important'><b>Utente: </b>"+channelTitle +"&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp<b>Categoria: </b>" +motivo+ "</p></div>"+
		"<div  style='margin:0px!important;width: auto;'>"+
		"<div style='float:left;display: inline-block;width: auto;margin-left:4em;'><i id='controller" + videoId + "'class='fas fa-play' style='font-size: 30px;'></i></div>"+
	   "<div style='float:right;display: inline-block; width: auto;margin-right:0.5em;'><button class='btn btn-outline-success' id='btn" + videoId + "' onclick='openReviewModal(this.id, "+'"'+channelTitle+'"'+")'>Lascia un recensione</button></div></div>"
	  );
	}
  

  checkReviewStyle(videoId);
  var iFramer = document.createElement("div");
  iFramer.setAttribute("id", "player" + videoId);
  $("#controller" + videoId).on("click", function() {
    $("#controller" + videoId).attr("class", "fas fa-pause");

    var player = YT.get("player" + videoId);
    if (
      player.getPlayerState() == YT.PlayerState.ENDED ||
      player.getPlayerState() == YT.PlayerState.PAUSED ||
      player.getPlayerState() == -1 ||
      player.getPlayerState() == YT.PlayerState.CUED
    ) {
	  speecIstance.cancel();
      stopOtherVideos(videoId);
      player.playVideo();
    } else {
      stopOtherVideos(player);
      $("#controller" + videoId).attr("class", "fas fa-play");
      player.pauseVideo();
    }
  });

  document.getElementById("iframeContainer").appendChild(iFramer);

  playerYT = new YT.Player("player" + videoId, {
    height: "0",
    width: "0",
    videoId: videoId.toString(),
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function stopOtherVideos(id) {
  var listOfPlayers = document.getElementsByTagName("iframe");
  for (element in listOfPlayers) {
    if (isNumber(element)) {
      if (
        listOfPlayers[element].id.includes("player") &&
        listOfPlayers[element].id.replace("player", "") != id
      ) {
        YT.get(listOfPlayers[element].id).stopVideo();
        $("#" + listOfPlayers[element].id.replace("player", "controller")).attr(
          "class",
          "fas fa-play"
        );
      }
    }
  }
}

function onPlayerReady(event) {
  //event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    $("#" + event.target.a.id.replace("player", "controller")).attr(
      "class",
      "fas fa-play"
    );
  } else if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  playerYT.stopVideo();
}

function clearClipModal() {
	speecIstance.cancel();
	try{$("#cliperror").remove();}catch(e){}
  var div = document.getElementById("clipContainer");
  div.hidden = true;
  $("#iframeContainer").empty();
  $("#reviewContainer").hide();
  $("#iframeContainer").show();
  actualRouting.splice(currentDestination, 1);
    if (actualRouting.length != 0) {
      routingTo(actualRouting[currentDestination]);
      greenMarker(actualRouting[currentDestination]);
      popupIndex = actualRouting[currentDestination];
    }
}

function stopRoutingFromModal(){
	clearClipModal();
	speecIstance.cancel();
        for (poi in POIs) {
          POIs[poi].visited = false;
          blueMarker(poi);
        }
        actualRouting = [];
        currentDestination = 0;
        popupIndex = 0;
        mymap.removeControl(control);
        control = null;
        customdirectionsButton.state("start");
}
