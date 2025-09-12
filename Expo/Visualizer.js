import { View, Text, StyleSheet, VirtualizedList } from 'react-native'

import { useState } from 'react'

export default function Visualizer({functionY: functionYDummyArray}){

    const functionX=function(i){return i;};

    const getItemCount = ()=>{
        return 30;
    }

    const getItem = (_dummy, index)=>{
        const row = [functionYDummyArray[0](functionX(index))];
        return {
            key: index,
            row: row
        };
    }

    const renderItem = el=>{
        return (<Text>{el.item.key} {el.item.row.join(' ')}</Text>);
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
