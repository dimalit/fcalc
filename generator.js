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
        root.generator = factory(root.tree);
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
    unary_sign_node,
    call_node,
    frac_node,
    power_node,
    disj_node,
    conj_node,
    not_node,
    condterm_node
} = tree;

function rand_id(){
    return "r"+(Math.random()*100000).toFixed(0);
}

function is_literal(val){
    if(!isNaN(+val))
        return true;
    if(['false', 'true'].includes(val))
        return true;
    return false;
}

empty_node.prototype.generate = function(){
    return '';
}

raw_node.prototype.generate = function(){
    let local_names = arguments[0] || [];

    // constant
    if(["\\pi"].includes(this.val))
        return this.val.substring(1);

    // local or number
    if(local_names.includes(this.val) || is_literal(this.val))
        return this.val;
    else
        return this.val+"(...arguments)";
}

function_node.prototype.generate = function(){

    let local_names = arguments[0] || [];

    let result = '';
    for (let i in this.statements) {
        result += this.statements[i].generate(local_names) + "\n";
    }
    result += 'return ' + this.return_expression.generate(local_names) + ";\n";
    return result;
}

statement_node.prototype.generate = function(){

    let local_names = arguments[0] || [];

    let namespace_prefix = arguments[1] ? arguments[1]+"." : "";

    let result = '';
    let tmp_name = rand_id()+'_'+this.lhs.name;
    result += `let ${tmp_name} = function(){};\n`;
    result += `if(typeof(${this.lhs.name}) != 'undefined')\n`;
    result += `    ${tmp_name} = ${this.lhs.name};\n`;
    result += "else " + (namespace_prefix || "var ") + `${this.lhs.name} = null;\n`;

    result += `${namespace_prefix}${this.lhs.name} = function(`;
    result += this.lhs.literal ? '' : this.lhs.arguments.join(',')
    result += "){\n";
    result += `if(${this.condition.generate(local_names.concat(this.lhs.arguments))} && ${this.lhs.generate_condition(local_names.concat(this.lhs.arguments))}){\n`
    result += this.rhs_function.generate(local_names.concat(this.lhs.arguments));

    result += "} else {\n";

    result += '    return ' + tmp_name+"(...arguments);\n"
    result += "}\n";
    result += "};\n";
    return result;
}

lhs_node.prototype.generate_condition = function(){
    if(!this.literal)
        return true;    // just no condition
    let res = '';
    for(let i in this.arguments){
        res += `arguments[${i}] == ${this.arguments[i]} && `;
    }
    res += "true";
    return res;
}

call_node.prototype.generate = function(){
    let local_names = arguments[0] || [];

    // normalize function name
    let name = this.name;
    if(name.startsWith("\\"))
        name = name.substring(1);

    let res = '';
    res += name+"(";
    for(let i in this.arguments){
        res += this.arguments[i].generate(local_names)+",";
    }
    res += ")";
    return res;
}

expression_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return '( (' + this.left_expression.generate(local_names) + ')' + this.operator + '(' + this.right_term.generate(local_names) + ') )';
}

term_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return '('+this.sign+'(' + this.left_term.generate(local_names) + ')' + this.operator + '(' + this.right_power.generate(local_names) + ') )';
}

unary_sign_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return '('+this.sign+this.term.generate(local_names)+')';
}

power_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return "Math.pow(" + this.bottom.generate(local_names) + ", " + 
                 this.top.generate(local_names) + ")";
}

frac_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return "( (" + this.numerator.generate(local_names) + ") / (" + 
                 this.denominator.generate(local_names) + ") )";
}

disj_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return this.left_disj.generate(local_names) + " || " + this.right_conj.generate(local_names);
}

conj_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return this.left_conj.generate(local_names) + " && " + this.right_maybenot.generate(local_names);
}

not_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return "!" + this.val.generate(local_names);
}

condterm_node.prototype.generate = function(){
    let local_names = arguments[0] || [];
    return '( (' + this.left_expression.generate(local_names) + ')' + this.operator + '(' + this.right_expression.generate(local_names) + ') )';
}

function main(){

// f(n) = f(n-1)*2, n>1
// f(1)=1
// f(4)
let f1 = new lhs_node("f");
    f1.arguments.push("1");
    f1.literal = true;
let rhs_func1 =  new function_node();
    rhs_func1.return_expression = new raw_node("1");
let st1 = new statement_node();
    st1.lhs = f1;
    st1.rhs_function = rhs_func1;

let fn = new lhs_node("f");
    fn.arguments.push("n");
    fn.literal = false;
let n1 = new expression_node(new raw_node('n'), '-', new raw_node('1'));
let call_f_n1 = new call_node("f");
    call_f_n1.arguments.push(n1);
let rhs_func2 =  new function_node();
    rhs_func2.return_expression = new expression_node(call_f_n1, '*', new raw_node('2'));
let st2 = new statement_node();
    st2.lhs = fn;
    st2.rhs_function = rhs_func2;
    st2.condition = new condition_node(new raw_node("n"), ">", new raw_node("1"));

let ret = new raw_node("f");

let func = new function_node();
    func.statements.push(st2);
    func.statements.push(st1);
    func.return_expression = ret;

console.log("function src(){\n"+func.generate()+"}\n");
console.log("const main = src();\n");

console.log("console.log(main(4));");

} // test main

////////////////
// junk code closing
}));
