import React from 'react';
import { SafeAreaView, Image, StyleSheet, FlatList, View, Text, StatusBar, TouchableOpacity, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/1.png'),
    title: 'Explore New Recipes',
    subtitle: 'with great search engine and category system, expoloring has been made easy and efficient',
  },
  {
    id: '2',
    image: require('../assets/2.png'),
    title: 'Share Your Recipes',
    subtitle: 'the app provides you with very smooth upload functionality of details and images of your recipe',
  },
  {
    id: '3',
    image: require('../assets/3.png'),
    title: 'Save New Recipes',
    subtitle: 'the app allows you to also save posts for later reference thereby not having to search all over again',
  },
];

const Slide = ({item}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={item?.image}
        style={{height: 300, width, resizeMode: 'contain'}}
      />
      <View>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Header = () => {
    return (
      <View style={{height: 30, width: 50, marginLeft: 290, marginTop: 40}}>
      {currentSlideIndex == slides.length - 1 ? (<></>): (<TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: '#737170',
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: 'black' }}> SKIP </Text>
              </TouchableOpacity>)}
    </View>
    )
    
  }
  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center'
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: '#E56B6F',
                  height: 15,
                  width: 15,
                  borderRadius: 15,
                  borderColor: 'white',
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20, alignItems: 'center'}}>
          {currentSlideIndex == slides.length - 1 ? (
           
              <TouchableOpacity
                style={styles.appButtonContainer}
                onPress={()=>navigation.navigate('login')}>
                <Text style={styles.appButtonText}> GET STARTED </Text>
              </TouchableOpacity>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}> NEXT </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Header/>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: '#737170',
    fontSize: 13,
    marginTop: 5,
    maxWidth: 270,
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: 'black',
    fontSize: 24,
    marginTop: 5,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 12,
    borderColor: '#737170',
    borderWidth: 1,
    marginHorizontal: 5,

  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appButtonContainer: {
    flexDirection: 'row',
    elevation: 3,
    backgroundColor: "#E56B6F",
    borderRadius: 30,
    paddingVertical: 15,
    width: 285,
    marginBottom: 20,
    marginTop: 20, 
    justifyContent: 'center'
     
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"  }
});
export default OnboardingScreen;