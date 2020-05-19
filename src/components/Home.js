import React, { Component } from 'react';
import { Text, View, StatusBar, TouchableOpacity, ToastAndroid } from 'react-native';
import { Divider } from 'react-native-elements';
import styles from '../styles/index';
import FilePickerManager from 'react-native-file-picker';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUpload, faCog } from '@fortawesome/free-solid-svg-icons';
import {
    parseISO,
    format
} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export default class Home extends Component {
    state = {
        titulo: "E ai negah",
        outro: "Tutupao"
    }

    readDate = parseISO('2020-05-14 21:26:54');

    lastReadingDate = format(
        new Date(), //AQUI VAMOS PASSAR O ULTIMO DIA
        "dd 'de' MMMM' às 'HH'h'mm",
        { locale: pt }
    );


    buttonView = ref => this.view = ref;
    fadeOut = () => this.view.slideOutDown(800).then(endState =>
        this.props.navigation.navigate('Welcome',
            {
                'titulo': this.state.titulo,
                'outro': this.state.outro
            },
            this.view.slideInUp(1)
        ));


    uploadFile() {
        FilePickerManager.showFilePicker(null, (response) => {

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else if (response.path.includes("SIGNAPP")) {
                this.setState({
                    file: response
                });
                this.props.navigation.navigate('Plot Existing Chart',
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
        this.view.fadeIn(800)
    }

    render() {
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
                    source={require('../assets/logo.png')}
                />

                <Animatable.Image
                    animation="fadeInRightBig"
                    duration={2500}
                    style={styles.backgroundImage
                    }
                    source={require('../assets/backImage.png')}
                />

                <Animatable.View
                    animation="fadeIn"
                    duration={1500}
                    delay={2500}
                    style={styles.lastReading}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Welcome',
                                {
                                    'titulo': this.state.titulo,
                                    'outro': this.state.outro
                                }
                            )
                        }}>
                        <Text style={styles.textBox}>Sua última leitura foi feita em</Text>
                        <Divider style={styles.divider} />
                        <Text style={styles.textData}>{this.lastReadingDate}</Text>

                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View
                    animation="fadeIn"
                    duration={1500}
                    delay={3000}
                    style={styles.groupButtons}
                >
                    <TouchableOpacity
                        style={styles.midButton}
                        onPress={() => {
                            this.uploadFile();
                        }}>
                        <FontAwesomeIcon
                            style={styles.iconMidButton}
                            icon={faUpload}
                            size={25}
                        />
                        <Text style={styles.textMidButton}>Importar{"\n"}Leitura</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.midButton}
                        onPress={() => {
                            this.props.navigation.navigate('Settings')
                        }}>
                        <FontAwesomeIcon
                            style={styles.iconMidButton}
                            icon={faCog}
                            size={25}
                        />
                        <Text style={styles.textMidButton}>{"\n"}Configurações</Text>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View

                    animation="fadeIn"
                    duration={1500}
                    delay={3500}
                    style={styles.listReading}
                />


                <Animatable.View
                    ref={this.buttonView}
                    animation="slideInUp"
                    duration={1500}
                    delay={1500}
                >
                    <TouchableOpacity
                        style={styles.readButton}
                        onPress={() => {
                            this.fadeOut
                            this.props.navigation.navigate('Plot Real Time')
                        }
                        }>
                        <Text style={styles.textButtonRead}>Nova Leitura</Text>
                    </TouchableOpacity>
                </Animatable.View>

            </View>

        )
    }
}

