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
    textButtonReading: {
        color: 'black',       
        fontSize: 15
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
    readingButton: {
        backgroundColor: secColor,
        fontWeight: 'bold',
        width: (width-80)/2,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
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
        width: width-50,
        alignItems: 'center',
    },  
    listPlot: {
        width: width-20,
        height: height/2
    },
    headTable: { height: 40, backgroundColor: '#f1f8ff' },
    textTable: { margin: 6 }
  });

export default styles;