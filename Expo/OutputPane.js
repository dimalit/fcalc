import OutputItem from "./OutputItem"

import { ScrollView, StyleSheet } from "react-native"

import { useState, useRef } from "react"

export default function OutputPane({style, formulas, onRequestView}){
    const scrollView = useRef(null);

    const scrollToEnd = function(){
        scrollView.current.scrollToEnd();
    }

    return(
        <ScrollView ref={scrollView}
            style={style}
            contentContainerStyle={styles.scroll}
            onContentSizeChange={scrollToEnd}>
            {
                formulas.map(
                    (f, i) => <OutputItem key={i} latex={f} onRequestView={()=>{onRequestView(i);}}/>
                )
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        justifyContent: "flex-end"
    }
});
