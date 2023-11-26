function del(L,s,n,depth){
    console.log(depth);
    function B(i,depth){
        console.log(depth);
        if(i%n!=0 || i<=s)
            return L(i,depth+1);
        else
            return false;
    }
    return B;
}

function L(i,depth){
    console.log(depth);
    return true;
}

function R(i,depth){
    console.log(depth);
    if(i==1)
        return L;
    return del(R(i-1,depth+1),i+1,i,depth+1);
}

function ff(L,i,depth){
    console.log(depth);
    if(L(i,depth+1)==true)
        return i;
    else
        return ff(L,i+1,depth+1);
}

function Out(i,depth){
    console.log(depth);
    if(i==0)
        return ff(Rn, 2,depth+1);
    else
        return ff(Rn, Out(i-1, depth+1)+1, depth+1);
}

// max 9269
const N = +process.argv[2];
let Rn = R(N,0);

// test
for(let i=0;;++i){
    let res = Out(i, 0);
    if(res > N)
        break;
    console.log(res);
}
