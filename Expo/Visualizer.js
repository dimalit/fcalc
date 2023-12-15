import { View, Text, StyleSheet, VirtualizedList } from 'react-native'

import { useState } from 'react'

export default function Visualizer(props){

    const functionX=function(i){return i;};
    const [functionsCol, setFunctionsCol] = useState(props.functionsCol || []);

    const getItemCount = ()=>{
        return 30;
    }

    const getItem = (_dummy, index)=>{
        const row = functionsCol.map(f=>f(functionX(index)));
        return {
            key: index,
            row: row
        };
    }

    const renderItem = el=>{
        return (<Text>{el.item.row.map(e=>e+' ')}</Text>);
    }

    return(
        <View>
            <VirtualizedList
//                data = {[{key:1, row:["sample text"]}]}
                getItemCount = {getItemCount}
                getItem = {getItem}
                renderItem = {renderItem}
            />
        </View>
    );
}
