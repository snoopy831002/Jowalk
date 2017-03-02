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
  Modal,
  View
} from 'react-native';
import Sketch from 'react-native-sketch';

export default class Jowalk039 extends Component {
   constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    global.flag = false;
    global.Interval;
    global.coordinates = {StartXcoordinate: '', EndXcoordinate: '',StartYcoordinate: '',EndYcoordinate: ''};
    global.distanceArr = [];
  }

  state = {
    encodedSignature: null,
    //
    animationType: 'fade',
    modalVisible: false,
    transparent: false,
    selectedSupportedOrientation: 1,
    //
  };

  _setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  _setAnimationType = (type) => {
    this.setState({animationType: type});
  };

  _toggleTransparent = () => {
    this.setState({transparent: !this.state.transparent});
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

  _onMoveShouldSetResponder(e) {
    return true;
  }

  _onStartShouldSetResponder(e) {
    return true;
  }
  //

  handlePressIn(e){
    coordinates.StartXcoordinate = e.nativeEvent.locationX ;
    coordinates.StartYcoordinate = e.nativeEvent.locationY ;
    Interval = setInterval(() => { flag = true; }, 1000);
  }

  handlePressOut(){
    clearInterval(Interval);
    console.log(distanceArr);
  }

  handleOnMove(e) {
    if(flag == true) {
      coordinates.EndXcoordinate = e.nativeEvent.locationX;
      coordinates.EndYcoordinate = e.nativeEvent.locationY;
      var distance = calculateDistance(coordinates.StartXcoordinate,coordinates.EndXcoordinate,coordinates.StartYcoordinate,coordinates.EndYcoordinate);
      distanceArr.push(distance);
      coordinates.StartXcoordinate = coordinates.EndXcoordinate ;
      coordinates.StartYcoordinate = coordinates.EndYcoordinate ;
      flag = false ;
    }
  }

  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;
    var activeButtonStyle = {
      backgroundColor: '#ddd'
    };
    return (
      <View style={styles.container}>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => this._setModalVisible(false)}
          supportedOrientations={['landscape']}
          >
          <View style={[styles.modalContainer, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text>AAAAAAAAAAAAAAA</Text>
              <Text>BBBBB</Text>
              <Button
                title="Close"
                onPress={this._setModalVisible.bind(this, false)}
                style={styles.modalButton}>
              </Button>
            </View>
          </View>
        </Modal>
          <Sketch
            onStartShouldSetResponder={this._onStartShouldSetResponder}
            onMoveShouldSetResponder={this._onMoveShouldSetResponder}
            onResponderStart={this.handlePressIn}
            onResponderMove={this.handleOnMove}
            onResponderRelease={this.handlePressOut}
            fillColor="#f5f5f5"
            strokeColor="#111111"
            strokeThickness={2}
            onReset={this.onReset}
            onUpdate={this.onUpdate}
            ref={(sketch) => { this.sketch = sketch; }}
            style={styles.sketch}
          />
        <Button
          onPress={this.clear}
          title="Clear drawing"
        />
        <Button 
          onPress={this._setModalVisible.bind(this, true)}
          title="Present"
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

function calculateDistance(InX,OutX,InY,OutY){
  return Math.sqrt(Math.pow(OutX-InX,2)+Math.pow(InY-OutY,2));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  sketch: {
    flexGrow: 1,
    height: Dimensions.get("window").height-100, // Height needed; Default: 200px
  },
  innerContainer: {
    borderRadius: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);
