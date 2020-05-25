import React, { useState, useEffect } from 'react'
import {
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import styles from '../styles/index';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faPlay,
    faStop,
    faUndoAlt,
    faDownload,
    faListAlt,
    faListOl
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import * as Animatable from 'react-native-animatable';
import RNFetchBlob from 'react-native-fetch-blob';
import getRealm from '../services/realm';
import { useReadings } from '../context'

const PlotRealTime = ({ navigation }) => {
    const [freqs, setFreqs] = useState([0])
    const [times, setTimes] = useState([0])
    const [chartPlot, setChartPlot] = useState()
    const [receiving, setReceiving] = useState()
    const [startPlot, setStartPlot] = useState(false) //PARA ATIVAR O PLAY NO INICIO
    const [stopPlot, setStopPlot] = useState(true) //PARA DESATIVAR O STOP NO INICIO
    const [restartPlot, setRestartPlot] = useState(true) //PARA DESATIVAR O STOP NO INICIO
    const [endPlot, setEndPlot] = useState(false) //PARA DESATIVAR O STOP NO INICIO
    const [timeStamp, setTimeStamp] = useState(new Date());
    const [dado, setDado] = useState()
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const {readings, setReadings} = useReadings()

    useEffect(() => {
        loadReadings(); //TODA VEZ QUE A LISTA DE LEITURAS SER ALTERADA, SOFRERÁ ATUALIZAÇÃO
    }, []);

    //FUNÇÃO PARA ATUALIZAÇÃO DA LISTA
    async function loadReadings() {
        const realm = await getRealm();
        const data = realm.objects('Reading').sorted('id', true);
        setReadings(data)
        global.empty_list = readings.length == 0 ? true : false;
    }

    //CONFIGURAÇÕES VISUAIS DO GRÁFICO
    const chartConfig = {
        backgroundColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        backgroundGradientFromOpacity: 0,
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(58, 56, 239, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#fff"
        }
    }

    //FUNÇÃO PARA RECEBER OS DADOS VIA BLUETOOTH
    function receiveData() {
        const freq = []
        const time = []
        let count = 0

        console.log('Iniciando a leitura dos dados: ')
        setTimeStamp(new Date())
        setReceiving(setInterval(() => {
            BluetoothSerial.read((data, subscription) => {

                //LEITURA DA FREQUENCIA PLOT    
                freq.push(parseFloat(data))
                setFreqs([...freq])

                count = count + 0.5 
                time.push(count) //PARA PEGAR TEMPOS MENORES, ALTERAR ESTE INTERVALO
                setTimes([...time])

                setChartPlot({
                    labels: [...time].length <= 10 ? [...time] : [...time].slice([...time].length - 10),
                    datasets: [
                        {
                            data: [...freq].length <= 10 ? [...freq] : [...freq].slice([...freq].length - 10)
                        }
                    ]
                })

                if (subscription) {
                    BluetoothSerial.removeSubscription(subscription);
                }
            }, '\n');
        }, 600)) //PARA PEGAR TEMPOS MENORES, ALTERAR ESTE INTERVALO
    }             //-> CUIDADO COM INTERVALOS PEQUENOS, IRÁ REPETIR VALORES

    //PARA A RECEPÇÃO DE DADOS E CHAMA A FUNÇÃO PARA INSERÇÃO NO BANCO DE DADOS
    function stopReceiving() {
        clearInterval(receiving)
        console.log('Leitura finalizada')
        addToDatabase()
    }

    //INSERE O VALOR LIDO NO BANCO DE DADOS
    async function addToDatabase() {
        try {
            const realm = await getRealm();
            let id = global.empty_list ? 0 : realm.objects('Reading').sorted('id', true)[0].id;

            const dado = {
                id: ++id,
                timeStamp: String(timeStamp),
                freqs: String(freqs),
                times: String(times)
            }

            realm.write(() => {
                realm.create('Reading', dado)
            });
            setDado(dado)
            console.log(`Adicionada leitura ${dado.id} ao banco de dados`)
            global.empty_list = false
        } catch (err) {
            console.log(err)
        }
    }

    //FUNÇÃO PARA EXPORTAR UM ARQUIVO .CSV DA LEITURA REALIZADA
    function exportCsv() {
        const rowString = times.map(function (e, i) {
            return ['"' + String(e) + '"', (i == times.length - 1 ? '"' + String(freqs[i]) + '"' : '"' + String(freqs[i]) + '"\n')];
        }).join('');

        const date = format(
            timeStamp,
            "yyyy'-'MM'-'dd'T'HHmm'",
        )

        const csvString = `${rowString}`;
        const label = `SIGNAPP_${date}.csv`

        const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/${label}`;
        console.log('Caminho em que o arquivo foi salvo: ', pathToWrite);
        RNFetchBlob.fs
            .writeFile(pathToWrite, csvString, 'utf8')
            .then(() => {
                console.log(`wrote file ${pathToWrite}`);
                ToastAndroid.showWithGravity(
                    `Arquivo .csv criado na pasta Downloads`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );

            })
            .catch(error => console.error(error));
    }

    return (
        <View style={styles.secondaryContainer}>
            {
                startPlot && <Animatable.View
                    animation={'fadeInDown'}
                    style={styles.barPlot}>
                    {chartPlot && <LineChart
                        data={chartPlot}
                        width={screenWidth - 20}
                        height={screenHeight / 3}
                        chartConfig={chartConfig}
                        withInnerLines={false}
                        bezier
                        style={{
                            marginVertical: 10,
                            borderRadius: 16,
                            marginTop: 50
                        }}
                    />}
                </Animatable.View>
            }

            <View>
                <Text>Leitura realizada dia {format(
                    timeStamp,
                    "dd 'de' MMMM' às 'HH'h'mm",
                    { locale: pt }
                )}</Text>
                <Text style={{ marginTop: 30 }}>Frequência: {freqs[freqs.length - 1]} Hz</Text>
                <Text>Tempo: {times[times.length - 1]} s</Text>

            </View>

            <View style={styles.groupPlotButtons}>
                <TouchableOpacity
                    onPress={() => {
                        setStopPlot(false)
                        setStartPlot(true)
                        setRestartPlot(true)
                        receiveData()
                    }
                    }
                    disabled={startPlot}
                    style={styles.buttonPlot}>
                    <FontAwesomeIcon
                        style={!startPlot || !startPlot ? styles.enabledPlot : styles.disabledPlot}
                        icon={faPlay}
                        size={25}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setRestartPlot(false) //PERMITIR REINICIAR O PLOT
                        setStartPlot(true) //NAO DEIXA QUE O USUÁRIO DÊ PLAY DEPOIS DE PARAR A PLOTAGEM
                        setEndPlot(true)
                        stopReceiving()
                        setStopPlot(true)
                    }
                    }
                    disabled={stopPlot}
                    style={styles.buttonPlot}>
                    <FontAwesomeIcon
                        style={!stopPlot || !stopPlot ? styles.enabledPlot : styles.disabledPlot}
                        icon={faStop}
                        size={25}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setStartPlot(false) //NAO DEIXA QUE O USUÁRIO DÊ PLAY DEPOIS DE PARAR A PLOTAGEM
                        setStopPlot(true)
                        setEndPlot(false)
                        setFreqs([])
                        setTimes([])
                    }
                    }
                    disabled={restartPlot}
                    style={styles.buttonPlot}>
                    <FontAwesomeIcon
                        style={!restartPlot || !restartPlot ? styles.enabledPlot : styles.disabledPlot}
                        icon={faUndoAlt}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.groupButtonsAfterPlot}>
                {
                    endPlot && <Animatable.View animation={'fadeInUp'}>
                        <TouchableOpacity
                            onPress={() => {
                                exportCsv()
                            }
                            }
                            style={styles.buttonAfterPlot}>
                            <FontAwesomeIcon
                                style={styles.enabledPlot}
                                icon={faDownload}
                                size={25}
                            />
                            <Text>EXPORTAR .CSV        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Plot Existing Chart',
                                {
                                    'data': dado.id
                                }
                            )
                            }
                            }
                            style={styles.buttonAfterPlot}>
                            <FontAwesomeIcon
                                style={styles.enabledPlot}
                                icon={faListOl}
                                size={25}
                            />
                            <Text>VISUALIZAR VALORES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Readings List')
                            }
                            }
                            style={styles.buttonAfterPlot}>
                            <FontAwesomeIcon
                                style={styles.enabledPlot}
                                icon={faListAlt}
                                size={25}
                            />
                            <Text>TODAS AS LEITURAS</Text>
                        </TouchableOpacity>
                    </Animatable.View >
                }
            </View>
        </View>
    )
}

export default PlotRealTime