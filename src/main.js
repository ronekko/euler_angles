import { EulerAngles } from "./modules/EulerAngles.js";

// Create a camera
const canvas_element = document.querySelector("#canvasContainer");

const camera = new THREE.PerspectiveCamera(
  60,
  canvas_element.clientWidth / canvas_element.clientHeight,
  0.001,
  1000
);
camera.position.set(2, 2, 2);
camera.up.set(0, 0, 1);
const look_at_vector = new THREE.Vector3(0, 0, 0.4);
camera.lookAt(look_at_vector);

// Create a scene
const scene = new THREE.Scene();
scene.add(objects.createWorldCoordinateFrame());

// Add ambient light.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light.
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create the coordinate frame to be rotated.
const frame = objects.createCoordinateFrame();
scene.add(frame);

// Create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setSize(canvas_element.clientWidth, canvas_element.clientHeight);

const camera_controls = new THREE.OrbitControls(camera, renderer.domElement);

// TransformControls
const transform_controls = new THREE.TransformControls(
  camera,
  renderer.domElement
);
transform_controls.setMode("rotate");
transform_controls.setSpace("local");

transform_controls.attach(frame);
scene.add(transform_controls);

transform_controls.addEventListener("change", render);

transform_controls.addEventListener("dragging-changed", function (event) {
  camera_controls.enabled = !event.value;
});

function formatNumber(number) {
  const fixed_point = number.toFixed(2);
  const sign_corrected = fixed_point == "-0.00" ? "0.00" : fixed_point;
  return sign_corrected.replace(/.00$/, ""); // If integer then remove fractional portion.
}

function radToFormattedDeg(angle_rad) {
  const angle_deg = (180.0 * angle_rad) / Math.PI;
  return formatNumber(angle_deg);
}

function degToRad(angle_deg) {
  return (Math.PI * Number(angle_deg)) / 180.0;
}

/**
 *
 * @param {String} euler_angles_order - order of rotation axes, e.g., "zyx" or "xzx".
 */
function updateTexts(euler_angles_order) {
  const euler_angles = frame.rotation
    .clone()
    .reorder(euler_angles_order.toUpperCase());
  const a = radToFormattedDeg(euler_angles.x);
  const b = radToFormattedDeg(euler_angles.y);
  const c = radToFormattedDeg(euler_angles.z);
  const div_id = `#intrinsic-${euler_angles_order}`;
  const tuple = `(${a}_deg, ${b}_deg, ${c}_deg)`;
  document.querySelector(`${div_id} .tuple`).textContent = tuple;
  document.querySelector(`${div_id} .a`).value = a;
  document.querySelector(`${div_id} .b`).value = b;
  document.querySelector(`${div_id} .c`).value = c;
}

/**
 *
 * @param {String} euler_angles_order - order of rotation axes, e.g., "zyx" or "xzx".
 */
function addEventListenersToTextBoxes(euler_angles_order) {
  document
    .querySelector(`#intrinsic-${euler_angles_order} .a`)
    .addEventListener("input", function (event) {
      const a_rad = degToRad(event.currentTarget.value);
      if (isNaN(a_rad) == false) {
        const euler_angles = frame.rotation.reorder(
          euler_angles_order.toUpperCase()
        );
        const b_rad = euler_angles.y;
        const c_rad = euler_angles.z;
        frame.rotation.set(
          a_rad,
          b_rad,
          c_rad,
          euler_angles_order.toUpperCase()
        );
      }
    });

  document
    .querySelector(`#intrinsic-${euler_angles_order} .b`)
    .addEventListener("input", function (event) {
      const b_rad = degToRad(event.currentTarget.value);
      if (isNaN(b_rad) == false) {
        const euler_angles = frame.rotation.reorder(
          euler_angles_order.toUpperCase()
        );
        const a_rad = euler_angles.x;
        const c_rad = euler_angles.z;
        frame.rotation.set(
          a_rad,
          b_rad,
          c_rad,
          euler_angles_order.toUpperCase()
        );
      }
    });

  document
    .querySelector(`#intrinsic-${euler_angles_order} .c`)
    .addEventListener("input", function (event) {
      const c_rad = degToRad(event.currentTarget.value);
      if (isNaN(c_rad) == false) {
        const euler_angles = frame.rotation.reorder(
          euler_angles_order.toUpperCase()
        );
        const a_rad = euler_angles.x;
        const b_rad = euler_angles.y;
        frame.rotation.set(
          a_rad,
          b_rad,
          c_rad,
          euler_angles_order.toUpperCase()
        );
      }
    });
}

/**
 *
 * @param {THREE.Quaternion} q
 * @returns
 */
