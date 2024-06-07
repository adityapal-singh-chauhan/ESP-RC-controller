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
  function print_message(messg)
    {//document.write ("dsvsdvsdv") ;
			let header = document.querySelector("h3");
		header.innerText = messg;
		// or
		//header.innerHTML = "My message";
			}
function start_kaam() {
	if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
    DeviceMotionEvent.requestPermission(); }
	
    window.addEventListener("deviceorientation", handleOrientation);
	if (cali_done) {
		socket_send();
	}else{
		calibration();
	}
}

var cali_done = false;
function calibrate() {
	
	cali = true;
}

function handleOrientation(event) {
	var x = event.alpha.toFixed();
	var y = event.beta.toFixed();
	var z = event.gamma.toFixed();
	var gyro_data = x << 18 | y << 9 | z;
	gyro_data = 'G' + gyro_data.toString(16);
	socket.send(gyro_data);
    updateFieldIfNotNull('Orientation_a', x);
    updateFieldIfNotNull('Orientation_b', y);
    updateFieldIfNotNull('Orientation_g', z);
}

function updateFieldIfNotNull(fieldName, value){
    if (value != null)
     document.getElementById(fieldName).innerHTML = value;
}

	
/*
function send_data() {
	var throttle =  document.getElementById('t').value;
	var rudder = document.getElementById('r').value;
	
	var slider_data = rudder << 10 | throttle;  
	var slider_data = '#' + slider_data.toString(16);
	socket.send(slider_data);
}
*/