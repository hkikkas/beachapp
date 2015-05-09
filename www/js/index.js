var app = {
	
	apiURL: "http://beachspot.org/test/",
	
	mapContainerName: "map",
	mapObject: "",
	mapBounds: new google.maps.LatLngBounds(),
	
	markersArray: [],
	markerImage: 'img/map/marker2.png',
	mylocationImage: 'img/map/mylocation.png',
	
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
 
	onSuccess: function(position) {

		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var myLatLong = new google.maps.LatLng(latitude, longitude);
 
		var mapOptions = {
			center: myLatLong,
			zoom: 11,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		app.mapObject = new google.maps.Map(document.getElementById(app.mapContainerName), mapOptions);

		var marker = new google.maps.Marker({
				position: myLatLong,
				map: app.mapObject,
				icon: app.mylocationImage,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				title: "Your location"
			});
			
		// push markers to global array
		app.markersArray.push(marker);
		
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
		
		var myLatlng = new google.maps.LatLng(59.4425, 24.634);
		var mapOptions = {
			zoom: 10,
			center: myLatlng
		}
		app.mapObject = new google.maps.Map(document.getElementById(app.mapContainerName), mapOptions);
			
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: app.mapObject,
			icon: app.mylocationImage,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			title: "Your location"
		});
			
		// push markers to global array
		app.markersArray.push(marker);
		
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
			var markerLatlng = new google.maps.LatLng(data[i].bLat, data[i].bLon);
			
			var marker = new google.maps.Marker({
				position: markerLatlng,
				map: app.mapObject,
				icon: app.markerImage,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				title: data[i].bInfo.bwname
			});
			
			// push markers to global array
			app.markersArray.push(marker);

		});
	}
};
 
//google.maps.event.addDomListener(window, 'load', app.fakeTheMap());
app.initialize();
