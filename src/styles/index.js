import { StyleSheet, Dimensions } from 'react-native';

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
    secondaryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: secColor
    },
    thirdContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 50,
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
        width: width / 2,
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
        width: width - 50,
        justifyContent: 'space-around'
    },
    midButton: {
        backgroundColor: secColor,
        fontWeight: 'bold',
        width: (width - 80) / 2,
        height: 100,
        justifyContent: 'center',
        borderRadius: radius,
        marginTop: 30,
        marginBottom: 30
    },
    readButton: {
        backgroundColor: thirdColor,
        fontWeight: 'bold',
        width: width - 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 15
    },
    lastReading: {
        backgroundColor: secColor,
        borderRadius: radius,
        width: width - 50,
        height: height / 8,
        marginTop: 100
    },
    listReading: {
        backgroundColor: secColor,
        borderRadius: radius,
        width: width - 50,
        height: height / 4
    },
    barPlot: {
        width: width,
        alignItems: 'center'
    },
    listPlot: {
        width: width - 20,
        height: height / 2
    },
    headTable: { height: 40, backgroundColor: '#716fff' },
    textHeadTable: { margin: 6, color: secColor, textAlign: 'center' },
    textTable: { margin: 6, textAlign: 'center' },
    textBox: {
        marginLeft: 20,
        marginTop: 5
    },
    divider: {
        backgroundColor: 'grey',
        opacity: 80,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5
    },
    textData: {
        marginLeft: 20,
        marginTop: 15,
        fontSize: 30
    },
    settingItem: {
        backgroundColor: secColor,
        borderRadius: radius,
        width: width - 50,
        marginBottom: 20
    },
    settingTitle: {
        fontSize: 25,
        marginLeft: 20,
        marginTop: 20
    },
    toolbar: {
        paddingTop: 30,
        paddingBottom: 30,
        flexDirection: 'row'
    },
    toolbarButton: {
        width: 50,
        marginTop: 8,
    },
    toolbarTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        marginTop: 6
    },
    deviceName: {
        fontSize: 17,
        color: "black"
    },
    deviceNameWrap: {
        margin: 10,
        borderBottomWidth: 1
    },
    modalDevicesOutter: {
        backgroundColor: "#000000aa",
        flex: 1,
        justifyContent: 'center'
    },
    modalDevicesInner: {
        backgroundColor: secColor,
        margin: 50,
        borderRadius: 20,
        padding: 40
    },
    buttonViewDevices: {
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center'
    },
    fillVoid: {
        height: height / 5
    }
});

export default styles;