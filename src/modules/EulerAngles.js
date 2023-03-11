"use strict";

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

class EulerAngles extends React.Component {
  handleChangeA = (event) => {
    this.setState({ value: event.target.value });

    const order = this.props.order.toUpperCase();
    const frame = this.props.frame;
    const a_rad = degToRad(event.currentTarget.value);
    if (isNaN(a_rad) == false) {
      const euler_angles = frame.rotation.reorder(order);
      const b_rad = euler_angles.y;
      const c_rad = euler_angles.z;
      frame.rotation.set(a_rad, b_rad, c_rad, order);
    }
  };

  handleChangeB = (event) => {
    this.setState({ value: event.target.value });

    const order = this.props.order.toUpperCase();
    const frame = this.props.frame;
    const b_rad = degToRad(event.currentTarget.value);
    if (isNaN(b_rad) == false) {
      const euler_angles = frame.rotation.reorder(order);
      const a_rad = euler_angles.x;
      const c_rad = euler_angles.z;
      frame.rotation.set(a_rad, b_rad, c_rad, order);
    }
  };

  handleChangeC = (event) => {
    this.setState({ value: event.target.value });

    const order = this.props.order.toUpperCase();
    const frame = this.props.frame;
    const c_rad = degToRad(event.currentTarget.value);
    if (isNaN(c_rad) == false) {
      const euler_angles = frame.rotation.reorder(order);
      const a_rad = euler_angles.x;
      const b_rad = euler_angles.y;
      frame.rotation.set(a_rad, b_rad, c_rad, order);
    }
  };

  render() {
    const order = this.props.order.toLowerCase();
    const euler_angles = this.props.frame.rotation
      .clone()
      .reorder(order.toUpperCase());
    const a = radToFormattedDeg(euler_angles.x);
    const b = radToFormattedDeg(euler_angles.y);
    const c = radToFormattedDeg(euler_angles.z);

    return (
      <div className="euler-angles">
        <span>
          Intrinsic-{order.toUpperCase()}: {`(${a}_deg, ${b}_deg, ${c}_deg)`}
        </span>
        <p>
          <label>
            A:
            <input type="number" value={a} onChange={this.handleChangeA} />
          </label>
          <label>
            B:
            <input type="number" value={b} onChange={this.handleChangeB} />
          </label>
          <label>
            C:
            <input type="number" value={c} onChange={this.handleChangeC} />
          </label>
        </p>
      </div>
    );
  }
}
