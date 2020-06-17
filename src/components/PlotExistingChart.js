import React, { useState, useEffect } from 'react'
import { 
    Dimensions, 
    ScrollView, 
    Text, 
    View, 
    TouchableOpacity,
    Alert } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import styles from '../styles/index';
import { Table, Row, Rows } from 'react-native-table-component';
import * as RNFS from 'react-native-fs';
import Papa from 'papaparse';
import * as Animatable from 'react-native-animatable';
import getRealm from '../services/realm';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const PlotExistingChart = ({ route, navigation, data }) => {
    const [tableData, setTableData] = useState([])
    const [freqs, setFreqs] = useState([])
    const [times, setTimes] = useState([])
    const [chartPlot, setChartPlot] = useState()
    const [timeStamp, setTimeStamp] = useState()

    useEffect(() => {
        if(route.params.path){
            uploadFile(route.params.path); //CASO A VIEW SEJA ACESSADA UTILIZANDO O UPLOAD FILE
        }
        else{
            getFromDatabase(route.params.data) //CASO A VIEW SEJA ACESSADA UTILIZANDO A LISTA DE LEITURAS
        }
    }, [route.params.path, route.params.data])

    //DIMENSÕES PARA ESTRUTURAR A TABELA DE VALORES
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    //CABEÇALHO DA TABELA
    const tableHead = ['Tempo (s)', 'Frequência (Hz)'];

    //CONFIGURAÇÕES VISUAIS DO GRÁFICO
    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        fillShadowGradientOpacity: 0,
        color: (opacity = 1) => `rgba(58, 56, 239, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "0",
            strokeWidth: "0"
        }
    }

    //AJUSTE PARA QUE O EIXO X APRESENTE 5 VALORES DE REFERÊNCIA PARA LEITURAS MAIORES DE 10
    function fixXLabel(times) {
        let i = 0;
        const xlabel = [];
        xlabel.push(times[0])
        for (i = 0; i < times.length; i++) {
            if (times[i] == times[parseInt((1 * times.length) / 5)]) {
                xlabel.push(times[i])
            } else if (times[i] == times[parseInt((2 * times.length) / 5)]) {
                xlabel.push(times[i])
            } else if (times[i] == times[parseInt((3 * times.length) / 5)]) {
                xlabel.push(times[i])
            } else if (times[i] == times[parseInt((4 * times.length) / 5)]) {
                xlabel.push(times[i])
            }
            else {
                xlabel.push([''])
            }
        }
        xlabel.push(times[parseInt(times.length) - 1])
        return xlabel
    }

    //RECEBER E FORMATAR A DATA DE LEITURA
    const getTimeStamp = (path) => {
        const min = path.slice(-6,-4)
        const hour = path.slice(-8,-6)
        const day = path.slice(-11,-9)
        const month = path.slice(-14,-12)
        const ts = `${day}/${month} às ${hour}h${min} `
        setTimeStamp(ts)
    }

    //FUNÇÃO PARA TRATAR OS DADOS QUE CHEGAM POR ARQUIVO .CSV
    const uploadFile = (path) => {
        const times = []
        const freqs = []
        
        getTimeStamp(path)
        try {
            RNFS.readFile(path).then((data) => {
                Papa.parse(data, {
                    dynamicTyping: true,
                    complete: results => {
                        setTableData(results.data)
                        for (let data of results.data) {
                            times.push(parseFloat(data[0]))
                            freqs.push(parseFloat(data[1]))
                        }
                        setFreqs(freqs)
                        setTimes(times)
                        
                        const lenght = freqs.length
                        const data = lenght <= 10 ? freqs : freqs.slice(lenght - 90)

                        setChartPlot({
                            //labels: times.length < 15 ? times : fixXLabel(times),
                            datasets: [
                                {
                                    data
                                }
                            ]
                        })
                    }
                });
            });
        } catch (err) {
            console.log('catch')
        }
    }

    //FUNÇÃO PARA TRATAR OS DADOS QUE SÃO ACESSADOR POR BANCO DE DADOS
    async function getFromDatabase(data) {
        try {
            const realm = await getRealm();
            let leitura = realm.objects('Reading').filtered(`id == ${data}`);

            const freq = leitura[0].freqs.split(',').map(Number)
            const time = leitura[0].times.split(',').map(Number)
            setTimeStamp(format(
                new Date(leitura[0].timeStamp),
                "dd 'de' MMMM' às 'HH'h'mm",
                { locale: pt }
            ))       
            
            const lenght = freq.length
            const frequencies = lenght <= 10 ? freq : freq.slice(lenght - 90)

            setChartPlot({
                //labels: time.length < 15 ? time : fixXLabel(time),
                datasets: [
                    {
                        data: frequencies
                    }
                ]
            })
            const table = []
            let i = 0
            for(i = 0; i < time.length; i++){
                table.push([time[i], freq[i]])
            }
            setTableData(table)

        } catch (err) {
            console.log(err)
        }
    }

    //FUNÇÃO PARA CERTIFICAR QUE O USUÁRIO JÁ SE CONECTOU AO DISPOSITIVO ANTES DE INICIAR A PLOTAGEM 
    function goToPlot() {
        if(global.connected) {
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
                  { text: "Ir para Configurações", onPress: () => navigation.navigate('Settings') }
                ],
                { cancelable: false }
              );
        }
    }

    return (
        <View style={styles.secondaryContainer}>
            <Animatable.View

                animation="fadeIn"
                duration={1500}
                style={styles.barPlot}>
                {chartPlot && <LineChart
                    data={chartPlot}
                    width={screenWidth - 20}
                    height={screenHeight / 3}
                    chartConfig={chartConfig}
                    withInnerLines={false}
                    style={{
                        marginVertical: 10,
                        borderRadius: 16,
                        marginTop: 50
                    }}
                />}
            </Animatable.View>
            <Animatable.View
                animation="fadeIn"
                duration={1500}
                delay={2500}>
                <View
                    style={styles.listPlot}>
                    <Table borderStyle={{ borderWidth: .3 }}>
                        <Row data={[`Leitura realizada dia ${timeStamp}`]} style={styles.headTable} textStyle={styles.textHeadTable} />
                    </Table>
                    <Table borderStyle={{ borderWidth: .3 }}>
                        <Row data={tableHead} style={styles.headTable} textStyle={styles.textHeadTable} />
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: .3 }}>
                            <Rows data={tableData} textStyle={styles.textTable} />
                        </Table>
                    </ScrollView>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.readButton}
                        onPress={() => {
                            goToPlot()
                        }}>
                        <Text style={styles.textButtonRead}>Nova Leitura</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

export default PlotExistingChart