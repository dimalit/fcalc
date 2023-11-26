/////////////// JUNK CODE /////////////////
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Asynchronous Module Definition)
        define(['./tree.js'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node.js (CommonJS)
        module.exports = factory(require("./tree.js"));
    } else {
        // Browser globals
        root.parser = factory(root.tree);
    }
}(typeof self !== 'undefined' ? self : this, function (tree) {
///////////////////////////////////////////
const {
    empty_node,
    raw_node,
    function_node,
    statement_node,
    lhs_node,
    expression_node,
    term_node,
    call_node,
    frac_node,
    power_node,
    disj_node,
    conj_node,
    not_node,
    condterm_node
} = tree;

let sys_assert;

let column = 0;
let row = 0;

let buffer = [];
let undo_buffer = [];
let undo_stack = [];    // pos,row,column

if (typeof module === 'object' && module.exports) {
    // Node.js (CommonJS)
    sys_assert = require('assert');

    process.stdin.on('data', (data)=>{
        for(const c of data)
            buffer.push(String.fromCharCode(c));
    });

    //process.stdin.on('end', ()=>{
    //    main();
    //});

} else {
    // Browser globals
    sys_assert = function(condition, message) {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    };
}

function assert(cond, message){
    if(!cond){
        console.error(`Error on line ${row} col ${column} on or after token ${peektoken()}:`);
        console.error(message);
        sys_assert(cond);
    } // if
}

function peek(){
    return buffer[0];
}

function getc(){
    let val = buffer.shift();

    if(undo_stack.length > 0)
        undo_buffer.push(val);

    if(val != "\n")
        ++column;
    else{
        ++row;
        column = 0;
    }
    return val;
}

function count_spaces(){
    if(buffer.length==0)
        return -1;
    let pos = 0;
    while(pos<buffer.length && buffer[pos].match(/\s/)==buffer[pos] && buffer[pos]!='\n')
        ++pos;
    return pos;
}

function number_detector(){
    this.reset();
}
number_detector.prototype.reset = function(){
    this.dot_passed = false;
    this.valid = true;
    this.value = '';
}
number_detector.prototype.consume = function(c){
    if(!this.dot_passed){
        if(c.match(/[\.0-9]/) == c){
            this.value += c;
            this.dot_passed = (c=='.');
        }
        else
            this.valid = false;
    }
    else if(this.valid){
        if(c.match(/[0-9]/) == c)
            this.value += c;
        else
            this.valid = false;
    }
    return this.valid;
}

function name_detector(){
    this.reset();
}
name_detector.prototype.reset = function(){
    this.valid = true;
    this.value = '';
}
name_detector.prototype.consume = function(c){
    if(this.valid && c.match(/[A-Za-z]/) == c)
        this.value += c;
    else
        this.valid = false;
    return this.valid;
}

function dict_detector(){
    this.reset();
}
dict_detector.prototype.reset = function(){
    this.valid = true;
    this.value = '';
}
dict_detector.prototype.consume = function(c){

    let dict = ['\\ge', '\\le', '\\frac', '\\cdot', '\\sin', '\\cos', '\\tan', '\\sqrt', '\\exp', '\\log', '\\pi'];

    if(!this.valid)
        return false;

    let found = false;
    for(let i in dict){
        let w = dict[i];
        found = found || w.startsWith(this.value+c);
    }
    if(found)
        this.value += c;
    else
        this.valid = false;

    return this.valid;
}

function token_detector(){
    this.detectors = [new number_detector(), new name_detector(), new dict_detector()];
    this.reset();
}
token_detector.prototype.reset = function(){
    this.value = ''
    this.valid = true
    for(let i in this.detectors)
        this.detectors[i].reset();
}
token_detector.prototype.consume = function(c){
    let success = false;
    for(let i in this.detectors)
        success = this.detectors[i].consume(c) || success;
    if(success)
        this.value += c;
    this.valid = success;
    return this.valid;
}

function peektoken(){
    let n = arguments[0] || 0;
    let pos = 0;
    let detector = new token_detector();
    for(let i=0; i<=n; ++i){
        detector.reset();
        // skip spaces
        while(pos!=buffer.length && buffer[pos].match(/\s/)==buffer[pos] && buffer[pos]!="\n")
            ++pos;
        // consume token
        while(pos!=buffer.length && detector.consume(buffer[pos]))
            ++pos;
        // use 1 character if no detector triggered
        if(pos!=buffer.length && detector.value=='')
            detector.value=buffer[pos++];
    }// for i
//    console.log(`token ${n}: ${detector.value}`);
    return detector.value;
}

function gettoken(){
    let t = peektoken();
    let length = count_spaces()+t.length;
    let data = buffer.splice(0, length);
    if(t != "\n")
        column += length;
    else{
        ++row;
        column = 0;
    }
    if(undo_stack.length > 0)
        undo_buffer.push(...data);
    return t;
}

function begin_undoable(){
    undo_stack.push({
        pos: undo_buffer.length,
        column: column,
        row: row
    });
}

function end_undoable(){
    undo_stack.pop();
    if(undo_stack.length==0)
        undo_buffer = [];
}

function undo(){
    let item = undo_stack.pop();
    let data = undo_buffer.splice(item.pos);
    buffer.unshift(...data);
    row = item.row;
    column = item.column;
}

function is_name(arg){
    return arg.match(/\\*[A-Za-z]+/) == arg;
}

function is_literal(val){
    if(!isNaN(+val))
        return true;
    if(['false', 'true'].includes(val))
        return true;
    return false;
}

function is_lhs(){
    if(peektoken()=='')
        return false;
    if(!is_name(peektoken()))
        return false;
    if(peektoken(1)=='=')
        return true;
    if(peektoken(1)!='(')
        return false;
    let pos = 2;
    while(peektoken(pos)!=')'){
        if(!is_name(peektoken(pos)) && !is_literal(peektoken(pos)))
            return false;
        ++pos;
        if(peektoken(pos)==')')
            break;
        if(peektoken(pos)!=',')
            return false;
        ++pos;
    }
    if(peektoken(pos+1)!='=')
        return false;
    return true;
}

function parse_lhs(){
    console.error(`LHS at ${row} ${column}`);

    assert(is_name(peektoken()), `"${peektoken()}" should be name or literal`);
    let name = gettoken();
    let res = new lhs_node(name);
    let literal = false;
    if(peektoken()=='('){
        gettoken(); // (
        while(peektoken()!=")"){
            let arg = gettoken();
            assert(is_name(arg), `"${arg}" should be name or literal`);
            res.arguments.push(arg);
            if(+arg==arg)
                literal = true;
            if(peektoken()==",")
                gettoken();
        }
        gettoken(); // )
    }// if (
    res.literal = literal;
    return res;
}

function parse_call(){
    console.error(`Call at ${row} ${column}`);

    assert(is_name(peektoken()), `"${peektoken()}" should be name`);
    let name = gettoken();
    let builtin = name.startsWith("\\");    // \sin \tan etc
    let res = new call_node(name);

    assert(builtin || gettoken()=="(", "Expected \"(\" for call arguments"); // (

    if(builtin){
        res.arguments.push(parse_term());
    }
    else {
        while(peektoken()!=")"){
            let arg = parse_expression();
            res.arguments.push(arg);
            if(peektoken()==",")
                gettoken();
        }
        gettoken(); // )
    } // else
    return res;
}

function parse_frac(){
    console.error(`Frac at ${row} ${column}`);
    assert(gettoken()=="\\frac", "Only \\frac can be here");

    assert(gettoken()=="(");
//    console.log(frac_node);
    let res = new frac_node(parse_expression(), null);
    assert(gettoken()==")");

    assert(gettoken()=="(");
    res.denominator = parse_expression();
    assert(gettoken()==")");

    return res;
}

function parse_super(){
    console.error(`Superscript at ${row} ${column}`);

    if(is_name(peek()) || is_literal(peek()))
        return new raw_node(getc());
    assert(gettoken()=="(", "Expected expression here");
    let res = parse_expression();
    assert(gettoken()==")", "Expected closing bracket here");
    return res;
}

function parse_power(){
    console.error(`Power at ${row} ${column}`);

    // sub-expression
    if(peektoken()=="("){
        gettoken();// (
        let expr = parse_expression();
        assert(gettoken()==")", "No closing bracket here");
        if(peektoken()=="^")
            return new power_node(expr, parse_super());
        else
            return expr;
    } // (

    let name = peektoken();
    assert(is_name(name) || is_literal(name), "Expected function, variable or number here");
    if(name=="\\frac")
        return parse_frac();
    if(name.startsWith("\\") && name!="\\pi"){          // simple or powered call to builtin
        if(peektoken(1)=="^"){
            gettoken();     // name
            gettoken();     // ^
            let sup = parse_super();
            return new power_node(new call_node(name, parse_power()),sup);
        }
        return parse_call();
    }
    if(peektoken(1)=="("){
        let call = parse_call();
        // f(x)^n
        if(peektoken()=="^"){
            gettoken();     // ^
            return new power_node(call, parse_super());
        }
        // f(x)
        return call;
    } // if (

    // a^b
    gettoken();     // name
    if(peektoken() != "^")
        return new raw_node(name);
    gettoken();     // ^
    let sup = parse_super();
    if(peektoken()!="(")
        return new power_node(new raw_node(name), sup);

    // f^n(x)
    gettoken(); // (
    let expr = parse_expression();  // TODO here must be list of parameters (>1) !
    assert(gettoken()==")", "Expected closing bracket here");
    return new power_node(new call_node(name, expr), sup);
}

function _deleted_parse_operand(){
    console.error(`Operand at ${row} ${column}`);

    let res = null;
    if(peektoken()=="("){
        gettoken();// (
        res = parse_expression();
        assert(gettoken()==")", "No closing bracket here");
    }
    else if(peektoken()=="\\frac")
            res = parse_frac();
    else if(is_name(peektoken()) || is_literal(peektoken())){
        if(peektoken(1)=="(" || peektoken().startsWith("\\"))
            res = parse_call();
        else {
            let val = gettoken();
            res = new raw_node(val);
        }
    }
    else assert(false, "No operand found at this position");
    return res;
}

function parse_term(){
    console.error(`Term at ${row} ${column}`);

    let res = parse_power();
    // loop all
    let token = peektoken();
    while(token!='' && token!="\n" && (token=="\\cdot" || is_literal(token) || is_name(token))){
        let tmp = new term_node();
        tmp.left_term = res;
        tmp.operator = "*";
        if(token=="\\cdot")
            gettoken();
        tmp.right_power = parse_power();
        res = tmp
        token = peektoken();
    }
    return res;
}

function parse_expression(){
    console.error(`Expression at ${row} ${column}`);

    let res = parse_term();
    // loop through all terms
    while(peektoken().match(/[\+\-]/)==peektoken()){
        let tmp = new expression_node();
        tmp.left_expression = res;
        tmp.operator = gettoken();
        tmp.right_term = parse_term();
        res = tmp;
    }
    return res;
}

function parse_statement(){
    console.error(`Statement at ${row} ${column}`);

    let res = new statement_node();
    res.lhs = parse_lhs();
    assert(gettoken()=='=', "Function should consist of statements of the form: name=function_body");
    res.rhs_function = parse_function();
    // optional condition
    if(peektoken()==","){
        gettoken(); // ,
        res.condition = parse_disj();
    } // ,
    assert(peektoken()=="\n" || peektoken()==";", "Expected end of statement here");
    res.end = gettoken();       // HACK for ';'
    return res;
}

function parse_condterm(){
    console.error(`Condterm at ${row} ${column}`);

    // try sub-disj
    if(peektoken()=="("){
        let ex1 = null, ex2 = null;
        try{
            begin_undoable();
            gettoken(); // (
            // try disj
            let res = parse_disj();     // can throw
            gettoken(); // )
            apply_undoable();
            return res;
        }catch(ex){
            // disj failed!
            ex1 = ex;
            undo();
        }// catch
    } // if "("

    // expression or raw

    let res = parse_expression();

    if(res in raw_node){
        assert(res.val=="true" || res.val=="false", "Only true and false literals are accepted as boolean expressions");
        return res;
    }

    let op = gettoken();
    if(op=="\\ge")
        op = ">=";
    else if(op=="\\le")
        op = "<=";
    else if(op=="=")
        op = "==";
    return new condterm_node(res, op, parse_expression());
}

function parse_maybenot(){
    let val = peektoken();
    if(val!="!")
        return parse_condterm();
    gettoken();     // !
    return new not_node(parse_condterm());
}

function parse_conj(){
    let res = parse_maybenot();
    while(peektoken()=="&&"){
        gettoken(); // &&
        res = new conj_node(res, parse_maybenot());
    } // while
    return res;
}

function parse_disj(){
    let res = parse_conj();
    while(peektoken()=="||"){
        gettoken(); // ||
        res = new disj_node(res, parse_conj());
    } // while
    return res;
}

function parse_function(){
    console.error(`Function at ${row} ${column}`);

    const indent = column + count_spaces();

//    console.log("indent="+indent);

    let res = new function_node();
    if(is_lhs()){
        res.statements.push(parse_statement());
    }
    else{
        res.return_expression = parse_expression();
        return res;
    }

    while(is_lhs() && (count_spaces() == indent || res.statements[res.statements.length-1].end==';'))
        res.statements.push(parse_statement());
    if(peektoken()!='' && (count_spaces() == indent || res.statements[res.statements.length-1].end==';'))
        res.return_expression = parse_expression();

    return res;
}

// parses function element-by-element
function parse_chunk(text){
    buffer = text.split('');
    row = column = 0;
    let res;
    if(is_lhs())
        res = parse_statement();
    else
        res = parse_expression();
    let token = peektoken();
    assert(token=='' || token=="\n" || token==';', "Extra input after end");
    return res;
}

function test_parsers(){
//    console.log(parse_expression());
//    console.log(parse_call());
//    console.log(parse_statement());
//    console.dir(parse_function(), {'depth':null});
}

function test_undo(){
    buffer = "test data 1 2 3".split('');

    begin_undoable();
    assert(gettoken() == "test");
    begin_undoable();
    assert(gettoken() == "data");
    undo();
    assert(gettoken() == "data");
    begin_undoable();
    assert(gettoken() == "1");
    end_undoable();
    assert(gettoken() == "2");
    undo();
    assert(gettoken() == "test");

    console.log("success")
}

//main();

return {
    parse_function: parse_function,
    parse_chunk: parse_chunk
};

////////////////
// junk code closing
}));
