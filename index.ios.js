/**
 * Jowalk - An ncku ide project
 * https://github.com/snoopy831002/Jowalk
 * @Author : snoopy831002 
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  View
} from 'react-native';

import Sketch from 'react-native-sketch';
import renderIf from './js/renderif.js';
import { takeSnapshot } from "react-native-view-shot";
import SlotMachine from 'react-native-slot-machine';
import * as Animatable from 'react-native-animatable';
import Chart from 'react-native-chart';

export default class Jowalk039 extends Component {

   constructor(props) {
      super(props);
      this.calculateAverageSpeed = this.calculateAverageSpeed.bind(this);
      this.clear = this.clear.bind(this);
      this.onSave = this.onSave.bind(this);
      this.onUpdate = this.onUpdate.bind(this);
      this.finishJourney = this.finishJourney.bind(this);
      this.triggerAnimation=this.triggerAnimation.bind(this);
      this.handlePressIn=this.handlePressIn.bind(this);
      this.handlePressOut=this.handlePressOut.bind(this);
      this.handleOnMove=this.handleOnMove.bind(this);
      global.flag = false;
      global.Interval;
      global.onHandleMoveCounter=0;
      global.mapHeight = 0 ; 
      global.mapWidth = 0 ;
      global.SQUARE_DIMENSIONS = 30;
      global.coordinates = {StartXcoordinate: '', EndXcoordinate: '',StartYcoordinate: '',EndYcoordinate: ''};
      global.distanceArr = [[]];
      global.uData=new Array();
      global.charIcons=new Array();
      global.fadeAnim=new Animated.Value(1);
      charIcons = [  
      {image: require('./img/characters/char1.png')},
      {image: require('./img/characters/char2.png')},
      {image: require('./img/characters/char3.png')},
      {image: require('./img/characters/char4.png')}
    ];
  }

  state = {
    totalDistance : '',
    totalTime : 0,
    totalSteps:0,
    totalCalories:0,
    currentCharacter: require('./img/characters/char1.png'),
    currentAverageSpeed: 0,
    handloopState : 1,
    handloopStateRepeat : 1,
    encodedSignature: null,
    animationType: 'fade',
    modalVisible: false,
    transparent: true,
    selectedSupportedOrientation: 1,
    pairingVisibilityStatus: true,
    slotVisibilityStatus: false,
    confirmVisibilityStatus: false,
    finishJourneyBtnVisibilityStatus: false,
    chartVisibilityStatus: false,
    CharacterVisibilityStatus: false,
    RankVisibilityStatus: false,
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
    playAgainUri: require('./img/playAgain.png'),
    finishJourneyUri: require('./img/finishJourney.png'),
    congratulationImageShow:false,
    goForItImageShow:true
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
    //this.startAndRepeat();

  }

  startAndRepeat() {
    //console.log('==start and repeat==');
    //this.triggerAnimation();     
  }

  triggerAnimation() {
    /*
    if(this.state.handloopState){
      
      //console.log('in hand loop state');
      
      Animated.sequence([
          Animated.spring(this.state.pan, {
            toValue: {x: 300, y: 80},
            duration: 4000,    
          }),
          Animated.spring(this.state.pan, {
            toValue: {x: 100, y: 70},
            duration: 4000,    
          })
      ]).start(event => {
      if (event.finished) {
        if (this.state.handloopStateRepeat) {
          this.triggerAnimation();       
        };
      }});
    }
    */
    /*
    Animated.timing(       // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
              toValue: 0,        // Target
              duration: 2000,    // Configuration
            },
          ).start();
    */
     Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2000,    
          })
      ]).start();
    //console.log("TA"); 
  }

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

  calculateAverageSpeed(time,distance){
    return distance/time;
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
    this.setState({ finishJourneyBtnVisibilityStatus : false});
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
        this.setState({ totalDistance: calculateTotalDistance(distanceArr[0]) });
        this.setState({ totalTime: calculateTotalTime(distanceArr[0]) });
        this.setState({ totalSteps: calculateTotalSteps(this.state.totalDistance) });
        this.setState({ totalCalories: calculateCalories(this.state.totalTime) });
        this.setState({ pairingVisibilityStatus: false  });
        this.setState({ slotVisibilityStatus: true });
        clearInterval(finishJourneyInterval);
        var displayConfirmInterval = setInterval(() => { 
          this.setState({ confirmVisibilityStatus: true });
          clearInterval(displayConfirmInterval);
        }, 2000);
      }
    }, 1500);
  }

  handlePressIn(e){
    //this.setState({ handloopState: 0  });
    //this.setState({ handloopStateRepeat: 0  });
    this.triggerAnimation();
    coordinates.StartXcoordinate = e.nativeEvent.locationX ;
    coordinates.StartYcoordinate = e.nativeEvent.locationY ;
    Interval = setInterval(() => { flag = true; }, 1000);
  }

  handlePressOut(){
    clearInterval(Interval);
  }

  handleOnMove(e) {
    if(flag == true) {
      coordinates.EndXcoordinate = e.nativeEvent.locationX;
      coordinates.EndYcoordinate = e.nativeEvent.locationY;
      var distance = calculateDistance(coordinates.StartXcoordinate,coordinates.EndXcoordinate,coordinates.StartYcoordinate,coordinates.EndYcoordinate);
      var distanceData = [distanceArr[0].length,distance] ;
      distanceArr[0].push(distanceData);
      coordinates.StartXcoordinate = coordinates.EndXcoordinate ;
      coordinates.StartYcoordinate = coordinates.EndYcoordinate ;
      if(distanceArr[0].length > 1) this.setState({finishJourneyBtnVisibilityStatus : true});
      flag = false ;
    }
  }

  render() {
    var createThumbRow = (uri, i) => <Jowalk039 key={i} source={uri} />;
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
    uData.sort(function(a,b) {return (a.speed < b.speed) ? 1 : ((b.speed < a.speed) ? -1 : 0);} );
    var Ranks = [];
    for(let i = 0; i < uData.length; i++){
      if(uData[i].selected) {
        Ranks.push(
          <View key = {i} style={styles.rankPlacesContainerSelected}>
            <View style={styles.rankPlace}><Text style={{color:'#FFFFFF',fontSize:50,textAlign: 'center'}}>{i+1}</Text></View>
            <View style={styles.rankCharacter}>
              <Image 
                source={charIcons[uData[i].char].image}
                style={{width:70,height:70}}
              />
            </View>
            <View style={styles.rankPlaceholder}></View>
            <View style={styles.rankSprint}>
              <Image 
                source={require('./img/sprint.png')}
                style={{width:40,height:40}}
              />
            </View>
            <View style={styles.rankMinute}><Text style={{color:'#FFFFFF',fontSize:30,textAlign: 'center'}}>{uData[i].speed}</Text></View>
          </View>
        )
      }
      else {
        Ranks.push(
          <View key = {i} style={styles.rankPlacesContainer}>
            <View style={styles.rankPlace}><Text style={{color:'#FFFFFF',fontSize:50,textAlign: 'center'}}>{i+1}</Text></View>
            <View style={styles.rankCharacter}>
              <Image 
                source={charIcons[uData[i].char].image}
                style={{width:67,height:67}}
              />
            </View>
            <View style={styles.rankPlaceholder}></View>
            <View style={styles.rankSprint}>
            </View>
            <View style={styles.rankMinute}><Text style={{color:'#FFFFFF',fontSize:30,textAlign: 'center'}}>{uData[i].speed}</Text></View>
          </View>
        )
      }
    }
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
                  <View style={styles.loadingUpper}>
                    <Text style={{color: 'white'}}>正在配對路徑獎勵</Text>
                  </View>
                  <View style={styles.loadingLower}>
                    <Image 
                      source={require('./img/loading.gif')}
                      style={{ width: 86.2,height: 23}}
                     />
                  </View>
                </Animatable.View>
              )}
              {renderIf(this.state.slotVisibilityStatus)(
                <View>
                  <Animatable.View ref="modal2" animation="zoomIn" ref="workoutDashboard">
                    <View style={[styles.modal2WorkoutContainer, innerContainerTransparentStyle]}>
                      { error
                        ? <Text style={styles.previewError}>
                              {"有錯誤"+(error.message || error)}
                          </Text>
                        : 
                        <View style={[styles.previewImageContainer]}> 
                          <Image
                              resizeMode="contain"
                              style={styles.previewImage}
                              source={screenShotSource}/>
                        </View>
                       }
                      <View style={[styles.modal2placeholder]}>   
                      </View> 
                      <View style={[styles.slotContainer]}>   
                        <SlotMachine text={makeid()} padding='1' range="abcdefghijklm"
                         />
                      </View> 
                    </View> 
                    <View style={styles.modal2buttonContainer}>
                      {renderIf(this.state.confirmVisibilityStatus)(
                        <TouchableWithoutFeedback 
                          onPressIn={()=>{this.setState({ confirmUri:require('./img/confirmHit.png')});}}
                          onPress={()=>{this.setState({ confirmUri:require('./img/confirm.png')});
                                        this.setState({ slotVisibilityStatus:false});
                                        this.setState({ chartVisibilityStatus:true});}}>
                          <View>
                            <Image 
                              style={{width:252,height:94}}
                              source={this.state.confirmUri}
                            />
                          </View>
                        
                        </TouchableWithoutFeedback>
                      )}
                    </View> 
                  </Animatable.View>
                </View>
              )}  
              {renderIf(this.state.chartVisibilityStatus)(
                <Animatable.View ref="modal3" animation="zoomIn" ref="" style={styles.chartDashboard}>
                  <View style={styles.modal3TopContainer}>
                    <View style={styles.bigAverageSpeed}>
                      <View style={styles.currentAverageSpeedText}>
                        <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'left'}}>{"本次平均速率"}</Text>
                      </View>
                      <View style={styles.currentAverageSpeedNum}>
                        <View style={styles.currentAverageSpeedNumValue}>
                          <View style={styles.currentAverageSpeedNumValueCenter}>
                            <Text style={{color:'#FFFFFF',fontSize:80,textAlign: 'left'}}>{this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2)}</Text>
                          </View> 
                        </View>  
                        <View style={styles.currentAverageSpeedNumUnit}>
                          <View style={styles.currentAverageSpeedNumUnitCenter}>
                            <Text style={{color:'#FFFFFF',fontSize:15,paddingTop:39}}>{"km/hr"}</Text>                     
                          </View> 
                        </View>
                      </View>
                    </View>
                    <View style={styles.targetSpeed}>
                      <View style={styles.targetSpeedText}>
                        <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'center'}}>{"目標速率 6.00 km/hr"}</Text>
                      </View>
                      <View style={styles.congratulationImage}>
                          {renderIf(this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2)>=6)(
                            <Image 
                              style={{width:271,height:60}}
                              source={require('./img/missionAccomplished.png')}
                            />
                          )} 
                          {renderIf(this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2)<6)(
                            <Image 
                              style={{width:271,height:60}}
                              source={require('./img/goForIt.png')}
                            />
                          )} 
                      </View>
                    </View>
                  </View>
                  <View style={styles.chartContainer}>
                    <View style={styles.cccc}>
                      <Chart
                        style={styles.chart}
                        data={distanceArr}
                        showDataPoint={true}
                        color={['#E8843C']}
                        axisColor='#FFF'
                        hideHorizontalGridLines={true}
                        hideVerticalGridLines={false}
                        gridColor='#FFF'
                        axisLabelColor='#FFF'
                        lineWidth={3}
                        showAxis={true}
                        dataPointFillColor={['rgba(0,0,0,0)']}
                        dataPointColor={['rgba(0,0,0,0)']}
                        xAxisHeight={50}
                        showXAxisLabels={true}
                        type="line"
                      />
                    </View>
                    <View style={styles.chartColor}></View>
                  </View>
                  <View style={styles.modal3statisticContainer}>
                    <View style={{width:220,height:100,flexDirection:'row',justifyContent: 'center'}}>
                      <View style={{width:60,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Image 
                            style={{width:60,height:60}}
                            source={require('./img/time.png')}
                          />
                      </View>
                      <View style={{width:120,height:100,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'center'}}>{(this.state.totalTime)*60}</Text>
                      </View>
                    </View>
                    <View style={{width:220,height:100,flexDirection:'row',justifyContent: 'center'}}>
                      <View style={{width:60,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Image 
                            style={{width:60,height:60}}
                            source={require('./img/calories.png')}
                          />
                      </View>
                      <View style={{width:120,height:100,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                        <View style={{width:70,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'center'}}>{calculateCalories(this.state.totalTime)*60}</Text>
                        </View>
                        <View style={{width:30,height:100,justifyContent: 'center',paddingTop: 6}}>
                          <Text style={{color:'#FFFFFF',fontSize:10,textAlign: 'left'}}>{'cal'}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{width:220,height:100,flexDirection:'row',justifyContent: 'center'}}>
                      <View style={{width:60,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Image 
                            style={{width:60,height:60}}
                            source={require('./img/speed.png')}
                          />
                      </View>
                      <View style={{width:120,height:100,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                        <View style={{width:70,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'center'}}>{this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2)}</Text>
                        </View>
                        <View style={{width:30,height:100,justifyContent: 'center',paddingTop: 6}}>
                          <Text style={{color:'#FFFFFF',fontSize:10,textAlign: 'left'}}>{'km/hr'}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{width:220,height:100,flexDirection:'row',justifyContent: 'center'}}>
                      <View style={{width:60,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Image 
                            style={{width:60,height:60}}
                            source={require('./img/step.png')}
                          />
                      </View>
                      <View style={{width:120,height:100,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                        <View style={{width:70,height:100,justifyContent: 'center',alignItems: 'center'}}>
                          <Text style={{color:'#FFFFFF',fontSize:20,textAlign: 'center'}}>{parseInt(this.state.totalDistance*20*75)}</Text>
                        </View>
                        <View style={{width:30,height:100,justifyContent: 'center',paddingTop: 6}}>
                          <Text style={{color:'#FFFFFF',fontSize:10,textAlign: 'left'}}>{'步'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.modal3buttonContainer}>
                    <TouchableWithoutFeedback 
                        onPressIn={()=>{this.setState({ previousUri:require('./img/previousHit.png')});}}
                        onPress={()=>{this.setState({ previousUri:require('./img/previous.png')});
                                      this.setState({ slotVisibilityStatus:true});
                                      this.setState({ chartVisibilityStatus:false});}}>
                        <View>
                          <Image 
                            style={{width:252,height:94}}
                            source={this.state.previousUri}
                          />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback 
                        onPressIn={()=>{this.setState({ nextUri:require('./img/nextHit.png')});}}
                        onPress={()=>{this.setState({ nextUri:require('./img/next.png')});
                                      this.setState({ CharacterVisibilityStatus:true});
                                      this.setState({ chartVisibilityStatus:false});}}>
                        <View>
                          <Image 
                            style={{width:252,height:94}}
                            source={this.state.nextUri}
                          />
                        </View>
                    </TouchableWithoutFeedback>
                  </View>
                </Animatable.View>
              )}  
              {renderIf(this.state.CharacterVisibilityStatus)(
                <Animatable.View ref="modal4" animation="zoomIn" ref="" style={styles.modal4}>
                  <View style={styles.modal4TopicContainer}>
                    <Text style={{color:'#FFFFFF',fontSize:50}}>請選一個角色</Text>
                  </View>
                  <View style={styles.modal4CharacterContainer}>
                     <View style={{paddingHorizontal: 45}}>
                      <TouchableWithoutFeedback     
                        onPress={()=>{this.setState({ CharacterVisibilityStatus:false});
                                          this.setState({ RankVisibilityStatus:true});
                                          this.setState({ currentCharacter:require('./img/characters/char1.png')});
                                          saveCurrentUserData("0",this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2))}}>  
                          <Image 
                            source={require('./img/characters/char1.png')}
                          />
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingHorizontal: 45}}>  
                      <TouchableWithoutFeedback     
                        onPress={()=>{this.setState({ CharacterVisibilityStatus:false});
                                          this.setState({ RankVisibilityStatus:true});
                                          this.setState({ currentCharacter:require('./img/characters/char2.png')});
                                          saveCurrentUserData("1",this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2))}}>
                          <Image 
                            source={require('./img/characters/char2.png')}
                          />
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingHorizontal: 45}}> 
                      <TouchableWithoutFeedback   
                        onPress={()=>{this.setState({ CharacterVisibilityStatus:false});
                                          this.setState({ RankVisibilityStatus:true});
                                          this.setState({ currentCharacter:require('./img/characters/char3.png')});
                                          saveCurrentUserData("2",this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2))}}>  
                          <Image 
                            source={require('./img/characters/char3.png')}
                          />
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingHorizontal: 45}}> 
                      <TouchableWithoutFeedback  
                        onPress={()=>{this.setState({ CharacterVisibilityStatus:false});
                                          this.setState({ RankVisibilityStatus:true});
                                          this.setState({ currentCharacter:require('./img/characters/char4.png')});
                                          saveCurrentUserData("3",this.calculateAverageSpeed(this.state.totalTime,this.state.totalDistance).toFixed(2))}}> 
                          <Image 
                            source={require('./img/characters/char4.png')}
                          />
                      </TouchableWithoutFeedback> 
                    </View> 
                  </View>
                  <View style={styles.modal4buttonContainer}>
                  </View>
                </Animatable.View>
              )}  
              {renderIf(this.state.RankVisibilityStatus)(
                <Animatable.View ref="modal5" animation="zoomIn" ref="" style={styles.modal5}>
                  <View style={styles.modal5TopicContainer}>
                    <Text style={{color:'#FFFFFF',fontSize:50}}>您的名次</Text>
                  </View>
                  <View style={styles.modal5RankContainer}>
                      <ScrollView
                        ref={(scrollView) => { _scrollView = scrollView; }}
                        automaticallyAdjustContentInsets={false}
                        bounces={true}
                        style={styles.scrollView}
                        scrollEventThrottle={200}>
                        {Ranks}
                      </ScrollView>
                  </View>
                  <View style={styles.modal5buttonContainer}>
                    <TouchableWithoutFeedback 
                      onPressIn={()=>{this.setState({  playAgainUri:require('./img/playAgainHit.png')});}}
                      onPress={()=>{this.setState({  playAgainUri:require('./img/playAgain.png')});
                      this.setState({ RankVisibilityStatus:false });
                      this.setState({ pairingVisibilityStatus:true });
                      this.setState({ finishJourneyBtnVisibilityStatus : false});
                      this.clear();
                      distanceArr = [[]];
                      for(let i = 0; i < uData.length; i++){
                        uData[i].selected = 0 ;
                      };
                      this.setState({modalVisible: false});
                      this.setState({ handloopState: 1 });
                      fadeAnim=new Animated.Value(1);
                      //this.setState({ handloopStateRepeat: 1 });
                      //this.startAndRepeat();
                    }}>
                        <View>
                          <Image 
                            style={{width:252,height:94}}
                            source={this.state.playAgainUri}
                          />
                        </View>        
                    </TouchableWithoutFeedback>
                  </View>
                </Animatable.View>
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
            strokeColor="#EC8E44"
            strokeThickness={17}
            onReset={this.onReset}
            onUpdate={this.onUpdate}
            ref={(sketch) => { this.sketch = sketch; }}
            style={styles.sketch}
          />
          <Image
            style={{height: 628*0.23 ,width: 185*0.23 , position: 'absolute',top:25,left:0,zIndex: 1}}
            source={require('./img/map/1.png')}
          />
          <Image
            style={{height:2006*0.23 ,width: 185*0.23,position: 'absolute',top:200,left:0,zIndex: 1}}
            source={require('./img/map/2.png')}
          />
          <Image
            style={{height:325*0.23,width:185*0.23,position: 'absolute',bottom:0,left:0,zIndex: 1}}
            source={require('./img/map/3.png')}
          />
          <Image
            style={{height: 628*0.23,width: 1453*0.23,position: 'absolute',top:25,left:80,zIndex: 1}}
            source={require('./img/map/4.png')}
          />
          <Image
            style={{height: 688*0.23,width: 1453*0.23,position: 'absolute',top:200,left:80,zIndex: 1}}
            source={require('./img/map/5.png')}
          />
          <Image
            style={{height: 348*0.23,width: 749*0.23,position: 'absolute',top:280,left:165,zIndex: 1}}
            source={require('./img/map/6.png')}
          />
          <Image
            style={{height: 241*0.23,width: 1111*0.23,position: 'absolute',top:395,left:160,zIndex: 1}}
            source={require('./img/map/7.png')}
          />
          <Image
            style={{height: 1151*0.23,width: 1453*0.23,position: 'absolute',top:395,left:80,zIndex: 1}}
            source={require('./img/map/8.png')}
          />
          <Image
            style={{height: 325*0.23,width: 1453*0.23,position: 'absolute',bottom:0,left:80,zIndex: 1}}
            source={require('./img/map/9.png')}
          />
          <Image
            style={{height: 302*0.23,width: 528*0.23,position: 'absolute',top:25,left:510,zIndex: 1}}
            source={require('./img/map/10.png')}
          />
          <Image
            style={{height: 628*0.23,width: 778*0.23,position: 'absolute',top:25,left:450,zIndex: 1}}
            source={require('./img/map/11.png')}
          />
          <Image
            style={{height: 688*0.23,width: 778*0.23,position: 'absolute',top:200,left:450,zIndex: 1}}
            source={require('./img/map/12.png')}
          />
          <Image
            style={{height: 709*0.23,width: 778*0.23,position: 'absolute',top:395,left:450,zIndex: 1}}
            source={require('./img/map/13.png')}
          />
          <Image
            style={{height: 359*0.23,width: 778*0.23,position: 'absolute',top:578,left:450,zIndex: 1}}
            source={require('./img/map/14.png')}
          />
          <Image
            style={{height: 325*0.23,width: 778*0.23,position: 'absolute',bottom:0,left:450,zIndex: 1}}
            source={require('./img/map/15.png')}
          />
          <Image
            style={{height: 302*0.23,width: 647*0.23,position: 'absolute',top:25,left:650,zIndex: 1}}
            source={require('./img/map/16.png')}
          />
          <Image
            style={{height: 156*0.23,width: 439*0.23,position: 'absolute',top:25,left:810,zIndex: 1}}
            source={require('./img/map/17.png')}
          />
          <Image
            style={{height: 389*0.23,width: 1182*0.23,position: 'absolute',top:80,left:650,zIndex: 1}}
            source={require('./img/map/18.png')}
          />
          <Image
            style={{height: 688*0.23,width: 743*0.23,position: 'absolute',top:200,left:650,zIndex: 1}}
            source={require('./img/map/19.png')}
          />
          <Image
            style={{height: 2006*0.23,width: 1182*0.23,position: 'absolute',top:200,left:650,zIndex: 1}}
            source={require('./img/map/20.png')}
          />
          <Image
            style={{height: 325*0.23,width: 1182*0.23,position: 'absolute',bottom:0,left:650,zIndex: 1}}
            source={require('./img/map/21.png')}
          />
          <Image
            style={{height: 625*0.23,width: 273*0.23,position: 'absolute',top:25,right:0,zIndex: 1}}
            source={require('./img/map/22.png')}
          />
          <Image
            style={{height: 645*0.23,width: 273*0.23,position: 'absolute',top:200,right:0,zIndex: 1}}
            source={require('./img/map/23.png')}
          />
          <Image
            style={{height: 243*0.23,width: 273*0.23,position: 'absolute',top:370,right:0,zIndex: 1}}
            source={require('./img/map/24.png')}
          />
          <Image
            style={{height: 922*0.23,width: 273*0.23,position: 'absolute',top:445,right:0,zIndex: 1}}
            source={require('./img/map/25.png')}
          />
          <Image
            style={{height: 325*0.23,width: 273*0.23,position: 'absolute',bottom:0,right:0,zIndex: 1}}
            source={require('./img/map/26.png')}
          />
          {renderIf(this.state.handloopState)(
            <View style={styles.handGifContainer}>
              <Animated.Image 
                style={{width:270,
                        height:150,
                        opacity: fadeAnim
                      }}
                source={require('./img/hand.gif')}
              />
            </View> 
          )}
        </View>
        {renderIf(this.state.finishJourneyBtnVisibilityStatus)(
          <View style={styles.addButton}>
            <TouchableWithoutFeedback 
              onPressIn={this.finishJourney}
              onPress={()=>{this.setState({  finishJourneyUri:require('./img/finishJourney.png')});}}>
                <View>
                  <Image 
                    style={{width:252,height:94}}
                    source={this.state.finishJourneyUri}
                  />
                </View>        
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    );
  }
}

function calculateDistance(InX,OutX,InY,OutY){
  return Math.sqrt(Math.pow(OutX-InX,2)+Math.pow(InY-OutY,2));
}

function calculateTotalTime(arr){
  return arr.length/60;
}

function calculateTotalDistance(arr){
  var totalDistance = 0;
  arr.forEach(function (value) {
    totalDistance +=  value[1];
  });
  return (totalDistance/30)*0.05;
}

function calculateCalories(time){
  return time*7.5;
}

function calculateTotalSteps(distance){
  return distance*75;
}

function saveCurrentUserData(char,speed){
  uData.push({'char':char,'speed':speed,'selected':1});
}

const placeholder = {
  uri: './img/1.png',
};

function makeid()
{
    var text = "";
    var possible = "abcdefghijklm";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handGifContainer: {
    position: 'absolute',
    width: 270,
    top:200,
    left:100,
    height: 150,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
        justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#ff5722',
    //borderColor: '#ff5722',
    //borderWidth: 1,
    height: 94,
    width: 252,
    //borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 390,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sketch: {
    flexGrow: 1,
    height: Dimensions.get("window").height-100, // Height needed; Default: 200px
    zIndex: 0,
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    width: 200,
    height: 100,
  },
  loadingUpper: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
   loadingLower: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDashboard: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "purple",
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
  previewImageContainer: {
    width: 450,
    height: 350,
    left: 0,
    //backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 400,
    height: 310,
  },
  modal2placeholder: {
    width: 5,
    height: 350,
   // backgroundColor: "green"
  },
  slotContainer: {
    width: 340,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    //backgroundColor: "blue",
  },
  hand: {
    //top:150,
    //left:50,
    top:200,
    left:100,
    position: 'absolute',
    zIndex: 1
  },
  chart: {
    width: 800,
    height: 250,
    margin: 10,
    zIndex: 1,
    left:20,
    position: 'absolute'
  },
  chartColor: {
    bottom:50,
    width: 769,
    height: 200,
    margin: 2,
    left:60,
    backgroundColor:'#716A60',
    zIndex: 0,
    position: 'absolute'
  },
  cccc: {
    bottom:10,
    left:0,
    width: 800,
    height: 250,
    margin: 2,
    zIndex: 1,
    position: 'absolute'
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: 900,
    //backgroundColor: "green",
    margin: 3,
    flexDirection: 'row'
  },
  modal3TopContainer: {
    height: 170,
    margin: 3,
    width: 900,
    height:200,
    //backgroundColor: "red",
    flexDirection: 'row'
  },
  bigAverageSpeed: {
    height: 170,
    width: 300,
    left: 0,
    flexDirection: 'column',
    //backgroundColor: "pink"
  },
  currentAverageSpeedText:{
    height: 50,
    width: 300,
    justifyContent: 'center',
    //ackgroundColor: "green"
  },
  currentAverageSpeedNum:{
    height: 120,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //backgroundColor: "black"
  },
  currentAverageSpeedNumValue:{
    height: 120,
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "orange"
  },
  currentAverageSpeedNumValueCenter:{
    height: 60,
    width: 230,
    justifyContent: 'center',
    //backgroundColor: "pink"
  },
  currentAverageSpeedNumUnit:{
    height: 120,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "blue"
  },
  currentAverageSpeedNumUnitCenter:{
    height: 60,
    width: 70,
    justifyContent: 'center',
    //backgroundColor: "red"
  },
  targetSpeed: {
    height: 170,
    width: 270,
    left: 350,
    flexDirection: 'column',
    //backgroundColor: "black"
  },
  targetSpeedText:{
    height: 50,
    width: 270,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "white"
  },
  congratulationImage:{
    height: 120,
    width: 270,
    //backgroundColor: "black",
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3statisticContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 3,
    //backgroundColor: "blue",
    flexDirection: 'row'
  },
  modal3buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    margin: 3,
    //backgroundColor: "green",
    flexDirection: 'row'
  },
  modal2WorkoutContainer: {
    borderRadius: 10,
    margin: 3,
    flexDirection: 'row'
  },
  modal2buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 3,
    //backgroundColor: "green",
    flexDirection: 'row'
  },
  modal4TopicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 3,
    //backgroundColor: "red",
    flexDirection: 'row'
  },
  modal4CharacterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 800,
    margin: 3,
    //backgroundColor: "green",
    flexDirection: 'row'
  },
  modal4buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 3,
    //backgroundColor: "blue",
    flexDirection: 'row'
  },
  modal4: {
    margin: 3,
    flexDirection: 'column'
  },
  modal5: {
    margin: 3,
    flexDirection: 'column'
  },
  modal5TopicContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    margin: 3,
    //backgroundColor: "red",
    flexDirection: 'row'
  }, 
  modal5RankContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
    margin: 3,
    //backgroundColor: "green",
    flexGrow:1
  },
  modal5buttonContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    margin: 3,
    //backgroundColor: "blue",
    flexDirection: 'row'
  },
  scrollView:{
    height:500,
    flex:1
    //backgroundColor: "red",
  },
  rankPlacesContainerSelected:{
    height: 90,
    width:960,
    //backgroundColor: "blue",
    margin: 3,
    padding: 2,
    borderRadius:10,
    borderWidth: 5,
    borderColor: '#E8843C',
    flexDirection: 'row'
  },
  rankPlacesContainer:{
    height: 90,
    width:960,
    //backgroundColor: "blue",
    margin: 3,
    padding: 2,
    flexDirection: 'row'
  },
  rankPlace:{
    height: 70,
    width:60,
    //backgroundColor: "red",
  },
  rankCharacter:{
    height: 70,
    width:85,
    //backgroundColor: "orange",
    justifyContent: 'center',
    alignItems: 'center'
  },
  rankPlaceholder:{
    height: 70,
    width:520,
    //backgroundColor: "yellow",
  },
  rankSprint:{
    height: 70,
    width:85,
    //backgroundColor: "green",
    justifyContent: 'center',
    alignItems: 'center'
  },
  rankMinute:{
    height: 70,
    width:190,
    //backgroundColor: "blue",
    justifyContent: 'center',
    alignItems: 'center'
  },
});

AppRegistry.registerComponent('Jowalk039', () => Jowalk039);