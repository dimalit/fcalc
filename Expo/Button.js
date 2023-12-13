import {Pressable, StyleSheet, Text, View} from 'react-native';

export default function CalcButton(props){
    return(
        <Pressable
            style = {[styles.button, props.style]}
            onPress = {props.onPress}
        >
        <Text style={props.style}>{props.title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button:{
        width: 40,
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
