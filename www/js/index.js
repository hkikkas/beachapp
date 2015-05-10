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
	},
 
	onSuccess: function( position ) {

		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var myLatLng = new google.maps.LatLng(latitude, longitude);
 
		var mapOptions = {
			center: myLatLng,
			zoom: 11,
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
			zoom: 10,
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
		alert("the code is " + error.code + ". \n" + "message: " + error.message);
	},
	
	toggleMap: function() {
		$('#' + app.mapContainerName).toggle();
	},
	
	clearMarkers: function() {
		for (var i = 1; i < app.markersArray.length; i++ ) {
			app.markersArray[i].setMap(null);
		}
		app.markersArray.length = 1;
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
				app.showBeachDetails(item);
			});
			
			// push markers to global array
			app.markersArray.push(marker);

		});
	},
	
	searchBeach: function( beachName ) {
		
		if(beachName.length < 3)
			return;
		
		// construct the api call parameters
		var apiCallParams = app.apiURL + '?s=beachName';
		$.ajax({
			url: apiCallParams,
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'app.jsonpSearchCallback',
		});
	},
	
	jsonpSearchCallback: function( data ) {
	
		$.each(data, function(i, item) {
			
			
		});
	},
	
	showBeachDetails: function( beachData ) {
		
		// get the html of the template, replace the parameters...
		var currentHTML = $('#' + app.beachContainerTmpl).html();
		var newHTML = currentHTML.replace('%BEACH_NAME%', beachData.bInfo.bwname);
		
		// temperatures & wind speed
		newHTML = newHTML.replace('%WATER_TEMP%', beachData.bWeather.t_wa);
		newHTML = newHTML.replace('%WEATHER_TEMP%', beachData.bWeather.t_we);
		newHTML = newHTML.replace('%WIND_DIRECTION%', beachData.bWeather.w_di);
		newHTML = newHTML.replace('%WIND_SPEED%', beachData.bWeather.w_sp);
		
		// decide the smileys
		if(beachData.bWater.length == 1) {
			
			var beachSmiley = beachData.bWater[0].value;
			if(beachSmiley == 'Excellent' || beachSmiley == 'Good' || beachSmiley == 'OK') {
				newHTML = newHTML.replace('%FROWNY_ACTIVE%', 'inactive');
				newHTML = newHTML.replace('%SMILEY_ACTIVE%', 'active');
			} // if -> smiley
			else {
				newHTML = newHTML.replace('%FROWNY_ACTIVE%', 'active');
				newHTML = newHTML.replace('%SMILEY_ACTIVE%', 'inactive');
			} // else -> frowney
	
		} // if there is data
		else {
			newHTML = newHTML.replace('%FROWNY_ACTIVE%', 'active');
			newHTML = newHTML.replace('%SMILEY_ACTIVE%', 'inactive');
		} // else -> no measurements -> frowney
		
		// and set the new data to the container
		$('#' + app.beachContainerName).html(newHTML);
		
		$('#' + app.beachContainerName).animate({width:'toggle'}, 300);
		$('#map').hide();
	}
};
 
//google.maps.event.addDomListener(window, 'load', app.fakeTheMap());
app.initialize();
