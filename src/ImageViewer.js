import React from "react";

export default class ImageViewer extends React.Component {
  componentDidUpdate() {
    // console.log("ImageViewer update");
  }
  render() {
    // console.log("ImageViewer render()")
    const points = this.props.points;
    const pointSVGs = points.map(point => {
      return (
        <circle
          cx={point.x}
          cy={point.y}
          key={point.id}
          r="2"
          stroke="blanchedalmond"
          fill="red"
          onClick={e => this.props.onDotClick(e, point.id)}
        />
      );
    });

    var inputStyle = { flexGrow: "1" };
    return (
      <div className="imageViewer-conainer">
        <div className="imageViewer-controls">
          <button onClick={this.props.onZoomOut}>-</button>
          <button onClick={this.props.onZoomIn}>+</button>
          <input
            type="url"
            value={this.props.urlTXT}
            onChange={this.props.onChange}
            style={inputStyle}
          />
          <button onClick={this.props.onLoad}>Load</button>
          <button onClick={this.props.onPrevImg}> &lt; </button>
          <button onClick={this.props.onNextImg}> > </button>
        </div>
        <div className="image-container">
          {this.props.imageUrl && (
            <div style={this.props.style} className="zoom-ize">
              <img
                src={this.props.imageUrl}
                alt="dik miez??"
                className="image"
              ></img>
              <svg className="svg" onClick={this.props.onClick}>
                {pointSVGs}
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }
}
