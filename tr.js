const parser = require('./parser.js');
require('./generator.js');

process.stdin.on('end', ()=>{
    main();
});

function main(){
    const tree = parser.parse_function();

    console.dir(tree, {'depth':null});
//    return;

    console.log("var window=global;")
    console.log("function main(){\n"+tree.generate()+"}\n");
//    console.log("const main = src();\n");
    console.log("console.log(main());\n");
}
