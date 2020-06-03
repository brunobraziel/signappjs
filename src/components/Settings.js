import React, { Component } from 'react'
import {
    Text,
    View,
    ToastAndroid,
    Modal,
    Switch,
    TouchableOpacity,
    Linking,
} from 'react-native'
import styles from '../styles/index'
import { Divider } from 'react-native-elements';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import FilePickerManager from 'react-native-file-picker';

export default class Settings extends Component {

    //METODO CONSTRUTOR PARA INICIAR AS CONFIGURAÇÕES DO BLUETOOTH
    constructor(props) {
        super(props)
        this.state = {
            isEnabled: true,
            discovering: false,
            devices: [],
            unpairedDevices: [],
            connected: false,
            showModal: false,
            colorPlot: ""
        }

        BluetoothSerial.on("error", err => {
            console.log("error", err);
        });

    }

    //RETORNA UMA LISTA COM OS DISPOSITIVOS EMPARELHADOS E DISPONÍVEIS PARA CONEXÃO
    async getDevices() {
        await Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
            values => {
                const [isEnabled, devices] = values;
                console.log('devices', devices);
                this.setState({ isEnabled, devices });
            }
        );
    }

    //HABILITAR O BLUETOOTH ASSIM QUE A VIEW FOR ABERTA
    async componentDidMount() {
        await this.enable()
    }

    //MÉTODOS PARA GERENCIAMENTO DE CONEXAO BLUETOOTH
    _renderItem(item) {
        return (<View style={styles.deviceNameWrap}>
            <Text style={styles.deviceName}>{item.item.name}</Text>
        </View>)
    }

    //HABILITAR O BLUETOOTH
    async enable() {
        BluetoothSerial.enable()
            .then((res) => {
                this.setState({ isEnabled: true })
            })
            .catch((err) => console.log(err.message))

        await this.getDevices()
    }

    //DESABILITAR O BLUETOOTH
    async disable() {
        await this.disconnect()
        BluetoothSerial.disable()
            .then((res) => {
                this.setState({ isEnabled: false })
                global.connected = false
            })
            .catch((err) => console.log(err.message))
    }

    //BOTÃO DE TOGGLE DO BLUETOOTH CHAMANDO AS FUNÇÕES
    toggleBluetooth(value) {
        value ? this.enable() : this.disable()
    }

    //DESCOBRIR DISPOSITIVOS QUE NAO FORAM EMPARELHADOS
    discoverUnpaired() {
        if (this.state.discovering) {
            return false
        } else {
            this.setState({ discovering: true })
            BluetoothSerial.discoverUnpairedDevices()
                .then((unpairedDevices) => {
                    this.setState({ unpairedDevices, discovering: false })
                })
                .catch((err) => console.log(err.message))
        }
    }

    //CANCELAR A DESCOBERTA
    cancelDiscovery() {
        if (this.state.discovering) {
            BluetoothSerial.cancelDiscovery()
                .then(() => {
                    this.setState({ discovering: false })
                })
                .catch((err) => console.log(err.message))
        }
    }

    //CONECTAR A UM DISPOSITIVO BLUETOOTH
    connect(device) {
        this.setState({ connecting: true })
        console.log({ device })

        ToastAndroid.showWithGravity(
            `Conectando-se com ${device.name}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
        BluetoothSerial.connect(device.id)
            .then((res) => {
                ToastAndroid.showWithGravity(
                    `Conectado com ${device.name}`,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );
                console.log(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })
                global.connected = true;
            })
            .catch((err) => console.log(err.message))
    }

    //DISCONECTAR DE UM DISPOSITIVO BLUETOOTH
    async disconnect() {
        BluetoothSerial.disconnect()
            .then(() => {
                this.setState({ connected: false })
                global.connected = false
            })
            .catch((err) => console.log(err.message))
    }

    //BOTAO DE TOGGLE PARA ALTERAR A INTERFACE
    toggleConnect(value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
    }

    //FUNÇÃO PARA CERTIFICAR QUE O USUÁRIO JÁ SE CONECTOU AO DISPOSITIVO ANTES DE INICIAR A PLOTAGEM 
    goToPlot() {
        if (global.connected) {
            this.props.navigation.navigate('Plot Real Time')
        } else {
            ToastAndroid.show("Conecte-se ao dispositivo antes de iniciar uma leitura.", ToastAndroid.SHORT);
        }
    }

    //FUNÇÃO PARA CARREGAR O ARQUIVO .CSV EXISTENTE
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
    }

    render() {
        return (
            <View style={styles.thirdContainer}>
                <View style={styles.settingItem}>

                    <Text style={styles.settingTitle}>Bluetooth</Text>

                    <Divider style={styles.divider} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 20 }}>
                        <Text style={styles.textBox}>Ativar o dispositivo Bluetooth</Text>
                        <Switch
                            value={this.state.isEnabled}
                            thumbColor={'blue'}
                            onValueChange={(val) => {
                                this.toggleBluetooth(val)
                            }}
                        />
                    </View>

                    <View style={styles.buttonViewDevices}>
                        {
                            this.state.isEnabled &&
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showModal: true
                                    })
                                }}>
                                <Divider style={{ marginBottom: 5 }} />
                                <Text style={{ fontSize: 15 }}>Conectar com um dispositivo pareado</Text>
                            </TouchableOpacity>
                        }
                    </View>

                </View>

                <View style={styles.settingItem}>

                    <Text style={styles.settingTitle}>Atualizações</Text>

                    <Divider style={styles.divider} />
                    <Text style={styles.textBox}>Mantenha-se atualizado sobre as últimas releases</Text>

                    <View style={styles.buttonViewDevices}>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL('https://github.com/brbraziel/signappjs').catch((err) => console.error('An error occurred', err));
                            }}>
                            <Divider style={{ marginBottom: 5 }} />
                            <Text style={{ fontSize: 15 }}>Acessar o repositório no GitHub</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.settingItem}>

                    <Text style={styles.settingTitle}>Sobre</Text>

                    <Divider style={styles.divider} />
                    <Text style={styles.textBox}>Versão 1.0</Text>

                    <View style={{ margin: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 19 }}> Trabalho de Conclusão de Curso</Text>
                        <Text> Universidade Tecnológica Federal do Paraná</Text>
                        <Text> Bruno da Silva Braziel</Text>
                        <Text> Cornélio Procópio</Text>
                        <Text> 2020</Text>

                    </View>
                </View>


                <Modal
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => {
                        this.setState({
                            showModal: false
                        })
                    }}>
                    <TouchableOpacity
                        style={styles.modalDevicesOutter}
                        onPressOut={() => {
                            this.setState({
                                showModal: false
                            })
                        }}>
                        <View style={styles.modalDevicesInner}>
                            <Text style={{ fontSize: 20, marginBottom: 20 }}>Dispositivos pareados</Text>

                            {this.state.devices.map(device => {
                                return (
                                    <TouchableOpacity

                                        key={device.address}
                                        onPress={() => {
                                            this.connect(device)
                                            this.setState({
                                                showModal: false
                                            })
                                        }
                                        }>
                                        <Text style={{ margin: 10 }}>{device.name}</Text>
                                        <Divider style={styles.divider} />
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </View>
                    </TouchableOpacity>
                </Modal>


                <View style={styles.fillVoid}></View>
                <View style={styles.groupsetButtons}>
                    <TouchableOpacity
                        style={styles.secButton}
                        onPress={() => {
                            this.props.navigation.navigate('Readings List')
                        }}>
                        <Text style={styles.sectextButtonRead}>Todas as Leituras</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secButton}
                        onPress={() => {
                            this.uploadFile()
                        }}>
                        <Text style={styles.sectextButtonRead}>Importar Leitura</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.readButton}
                        onPress={() => {
                            this.goToPlot()
                        }}>
                        <Text style={styles.textButtonRead}>Nova Leitura</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

