import OutputItem from "./OutputItem"

import { ScrollView, StyleSheet } from "react-native"

import { useState, useRef } from "react"

export default function OutputPane(props){
    const scrollView = useRef(null);

    const scrollToEnd = function(){
        scrollView.current.scrollToEnd();
    }

    const items = [];
    for(let i in props.formulas)
        items.push(<OutputItem key={i} latex={props.formulas[i]}/>);

    return(
        <ScrollView ref={scrollView}
            style={props.style}
            contentContainerStyle={styles.scroll}
            onContentSizeChange={scrollToEnd}>
            {items}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
    }
});
