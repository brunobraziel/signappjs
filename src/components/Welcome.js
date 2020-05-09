import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/index'
import { TouchableOpacity } from "react-native"

export default class Welcome extends Component {
    state = {
        subtitulo: "Tutupom por ai, negah?"
      }

    
    alternar = (message) => {
        this.setState({
          subtitulo: this.state.subtitulo ? '' : message
        });
      }

    render() {
        const tit = this.props.route.params.titulo;
        const outro = this.props.route.params.outro;
        
        return (
            <View style={styles.container}>
                <Text style={styles.texto}>{tit}</Text>
                <Text style={styles.texto}>{outro}</Text>

                
                <TouchableOpacity 
                    style={styles.botao}
                    onPress={() => {this.alternar('Tutupom por aí, negah?')}}>
                    <Text style={styles.textoBotao}>Mudar state</Text>
                </TouchableOpacity>
                
                <Text style={styles.texto}>{this.state.subtitulo}</Text>

                <TouchableOpacity 
                    style={styles.botao}
                    onPress={() => {this.alternar('Tutupom por aí, negah?')}}>
                    <Text style={styles.textoBotao}>Mudar state</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

