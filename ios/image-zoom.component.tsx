import * as React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import styles from './image-zoom.style';
import { ICenterOn, Props, State } from './image-zoom.type';

export default class ImageViewer extends React.Component<Props, State> {
  public static defaultProps = new Props();
  public state = new State();

  // 上次/当前/动画 x 位移
  private positionX = 0;
  private animatedPositionX = new Animated.Value(0);

  // 上次/当前/动画 y 位移
  private positionY = 0;
  private animatedPositionY = new Animated.Value(0);

  // 缩放大小
  private scale = 1;
  private animatedScale = new Animated.Value(1);
  private zoomCurrentDistance = 0;

  public componentWillMount() { }

  public resetScale = () => {
    this.positionX = 0;
    this.positionY = 0;
    this.scale = 1;
    this.animatedScale.setValue(1);
  };

  public panResponderReleaseResolve = () => {};

  public componentDidMount() {}

  public componentWillReceiveProps(nextProps: Props) { }

  public imageDidMove(type: string) {
    if (this.props.onMove) {
      this.props.onMove({
        type,
        positionX: this.positionX,
        positionY: this.positionY,
        scale: this.scale,
        zoomCurrentDistance: this.zoomCurrentDistance
      });
    }
  }

  public centerOn(params: ICenterOn) {
    this.positionX = params!.x;
    this.positionY = params!.y;
    this.scale = params!.scale;
    const duration = params!.duration || 300;
    Animated.parallel([
      Animated.timing(this.animatedScale, {
        toValue: this.scale,
        duration
      }),
      Animated.timing(this.animatedPositionX, {
        toValue: this.positionX,
        duration
      }),
      Animated.timing(this.animatedPositionY, {
        toValue: this.positionY,
        duration
      })
    ]).start(() => {
      this.imageDidMove('centerOn');
    });
  }  

  /**
   * 图片区域视图渲染完毕
   */
  public handleLayout(event: LayoutChangeEvent) {
    if (this.props.layoutChange) {
      this.props.layoutChange(event);
    }
  }

  /**
   * 重置大小和位置
   */
  public reset() {
    this.scale = 1;
    this.animatedScale.setValue(this.scale);
    this.positionX = 0;
    this.animatedPositionX.setValue(this.positionX);
    this.positionY = 0;
    this.animatedPositionY.setValue(this.positionY);
  }

  public render() {
    const parentStyles = StyleSheet.flatten(this.props.style);

    return (
      <View
        style={{
          ...styles.container,
          ...parentStyles,
          width: this.props.cropWidth,
          height: this.props.cropHeight
        }}
      >
          <View
            onLayout={this.handleLayout.bind(this)}
            style={{
              width: this.props.imageWidth,
              height: this.props.imageHeight
            }}
          >
						<ScrollView
							style={{
								width: this.props.imageWidth,
								height: this.props.imageHeight,
							}}
              maximumZoomScale={4.5}
							minimumZoomScale={1}
							bouncesZoom={false}
							bounces={false}
							zoomScale={1}
							alwaysBounceHorizontal={false}
							alwaysBounceVertical={false}
							decelerationRate="fast"
							showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={8}
						>
							{this.props.children}
						</ScrollView>
          </View>
      </View>
    );
  }
}
