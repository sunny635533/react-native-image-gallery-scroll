
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

// import ImageCarousell from 'react-native-image-carousell';
import ImageCarousell from './ImageCarousell';

const IMGS = [
  { uri: 'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024' }
];

export default class Ausesome extends Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    // this.state = {
    //   dataSource: dataSource.cloneWithRows([
    //     null,
    //     null,
    //     require('./images/first.png'),
    //     require('./images/second.png'),
    //     require('./images/3.png'),
    //     require('./images/4.png'),
    //     require('./images/5.png'),
    //     require('./images/6.png'),
    //     require('./images/7.png'),
    //     require('./images/8.png'),
    //     require('./images/9.png'),
    //     require('./images/10.png'),
    //     null,
    //     null,
    //   ]),
    // };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageCarousell
          imageArray={IMGS}
          middview={<View style={{ width: 80, height: 30, backgroundColor: '#333333' }} />}
          showPreview={true}
        />
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
