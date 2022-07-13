import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import { Title, Drawer, Switch } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMutation, useQueryClient } from 'react-query';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useSelector, useDispatch } from 'react-redux';
// import { reset } from "../redux/reducers/userSlice";

export default function DrawerContent(props) {
  const [status, setStatus] = useState(false);

  const groupCode = useSelector((state) => state.user.currGroupCode);
  console.log('group code', groupCode);
  const groupName = useSelector((state) => state.user.currGroupName);
  const userName = useSelector((state) => state.user.currUserName);
  const tentType = useSelector((state) => state.user.currTentType);
  const groupRole = useSelector((state) => state.user.currGroupRole);

  const useUpdateTentStatus = (groupCode) => {
    const queryClient = useQueryClient();
    return useMutation((status) => updateTentStatus(groupCode, status), {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['group', groupCode]);
      },
    });
  };
  const updateTentStatus = (groupCode, status) => {
    firebase
      .firestore()
      .collection('groups')
      .doc(groupCode)
      .collection('members')
      .doc(firebase.auth().currentUser.uid)
      .update({
        inTent: status,
      })
      .then(() => {
        console.log('successfully updated tent status: ', status);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const postTentStatus = useUpdateTentStatus(groupCode);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      console.log('useFocusEffect triggered');
      if (mounted && groupCode != '') {
        firebase
          .firestore()
          .collection('groups')
          .doc(groupCode)
          .collection('members')
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((doc) => {
            if (mounted && doc.exists) {
              console.log(doc.data().inTent);
              setStatus(doc.data().inTent);
              console.log('status: ', status);
            } else {
              console.log("doc doesn't exist");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
      return () => (mounted = false);
    }, [groupCode])
  );

  const onToggleSwitch = async () => {
    setStatus(!status);
    postTentStatus.mutate(!status);
  };

  //const dispatch = useDispatch();

  const onLogout = () => {
    //dispatch(reset());
    firebase.auth().signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Title style={styles.title}>Krzyzewskiville</Title>
            </View>

            {/* <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  100
                </Paragraph>
                <Caption style={styles.caption}>Followers</Caption>
              </View>
            </View> */}
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='home-outline' color={color} size={size} />
              )}
              label='Home'
              onPress={() => {
                props.navigation.navigate('Start');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='account-group-outline' color={color} size={size} />
              )}
              label='Group Information'
              onPress={() => {
                props.navigation.navigate('GroupInfo', {
                  groupCode: groupCode,
                  groupName: groupName,
                  groupRole: groupRole,
                });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='calendar-text-outline' color={color} size={size} />
              )}
              label='Your Availability'
              onPress={() => {
                props.navigation.navigate('AvailabilityScreen', {
                  groupCode,
                });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='calendar-outline' color={color} size={size} />
              )}
              label='Schedule'
              onPress={() => {
                props.navigation.navigate('ScheduleScreen', {
                  code: groupCode,
                  tentType: tentType,
                });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='timer-outline' color={color} size={size} />
              )}
              label='Countdown'
              onPress={() => {
                props.navigation.navigate('CountdownScreen');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='alert-outline' color={color} size={size} />
              )}
              label='Line Monitoring'
              onPress={() => {
                props.navigation.navigate('MonitorScreen');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='information-outline' color={color} size={size} />
              )}
              label='Information'
              onPress={() => {
                props.navigation.navigate('InfoScreen');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='cog-outline' color={color} size={size} />
              )}
              label='Settings'
              onPress={() => {
                props.navigation.navigate('SettingScreen', {
                  groupCode,
                  groupName,
                  userName,
                  tentType,
                });
              }}
            />
            <DrawerItem label='Log out' onPress={() => onLogout()} />
          </Drawer.Section>
          <Drawer.Section title='Preferences'>
            <View style={styles.preference}>
              <Text style={{ color: '#000' }}>In Tent</Text>
              <Switch value={status} onValueChange={onToggleSwitch} />
            </View>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
