
import * as React from 'react';
import {
  View,
  // Text,
  Dimensions,
  // TouchableOpacity,
  StyleSheet,
  // Platform,
  ListViewDataSource,
  ListView,
  ImageSourceUri,
  Image
} from 'react-native';
import { autobind } from 'core-decorators';
// import Pdf from 'react-native-pdf';
import * as RNFS from 'react-native-fs';
import { AppContext } from '@src/services/app';
import ImageCarousell from './ImageCarousell';
import Assets from '@src/main/assets';

interface CelebrityPageProps extends AppContext {
}

interface CelebrityPageState {
  page: number;
  pageCount: number;
  downloadText: string;
  pdfPath: string;
  jobId: number;

  dataSource: ListViewDataSource;
}

const IMGS: ImageSourceUri[] = [
  { uri: 'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024' },
  { uri: 'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024' }
];

@autobind
export class CelebrityDetail extends React.Component<CelebrityPageProps, CelebrityPageState> {
  path: string;

  constructor(props: CelebrityPageProps) {
    super(props);
    this.state = {
      page: 1,
      pageCount: 1,
      downloadText: '',
      pdfPath: '',
      jobId: 0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };

    // this.path = Platform.select({ ios: RNFS.DocumentDirectoryPath, android: RNFS.ExternalStorageDirectoryPath }) + '/RNTVBZone';
    // this.getPdfPath();
  }

  prePage() {
    let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
    this.setState({ page: prePage });
    console.log(`prePage: ${prePage}`);
  }

  nextPage() {
    let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
    this.setState({ page: nextPage });
    console.log(`nextPage: ${nextPage}`);

  }

 

  render() {
// 类似这样直接引用
    return (
      <View style={styles.container}>
        <ImageCarousell
          middView={<Image source={Assets.zone.thumbnail_tab} style={styles.middView} />}
          showPreview={true}
          imageArray={IMGS}
          previewImageSize={80}
          initialIndex={0} />
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  btn: {
    margin: 5,
    padding: 5,
    backgroundColor: 'blue',
  },
  btnDisable: {
    margin: 5,
    padding: 5,
    backgroundColor: 'gray',
  },
  btnText: {
    color: '#FFF',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  middView: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  }
});