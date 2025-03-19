import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const ChartScreen = () => {
  const dashboardUrl = "https://demo.thingsboard.io/dashboard/ab7c9c00-f8c9-11ef-9dbc-834dadad7dd9?publicId=41a9ff80-f8af-11ef-9dbc-834dadad7dd9";

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: dashboardUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
      />
    </View>
  );
};

export default ChartScreen;
