var x_axis,y_axis,z_axis;
var cali_done = false;
var data;
var x_max = 0;
var x_min = 0;
var y_max = 0;
var y_min = 0;
var z_max = 0; 
var z_min = 0;
var elevatorServo_min = 0;
var elevatorServo_max = 90;
var rudderServo_min = 0;
var rudderServo_max = 90;
var elevator;
var rudder;
var throttle = 0;
 
var socket = new WebSocket('wss://'+location.hostname+'/wss',['arduino']);
socket.onopen = function () {
    socket.send('Connect ' + new Date());
};
socket.onerror = function (error) {
    console.log('WebSocket Error ', error);
};
socket.onmessage = function (e) {  
    console.log('Server: ', e.data);
};
socket.onclose = function(){
    console.log('WebSocket socket closed');
};

function cali_finish() {
	cali_done = true;
	//document.getElementById("calidone").disabled = true;
}

function accelro_start(){
	if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
    DeviceMotionEvent.requestPermission(); }
	window.addEventListener("deviceorientation", handleOrientation);
	
}

function handleOrientation(event) {
	x_axis = parseInt(event.alpha.toFixed());
	y_axis = parseInt(event.beta.toFixed());
	z_axis = parseInt(event.gamma.toFixed());
	if (cali_done) {
		rudder = map(y_axis,y_min,y_max,rudderServo_min,rudderServo_max);
		elevator = map(z_axis,z_min,z_max,elevatorServo_min,elevatorServo_max);
		throttle = document.getElementById('throttle').value;
		//rudder = y_axis;
		//elevator = z_axis;
		//throttle = 0;
		var data = rudder << 16 | elevator << 8 | throttle;
		data = 'D' + data.toString(16);
		socket.send(data);
	}else{
		calibration();
	}
	updateFieldIfNotNull('orientation_x', x_axis);
    updateFieldIfNotNull('orientation_y', y_axis);
    updateFieldIfNotNull('orientation_z', z_axis);
	updateFieldIfNotNull('Max_x',x_max);
	updateFieldIfNotNull('Max_y',y_max);
	updateFieldIfNotNull('Max_z',z_max);
	updateFieldIfNotNull('Min_x',x_min);
	updateFieldIfNotNull('Min_y',y_min);
	updateFieldIfNotNull('Min_z',z_min);
}

function updateFieldIfNotNull(fieldName, value){
    if (value != null)
     document.getElementById(fieldName).innerHTML = value;
}

function calibration() {
	if (x_axis >= x_max) {
		x_max = x_axis;
	}
	if (x_axis <= x_min){
		x_min = x_axis;
	}
	if (y_axis >= y_max) {
		y_max = y_axis;
	}
	if (y_axis <= y_min){
		y_min = y_axis;
	}
	if (z_axis >= z_max) {
		z_max = z_axis;
	}
	if (z_axis <= z_min){
		z_min = z_axis;
	}
}
function map(value, in_min, in_max, to_min, to_max) {
	var mapped_value = Math.min(to_max, Math.max(to_min, ((value - in_min)*(to_max - to_min))/(in_max - in_min) + to_min));
	return mapped_value
}