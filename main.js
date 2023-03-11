"use strict";

// Create a camera

var canvas_element = document.querySelector("#canvasContainer");

var camera = new THREE.PerspectiveCamera(60, canvas_element.clientWidth / canvas_element.clientHeight, 0.001, 1000);
camera.position.set(2, 2, 2);
camera.up.set(0, 0, 1);
var look_at_vector = new THREE.Vector3(0, 0, 0.4);
camera.lookAt(look_at_vector);

// Create a scene
var scene = new THREE.Scene();
scene.add(objects.createWorldCoordinateFrame());

// Add ambient light.
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light.
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create the coordinate frame to be rotated.
var frame = objects.createCoordinateFrame();
scene.add(frame);

// Create a renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas")
});
renderer.setSize(canvas_element.clientWidth, canvas_element.clientHeight);

var camera_controls = new THREE.OrbitControls(camera, renderer.domElement);

// TransformControls
var transform_controls = new THREE.TransformControls(camera, renderer.domElement);
transform_controls.setMode("rotate");
transform_controls.setSpace("local");

transform_controls.attach(frame);
scene.add(transform_controls);

transform_controls.addEventListener("change", render);

transform_controls.addEventListener("dragging-changed", function (event) {
  camera_controls.enabled = !event.value;
});

function formatNumber(number) {
  var fixed_point = number.toFixed(2);
  var sign_corrected = fixed_point == "-0.00" ? "0.00" : fixed_point;
  return sign_corrected.replace(/.00$/, ""); // If integer then remove fractional portion.
}

function radToFormattedDeg(angle_rad) {
  var angle_deg = 180.0 * angle_rad / Math.PI;
  return formatNumber(angle_deg);
}

function degToRad(angle_deg) {
  return Math.PI * Number(angle_deg) / 180.0;
}

/**
 *
 * @param {THREE.Quaternion} q
 * @returns
 */
function quaternionToRotationVector(q) {
  var angle_rad = 2 * Math.acos(q.w);
  var rotation_axis = new THREE.Vector3().set(q.x, q.y, q.z);
  if (Math.abs(angle_rad) > 0.0001) {
    var sin = Math.sin(angle_rad / 2);
    rotation_axis.divideScalar(sin);
  }
  return rotation_axis.multiplyScalar(angle_rad);
}

function updateTextOfRotationVector() {
  var rotation_vector = quaternionToRotationVector(frame.quaternion);
  var a_deg = radToFormattedDeg(rotation_vector.x);
  var b_deg = radToFormattedDeg(rotation_vector.y);
  var c_deg = radToFormattedDeg(rotation_vector.z);
  var a_rad = formatNumber(rotation_vector.x);
  var b_rad = formatNumber(rotation_vector.y);
  var c_rad = formatNumber(rotation_vector.z);
  var div_id = "#rotation-vector";
  var tuple = "(" + a_deg + "_deg, " + b_deg + "_deg, " + c_deg + "_deg), (" + a_rad + "_rad, " + b_rad + "_rad, " + c_rad + "_rad)";
  document.querySelector(div_id + " .tuple").textContent = tuple;
  document.querySelector(div_id + " .a").value = a_deg;
  document.querySelector(div_id + " .b").value = b_deg;
  document.querySelector(div_id + " .c").value = c_deg;
}

function addEventListenersToTextBoxesOfRotationVector() {
  document.querySelector("#rotation-vector .a").addEventListener("input", function (event) {
    var a_rad = degToRad(event.currentTarget.value);
    var b_rad = degToRad(document.querySelector("#rotation-vector .b").value);
    var c_rad = degToRad(document.querySelector("#rotation-vector .c").value);
    if (isNaN(a_rad) == false && isNaN(b_rad) == false && isNaN(c_rad) == false) {
      var angle_rad = Math.sqrt(a_rad * a_rad + b_rad * b_rad + c_rad * c_rad);

      var rotation_axis = angle_rad == 0.0 ? new TREE.Vector3() : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

      frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
    }
  });

  document.querySelector("#rotation-vector .b").addEventListener("input", function (event) {
    var a_rad = degToRad(document.querySelector("#rotation-vector .a").value);
    var b_rad = degToRad(event.currentTarget.value);
    var c_rad = degToRad(document.querySelector("#rotation-vector .c").value);
    if (isNaN(a_rad) == false && isNaN(b_rad) == false && isNaN(c_rad) == false) {
      var angle_rad = Math.sqrt(a_rad * a_rad + b_rad * b_rad + c_rad * c_rad);

      var rotation_axis = angle_rad == 0.0 ? new TREE.Vector3() : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

      frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
    }
  });

  document.querySelector("#rotation-vector .c").addEventListener("input", function (event) {
    var a_rad = degToRad(document.querySelector("#rotation-vector .a").value);
    var b_rad = degToRad(document.querySelector("#rotation-vector .b").value);
    var c_rad = degToRad(event.currentTarget.value);

    if (isNaN(a_rad) == false && isNaN(b_rad) == false && isNaN(c_rad) == false) {
      var angle_rad = Math.sqrt(a_rad * a_rad + b_rad * b_rad + c_rad * c_rad);

      var rotation_axis = angle_rad == 0.0 ? new TREE.Vector3() : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

      frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
    }
  });
}

function render() {
  renderer.render(scene, camera);
}

// Render the scene
var root = ReactDOM.createRoot(document.querySelector("#euler-angles-container"));
function Indicator(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(EulerAngles, { order: "zyx", frame: props.frame }),
    React.createElement(EulerAngles, { order: "xyz", frame: props.frame })
  );
}

function animate() {
  requestAnimationFrame(animate);

  camera_controls.update(); // Update the OrbitControls
  render();

  // Update the indicator.
  root.render(React.createElement(Indicator, { frame: frame }));
  updateTextOfRotationVector();
}
animate();

// Define events for text boxes.
addEventListenersToTextBoxesOfRotationVector();