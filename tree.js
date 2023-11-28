/////////////// JUNK CODE /////////////////
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Asynchronous Module Definition)
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node.js (CommonJS)
        module.exports = factory();
    } else {
        // Browser globals
        root.tree = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
///////////////////////////////////////////

function empty_node(){}

function raw_node(val){
    this.val = val;
}

// function ::= [statement] [statement...] [expression]
// no EOL at end - EOLs are in statement!
function function_node(){
    this.statements = []
    this.return_expression = new empty_node();
}

// statement ::= lhs "=" function ["," condition] "\n"|";"
function statement_node(){
    this.lhs = null;
    this.rhs_function = null;
    this.condition = new raw_node('true');
    this.end = '';
}

// lhs ::= name
//      |  name([arg],[arg...])
// literal means (1,2), !literal means (n,m)
function lhs_node(){
    this.name = null;
    if(arguments.length > 0)
        this.name = arguments[0];
    this.arguments = [];
    this.literal = false;
}

// expression ::= term
//             |  expression operator+- term
function expression_node(a,b,c){
    this.left_expression = a;
    this.right_term = c;
    this.operator = b;
}

// term ::= power
//       |  term ["\cdot"] power
function term_node(a,b,c){
    this.left_term = a;
    this.right_power = c;
    this.operator = b;
}

// power ::= raw ["^" super]
//        |  call
//        |  name "(" expression ")" "^" super
//        |  "\frac" "(" expression ")" "(" expression ")"
//        |  name "^" super "(" expression ")"
//        |  \name "^" super power
//        | "(" expression ")" ^ super

// super ::= char
//        |  "(" expression ")"

function frac_node(a,b){
    this.numerator = a;
    this.denominator = b;
}

function power_node(a,b){
    this.bottom = a;
    this.top = b;
}

// call ::= name ["_"] "(" expression, ... ")"
//       |  \name term
//       |  name "_" term
// TODO accept list of parameters
//       |  name "_" char
function call_node(){
    this.name = null;
    if(arguments.length > 0)
        this.name = arguments[0];
    this.arguments = [];
    if(arguments.length > 1)
        this.arguments.push(arguments[1]);
}

// disj ::= conj
//       |  disj "\vee" conj
function disj_node(a,b){
    this.left_disj = a;
    this.right_conj = b;
}

// conj ::= maybenot
//       |  conj "\wedge" maybenot
function conj_node(a,b){
    this.left_conj = a;
    this.right_maybenot = b;
}

// maybenot ::= condterm
//           |  "\neg" condterm
function not_node(arg){
    this.val = arg;
}

// condterm ::= raw
//           |  expression operator expression
//           |  "(" disj ")"
function condterm_node(a,b,c){
    this.left_expression = a;
    this.right_expression = c;
    this.operator = b;
}

return {
    empty_node:    empty_node,
    raw_node:    raw_node,
    function_node:    function_node,
    statement_node:    statement_node,
    lhs_node:    lhs_node,
    expression_node:    expression_node,
    term_node:    term_node,
    call_node:    call_node,
    frac_node:  frac_node,
    power_node: power_node,
    disj_node:  disj_node,
    conj_node:  conj_node,
    not_node:   not_node,
    condterm_node: condterm_node
};
////////////////
// junk code closing
}));
