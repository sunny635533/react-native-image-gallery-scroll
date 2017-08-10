
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ListView
} from 'react-native';

import ImageCarousell from 'react-native-image-carousell';

export default class Ausesome extends Component {


  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([
        null,
        null,
        require('./images/first.png'),
        require('./images/second.png'),
        require('./images/3.png'),
        require('./images/4.png'),
        require('./images/5.png'),
        require('./images/6.png'),
        require('./images/7.png'),
        require('./images/8.png'),
        require('./images/9.png'),
        require('./images/10.png'),
        null,
        null,
      ]),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageCarousell
          middview={<Image source={require('./images/10.png')} style={{ width: 80 }} />}
          showPreview={true}
          dataSource={this.state.dataSource} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  page: {
    width: Dimensions.get('window').width,
  },
});

AppRegistry.registerComponent('Ausesome', () => Ausesome);
