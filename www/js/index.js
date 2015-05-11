var app = {
	
	apiURL: "http://beachspot.org/test/",
	
	mapContainerName: 'map',
	mapObject: "",
	mapBounds: new google.maps.LatLngBounds(),
	
	markersArray: [],
	markerImage: 'img/map/marker2.png',
	myLocationImage: 'img/map/mylocation.png',
	
	beachContainerName: 'details_container',
	beachContainerTmpl: 'details_container_tmpl',
	
	resultContainerName: 'result_container',
	resultContainerTmpl: 'result_tmpl',
	
	eventContainerTmpl: 'details_infotext_tmpl',
	
	searchInput: 'search_input',
	searchContainer: 'search_container',
	
	errorContainerName: 'error_container',
	errorFriendlyName: 'error_friendly',
	errorMessageName: 'error_message',
	
	locationName: 'location_btn',
	
	state: 'home',
	
	// Application Constructor
	initialize: function() {
		this.bindEvents();
		
		// hide the splash screen
		$('#splash_screen').fadeOut(2500);
	},
	
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		
		// app.receivedEvent('deviceready');
		navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
		
		document.addEventListener("backbutton", app.onBackKeyDown, false);

	},
 
	onSuccess: function( position ) {

		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var myLatLng = new google.maps.LatLng(latitude, longitude);
 
		var mapOptions = {
			center: myLatLng,
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};
		app.mapObject = new google.maps.Map(document.getElementById(app.mapContainerName), mapOptions);

		var myLocationMarkerImage = {
			url: app.myLocationImage,
			size: new google.maps.Size(48, 48), // marker image size
			origin: new google.maps.Point(0,0), // image origin
			anchor: new google.maps.Point(24, 24) // contact with the map offset
		};

		var myLocationMarker = new google.maps.Marker({
				position: myLatLng,
				map: app.mapObject,
				icon: myLocationMarkerImage,
				title: "Your location"
		});
			
		// push markers to global array
		app.markersArray.push(myLocationMarker);
		
		// add listener for bounds changed event
		google.maps.event.addListener(app.mapObject, 'bounds_changed', function() {
			app.bounds = app.mapObject.getBounds();
			
			var northEast = app.bounds.getNorthEast();
			var southWest = app.bounds.getSouthWest();
			
			// construct the api call parameters
			var apiCallParams = app.apiURL + '?lat1=' + northEast.lat() + '&lon1=' + northEast.lng();
			apiCallParams += '&lat2=' + southWest.lat() + '&lon2=' + southWest.lng();
			
			$.ajax({
				url: apiCallParams,
				dataType: 'jsonp',
				jsonp: 'callback',
				jsonpCallback: 'app.jsonpCallback',
			});
			
		}); // end of listener callbck

	},
	
	fakeTheMap : function() {
		
		// hide the splash
		$('#splash_screen').hide();
		
		var myLatLng = new google.maps.LatLng(59.4425, 24.634);
		var mapOptions = {
			zoom: 9,
			center: myLatLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		}
		app.mapObject = new google.maps.Map(document.getElementById(app.mapContainerName), mapOptions);
		
		var myLocationMarkerImage = {
			url: app.myLocationImage,
			size: new google.maps.Size(48, 48), // marker image size
			origin: new google.maps.Point(0,0), // image origin
			anchor: new google.maps.Point(24, 24) // contact with the map offset
		};

		var myLocationMarker = new google.maps.Marker({
				position: myLatLng,
				map: app.mapObject,
				icon: myLocationMarkerImage,
				title: "Your location"
		});
			
		// push markers to global array
		app.markersArray.push(myLocationMarker);
		
		// add listener for bounds changed event
		google.maps.event.addListener(app.mapObject, 'bounds_changed', function() {
			app.bounds = app.mapObject.getBounds();
			
			var northEast = app.bounds.getNorthEast();
			var southWest = app.bounds.getSouthWest();
			
			// construct the api call parameters
			var apiCallParams = app.apiURL + '?lat1=' + northEast.lat() + '&lon1=' + northEast.lng();
			apiCallParams += '&lat2=' + southWest.lat() + '&lon2=' + southWest.lng();
			
			$.ajax({
				url: apiCallParams,
				dataType: 'jsonp',
				jsonp: 'callback',
				jsonpCallback: 'app.jsonpCallback',
			});
			
		}); // end of listener callbck
	},
	
	onError: function(error){
		if(error.code == "1")
			$('#' + app.errorFriendlyName).html("Please enable location services on your mobile. We would like to know where you are so we can show you great beaches nearby.");
		else
			$('#' + app.errorFriendlyName).html("Oups.<br/>We did not want this to happen.<br/><br/>Please contact us with the following error message:");
		$('#' + app.errorMessageName).html("Code " + error.code + " - " + error.message);
		$('#' + app.errorContainerName).show();
	},
	
	toggleMap: function() {
		$('#' + app.mapContainerName).toggle();
	},
	
	showBeachLocation: function() {
		var center = new google.maps.LatLng($('#' + app.locationName).attr("data-lat"), $('#' + app.locationName).attr("data-lng"));
		
		app.mapObject.setZoom(11);
		app.mapObject.setCenter(center);
		$('#' + app.beachContainerName).hide();
		$('#' + app.mapContainerName).show();
	},
	
	onBackKeyDown: function() {
		switch(app.state) {
		case 'details':
			$('#' + app.searchContainer).removeClass('bluebox');
			$('#' + app.beachContainerName).hide();
			$('#' + app.mapContainerName).show();
			break;
		case 'searchresults':
			$('#' + app.searchInput).val('');
			$('#' + app.searchContainer).removeClass('search_error');
			$('#' + app.searchContainer).addClass('search_dropshadow');
			$('#' + app.searchContainer).removeClass('bluebox');
			$('#' + app.resultContainerName).hide();
			$('#' + app.resultContainerName).empty();
			$('#' + app.mapContainerName).show();
			break;
		default:
		}
	},
	
	clearMarkers: function() {
		for (var i = 1; i < app.markersArray.length; i++ ) {
			app.markersArray[i].setMap(null);
		}
		app.markersArray.length = 1;
	},
	
	closeDetails: function() {
		$('#' + app.searchContainer).removeClass('bluebox');
		$('#' + app.beachContainerName).hide();
		$('#' + app.mapContainerName).show();
	},
	
	jsonpCallback: function( data ) {

		// clear old markers
		app.clearMarkers();
	
		$.each(data, function(i, item) {
			var markerLatLng = new google.maps.LatLng(data[i].bLat, data[i].bLon);
			
			var marker = new google.maps.Marker({
				position: markerLatLng,
				map: app.mapObject,
				icon: app.markerImage,
				title: data[i].bInfo.bwname
			});
			
			google.maps.event.addListener(marker, 'click', function() {
				$('#' + app.searchContainer).addClass('bluebox');
				app.showBeachDetails(item);
			});
			
			// push markers to global array
			app.markersArray.push(marker);

		});
	},
	
	searchBeach: function() {
		
		var beachName = $('#' + app.searchInput).val();
		
		if(beachName.length < 3) {
			//$('#' + app.searchContainer).css('background-color', 'lightsalmon');
			if(beachName.length == 0)
				$('#' + app.searchContainer).removeClass('search_error');
			else
				$('#' + app.searchContainer).addClass('search_error');
			$('#' + app.searchContainer).addClass('search_dropshadow');
			$('#' + app.searchContainer).removeClass('bluebox');
			$('#' + app.resultContainerName).hide();
			$('#' + app.resultContainerName).empty();
			$('#' + app.mapContainerName).show();
			return;
		} else { 
			// design changes
			$('#' + app.searchContainer).removeClass('search_error');
			$('#' + app.searchContainer).removeClass('search_dropshadow');
			$('#' + app.searchContainer).removeClass('bluebox');
			//$('#' + app.searchContainer).css('background-color', 'white');
			}
        
		app.state = 'searchresults';
		
		// construct the api call parameters
		var apiCallParams = app.apiURL + '?s=' + beachName;
		$.ajax({
			url: apiCallParams,
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'app.jsonpSearchCallback',
		});
	},
	
	jsonpSearchCallback: function( data ) {
	
		// clear old results
		$('#' + app.resultContainerName).hide();
		$('#' + app.resultContainerName).empty();
		
		if(data.length > 0) {
			$('#' + app.mapContainerName).hide();

			// append search results
			var newHTML = '';
			$.each(data, function(i, item) {
				var tmplHTML = $('#' + app.resultContainerTmpl).html();
				tmplHTML = tmplHTML.replace('%BEACH_ID%', item.bID);
				tmplHTML = tmplHTML.replace('%BEACH_NAME%', item.bInfo.bwname.toLowerCase());
				tmplHTML = tmplHTML.replace('%BEACH_COUNTRY%', item.bInfo.bwco);
				
				$('#' + app.resultContainerName).append(tmplHTML);
				
				// add click event to div based on beach id
				$('#beach_' + item.bID).click( function() {
					
					// clear the search field & restore the background
					$('#' + app.searchInput).val('');
					$('#' + app.searchContainer).addClass('bluebox');
					
					$('#' + app.resultContainerName).hide();
					app.showBeachDetails(item);
				});
			});
		} // if no results
		else {
			$('#' + app.mapContainerName).hide();
			
			var tmplHTML = $('#' + app.resultContainerTmpl).html();
			tmplHTML = tmplHTML.replace('%BEACH_ID%', 'nothing');
			tmplHTML = tmplHTML.replace('%BEACH_NAME%', ' Sorry. No beach found.');
			tmplHTML = tmplHTML.replace('%BEACH_COUNTRY%', '');
			
			$('#' + app.resultContainerName).append(tmplHTML);
			
		} // else -> show no results message
		
		// show the container
		$('#' + app.searchContainer).removeClass('search_dropshadow');
		$('#' + app.resultContainerName).show();
	},
	
	showBeachDetails: function( beachData ) {
		var directionArray = {"N": "⬆", "NE": "↗", "E": "➡", "SE": "↘", "S": "⬇", "SW": "↙", "W": "⬅", "NW": "↖" };
		
		// get the html of the template, replace the parameters...
		var tmplHTML = $('#' + app.beachContainerTmpl).html();
		var newHTML = tmplHTML.replace('%BEACH_NAME%', beachData.bInfo.bwname);
		
		app.state = 'details';
		
		// beach rating
		var rating = Math.floor((Math.random() * 5) + 1);
		var ratinglist = "";
		
		for (i = 0; i < rating; i++) { 
			ratinglist += "<li class='star'></li>";
		}
		for (i = rating; i < 5; i++) { 
			ratinglist += "<li class='star dimmed'></li>";
		}
		newHTML = newHTML.replace('%RATING_STARS%', ratinglist);
		newHTML = newHTML.replace('%RATING_COUNT%', Math.floor((Math.random() * 50) + 1));
		
		// temperatures & wind speed
		newHTML = newHTML.replace('%WATER_TEMP%', beachData.bWeather.t_wa);
		newHTML = newHTML.replace('%WEATHER_TEMP%', beachData.bWeather.t_we);
		newHTML = newHTML.replace('%WIND_DIRECTION%', beachData.bWeather.w_di);
		newHTML = newHTML.replace('%WIND_DIRECTION_ARROW%', directionArray[beachData.bWeather.w_di]);
		newHTML = newHTML.replace('%WIND_SPEED%', beachData.bWeather.w_sp);
		
		// decide the smileys
		if(beachData.bWater.length == 1) {
			
			var beachSmiley = beachData.bWater[0].value;
			if(beachSmiley == 'Excellent' || beachSmiley == 'Good' || beachSmiley == 'OK') {
				newHTML = newHTML.replace('%FROWNY_ACTIVE_STATUS%', 'inactive');
				newHTML = newHTML.replace('%SMILEY_ACTIVE_STATUS%', 'active');
			} // if -> smiley
			else {
				newHTML = newHTML.replace('%FROWNY_ACTIVE_STATUS%', 'active');
				newHTML = newHTML.replace('%SMILEY_ACTIVE_STATUS%', 'inactive');
			} // else -> frowney
	
		} // if there is data
		else {
			newHTML = newHTML.replace('%FROWNY_ACTIVE_STATUS%', 'active');
			newHTML = newHTML.replace('%SMILEY_ACTIVE_STATUS%', 'inactive');
		} // else -> no measurements -> frowney
		
		var bClean = beachData.bClean;
		if(bClean == '1') {
			newHTML = newHTML.replace('%FROWNY_ACTIVE_CLEAN%', 'inactive');
			newHTML = newHTML.replace('%SMILEY_ACTIVE_CLEAN%', 'active');
			
			// no sticker
			newHTML = newHTML.replace('%BEACH_DETAILS_EVENT%', '');
			
		} // if beach is clean
		else {
			newHTML = newHTML.replace('%FROWNY_ACTIVE_CLEAN%', 'active');
			newHTML = newHTML.replace('%SMILEY_ACTIVE_CLEAN%', 'inactive');
			
			// show also the "garbage collection" event sticker
			var eventDetailsHTML = $('#' + app.eventContainerTmpl).html();
			newHTML = newHTML.replace('%BEACH_DETAILS_EVENT%', eventDetailsHTML);
			
		} // else -> not clean
		
		// and set the new data to the container
		$('#' + app.beachContainerName).html(newHTML);
		
		$('#' + app.locationName).attr("data-lat", beachData.bLat);
		$('#' + app.locationName).attr("data-lng", beachData.bLon);
		
		$('#' + app.beachContainerName).animate({width:'toggle'}, 300);
		$('#' + app.mapContainerName).hide();
	}
};
 
$('#search_input').bind("enterKey",function(e){
   app.searchBeach();
});
$('#search_input').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});
 
//google.maps.event.addDomListener(window, 'load', app.fakeTheMap());
app.initialize();