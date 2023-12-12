import Keyboard from './Keyboard'

const parser = require('../parser.js');
require('../generator.js');

const MQ = window.MathQuill;
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'

const $ = window.jQuery;

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
    const tree_node = parser.parse_chunk(input+"\n"); // Using the imported function
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

  } // processInput

  return (
    <View style={styles.container}>
      <EditableMathField
        latex=""
        id="mathScreen"
      />
      <Keyboard typedText={(input)=>{
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
