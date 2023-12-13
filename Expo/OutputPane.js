import OutputItem from "./OutputItem"

import { ScrollView, StyleSheet } from "react-native"

import { useState } from "react"

export default function OutputPane(props){
    const items = [];
    for(let i in props.formulas)
        items.push(<OutputItem key={i} latex={props.formulas[i]}/>);

    return(
        <ScrollView style={props.style} contentConrainerStyle={styles.scroll}>
            {items}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        alignItems:"flex-end"
    }
});
