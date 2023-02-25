function createWorldCoordinateFrame(segment_length = 4) {
  const group = new THREE.Group();

  // Create a coodinate frame.
  const world_frame = new THREE.AxesHelper(segment_length);
  group.add(world_frame);

  // Segments of negative part.
  const line_material = new THREE.LineBasicMaterial({ color: 0x333333 });

  // Negative part of the x-axis.
  const origin = new THREE.Vector3(0, 0, 0);
  const x_negative_geometry = new THREE.BufferGeometry().setFromPoints([
    origin,
    new THREE.Vector3(-segment_length, 0, 0),
  ]);
  const x_negative_line = new THREE.Line(x_negative_geometry, line_material);
  group.add(x_negative_line);

  // Negative part of the y-axis.
  const y_negative_geometry = new THREE.BufferGeometry().setFromPoints([
    origin,
    new THREE.Vector3(0, -segment_length, 0),
  ]);
  const y_negative_line = new THREE.Line(y_negative_geometry, line_material);
  group.add(y_negative_line);

  // Negative part of the z-axis.
  const z_negative_geometry = new THREE.BufferGeometry().setFromPoints([
    origin,
    new THREE.Vector3(0, 0, -segment_length),
  ]);
  const z_negative_line = new THREE.Line(z_negative_geometry, line_material);
  group.add(z_negative_line);

  return group;
}

/**
 * Create an arrow object.
 * @param {THREE.Vector3} direction - directinal vector.
 * @param {float} length
 * @param {THREE.Color} color
 * @returns THREE.Group
 */
function createArrow(direction, length, color) {
  const arrow = new THREE.Group();

  // Create the line segment part.
  const line_segment_geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, length, 0),
  ]);
  const line_segment_material = new THREE.LineBasicMaterial({ color: color });
  const line_segment = new THREE.Line(
    line_segment_geometry,
    line_segment_material
  );
  arrow.add(line_segment);

  // Create the head part.
  const HEAD_RATIO = 0.2;
  const head_geometry = new THREE.ConeGeometry(0.1, HEAD_RATIO * length, 32);
  const head_material = new THREE.MeshLambertMaterial({ color: color });
  const head = new THREE.Mesh(head_geometry, head_material);
  head.position.set(0, length * (1 - HEAD_RATIO / 2), 0); // Translate the cone to the head.
  line_segment.add(head);

  // Set direction.
  var quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return arrow.applyQuaternion(quaternion);
}

/**
 * Create a coordinate frame object.
 * @returns THREE.Group
 */
function createCoordinateFrame() {
  const frame = new THREE.Group();

  const origin_geometry = new THREE.SphereGeometry(0.1, 20, 20);
  const origin_material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const origin = new THREE.Mesh(origin_geometry, origin_material);
  frame.add(origin);

  const ARROW_LENGTH = 1;
  const x_axis = createArrow(
    new THREE.Vector3(1, 0, 0),
    ARROW_LENGTH,
    0xff0000
  );
  origin.add(x_axis);

  const y_axis = createArrow(
    new THREE.Vector3(0, 1, 0),
    ARROW_LENGTH,
    0x00ff00
  );
  origin.add(y_axis);

  const z_axis = createArrow(
    new THREE.Vector3(0, 0, 1),
    ARROW_LENGTH,
    0x0000ff
  );
  origin.add(z_axis);

  const wrapper_geometry = new THREE.SphereGeometry(1, 20, 20);
  const wrapper_material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });
  const wrapper = new THREE.Mesh(wrapper_geometry, wrapper_material);
  frame.add(wrapper);

  return frame;
}

/**
 *
 * @param {float} grid_unit - Interval of grid [m].
 * @param {float} plane_size - Side length of the ground plane [m].
 * @returns
 */
function createCoordinatePlanes(grid_unit = 0.5, plane_size = 6) {
  const step = plane_size / grid_unit;

  const planes = new THREE.Group();

  const xy_plane = new THREE.GridHelper(plane_size, step, 0x888888, 0x333333);
  xy_plane.rotateX(Math.PI / 2);
  planes.add(xy_plane);

  const yz_plane = new THREE.GridHelper(plane_size, step, 0x888888, 0x333333);
  yz_plane.rotateZ(Math.PI / 2);
  planes.add(yz_plane);

  const zx_plane = new THREE.GridHelper(plane_size, step, 0x888888, 0x333333);
  planes.add(zx_plane);

  return planes;
}
