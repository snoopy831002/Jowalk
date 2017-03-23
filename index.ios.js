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
  Text,
  Modal,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated, 
  Easing,
  View
} from 'react-native';

import Sketch from 'react-native-sketch';
import renderIf from './js/renderif.js';
import FadeInView from './js/FadeInView.js';
import { takeSnapshot } from "react-native-view-shot";
import SlotMachine from 'react-native-slot-machine';
import * as Animatable from 'react-native-animatable';
import Chart from 'react-native-chart';

export default class Jowalk039 extends Component {

  constructor(props) {
      super(props);
      this.clear = this.clear.bind(this);
      this.onReset = this.onReset.bind(this);
      this.onSave = this.onSave.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.finishJourney = this.finishJourney.bind(this);
      this.triggerAnimation=this.triggerAnimation.bind(this);
      this.handleConfirmPressIn=this.handleConfirmPressIn(this);
      global.flag = false;
      global.Interval;
      global.mapHeight = 0 ; 
      global.mapWidth = 0 ;
      global.SQUARE_DIMENSIONS = 30;
      global.coordinates = {StartXcoordinate: '', EndXcoordinate: '',StartYcoordinate: '',EndYcoordinate: ''};
      global.distanceArr = [];
  }

  state = {
    totalDistance : '',
    totalTime : 0,
    handloopState : 1,
    encodedSignature: null,
    animationType: 'fade',
    modalVisible: false,
    transparent: true,
    selectedSupportedOrientation: 1,
    pairingVisibilityStatus: true,
    slotVisibilityStatus: false,
    chartVisibilityStatus: false,
    finishJourneyBtnVisibilityStatus: true,
    screenShotSource: placeholder,
    error: null,
    confirmPressed: false,
    btnVisible: false,
    value: {
      format: "png",
      quality: 0.9,
      result: "file",
    },
    pan: new Animated.ValueXY(),
    confirmUri: require('./img/confirm.png'),
    previousUri: require('./img/previous.png'),
    nextUri: require('./img/next.png'),
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

  componentDidMount() {
    this.startAndRepeat();
  }

  startAndRepeat() {
      this.triggerAnimation();  
  }

  triggerAnimation() {
    if(this.state.handloopState){
      Animated.sequence([
          Animated.spring(this.state.pan, {
            toValue: {x: 200, y: 100},
            duration: 4000,    
          }),
          Animated.spring(this.state.pan, {
            toValue: {x: 100, y: 80},
            duration: 4000,    
          })
      ]).start(event => {
      if (event.finished) {
        this.triggerAnimation();
      }});
    }
  }

  /**
   * 
   */
  getStyle() {
    return [
      styles.hand, 
      {
        transform: this.state.pan.getTranslateTransform()
      }
    ];
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
    this.setState({ hide: true  });
      takeSnapshot(this.refs['full'], this.state.value)
      .then(res => this.state.value.result !== "file" ? res : new Promise((success, failure) =>
            // just a test to ensure res can be used in Image.getSize
            Image.getSize(
              res,
              (width, height) => (console.log('uri='+res,width,height), success(res)),
              failure)))
            .then(res => this.setState({
              error: null,
              res,
              screenShotSource: { uri:
                this.state.value.result === "base64"
                ? "data:image/"+this.state.value.format+";base64,"+res
                : res }
            })).catch(error => (console.warn(error), this.setState({ error, res: null, screenShotSource: null })));
    this.setState({modalVisible: true});
    var finishJourneyInterval = setInterval(() => { 
      if(!this.state.error){
        this.setState({ totalDistance: calculateTotalDistance(distanceArr)  });
        this.setState({ totalTime: calculateTotalTime(distanceArr) });
        this.refs.modal1.zoomOut().then((endState) => console.log(endState.finished ? 'zoomOutfinished' : 'zoomOut cancelled'));
        this.setState({ pairingVisibilityStatus: false  });
        this.setState({ slotVisibilityStatus: true });
        clearInterval(finishJourneyInterval);
      }
    }, 1500);
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

  handleConfirmPressIn(){
    
    console.log('confirmed');
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
const data = [[
  [0, 1],
  [1, 3],
  [3, 7],
  [4, 9],
]];

    return (

      <View style={styles.container}>
      
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
                <Animatable.View animation="zoomIn" style={styles.loading} ref="modal1">
                  <Text style={{color: 'white'}}>正在配對路徑獎勵</Text>
                  <Image source={require('./img/loading.gif')} />
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
                  <TouchableWithoutFeedback 
                    onPressIn={()=>{this.setState({ confirmUri:require('./img/confirmHit.png')});}}
                    onPress={()=>{this.setState({ confirmUri:require('./img/confirm.png')});
                                  this.setState({ slotVisibilityStatus:false});
                                  this.setState({ chartVisibilityStatus:true});
                    }}
                  >
                    <View>
                      <Image 
                        style={{width:252,height:94}}
                        source={this.state.confirmUri}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}  
              {renderIf(this.state.chartVisibilityStatus)(
                <View>
                  <Animatable.View ref="modal3" animation="zoomIn" ref="workoutDashboard" style={[styles.workoutDashboard, innerContainerTransparentStyle]}>
                    <View style={styles.chartContainer}>
                      <Chart
                        style={styles.chart}
                        data={data}
                        verticalGridStep={5}
                        type="line"
                        showDataPoint={true}
                        color={['#e1cd00']}
                       />
                    </View>
                  </Animatable.View>
                  <TouchableWithoutFeedback 
                    onPressIn={()=>{this.setState({ previousUri:require('./img/confirmHit.png')});}}
                    onPress={()=>{this.setState({ previousUri:require('./img/confirm.png')});}}
                  >
                    <View>
                      <Image 
                        style={{width:252,height:94}}
                        source={this.state.previousUri}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}  
            </View>
          </Modal>
            <TouchableWithoutFeedback onPress={()=>{this.setState({ handloopState: 0  });}}>
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
            </TouchableWithoutFeedback>
          <Image
            style={{height: 105*0.8 ,width: 65*0.8 , position: 'absolute',top:25,left:-5,zIndex: 1}}
            source={require('./img/map/1.png')}
          />
          <Image
            style={{height:161*0.8 ,width: 37*0.8,position: 'absolute',top:135,left:-5,zIndex: 1}}
            source={require('./img/map/2.png')}
          />
          <Image
            style={{height:117*0.8 ,width:105*0.8,position: 'absolute',top:25,left:50,zIndex: 1}}
            source={require('./img/map/3.png')}
          />
          <Image
            style={{height: 435*0.8,width: 132*0.8,position: 'absolute',top:140,left:0,zIndex: 1}}
            source={require('./img/map/4.png')}
          />
          <Image
            style={{height: 201*0.8,width: 46*0.8,position: 'absolute',top:550,left:-5,zIndex: 1}}
            source={require('./img/map/5.png')}
          />
          <Image
            style={{height: 18*0.8,width: 84*0.8,position: 'absolute',top:25,left:310,zIndex: 1}}
            source={require('./img/map/6.png')}
          />
          <Image
            style={{height: 142*0.8,width: 300*0.8,position: 'absolute',top:25,left:145,zIndex: 1}}
            source={require('./img/map/7.png')}
          />
          <Image
            style={{height: 128*0.8,width: 327*0.8,position: 'absolute',top:155,left:120,zIndex: 1}}
            source={require('./img/map/8.png')}
          />
          <Image
            style={{height: 39*0.8,width: 225*0.8,position: 'absolute',top:225,left:160,zIndex: 1}}
            source={require('./img/map/9.png')}
          />
          <Image
            style={{height: 46*0.8,width: 267*0.8,position: 'absolute',top:270,left:140,zIndex: 1}}
            source={require('./img/map/10.png')}
          />
          <Image
            style={{height: 121*0.8,width: 313*0.8,position: 'absolute',top:280,left:100,zIndex: 1}}
            source={require('./img/map/11.png')}
          />
          <Image
            style={{height: 137*0.8,width: 316*0.8,position: 'absolute',top:380,left:80,zIndex: 1}}
            source={require('./img/map/12.png')}
          />
          <Image
            style={{height: 142*0.8,width: 311*0.8,position: 'absolute',top:500,left:65,zIndex: 1}}
            source={require('./img/map/13.png')}
          />
          <Image
            style={{height: 191*0.8,width: 321*0.8,position: 'absolute',top:615,left:35,zIndex: 1}}
            source={require('./img/map/14.png')}
          />
          <Image
            style={{height: 59*0.8,width: 180*0.8,position: 'absolute',top:730,left:130,zIndex: 1}}
            source={require('./img/map/15.png')}
          />
          <Image
            style={{height: 20*0.8,width: 33*0.8,position: 'absolute',top:25,left:400,zIndex: 1}}
            source={require('./img/map/16.png')}
          />
          <Image
            style={{height: 18*0.8,width: 50*0.8,position: 'absolute',top:25,left:440,zIndex: 1}}
            source={require('./img/map/17.png')}
          />
          <Image
            style={{height: 17*0.8,width: 50*0.8,position: 'absolute',top:25,left:490,zIndex: 1}}
            source={require('./img/map/18.png')}
          />
         <Image
            style={{height: 15*0.8,width: 17*0.8,position: 'absolute',top:25,left:540,zIndex: 1}}
            source={require('./img/map/19.png')}
          />
          <Image
            style={{height: 15*0.8,width: 44*0.8,position: 'absolute',top:25,left:565,zIndex: 1}}
            source={require('./img/map/20.png')}
          />
          <Image
            style={{height: 59*0.8,width: 134*0.8,position: 'absolute',top:50,left:445,zIndex: 1}}
            source={require('./img/map/21.png')}
          />
          <Image
            style={{height: 143*0.8,width: 237*0.8,position: 'absolute',top:50,left:405,zIndex: 1}}
            source={require('./img/map/22.png')}
          />
          <Image
            style={{height: 134*0.8,width: 214*0.8,position: 'absolute',top:170,left:390,zIndex: 1}}
            source={require('./img/map/23.png')}
          />
          <Image
            style={{height: 123*0.8,width: 202*0.8,position: 'absolute',top:280,left:370,zIndex: 1}}
            source={require('./img/map/24.png')}
          />
          <Image
            style={{height: 126*0.8,width: 213*0.8,position: 'absolute',top:385,left:345,zIndex: 1}}
            source={require('./img/map/25.png')}
          />
          <Image
            style={{height: 127*0.8,width: 213*0.8,position: 'absolute',top:480,left:330,zIndex: 1}}
            source={require('./img/map/26.png')}
          />
          <Image
            style={{height: 121*0.8,width: 212*0.8,position: 'absolute',top:580,left:310,zIndex: 1}}
            source={require('./img/map/27.png')}
          />
         <Image
            style={{height: 34*0.8,width: 199*0.8,position: 'absolute',top:745,left:280,zIndex: 1}}
            source={require('./img/map/28.png')}
          />
         <Image
            style={{height: 40*0.8,width: 149*0.8,position: 'absolute',top:25,left:620,zIndex: 1}}
            source={require('./img/map/29.png')}
          />
         <Image
            style={{height: 48*0.8,width: 53*0.8,position: 'absolute',top:25,left:750,zIndex: 1}}
            source={require('./img/map/30.png')}
          />
         <Image
            style={{height: 60*0.8,width: 79*0.8,position: 'absolute',top:25,left:810,zIndex: 1}}
            source={require('./img/map/31.png')}
          />
         <Image
            style={{height: 85*0.8,width: 184*0.8,position: 'absolute',top:50,left:610,zIndex: 1}}
            source={require('./img/map/32.png')}
          />
         <Image
            style={{height: 59*0.8,width: 113*0.8,position: 'absolute',top:70,left:770,zIndex: 1}}
            source={require('./img/map/33.png')}
          />
         <Image
            style={{height: 119*0.8,width: 309*0.8,position: 'absolute',top:120,left:600,zIndex: 1}}
            source={require('./img/map/34.png')}
          />
         <Image
            style={{height: 139*0.8,width: 242*0.8,position: 'absolute',top:200,left:570,zIndex: 1}}
            source={require('./img/map/35.png')}
          />
         <Image
            style={{height: 465*0.8,width: 400*0.8,position: 'absolute',top:240,left:520,zIndex: 1}}
            source={require('./img/map/36.png')}
          />
         <Image
            style={{height: 113*0.8,width: 458*0.8,position: 'absolute',top:600,left:490,zIndex: 1}}
            source={require('./img/map/37.png')}
          />
         <Image
            style={{height: 5*0.8,width: 33*0.8,position: 'absolute',top:25,left:600,zIndex: 1}}
            source={require('./img/map/38.png')}
          />
         <Image
            style={{height: 72*0.8,width: 10*0.8,position: 'absolute',top:25,left:880,zIndex: 1}}
            source={require('./img/map/39.png')}
          />
         <Image
            style={{height: 107*0.8,width: 23*0.8,position: 'absolute',top:100,left:870,zIndex: 1}}
            source={require('./img/map/40.png')}
          />
         <Image
            style={{height: 89*0.8,width: 34*0.8,position: 'absolute',top:230,left:860,zIndex: 1}}
            source={require('./img/map/41.png')}
          />
         <Image
            style={{height: 237*0.8,width: 58*0.8,position: 'absolute',top:320,left:840,zIndex: 1}}
            source={require('./img/map/42.png')}
          />
          <Animated.Image 
            style={this.getStyle()} 
            source={require('./img/hand.png')}
          />
        </View>
        <TouchableHighlight 
          visible={this.state.modalVisible}
          style={ !this.state.hide ? styles.addButton : styles.addButton2 }
          underlayColor='#ff7043' 
          onPress={this.finishJourney}>
          <Text style={{color: 'white'}}>結束旅程</Text>
        </TouchableHighlight>
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
  loading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
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
  hand: {
    top:100,
    left:50,
    position: 'absolute',
    zIndex: 1
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chart: {
    width: 200,
    height: 200,
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);
