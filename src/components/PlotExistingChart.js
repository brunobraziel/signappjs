import React, { useState, useEffect } from 'react'
import { Dimensions, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import styles from '../styles/index';
import { Table, Row, Rows } from 'react-native-table-component';
import * as RNFS from 'react-native-fs';
import Papa from 'papaparse';
import * as Animatable from 'react-native-animatable';

const PlotExistingChart = ({ route, navigateToHomeScreen }) => {
    const [tableData, setTableData] = useState([])
    const [freqs, setFreqs] = useState([])
    const [times, setTimes] = useState([])
    const [chartPlot, setChartPlot] = useState()

    useEffect(() => {
        uploadFile(route.params.path);
    }, [route.params.path])

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const tableHead = ['Tempo (s)', 'Frequencia (Hz)'];


    const chartConfig = {
        backgroundColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
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

    function fixXLabel(times) {
        let i = 0;
        xlabel = [];
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

    const uploadFile = (path) => {
        const times = []
        const freqs = []

        try {
            RNFS.readFile(path).then((data) => {
                Papa.parse(data, {
                    dynamicTyping: true,
                    complete: results => {
                        setTableData(results.data)
                        for (let data of results.data) {
                            times.push(parseInt(data[0]))
                            freqs.push(parseInt(data[1]))
                        }
                        setFreqs(freqs)
                        setTimes(times)
                        setChartPlot({
                            labels: times.length < 15 ? times : fixXLabel(times),
                            datasets: [
                                {
                                    data: freqs
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

    return (
        <View style={styles.container}>
            <Animatable.View

                animation="fadeIn"
                duration={1500}
                style={styles.barPlot}>
                {chartPlot && <LineChart
                    data={chartPlot}
                    width={screenWidth - 20}
                    height={screenHeight / 3}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 10,
                        borderRadius: 16
                    }}
                />}
            </Animatable.View>

            <Animatable.View
                animation="fadeIn"
                duration={1500}
                delay={2500}
                style={styles.listPlot}>
                <Table borderStyle={{ borderWidth: .3 }}>
                    <Row data={tableHead} style={styles.headTable} textStyle={styles.textTable} />
                </Table>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: .3 }}>
                        <Rows data={tableData} textStyle={styles.textTable} />
                    </Table>
                </ScrollView>
            </Animatable.View>

            <TouchableOpacity
                style={styles.readButton}
                onPress={() => {
                    props.navigation.navigate('Welcome')
                }}>
                <Text style={styles.textButtonRead}>Nova Leitura</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PlotExistingChart