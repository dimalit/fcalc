import Visualizer from './Visualizer'
import OutputPane from './OutputPane'
import Keyboard from './Keyboard'
import FullScreenFrame from './FullScreenFrame'

const parser = require('../parser.js');
require('../generator.js');

const MQ = window.MathQuill.getInterface(2);
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'

const $ = window.jQuery;

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import { useState } from 'react';

addStyles();    // mathquill styles

// global (!) scope for eval()
var scope = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  exp: Math.exp, log: Math.log,
  sqrt: Math.sqrt,
  pi: Math.PI,
  e: function(){return Math.exp(1);},
  res: null
};

export default function App() {

  const [outputs, setOutputs] = useState([]);
  const [lhsArray, setLhsArray] = useState([]);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [functionYDummyArray, setFunctionYDummyArray] = useState([()=>""]);

  function processInput(latex){

    function tex2formula(tex){
      tex=tex.replace(/\\left/g, "");
      tex=tex.replace(/\\right/g, "");
      tex=tex.replace(/\\ /g, " ");
      tex=tex.replace(/\{/g, "(");
      tex=tex.replace(/\}/g, ")");

      return tex;
    }

    const input = tex2formula(latex);
    const tree_node = parser.parse_chunk(input+"\n");
    const code = tree_node.generate([], "scope");

    console.log("code:");
    console.log(code);

    let ev = eval(code);

    // update "res" variable
    let prev_res = scope.res;
    scope.res = function(){
      let n = arguments[0] || 1;
      if(n==1)
        return ev;
      else
        return prev_res(n-1);
    };

    // decide result or code
    const func = (typeof ev == "function");

    if(!func){
        ev=""+ev;
        if(ev.search(/e\+/)>0)
            ev = ev.replace("e+", "\\cdot10^{")+"}";
        else if(ev.search(/e\-/)>0)
            ev = ev.replace("e-", "\\cdot10^{-")+"}";
    }

    const text = func ? latex : latex + ' = ' + ev;
    const lhs  = func ? tree_node.lhs : null;

    console.log("text:");
    console.log(text);

    console.log("lhs:");
    console.log(lhs);

    setOutputs([...outputs, text]);
    setLhsArray([...lhsArray, lhs]);

    MQ($('#mathScreen')[0]).latex('');
    MQ($('#mathScreen')[0]).keystroke('Backspace');     // enables cursor
  } // processInput

  const showVis = (i)=>{
    const lhs = lhsArray[i];
    const funY = (x)=>scope[lhs.name](x);
    setFunctionYDummyArray([funY]);
    setShowVisualizer(true);
  }

  return (

    <>

    <Modal
      transparent={false}
      visible={showVisualizer}
      onRequestClose={() => {
        setShowVisualizer(false);
    }}>
      <FullScreenFrame id="fsid">
        <Visualizer
          functionY = {functionYDummyArray}
        />
        <Button onPress={()=>{
            setShowVisualizer(false);
        }} title="Close"/>
      </FullScreenFrame>
    </Modal>

    <FullScreenFrame style={styles.container}>

      <OutputPane formulas={outputs} style={styles.output} onRequestView={showVis}/>

      <View style={styles.input}>
        <EditableMathField
          style={styles.mathScreen}
          latex=""
          id="mathScreen"
        />
      </View>

      <Keyboard style={styles.keyboard}
      typedText={(input)=>{
        MQ($('#mathScreen')[0]).typedText(input);
      }} cmd={(input)=>{
        MQ($('#mathScreen')[0]).cmd(input);
      }} keystroke={(input)=>{
        MQ($('#mathScreen')[0]).keystroke(input);
      }} handleCommand={(cmd)=>{
        if(cmd=="Enter"){
            const latex = MQ($('#mathScreen')[0]).latex();
            processInput(latex);
        }
        else if(cmd=="C"){
            MQ($('#mathScreen')[0]).latex("");
            MQ($('#mathScreen')[0]).keystroke('Backspace');     // enables cursor
        }
      }}/>

      <StatusBar style="auto" />

    </FullScreenFrame>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#dfe1e5",
    borderRadius: 1000,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {width: 0, height:2},
    shadowRadius: 5,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  mathScreen:{
    border: "none",
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center"
  },
  output:{
    width: "100%"
  },
  keyboard: {
    width: "100%",
    marginBottom: 10
  }
});