function quaternionToRotationVector(q) {
  const angle_rad = 2 * Math.acos(q.w);
  const rotation_axis = new THREE.Vector3().set(q.x, q.y, q.z);
  if (Math.abs(angle_rad) > 0.0001) {
    const sin = Math.sin(angle_rad / 2);
    rotation_axis.divideScalar(sin);
  }
  return rotation_axis.multiplyScalar(angle_rad);
}

function updateTextOfRotationVector() {
  const rotation_vector = quaternionToRotationVector(frame.quaternion);
  const a_deg = radToFormattedDeg(rotation_vector.x);
  const b_deg = radToFormattedDeg(rotation_vector.y);
  const c_deg = radToFormattedDeg(rotation_vector.z);
  const a_rad = formatNumber(rotation_vector.x);
  const b_rad = formatNumber(rotation_vector.y);
  const c_rad = formatNumber(rotation_vector.z);
  const div_id = "#rotation-vector";
  const tuple = `(${a_deg}_deg, ${b_deg}_deg, ${c_deg}_deg), (${a_rad}_rad, ${b_rad}_rad, ${c_rad}_rad)`;
  document.querySelector(`${div_id} .tuple`).textContent = tuple;
  document.querySelector(`${div_id} .a`).value = a_deg;
  document.querySelector(`${div_id} .b`).value = b_deg;
  document.querySelector(`${div_id} .c`).value = c_deg;
}

function addEventListenersToTextBoxesOfRotationVector() {
  document
    .querySelector(`#rotation-vector .a`)
    .addEventListener("input", function (event) {
      const a_rad = degToRad(event.currentTarget.value);
      const b_rad = degToRad(
        document.querySelector("#rotation-vector .b").value
      );
      const c_rad = degToRad(
        document.querySelector("#rotation-vector .c").value
      );
      if (
        isNaN(a_rad) == false &&
        isNaN(b_rad) == false &&
        isNaN(c_rad) == false
      ) {
        const angle_rad = Math.sqrt(
          a_rad * a_rad + b_rad * b_rad + c_rad * c_rad
        );

        const rotation_axis =
          angle_rad == 0.0
            ? new TREE.Vector3()
            : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

        frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
      }
    });

  document
    .querySelector(`#rotation-vector .b`)
    .addEventListener("input", function (event) {
      const a_rad = degToRad(
        document.querySelector("#rotation-vector .a").value
      );
      const b_rad = degToRad(event.currentTarget.value);
      const c_rad = degToRad(
        document.querySelector("#rotation-vector .c").value
      );
      if (
        isNaN(a_rad) == false &&
        isNaN(b_rad) == false &&
        isNaN(c_rad) == false
      ) {
        const angle_rad = Math.sqrt(
          a_rad * a_rad + b_rad * b_rad + c_rad * c_rad
        );

        const rotation_axis =
          angle_rad == 0.0
            ? new TREE.Vector3()
            : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

        frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
      }
    });

  document
    .querySelector(`#rotation-vector .c`)
    .addEventListener("input", function (event) {
      const a_rad = degToRad(
        document.querySelector("#rotation-vector .a").value
      );
      const b_rad = degToRad(
        document.querySelector("#rotation-vector .b").value
      );
      const c_rad = degToRad(event.currentTarget.value);

      if (
        isNaN(a_rad) == false &&
        isNaN(b_rad) == false &&
        isNaN(c_rad) == false
      ) {
        const angle_rad = Math.sqrt(
          a_rad * a_rad + b_rad * b_rad + c_rad * c_rad
        );

        const rotation_axis =
          angle_rad == 0.0
            ? new TREE.Vector3()
            : new THREE.Vector3(a_rad, b_rad, c_rad).divideScalar(angle_rad);

        frame.setRotationFromAxisAngle(rotation_axis, angle_rad);
      }
    });
}

function render() {
  renderer.render(scene, camera);
}

// Render the scene
const root = ReactDOM.createRoot(
  document.querySelector("#euler-angles-container")
);
function Indicator(props) {
  return (
    <div>
      <EulerAngles order="zyx" frame={props.frame} />
      <EulerAngles order="xyz" frame={props.frame} />
    </div>
  );
}

function animate() {
  requestAnimationFrame(animate);

  camera_controls.update(); // Update the OrbitControls
  render();

  // Update the indicator.
  root.render(<Indicator frame={frame} />);
  updateTextOfRotationVector();
}
animate();

// Define events for text boxes.

addEventListenersToTextBoxes("zyx");
addEventListenersToTextBoxes("xyz");
addEventListenersToTextBoxesOfRotationVector();
