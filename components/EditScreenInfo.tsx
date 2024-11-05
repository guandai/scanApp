import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditScreenInfo({ path }: { path: string }) {
  const [userInfo, setUserInfo] = useState<{
    userId: string | null;
    userRole: string | null;
    token: string | null;
  }>({
    userId: null,
    userRole: null,
    token: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userRole = await AsyncStorage.getItem('userRole');
        const token = await AsyncStorage.getItem('token');
        setUserInfo({ userId, userRole, token });
      } catch (error) {
        console.error('Failed to load user info', error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          User Information:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>User ID: {userInfo.userId}</MonoText>
          <MonoText>User Role: {userInfo.userRole}</MonoText>
          <MonoText>Token: {userInfo.token}</MonoText>
        </View>

        {/* You can keep the existing content or modify as needed
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View> */}
      </View>

      {/* Rest of your component */}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
