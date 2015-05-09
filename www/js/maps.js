var app = {
	
	mapContainerId: 'map-canvas',
	
	// Application Constructor
	initialize: function() {
		this.bindEvents();
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
 
	onSuccess: function(position){
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		var latLong = new google.maps.LatLng(latitude, longitude);
 
		var mapOptions = {
			center: latLong,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
 
		var map = new google.maps.Map(document.getElementById(this.mapContainerId), mapOptions);
	
		var marker = new google.maps.Marker({
			  position: latLong,
			  map: map,
			  title: 'my location'
		  });
	},
	
	fakeTheMap : function() {
		var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
		var mapOptions = {
			zoom: 12,
			center: myLatlng
		}
		var map = new google.maps.Map(document.getElementById(this.mapContainerId), mapOptions);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: 'Hello World!'
		});
	},
	
	onError: function(error){
		alert("the code is " + error.code + ". \n" + "message: " + error.message);
	},
};
 
//google.maps.event.addDomListener(window, 'load', app.fakeTheMap());
app.initialize();