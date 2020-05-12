import React, { useState, useEffect } from 'react'
import { Dimensions, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import styles from '../styles/index';
import { Table, Row, Rows } from 'react-native-table-component';
import * as RNFS from 'react-native-fs';
import Papa from 'papaparse';

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
    const tableHead = ['Frequência', 'Tempo'];


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

    const uploadFile = (path) => {
        const times = []
        const freqs = []

        try {
            console.log('ah edmar')
            RNFS.readFile(path).then((data) => {
                Papa.parse(data, {
                    dynamicTyping: true,
                    complete: results => {
                        setTableData(results.data)
                        for (let data of results.data) {
                            freqs.push(data[0])
                            times.push(data[1])
                        }
                        setFreqs(freqs)
                        setTimes(times)
                        setChartPlot({
                            labels: times,
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
            console.log('caiu no catch')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.barPlot}>
                {chartPlot && <LineChart
                    data={chartPlot}
                    width={screenWidth - 20}
                    height={screenHeight / 3}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />}
            </View>

            <View style={styles.listPlot}>
                <Table borderStyle={{ borderWidth: .3 }}>
                    <Row data={tableHead} style={styles.headTable} textStyle={styles.textTable} />
                </Table>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: .3 }}>
                        <Rows data={tableData} textStyle={styles.textTable} />
                    </Table>
                </ScrollView>
            </View>

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