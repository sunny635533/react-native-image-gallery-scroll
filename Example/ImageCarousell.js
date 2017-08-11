import React, { PropTypes, Component } from 'react';
import {
  View,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';


export default class ImageCarousell extends Component {
  static propTypes = {
    // dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    initialIndex: PropTypes.number,
    showPreview: PropTypes.bool,
    previewImageSize: PropTypes.number,
    renderScrollComponent: PropTypes.func,
    style: View.propTypes.style,
    previewContainerStyle: View.propTypes.style,
    imageStyle: View.propTypes.style,
    previewImageStyle: View.propTypes.style,
    width: PropTypes.number,
    height: PropTypes.number,
    middview:PropTypes.element,
    imageArray:PropTypes.array
  };

  static defaultProps = {
    initialIndex: 0,
    showPreview: true,
    previewImageSize: 80,
    renderScrollComponent: (props) => <ScrollView {...props} />,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this._onClickPreviewItem = this.onClickPreviewItem.bind(this);
    this.handlePreviewScrollEnd = this.handlePreviewScrollEnd.bind(this);
    this.renderImageView = this.renderImageView.bind(this);
    this.renderImagePreview = this.renderImagePreview.bind(this);
    this._bias = 0;
    this._previewOffset = 0;
    this._refListView = null;
    this._refPreviewListView = null;
    this.state = {
      showPreview: props.showPreview,
      currentPage: this.props.initialIndex,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
  }

  componentDidMount() {
    let datas = [];
    let newDatas = datas.concat([null, null], this.props.imageArray, [null, null]);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newDatas),
    });

    setTimeout(() => {
      this.refresh();
    }, 100)
  }

  componentWillReceiveProps() {
    this.refresh();
  }

  refresh() {
    const { initialIndex, previewImageSize, width } = this.props;
    const imageSize = previewImageSize + 10;

    this._refListView.scrollTo({ x: initialIndex * width, animated: false });
    if (this._refPreviewListView != null) {
      const offset = -(width - imageSize) / 2 + (initialIndex + 2) * imageSize;
      this._refPreviewListView.scrollTo({
        x: offset,
        animated: false,
      });
    }
  }

  handleScroll(e) {
    const event = e.nativeEvent;

    if (this.props.showPreview === true && Platform.OS === 'ios') {
      // [0] Show preview only if zoom is disabled
      const newShowPreview = event.zoomScale <= 1;

      if (this.state.showPreview !== newShowPreview) {
        this.setState({ showPreview: newShowPreview });
      }
      if (!newShowPreview) {
        return;
      }
    }

    const { previewImageSize, width } = this.props;
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

  handlePreviewScrollEnd(e) {
    const { width, previewImageSize } = this.props;
    const imageSize = previewImageSize + 10;
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

  onClickPreviewItem(rowID) {
    const { width, previewImageSize } = this.props;
    const imageSize = previewImageSize + 10;
    // 顶部切页
    this._refListView.scrollTo({ x: (rowID - 2) * width, animated: false });
    this.setState({
      currentPage: (rowID - 2),
    });
    // 底部选择中的item归中
    const newPreviewOffset = -(width - imageSize) / 2 + rowID * imageSize;
    this._refPreviewListView.scrollTo({ x: newPreviewOffset, animated: true });
  }

  renderImageView(row) {
    const {
      width,
      height,
      imageStyle,
      previewImageSize,
    } = this.props;
    let imageHeight = height;
    if (this.state.showPreview) {
      imageHeight -= previewImageSize;
    }

    if (row) {
      return (
        <Image
          style={[
            imageStyle,
            { width, height: imageHeight },
          ]}
          source={row}
          resizeMode="contain"
        />
      );
    } else {
      return null;
    }

  }

  renderImagePreview(row, sectionID, rowID) {
    const { previewImageStyle, previewImageSize } = this.props;
    if (row) {
      return (
        <TouchableOpacity style={styles.previewImage} onPress={() => {
          this._onClickPreviewItem(rowID);
        }}>
          <Image
            style={[
              previewImageStyle,
              { width: previewImageSize, height: previewImageSize },
            ]}
            source={row}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    } else {
      return (<View style={[
        styles.previewImage,
        previewImageStyle,
        { width: previewImageSize, height: previewImageSize },
      ]} />);

    }

  }

  renderPreviewListView() {
    if (!this.state.showPreview) { return null; }
    return (
      <View
        style={[
          styles.previewListView,
          this.props.previewContainerStyle,
          { height: this.props.previewImageSize },
        ]}>
        <ListView
          initialListSize={10}
          onLayout={this.handlePreviewLayout}
          dataSource={this.state.dataSource}
          renderRow={this.renderImagePreview}
          horizontal={true}
          onScrollEndDrag={this.handlePreviewScrollEnd}
          onMomentumScrollEnd={Platform.OS === 'android' ? this.handlePreviewScrollEnd : undefined}
          //scrollEnabled={true}
          //alwaysBounceHorizontal={false}// ios
          //bounces={false}
          ref={comp => { this._refPreviewListView = comp; return; }}
        />
      </View>
    );
  }

  // renderScrollComponent(props) {
  //   return React.cloneElement(
  //     this.props.renderScrollComponent(props),
  //     {
  //       horizontal: true,
  //       pagingEnabled: true,
  //       maximumZoomScale: 3.0,//ios
  //       directionalLockEnabled: true,
  //       showsVerticalScrollIndicator: false,
  //       showsHorizontalScrollIndicator: false,
  //       ...props,
  //     });
  // }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          //renderScrollComponent={this.renderScrollComponent}
          horizontal={true}
          pagingEnabled={true}
          maximumZoomScale={3.0}//ios
          directionalLockEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={this.handleScroll}
          dataSource={this.state.dataSource}
          style={styles.listView}
          renderRow={this.renderImageView}
          ref={comp => { this._refListView = comp; return; }}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: this.props.previewImageSize,
            height: 30,
            //backgroundColor: '#ff0000'
          }}>
          {this.props.middview}
          </View>
        </View>
        {this.renderPreviewListView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  previewListView: {
    marginTop: 2,
    paddingTop: 2,
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    marginLeft: 5,
    marginRight: 5,
  },
});
