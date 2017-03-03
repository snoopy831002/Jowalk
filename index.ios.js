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
  Image,
  TouchableHighlight,
  View
} from 'react-native';
import Sketch from 'react-native-sketch';
import renderIf from './js/renderif.js';

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
    animationType: 'fade',
    modalVisible: false,
    transparent: true,
    selectedSupportedOrientation: 1,
    pairingVisibilityStatus: false,
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

  pairingToggleStatus(){
    this.setState({
      status:!this.state.pairingVisibilityStatus
    });
  }

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
            <View style={[styles.pairing, innerContainerTransparentStyle]}>
              <Text>正在配對路徑與獎勵</Text>
            </View>
            {renderIf(this.state.pairingVisibilityStatus)(
              <View style={[styles.pairing, innerContainerTransparentStyle]}>
                <Text>拉霸喔～～～</Text>
              </View>
            )}
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
        <Image
          style={{position: 'absolute',top:25,left:0,zIndex: 1}}
          source={require('./img/1.png')}
        />
        <TouchableHighlight 
          style={styles.addButton}
          underlayColor='#ff7043' 
          onPress={this._setModalVisible.bind(this, true)}>
          <Text style={{color: 'white'}}>結束旅程</Text>
        </TouchableHighlight>
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
addButton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 50,
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: (Dimensions.get("window").height)*0.5+50,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  sketch: {
    flexGrow: 1,
    height: Dimensions.get("window").height-100, // Height needed; Default: 200px
    zIndex: 0,
  },
  pairing: {
    borderRadius: 10,
    margin: 300,
    alignItems: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);
