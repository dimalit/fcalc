import { StaticMathField } from 'react-mathquill'

import { View, Button, StyleSheet } from 'react-native'

import { useState } from "react"

export default function OutputItem({latex, onRequestView}){

    let button = <></>
    if(latex.search(/\(|_/) > 0){
        button = <Button title="&#128065;" onPress={onRequestView}/>
    }

    return(
        <View style={styles.item}>
            <StaticMathField style={{flexGrow:1,textAlign:"center"}}>{latex}</StaticMathField>
            {button}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection:"row",
        justifyContent:"space-between"
    }
});
