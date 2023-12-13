import OutputPane from './OutputPane'
import Keyboard from './Keyboard'

const parser = require('../parser.js');
require('../generator.js');

const MQ = window.MathQuill.getInterface(2);
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'

const $ = window.jQuery;

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
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
  const {height} = useWindowDimensions();
  const windowHeight = height;

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

    const ev = eval(code);

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

    const text = func ? latex : latex + ' = ' + ev;

    console.log("text:");
    console.log(text); 
    setOutputs([...outputs, text]);

    MQ($('#mathScreen')[0]).latex('');
  } // processInput

  return (
    <View style={styles.body}>
    <View style={[styles.container, {height: windowHeight, width: windowHeight/2}]}>
      <OutputPane formulas={outputs} style={{height:200}}/>
      <EditableMathField
        style={styles.input}
        latex=""
        id="mathScreen"
      />
      <Keyboard style={styles.keyboard}
      typedText={(input)=>{
        MQ($('#mathScreen')[0]).typedText(input);
      }} cmd={(input)=>{
        MQ($('#mathScreen')[0]).cmd(input);
      }} keystroke={(input)=>{
        MQ($('#mathScreen')[0]).keystroke(input);
      }} processResult={()=>{
        const latex = MQ($('#mathScreen')[0]).latex();
        processInput(latex);
      }}/>
      <StatusBar style="auto" />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  keyboard: {
    width: "100%",
    marginBottom: 10
  }
});
