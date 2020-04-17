import React from "react";
import "./App.css";
import ImageViewer from "./ImageViewer";


const initialState = {
  points: [],
  imageUrl: "",
  urlTXT: "",
  zoom: 1,
  style: { transform: "scale(1)" },
  forceRender: "",
  fileNames: [],
  basePath: "",
  imageIndex: 0,
  imagePoints: []
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClick(event) {
    let newImagePoints = JSON.parse(JSON.stringify(this.state.imagePoints));

    newImagePoints[this.state.imageIndex].points.push({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
      id: Date.now()
    });

    this.setState({
      imagePoints: newImagePoints
    });
  }

  calcJSON(imagePoints) {
    let imagePointsJSON = JSON.parse(JSON.stringify(imagePoints));

    imagePointsJSON = imagePointsJSON.filter(image => image.points.length > 0);

    imagePointsJSON.forEach(image => {
      image.points.map(point => {
        delete point.id;
        return point;
      });
    });

    return JSON.stringify(imagePointsJSON, null, 4);
  }

  handleZoomIn() {
    const zoom = this.state.zoom + 0.2;
    const style = { transform: `scale(${zoom})` };

    this.setState({
      zoom: zoom,
      style: style,
      forceRender: Date.now()
    });

    this.forceUpdate();
  }

  handleZoomOut() {
    const zoom = this.state.zoom - 0.2;
    const style = { transform: `scale(${zoom})` };

    this.setState({
      zoom: zoom,
      style: style,
      forceRender: Date.now()
    });
  }

  handleChange(e) {
    this.setState({
      urlTXT: e.target.value
    });
  }

  loadResult(result) {
    const newUrl = this.state.urlTXT;

    let imagePoints = [];
    result.files.forEach(file => {
      imagePoints.push({
        fileName: file,
        points: []
      });
    });

    this.setState({
      ...initialState,
      imageUrl: newUrl + result.files[0],
      urlTXT: newUrl,
      basePath: newUrl,
      fileNames: result.files,
      imagePoints: imagePoints
    });
  }

  handleLoad() {
    if (!this.state.urlTXT) {
      return
    }

    const requestUrl = this.state.urlTXT + "images.json";

    fetch(requestUrl)
      .then(res => res.json())
      .then(
        result => this.loadResult(result),
        error => {
          this.setState({
            error
          });
        }
      );
  }

  handlePrevImg() {
    const imageIndex = this.state.imageIndex - 1;

    if (imageIndex < 0) {
      return;
    }

    const imageUrl = this.state.basePath + this.state.fileNames[imageIndex];
    this.setState({
      imageUrl: imageUrl,
      imageIndex: imageIndex
    });
  }
  oldimagePoints;

  handleNextImg() {
    const imageIndex = this.state.imageIndex + 1;

    if (imageIndex > this.state.fileNames.length - 1) {
      return;
    }

    const imageUrl = this.state.basePath + this.state.fileNames[imageIndex];
    this.setState({
      imageUrl: imageUrl,
      imageIndex: imageIndex
    });
  }

  handleDotClick(e, id) {
    e.preventDefault();
    e.stopPropagation();

    let imagePoints = JSON.parse(JSON.stringify(this.state.imagePoints));
    const i = this.state.imageIndex;

    imagePoints[i].points = imagePoints[i].points.filter(point => point.id !== id);

    //const imagePoints = points.filter(point => point.id !== id);

    this.setState({
      imagePoints: imagePoints
    });
  }

  handleCopy() {
    /* Get the text field */
    var copyText = document.getElementById("json-textarea");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
  }

  render() {
    let points = [];
    if(this.state.imagePoints.length) {
      points = this.state.imagePoints[this.state.imageIndex].points;
    }

    return (
      <div className="App">
        <div className="viewer-container">
          <ImageViewer
            imageUrl={this.state.imageUrl}
            onClick={e => this.handleClick(e)}
            onZoomIn={() => this.handleZoomIn()}
            onZoomOut={() => this.handleZoomOut()}
            style={this.state.style}
            points={points}
            onChange={e => this.handleChange(e)}
            urlTXT={this.state.urlTXT}
            onLoad={() => this.handleLoad()}
            onDotClick={(e, id) => this.handleDotClick(e, id)}
            onPrevImg={() => this.handlePrevImg()}
            onNextImg={() => this.handleNextImg()}
          />
        </div>
        <div className="json-container">
          <button onClick={() => this.handleCopy()}>Copy</button>
          <span className="force-render">{this.state.forceRender}</span>
          <br />
          {/* <pre>{this.calcJSON(this.state.points)}</pre> */}
          <textarea
            readOnly
            id="json-textarea"
            value={this.calcJSON(this.state.imagePoints)}
          ></textarea>
        </div>
      </div>
    );
  }
}

export default App;
