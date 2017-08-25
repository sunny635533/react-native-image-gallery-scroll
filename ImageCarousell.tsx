import * as React from 'react';
import {
  View,
  Image,
  ListView,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ListViewDataSource,
  ViewStyle,
  ImageSourceUri,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { autobind } from 'core-decorators';
import Assets from '@src/main/assets';

type ImageSourceUriOrNull = ImageSourceUri | null;

export interface ImageCarousellProps {
  initialIndex: number;
  showPreview: boolean;
  previewImageSize: number;
  imageArray: ImageSourceUriOrNull[];
  style?: ViewStyle;
  middView?: JSX.Element;
}

export interface ImageCarousellState {
  showPreview: boolean;
  currentPage: number;
  dataSource: ListViewDataSource;
  showLeftRight: boolean;
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

@autobind
export default class ImageCarousell extends React.Component<ImageCarousellProps, ImageCarousellState> {
  private _previewOffset: number = 0;
  private _refListView: ListView;
  private _refPreviewListView: ListView;
  private timer: number;

  constructor(props: ImageCarousellProps) {
    super(props);

    this.state = {
      showLeftRight: false,
      showPreview: this.props.showPreview,
      currentPage: this.props.initialIndex,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
    this.timer = -1;
  }

  componentDidMount() {
    let datas: ImageSourceUriOrNull[] = [];
    let newDatas = datas.concat([null, null], this.props.imageArray, [null, null]);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newDatas),
    });

    setTimeout(() => {
      this.refresh();
    }, 100);

  }

  changedLeftRightStatus() {
    if (this.timer !== -1) {
      clearTimeout(this.timer);
    }
    this.setState({
      showLeftRight: true,
    });

    this.timer = setTimeout(() => {
      this.setState({
        showLeftRight: false,
      });
    }, 3000);

  }


  showLeftRightImage(uri: ImageSourceUri, style: ViewStyle, left: boolean) {
    if (this.state.showLeftRight) {
      return (
        <TouchableOpacity
          style={style}
          onPress={() => {
            this.changedLeftRightStatus();
            let currentPage = this.state.currentPage;
            if (left) {
              if (currentPage > 0) {
                this.onClickPreviewItem(currentPage - 1 + 2);
              }
            } else {
              if (currentPage < (this.props.imageArray.length - 1)) {
                this.onClickPreviewItem(currentPage + 1 + 2);
              }
            }
          }}>
          <Image source={uri} style={styles.leftRightImage} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  componentWillReceiveProps() {
    this.refresh();
  }

  refresh() {
    const { initialIndex, previewImageSize } = this.props;
    const imageSize = previewImageSize + 10; // 加上左右边距

    this._refListView.scrollTo({ x: initialIndex * width, animated: false });
    if (this._refPreviewListView != null) {
      const offset = -(width - imageSize) / 2 + (initialIndex + 2) * imageSize;
      this._refPreviewListView.scrollTo({
        x: offset,
        animated: false,
      });
    }
  }

  handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const event = e.nativeEvent;

    if (!this.state.showPreview) {
      return;
    }

    const { previewImageSize } = this.props;
    const imageSize = previewImageSize + 10;

    // [1] If preview is displayed, adjust position to current image index
    if (this._refPreviewListView != null) {
      const layoutWidth = event.layoutMeasurement.width;
      const currentIndex = Math.floor((event.contentOffset.x + (0.5 * layoutWidth)) / layoutWidth);
      const newPreviewOffset = -(width - imageSize) / 2 + (currentIndex + 2) * imageSize;
      if (this._previewOffset !== newPreviewOffset) {
        this._refPreviewListView.scrollTo({ x: newPreviewOffset, animated: false });
        this._previewOffset = newPreviewOffset;
        this.setState({
          currentPage: currentIndex
        });
      }
    }
  }

  handlePreviewScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { previewImageSize } = this.props;
    const imageSize = previewImageSize! + 10;
    const length = this.props.imageArray.length;

    const offset = e.nativeEvent.contentOffset.x;
    const leftOffsetFromMiddle = (width - imageSize) / 2 + offset;
    let currentIndex = Math.ceil(leftOffsetFromMiddle / imageSize);
    if (currentIndex < 2) {
      currentIndex = 2;
    }
    if (currentIndex >= (length + 1)) {
      currentIndex = length + 1;
    }

    if (currentIndex >= 2 && currentIndex <= (length + 1)) {
      const newPreviewOffset = -(width - imageSize) / 2 + currentIndex * imageSize;
      this._refPreviewListView.scrollTo({ x: newPreviewOffset, animated: true });
    }
  }

  onClickPreviewItem(rowID: number) {
    const { previewImageSize } = this.props;
    const imageSize = previewImageSize! + 10;
    // 顶部切页
    this._refListView.scrollTo({ x: (rowID - 2) * width, animated: false });
    if (this.state.showPreview) {
      // 底部选择中的item归中
      const newPreviewOffset = -(width - imageSize) / 2 + rowID * imageSize;
      this._refPreviewListView.scrollTo({ x: newPreviewOffset, animated: true });
    }
    this.setState({
      currentPage: (rowID - 2),
    });
  }

  renderImageView(row: ImageSourceUri | null) {
    const { previewImageSize } = this.props;
    let imageHeight = height;
    if (this.state.showPreview) {
      imageHeight -= previewImageSize!;
    }

    if (row) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={this.changedLeftRightStatus}>
          <Image
            style={{ width, height: imageHeight }}
            source={row}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }

  }

  renderImagePreview(row: ImageSourceUri, sectionID: number, rowID: number) {
    console.log('renderImagePreview:::sectionID=' + sectionID + ', rowID=' + rowID);
    const { previewImageSize } = this.props;
    if (row) {
      return (
        <TouchableOpacity style={styles.previewTouch} onPress={() => {
          this.onClickPreviewItem(rowID);
        }}>
          <Image
            style={{ width: previewImageSize, height: previewImageSize }}
            source={row}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={StyleSheet.flatten([
          styles.previewTouch,
          { width: previewImageSize, height: previewImageSize },
        ])} />
      );
    }

  }

  renderPreviewListView() {
    if (!this.state.showPreview) { return null; }
    return (
      <View
        style={StyleSheet.flatten([
          styles.previewListView,
          { height: this.props.previewImageSize },
        ])}>
        <ListView
          initialListSize={10}
          dataSource={this.state.dataSource}
          renderRow={this.renderImagePreview}
          horizontal={true}
          onScrollEndDrag={this.handlePreviewScrollEnd}
          onMomentumScrollEnd={Platform.OS === 'android' ? this.handlePreviewScrollEnd : undefined}
          ref={(comp: any) => { this._refPreviewListView = comp; return; }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          horizontal={true}
          pagingEnabled={true}
          maximumZoomScale={3.0}// ios
          directionalLockEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={this.handleScroll}
          dataSource={this.state.dataSource}
          style={styles.listView}
          renderRow={this.renderImageView}
          ref={(comp: any) => this._refListView = comp}
        />
        <TouchableOpacity onPress={() => {
          this.setState({
            showPreview: !this.state.showPreview
          });
        }}>
          {this.props.middView}
        </TouchableOpacity>
        {this.renderPreviewListView()}
        {this.showLeftRightImage(Assets.zone.swipe_left, styles.leftTouchView, true)}
        {this.showLeftRightImage(Assets.zone.swipe_right, styles.rightTouchView, false)}
      </View>
    );
  }
}

const kHight = (Dimensions.get('window').height - 120) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  previewListView: {
    bottom: 10,
    backgroundColor: '#FFFFFF',
  },
  previewTouch: {
    marginLeft: 5,
    marginRight: 5,
  },
  leftRightImage: {
    resizeMode: 'contain',
    height: 35,
    width: 35,
  },
  leftTouchView: {
    position: 'absolute',
    left: 0,
    top: kHight,
  },
  rightTouchView: {
    position: 'absolute',
    right: 0,
    top: kHight,
  }
});
