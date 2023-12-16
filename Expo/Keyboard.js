import Button from "./Button"

import { StyleSheet, Text, View } from 'react-native';

function processResult(){
    function process(input){
    console.log(input);
    const tree_node = parser.parse_chunk(input+"\n"); // Using the imported function
    const code = tree_node.generate([],"window");

    console.log(code);
    let ev = eval(code);

    console.log(ev);
    }

    process("s=w\\cdot h");
    process("w=3");
    process("h=5");
    process("s");
}

export default function Keyboard(props) {

        function writeInput(input){
            props.typedText(input);
        }

        function writeCmd(input){
            props.cmd(input);
        }

        function writeKey(input){
            props.keystroke(input);
        }

        function handleCommand(cmd){
            props.handleCommand(cmd);
        }

        let prevKey = '';   // used for multi-keys

        function handleKey(id){
            switch(id){
            case "k0":
                writeInput("0");
                break;
            case "k1":
                writeInput("1");
                break;
            case "k2":
                writeInput("2");
                break;
            case "k3":
                writeInput("3");
                break;
            case "k4":
                writeInput("4");
                break;
            case "k5":
                writeInput("5");
                break;
            case "k6":
                writeInput("6");
                break;
            case "k7":
                writeInput("7");
                break;
            case "k8":
                writeInput("8");
                break;
            case "k9":
                writeInput("9");
                break;
            case "kDiv":
                writeInput("/");
                break;
            case "kTimes":
                writeInput("*");
                break;
            case "kMinus":
                writeInput("-");
                break;
           case "kPlus":
                writeInput("+");
                break;
            case "kSqrt":
                writeCmd("\\sqrt");
                break;
            case "kSin":
                writeCmd("\\sin");
                break;
            case "kCos":
                writeCmd("\\cos");
                break;
            case "kLog":
                writeCmd("\\log");
                break;
            case "kPi":
                writeCmd("\\pi");
                break;
            case "kSup":
                writeInput("^");
                break;
            case "kSub":
                writeInput("_");
                break;
            case "kDot":
                if(!["kDot", "kComma", "kSemic"].includes(prevKey))
                    writeInput(".");
                else if(prevKey=="kDot") {
                    writeKey("Backspace");
                    writeInput(",");
                    id="kComma";
                } else if(prevKey=="kComma") {
                    writeKey("Backspace");
                    writeInput(";");
                    id="kSemic";
                } else if(prevKey=="kSemic") {
                    writeKey("Backspace");
                    writeInput(".");
                    id="kDot";
                }
                break;
            case "kBksp":
                writeKey("Backspace");
                break;
            case "kLeft":
                writeKey("Left");
                break;
            case "kRight":
                writeKey("Right");
                break;
            case "kAssign":
                writeInput("=");
                break;
            case "kMod":
                writeInput("mod");
                break;
            case "kA":
                writeInput("a");
                break;
            case "kB":
                writeInput("b");
                break;
            case "kC":
                writeInput("c");
                break;
            case "kDe":
                if(prevKey!="kDe")
                    writeInput("d");
                else {
                    writeKey("Backspace");
                    writeInput("e");
                    id="kE";
                }
                break;
            case "kF":
                writeInput("f");
                break;
            case "kG":
                writeInput("g");
                break;
            case "kH":
                writeInput("h");
                break;
            case "kI":
                writeInput("i");
                break;
            case "kJk":
                if(prevKey!="kJk")
                    writeInput("j");
                else {
                    writeKey("Backspace");
                    writeInput("k");
                    id="kK";
                }
                break;
            case "kL":
                writeInput("l");
                break;
            case "kM":
                writeInput("m");
                break;
            case "kNopq":
                if(!["kNopq", "kO", "kP"].includes(prevKey))
                    writeInput("n");
                else if(prevKey=="kNopq") {
                    writeKey("Backspace");
                    writeInput("o");
                    id="kO";
                } else if(prevKey=="kO") {
                    writeKey("Backspace");
                    writeInput("p");
                    id="kP";
                } else if(prevKey=="kP") {
                    writeKey("Backspace");
                    writeInput("q");
                    id="kQ";
                }
                break;
            case "kR":
                writeInput("r");
                break;
            case "kS":
                writeInput("s");
                break;
            case "kTu":
                if(prevKey!="kTu")
                    writeInput("t");
                else {
                    writeKey("Backspace");
                    writeInput("u");
                    id="kU";
                }
                break;
            case "kVw":
                if(prevKey!="kVw")
                    writeInput("v");
                else {
                    writeKey("Backspace");
                    writeInput("w");
                    id="kW";
                }
                break;
            case "kX":
                writeInput("x");
                break;
            case "kYz":
                if(prevKey!="kYz")
                    writeInput("y");
                else {
                    writeKey("Backspace");
                    writeInput("z");
                    id="kZ";
                }
                break;
            case "kLeftBrace":
                writeInput("(");
                break;
            case "kRightBrace":
                writeInput(")");
                break;
            case "kLess":
                writeInput("<");
                break;
            case "kGreater":
                writeInput(">");
                break;
            case "kEnter":
                handleCommand("Enter");
                break;
            } // sw
            prevKey = id;
        } // handleKey()

    return (
        <View style={[props.style, styles.keyboard]}>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kSin")} title="sin"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k7")} title="7"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k8")} title="8"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k9")} title="9"/>
        <Button style={styles.key} onPress={()=>handleKey("kDiv")} title="/"/>
        <Button style={styles.key} onPress={()=>handleKey("kPi")} title="&pi;"/>
        </View>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kCos")} title="cos"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k4")} title="4"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k5")} title="5"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k6")} title="6"/>
        <Button style={styles.key} onPress={()=>handleKey("kTimes")} title="&times;"/>
        <Button style={styles.key} onPress={()=>handleKey("kFact")} title="!"/>
        </View>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kLog")} title="log"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k1")} title="1"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k2")} title="2"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k3")} title="3"/>
        <Button style={styles.key} onPress={()=>handleKey("kMinus")} title="-"/>
        <Button style={styles.key} onPress={()=>handleKey("kMod")} title="mod"/>
        </View>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kSqrt")} title="&radic;"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("k0")} title="0"/>
        <Button style={[styles.key, styles.dark]} onPress={()=>handleKey("kDot")} title=".,;"/>
        <Button style={styles.key} onPress={()=>handleKey("kBksp")} title="&#9003;"/>
        <Button style={styles.key} onPress={()=>handleKey("kPlus")} title="+"/>
        <Button style={[styles.key, styles.enter]} onPress={()=>handleKey("kEnter")} title="&#9166;"/>
        </View>

        <View style={styles.hr}/>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kSub")}>
            <span>( )<sub>n</sub></span>
            </Button>
        <Button style={styles.key} onPress={()=>handleKey("kSup")}>
            <span>( )<sup>n</sup></span>
            </Button>
        <Button style={styles.key} onPress={()=>handleKey("kLeftBrace")} title="("/>
        <Button style={styles.key} onPress={()=>handleKey("kRightBrace")} title=")"/>
        <Button style={styles.key} onPress={()=>handleKey("kLeft")} title="&larr;"/>
        <Button style={styles.key} onPress={()=>handleKey("kRight")} title="&rarr;"/>
        </View>

        <View style={styles.row}>
        <Button style={styles.key} onPress={()=>handleKey("kGreek")} title="&alpha;&beta;"/>
        <Button style={styles.key} onPress={()=>handleKey("kUpper")} title="aA"/>
        <Button style={styles.key} onPress={()=>handleKey("kOr")} title="&or;"/>
        <Button style={styles.key} onPress={()=>handleKey("kLess")} title="<"/>
        <Button style={styles.key} onPress={()=>handleKey("kGreater")} title=">"/>
        <Button style={styles.key} onPress={()=>handleKey("kAssign")} title="="/>
        </View>

        <View style={styles.hr}/>

        <View style={styles.row}>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kA")} title="a"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kB")} title="b"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kC")} title="c"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kDe")}>
            <span>d<sub>e</sub></span>
            </Button>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kF")} title="f"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kG")} title="g"/>
        </View>

        <View style={styles.row}>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kH")} title="h"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kI")} title="i"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kJk")}>
            <span>j<sub>k</sub></span>
            </Button>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kL")} title="l"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kM")} title="m"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kNopq")}>
            <span>n<sub>opq</sub></span>
            </Button>
        </View>

        <View style={styles.row}>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kR")} title="r"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kS")} title="s"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kTu")}>
            <span>t<sub>u</sub></span>
            </Button>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kVw")}>
            <span>v<sub>w</sub></span>
            </Button>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kX")} title="x"/>
        <Button style={[styles.key, styles.mathKey]} onPress={()=>handleKey("kYz")}>
            <span>y<sub>z</sub></span>
            </Button>
        </View>

        </View>
    );
}

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: 'column',
    gap: 6
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-evenly'
  },
  hr: {
    marginTop: 1,
    borderTopWidth: 1,
    borderTopColor: "#dadce0",
  },
  key: {
    fontFamily: "'Times New Roman', Symbola, serif",
    fontSize: "115%"
  },
  mathKey:{
    fontStyle: "italic"
  },
  dark:{
    backgroundColor: "#dadce0"
  },
  enter:{
    backgroundColor: "#4285f4",
    borderColor: "#4285f4",
    color: "white"
  }
});
