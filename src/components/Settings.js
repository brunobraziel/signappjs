import React, { Component } from 'react'
import {
    Text,
    View,
    ToastAndroid,
    Modal,
    Switch,
    TouchableOpacity
} from 'react-native'
import styles from '../styles/index'
import { Divider } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
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
            myText: "",
            connected: false,
            showModal: false,
            colorPlot: ""
        }

        Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
            values => {
                const [isEnabled, devices] = values;
                console.log('devices', devices);
                this.setState({ isEnabled, devices });
            }
        );

        BluetoothSerial.on("bluetoothEnabled", () => {
            console.log("Bluetooth enabled")
            this.setState({
                isEnabled: true
            })
        }
        );

        BluetoothSerial.on("bluetoothDisabled", () => {
            console.log("Bluetooth disabled")
            this.disconnect()
            this.setState({
                isEnabled: false
            })
        }
        );

        BluetoothSerial.on("error", err => {
            console.log("error", err);
        });

        BluetoothSerial.on("connectionLost", () => {
            if (this.state.device) {
                this.connect(this.state.device)
                    .then(res => { })
                    .catch(err => {
                        console.log("error", err);
                    });
            }
        });
    }

    //MÉTODOS PARA GERENCIAMENTO DE CONEXAO BLUETOOTH
    _renderItem(item) {
        return (<View style={styles.deviceNameWrap}>
            <Text style={styles.deviceName}>{item.item.name}</Text>
        </View>)
    }

    enable() {
        BluetoothSerial.enable()
            .then((res) => {
                this.setState({ isEnabled: true })
            })
            .catch((err) => console.log(err.message))

    }


    disable() {
        BluetoothSerial.disable()
            .then((res) => this.setState({ isEnabled: false }))
            .catch((err) => console.log(err.message))
    }


    toggleBluetooth(value) {
        if (value === true) {
            this.enable()
        } else {
            this.disable()
        }
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

    receiveData() {
        BluetoothSerial.read((data, subscription) => {
            console.log(data);
            this.setState({ myText: data })

            if (subscription) {
                BluetoothSerial.removeSubscription(subscription);
            }
        }, '\n');
    }

    connect(device) {
        this.setState({ connecting: true })
        BluetoothSerial.connect(device.id)
            .then((res) => {
                ToastAndroid.showWithGravity(
                    `Conectado com ${device.name}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
                console.log(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })
                setInterval(() => {
                    // this.receiveData()
                }, 1000)
            })
            .catch((err) => console.log(err.message))
    }

    disconnect() {
        this.disable()
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

                    <Text style={styles.settingTitle}>Cores</Text>

                    <Divider style={styles.divider} />
                    <Text style={styles.textBox}>Altere a cor de plotagem do gráfico</Text>

                    <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 5 }}>
                        <RNPickerSelect
                            placeholder={
                                {
                                    label: 'Selecione uma cor'
                                }
                            }
                            onValueChange={(value) => this.setState({ colorPlot: value })}
                            items={[
                                { label: "Padrão (azul)", value: "`rgba(58, 56, 239, 1)`" },
                                { label: "Vermelho", value: "`rgba(255, 29, 25, 1)`" },
                                { label: "Verde", value: "`rgba(25, 255, 29, 1)`" },
                                { label: "Amarelo", value: "`rgba(251, 255, 25, 1)`" },
                            ]}
                        /> 
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
                                        <TouchableOpacity key={device.address} onPress={() => {
                                            this.connect(device)
                                            this.setState({
                                                showModal: false
                                            })
                                        }
                                        }>
                                            <Text>{device.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        )
                    })
                }
                <View  style={styles.fillVoid}></View>
                 <View>
                    <TouchableOpacity
                        style={styles.readButton}
                        onPress={() => {
                            props.navigation.navigate('Welcome')
                        }}>
                        <Text style={styles.textButtonRead}>Nova Leitura</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

