/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Sketch from 'react-native-sketch';
var TimerMixin = require('react-timer-mixin');

export default class Jowalk039 extends Component {
   constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    var EndXcoordinate;
    var EndYcoordinate;
    var StartXcoordinate;
    var StartYcoordinate;
  }

  state = {
    encodedSignature: null,
  };

  /**
   * Clear / reset the drawing
   */
  clear() {
    this.sketch.clear();
    this.setState({ encodedSignature: null });
  }

  /**
   * Do extra things after the sketch reset
   */
  onReset() {
    console.log('The drawing has been cleared!');
  }

  /**
   * The Sketch component provides a 'saveImage' function (promise),
   * so that you can save the drawing in the device and get an object
   * once the promise is resolved, containing the path of the image.
   */
  onSave() {

    this.sketch.saveImage(this.state.encodedSignature)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }

  /**
   * On every update (touch up from the drawing),
   * you'll receive the base64 representation of the drawing as a callback.
   */
  onUpdate(base64Image,evt) {
    this.setState({ encodedSignature: base64Image });
  }

  handlePressIn(evt){
    //console.log(`start x coord = ${evt.nativeEvent.locationX}`);
    console.log('in');
     this.timer = setInterval(
      () => { console.log('把一个定时器的引用挂在this上'); },
      50
    );
  }

  handlePressOut(evt){
    //console.log(`start x coord = ${evt.nativeEvent.locationX}`);
    console.log('out');
      this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPressIn={(evt) => this.handlePressIn(evt) } onPressOut={(evt) => this.handlePressOut(evt) } > 
          <Sketch
            fillColor="#f5f5f5"
            strokeColor="#111111"
            strokeThickness={2}
            onReset={this.onReset}
            onUpdate={this.onUpdate}
            ref={(sketch) => { this.sketch = sketch; }}
            style={styles.sketch}
          />
        </TouchableOpacity>
        <Button
          onPress={this.clear}
          title="Clear drawing"
        />
        <Button
          disabled={!this.state.encodedSignature}
          onPress={this.onSave}
          title="Save drawing"
        />
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    flexGrow: 1,
    height: Dimensions.get("window").height-100, // Height needed; Default: 200px
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);
