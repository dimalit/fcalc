import { View, StyleSheet, useWindowDimensions } from 'react-native'

export default function FullScreenFrame(props){

    const {height} = useWindowDimensions();

    return(
        <View style={styles.screen}>
        <View style={[{height: height, width: height/2}, props.style]}>
            {props.children}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
