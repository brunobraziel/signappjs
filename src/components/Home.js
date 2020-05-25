import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ToastAndroid,
    Alert,
    FlatList
} from 'react-native';
import { Divider } from 'react-native-elements';
import styles from '../styles/index';
import FilePickerManager from 'react-native-file-picker';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUpload, faCog } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { useReadings } from '../context'
import getRealm from '../services/realm';

const Home = ({ navigation }) => {

    useEffect(() => {
        loadReadings()
    }, [])

    const { readings, setReadings } = useReadings()
    const [lastReadingDate, setLastReadingDate] = useState("Não há nenhuma leitura")

    async function loadReadings() {
        try {
            const realm = await getRealm();
            const data = realm.objects('Reading').sorted('id', true);
            setReadings(data)
            global.empty_list = readings.length == 0 ? true : false;

            console.log('list: ', readings)
            console.log('empty list: ', global.empty_list)
        } catch (e) {
            console.log(e)
        }
    }

    const buttonView = ref => Home.view = ref;
    const fadeOut = () => Home.view.slideOutDown(800).then(endState => { console.log('Fade out') }
    );

    function uploadFile() {
        FilePickerManager.showFilePicker(null, (response) => {

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else if (response.path.includes("SIGNAPP")) {
                navigation.navigate('Plot Existing Chart',
                    {
                        'path': response.path
                    }
                )
            }
            else {
                console.log('Not an SIGNAPP.csv file');
                ToastAndroid.show("Arquivo inválido. Por favor, adicione um arquivo do tipo SIGNAPP.csv", ToastAndroid.SHORT);
            }
        });
        Home.view.fadeIn(800)
    }

    function goToPlot() {
        if (global.connected) {
            navigation.navigate('Plot Real Time')
        } else {
            Alert.alert(
                "",
                "Conecte-se a um dispositivo antes de iniciar uma nova leitura.",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "Ir para Configurações", onPress: () =>
                            navigation.navigate('Settings')
                    }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'} />

            <Animatable.Image
                animation="slideInDown"
                duration={1500}
                style={styles.logoImage
                }
                source={require('../assets/logo.png')} />

            <Animatable.Image
                animation="fadeInRightBig"
                duration={2500}
                style={styles.backgroundImage
                }
                source={require('../assets/backImage.png')} />

            <Animatable.View
                animation="fadeIn"
                duration={1500}
                delay={2500}
                style={styles.lastReading}>
                <Text style={styles.textBox}>Sua última leitura foi feita em</Text>
                <Divider style={styles.divider} />
                {
                    readings.length != 0 &&
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Plot Existing Chart',
                                    {
                                        'data': readings[0].id
                                    }
                                )
                        }}>
                        <Text
                            style={styles.textData}>
                            {format(
                                new Date(readings[0].timeStamp),
                                "dd 'de' MMMM' às 'HH'h'mm",
                                { locale: pt }
                            )}</Text>
                    </TouchableOpacity>
                }
                {readings.length == 0 && <Text style={styles.textData}>Não há nenhuma leitura</Text>}

            </Animatable.View>

            <Animatable.View
                animation="fadeIn"
                duration={1500}
                delay={3000}
                style={styles.groupButtons}>
                <TouchableOpacity
                    style={styles.midButton}
                    onPress={() => {
                        uploadFile();
                    }}>
                    <FontAwesomeIcon
                        style={styles.iconMidButton}
                        icon={faUpload}
                        size={25} />
                    <Text style={styles.textMidButton}>Importar{"\n"}Leitura</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.midButton}
                    onPress={() => {
                        navigation.navigate('Settings')
                    }}>
                    <FontAwesomeIcon
                        style={styles.iconMidButton}
                        icon={faCog}
                        size={25} />
                    <Text style={styles.textMidButton}>{"\n"}Configurações</Text>
                </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
                animation="fadeIn"
                duration={1500}
                delay={3500}>
                <TouchableOpacity
                    style={styles.listReading}
                    onPress={() => {
                        navigation.navigate('Readings List')
                    }}>
                    <Text style={styles.textBox}>Suas leituras</Text>
                    <Divider style={styles.divider} />
                    {
                        readings && <FlatList
                            data={readings}
                            renderItem={({ item }) =>
                                <View style={[styles.readingItem, { margin: 5 }]}>
                                    <Text
                                        style={{ fontSize: 17 }}>
                                        {format(
                                            new Date(item.timeStamp),
                                            "dd 'de' MMMM' às 'HH'h'mm",
                                            { locale: pt }
                                        )}</Text>
                                    <Text
                                        style={{ fontSize: 10 }}>
                                        {`#${item.id}`}</Text>
                                </View>
                            }
                            keyExtractor={item => item.id}
                        />
                    }
                </TouchableOpacity>
            </Animatable.View>


            <Animatable.View
                ref={buttonView}
                animation="slideInUp"
                duration={1500}
                delay={1500}>
                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => {
                        fadeOut
                        goToPlot()
                    }
                    }>
                    <Text style={styles.textButtonRead}>Nova Leitura</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>

    )
}

export default Home

