import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useState} from 'react';

export default function CalcButton({style, title, onPress, caps, children}){

    title = title || "";

    const [height, setHeight] = useState(40);

    const adjustHeight = function(evt){
        const {width} = evt.nativeEvent.layout;
        setHeight(width*4/5);
    }

    return(
        <Pressable
            onLayout = {adjustHeight}
            style = {[styles.button, {height: height}, style, caps?{textTransform:'uppercase'}:{}]}
            onPress = {onPress}
            tabIndex = {-1}
            onMouseDown = {(e)=>{e.preventDefault();}}
        >
        <Text style={style}>{title}</Text>
        {children}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button:{
        width: "15%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 1000,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: {width: 1, height:2},
        shadowRadius: 3
    }
});
