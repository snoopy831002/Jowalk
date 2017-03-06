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
  ScrollView,
  TouchableHighlight,
  Animated, 
  Easing,
  View
} from 'react-native';
import Sketch from 'react-native-sketch';
import renderIf from './js/renderif.js';
import { takeSnapshot } from "react-native-view-shot";
import SlotMachine from 'react-native-slot-machine';
import * as Animatable from 'react-native-animatable';

export default class Jowalk039 extends Component {

   constructor(props) {
      super(props);
      this.clear = this.clear.bind(this);
      this.onReset = this.onReset.bind(this);
      this.onSave = this.onSave.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.finishJourney = this.finishJourney.bind(this);
      global.flag = false;
      global.Interval;
      global.coordinates = {StartXcoordinate: '', EndXcoordinate: '',StartYcoordinate: '',EndYcoordinate: ''};
      global.distanceArr = [];
  }

  state = {
    totalDistance : '',
    totalTime : 0,
    encodedSignature: null,
    animationType: 'fade',
    modalVisible: false,
    transparent: true,
    selectedSupportedOrientation: 1,
    pairingVisibilityStatus: true,
    slotVisibilityStatus: false,
    finishJourneyBtnVisibilityStatus: true,
    screenShotSource: placeholder,
    error: null,
    value: {
      format: "png",
      quality: 0.9,
      result: "file",
    },
  };


  snapshot = refname => () =>
    takeSnapshot(this.refs[refname], this.state.value)
    .then(res => this.state.value.result !== "file" ? res : new Promise((success, failure) =>
          // just a test to ensure res can be used in Image.getSize
          Image.getSize(
            res,
            (width, height) => (console.log(res,width,height), success(res)),
            failure)))
          .then(res => this.setState({
            error: null,
            res,
            screenShotSource: { uri:
              this.state.value.result === "base64"
              ? "data:image/"+this.state.value.format+";base64,"+res
              : res }
          }))
          .catch(error => (console.warn(error), this.setState({ error, res: null, screenShotSource: null })));

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

  finishJourney() {
    this.setState({ finishJourneyBtnVisibilityStatus: false  });
    this.setState({modalVisible: true});
    takeSnapshot(this.refs['full'], this.state.value)
    .then(res => this.state.value.result !== "file" ? res : new Promise((success, failure) =>
          // just a test to ensure res can be used in Image.getSize
          Image.getSize(
            res,
            (width, height) => (console.log(res,width,height), success(res)),
            failure)))
          .then(res => this.setState({
            error: null,
            res,
            screenShotSource: { uri:
              this.state.value.result === "base64"
              ? "data:image/"+this.state.value.format+";base64,"+res
              : res }
          })).catch(error => (console.warn(error), this.setState({ error, res: null, screenShotSource: null })));

    var finishJourneyInterval = setInterval(() => { 
      if(!this.state.error){
        this.setState({ totalDistance: calculateTotalDistance(distanceArr)  });
        this.setState({ totalTime: calculateTotalTime(distanceArr) });



        this.refs.modal1.zoomOut().then((endState) => console.log(endState.finished ? 'zoomOutfinished' : 'zoomOut cancelled'));
        this.setState({ pairingVisibilityStatus: false  });
        this.setState({ slotVisibilityStatus: true });
        clearInterval(finishJourneyInterval);
      }
    }, 2000);
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
    const {screenShotSource,error} = this.state;

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
      <View style={styles.container} ref="full">
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => this._setModalVisible(false)}
          supportedOrientations={['landscape']}
          >
          <View style={[styles.modalContainer, modalBackgroundStyle]}>
            {renderIf(this.state.pairingVisibilityStatus)(
              <Animatable.View ref="modal1" animation="zoomIn" style={[styles.pairing, innerContainerTransparentStyle]}>
                <Animatable.View ref="view">
                  <Text>正在配對路徑獎勵...</Text>
                </Animatable.View>
              </Animatable.View>
            )}
            {renderIf(this.state.slotVisibilityStatus)(
              <View>
                <Animatable.View ref="modal2" animation="zoomIn" ref="workoutDashboard" style={[styles.workoutDashboard, innerContainerTransparentStyle]}>
                  { error
                    ? <Text style={styles.previewError}>
                          {"有錯誤"+(error.message || error)}
                      </Text>
                    : <Image
                        resizeMode="contain"
                        style={styles.previewImage}
                        source={screenShotSource}
                  /> }
                  <View style={[styles.slotContainer]}>   
                    <SlotMachine text="d" padding='1' range="abcd" />
                  </View> 
                </Animatable.View>
                <Text>
                  {"時間："+(this.state.totalTime)}
                </Text>
                <Text>
                  {"距離："+(this.state.totalDistance)}
                </Text>
                <Text>
                  卡路里：
                </Text>
                <Text>
                  步數：
                </Text>
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
        <Image
          style={{position: 'absolute',top:140,left:0,zIndex: 1}}
          source={require('./img/2.png')}
        />
        <Image
          style={{position: 'absolute',top:25,left:55,zIndex: 1}}
          source={require('./img/3.png')}
        />
        <Image
          style={{position: 'absolute',top:155,left:0,zIndex: 1}}
          source={require('./img/4.png')}
        />
        <Image
          style={{position: 'absolute',top:600,left:0,zIndex: 1}}
          source={require('./img/5.png')}
        />
        <Image
          style={{position: 'absolute',top:25,left:355,zIndex: 1}}
          source={require('./img/6.png')}
        />
        <Image
          style={{position: 'absolute',top:25,left:150,zIndex: 1}}
          source={require('./img/7.png')}
        />
        <Image
          style={{position: 'absolute',top:170,left:130,zIndex: 1}}
          source={require('./img/8.png')}
        />
        <Image
          style={{position: 'absolute',top:255,left:180,zIndex: 1}}
          source={require('./img/9.png')}
        />
        <Image
          style={{position: 'absolute',top:300,left:170,zIndex: 1}}
          source={require('./img/10.png')}
        />
        {renderIf(this.state.finishJourneyBtnVisibilityStatus)(
          <TouchableHighlight 
            style={styles.addButton}
            underlayColor='#ff7043' 
            onPress={this.finishJourney}>
            <Text style={{color: 'white'}}>結束旅程</Text>
          </TouchableHighlight>
        )}
      </View>
    );
  }
  
}

function calculateDistance(InX,OutX,InY,OutY){
  return Math.sqrt(Math.pow(OutX-InX,2)+Math.pow(InY-OutY,2));
}

function calculateTotalTime(arr){
  return arr.length;
}

function calculateTotalDistance(arr){
  var totalDistance = 0;
  arr.forEach(function (value) {
    totalDistance +=  value;
    //console.log(value);
  });
  
  return totalDistance/30;
}

const placeholder = {
  uri: './img/1.png',
};

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
  workoutDashboard: {
    borderRadius: 10,
    margin: 3,
    flexDirection: 'row'
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
  previewError: {
    width: 375,
    height: 300,
    paddingTop: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#c00",
  },
  previewImage: {
    width: 375,
    height: 300,
    left: 0
  },
  slotContainer: {
    width: 300,
    height: 300,
    left: 180
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);
