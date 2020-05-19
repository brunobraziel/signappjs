import React, { useState } from 'react'
import {
    Dimensions,
    Text,
    View,
    TouchableOpacity
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
    faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const PlotRealTime = ({ route, navigateToHomeScreen }) => {
    const [freqs, setFreqs] = useState([0])
    const [times, setTimes] = useState([0])
    const [chartPlot, setChartPlot] = useState()
    const [receiving, setReceiving] = useState()
    const [startPlot, setStartPlot] = useState(false) //PARA ATIVAR O PLAY NO INICIO
    const [stopPlot, setStopPlot] = useState(true) //PARA DESATIVAR O STOP NO INICIO
    const [restartPlot, setRestartPlot] = useState(true) //PARA DESATIVAR O STOP NO INICIO
    const [endPlot, setEndPlot] = useState(false) //PARA DESATIVAR O STOP NO INICIO
    const [timeStamp, setTimeStamp] = useState(format(
        new Date(), //AQUI VAMOS PASSAR O ULTIMO DIA
        "dd 'de' MMMM' às 'HH'h'mm",
        { locale: pt }
    ));
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const chartConfig = {
        backgroundColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(58, 56, 239, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    }

    function receiveData() {
        const freq = []
        const time = []
        let count = 0

        console.log('Iniciando a leitura dos dados: ')
        setReceiving(setInterval(() => {
            BluetoothSerial.read((data, subscription) => {

                //LEITURA DA FREQUENCIA PLOT    
                freq.push(parseInt(data))
                setFreqs([...freq])

                time.push(++count)
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
        }, 1500))
    }

    function stopReceiving() {
        clearInterval(receiving)
        console.log('Leitura finalizada')
    }

    return (
        <View style={styles.secondaryContainer}>
            <View
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
            </View>

            <View>
                <Text>Leitura realizada dia {timeStamp}</Text>
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
                        setTimeStamp(format(
                            new Date(), //AQUI VAMOS PASSAR O ULTIMO DIA
                            "dd 'de' MMMM' às 'HH'h'mm",
                            { locale: pt }
                        ))
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
                endPlot && <>
                    <TouchableOpacity
                        onPress={() => {

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

                        }
                        }
                        style={styles.buttonAfterPlot}>
                        <FontAwesomeIcon
                            style={styles.enabledPlot}
                            icon={faListAlt}
                            size={25}
                        />
                        <Text>TODOS OS VALORES</Text>
                    </TouchableOpacity>
                    </>
            }
                </View>
        </View>
    )
}

export default PlotRealTime