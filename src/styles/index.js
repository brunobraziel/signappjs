import {StyleSheet, Dimensions} from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var primColor = '#F5F5F5' 
var secColor = '#fff'     
var thirdColor = '#3A38EF' 
var radius = 20

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: primColor
    },
    bottomButton: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: primColor
    },
    logoImage: {        
        flex: 1,
        width: width/2,
        position: 'absolute',
        resizeMode: 'contain',
        top: 20
    },
    backgroundImage: {
        flex: 1,
        width: width,
        position: 'absolute',
        resizeMode: 'contain',
        top: -90
    },
    textMidButton: {
        color: 'black',
        marginLeft: 20,     
        fontSize: 15
    },
    iconMidButton: {
        color: thirdColor,
        opacity: 30,
        marginLeft: 20,
        marginBottom: 5
    },
    textButtonRead: {
        color: secColor,       
        fontSize: 15
    },
    groupButtons: {
        flexDirection: 'row',
        width: width-50,
        justifyContent: 'space-around'
    },
    midButton: {
        backgroundColor: secColor,
        fontWeight: 'bold',
        width: (width-80)/2,
        height: 100,
        justifyContent: 'center',
        borderRadius: radius,
        marginTop: 30,
        marginBottom: 30
    },
    readButton: {
        backgroundColor: thirdColor,
        fontWeight: 'bold',
        width: width-50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius,
        marginTop: 30,
        marginBottom: 30
    },
    lastReading: {
        backgroundColor: secColor,
        borderRadius: radius,
        width: width-50,
        height: height/8,
        marginTop: 100
    },
    listReading: {
        backgroundColor: secColor,
        borderRadius: radius,
        width: width-50,
        height: height/4
    },    
    barPlot: {
        width: width,
        alignItems: 'center'
    },  
    listPlot: {
        width: width-20,
        height: height/2
    },
    headTable: { height: 40, backgroundColor: '#f1f8ff' },
    textTable: { margin: 6 },
    textBox: {
        marginLeft: 20,
        marginTop: 5
    },
    divider: {
        backgroundColor: 'black',
        opacity: 80,
        marginLeft: 20,
        marginRight: 20
    },
    textData: {
        marginLeft: 20,
        marginTop: 20,
        fontSize: 30
    },
  });

export default styles;