import React, { Component } from 'react';
import { Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import styles from '../styles/index';
import FilePickerManager from 'react-native-file-picker';

export default class Home extends Component {
    state = {
        titulo: "E ai negah",
        outro: "Tutupao"
    }

    uploadFile() {
        FilePickerManager.showFilePicker(null, (response) => {

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                this.setState({
                    file: response

                });
                this.props.navigation.navigate('Plot Existing Chart',
                    {
                        'path': response.path
                    }
                )
            }
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={'dark-content'} />

                <Image style={styles.logoImage}
                    source={require('../assets/logo.png')}
                />

                <Image style={styles.backgroundImage}
                    source={require('../assets/backImage.png')}
                />

                <View style={styles.lastReading} />

                <View style={styles.groupButtons}>
                    <TouchableOpacity
                        style={styles.readingButton}
                        onPress={() => {
                            this.uploadFile();
                        }}>
                        <Text style={styles.textButtonReading}>Importar{"\n"}Leituras</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.readingButton}
                        onPress={() => {
                            this.props.navigation.navigate('Welcome',
                                {
                                    'titulo': this.state.titulo,
                                    'outro': this.state.outro
                                }
                            )
                        }}>
                        <Text style={styles.textButtonReading}>Configurações{"\n"}de Conexão</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listReading} />


                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => {
                        this.props.navigation.navigate('Welcome',
                            {
                                'titulo': this.state.titulo,
                                'outro': this.state.outro
                            }
                        )
                    }}>
                    <Text style={styles.textButtonRead}>Nova Leitura</Text>
                </TouchableOpacity>


            </View>

        )
    }
}

