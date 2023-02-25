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

function radToFormattedDeg(angle_rad) {
  const angle_deg = (180.0 * angle_rad) / Math.PI;
  const angle_deg_str = angle_deg.toFixed(2);
  const sign_fixed = angle_deg_str == "-0.00" ? "0.00" : angle_deg_str;
  return sign_fixed.replace(/.00$/, ""); // If integer then remove fractional portion.
}

function render() {
  renderer.render(scene, camera);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  updateTexts("zyx");

  updateTexts("xyz");

  camera_controls.update(); // Update the OrbitControls
  render();
}
animate();

function degToRad(angle_deg) {
  return (Math.PI * Number(angle_deg)) / 180.0;
}

// Define events for textboxes.

addEventListenersToTextBoxes("zyx");
addEventListenersToTextBoxes("xyz");

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
