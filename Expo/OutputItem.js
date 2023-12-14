import { StaticMathField } from 'react-mathquill'

import { View, Button, StyleSheet } from 'react-native'

import { useState } from "react"

export default function OutputItem(props){
    return(
        <View style={styles.item}>
            <StaticMathField style={{flexGrow:1,textAlign:"center"}}>{props.latex}</StaticMathField>
            <Button title="&#128065;"/>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection:"row",
        justifyContent:"space-between"
    }
});
