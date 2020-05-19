import React, { Component } from 'react'
import {
    Text,
    View,
    ToastAndroid,
    Modal,
    Switch,
    TouchableOpacity,
    Linking
} from 'react-native'
import styles from '../styles/index'
import { Divider } from 'react-native-elements';
import BluetoothSerial from 'react-native-bluetooth-serial-next';

export default class Settings extends Component {

    //METODO CONSTRUTOR PARA INICIAR AS CONFIGURAÇÕES DO BLUETOOTH
    constructor(props) {
        super(props)
        this.state = {
            isEnabled: false,
            discovering: false,
            devices: [],
            unpairedDevices: [],
            connected: false,
            connected: false,
            showModal: false,
            colorPlot: ""
        }

        BluetoothSerial.on("error", err => {
            console.log("error", err);
        });

    }

    async getDevices() {
        await Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
            values => {
                const [isEnabled, devices] = values;
                console.log('devices', devices);
                this.setState({ isEnabled, devices });
            }
        );
    }

    async componentDidMount() {
        await this.enable()
    }

    //MÉTODOS PARA GERENCIAMENTO DE CONEXAO BLUETOOTH
    _renderItem(item) {
        return (<View style={styles.deviceNameWrap}>
            <Text style={styles.deviceName}>{item.item.name}</Text>
        </View>)
    }

    async enable() {
        BluetoothSerial.enable()
            .then((res) => {
                this.setState({ isEnabled: true })
            })
            .catch((err) => console.log(err.message))

        await this.getDevices()
    }

    async disable() {
        await this.disconnect()
        BluetoothSerial.disable()
            .then((res) => this.setState({ isEnabled: false }))
            .catch((err) => console.log(err.message))
    }

    toggleBluetooth(value) {
        value ? this.enable() : this.disable()
    }

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

    cancelDiscovery() {
        if (this.state.discovering) {
            BluetoothSerial.cancelDiscovery()
                .then(() => {
                    this.setState({ discovering: false })
                })
                .catch((err) => console.log(err.message))
        }
    }

    connect(device) {
        this.setState({ connecting: true })
        console.log({ device })
        BluetoothSerial.connect(device.id)
            .then((res) => {
                ToastAndroid.showWithGravity(
                    `Conectado com ${device.name}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
                console.log(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })
            })
            .catch((err) => console.log(err.message))
    }

    async disconnect() {
        BluetoothSerial.disconnect()
            .then(() => this.setState({ connected: false }))
            .catch((err) => console.log(err.message))
    }

    toggleConnect(value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
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
                {
                    this.state.devices.map(device => {
                        return (
                            <Modal
                                transparent={true}
                                key={device.address}
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

                                        <TouchableOpacity onPress={() => {
                                            this.connect(device)
                                            this.setState({
                                                showModal: false
                                            })
                                        }
                                        }>
                                            <Text style={{ margin: 10 }}>{device.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        )
                    })
                }
                <View style={styles.fillVoid}></View>
                <View>
                    <TouchableOpacity
                        style={styles.readButton}
                        onPress={() => {
                            this.props.navigation.navigate('Plot Real Time')
                        }}>
                        <Text style={styles.textButtonRead}>Nova Leitura</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

