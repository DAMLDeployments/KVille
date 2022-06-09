import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/* let currentUserName;

firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
.get().then((doc) => {
  if (doc.exists) currentUserName = doc.data().username;
}).catch((error) => {
  console.log("Error getting document:", error);
});*/

let members = new Array(); //members array for list


export default function GroupInfo({ route }) {
  const [isReady, setIsReady] = useState(false); // for checking if firebase is read before rendering
  const [isModalVisible, setModalVisible] = useState(false);
  const [currMember, setCurrMember] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { groupCode, groupName } = route.params; // take in navigation parameters
  console.log('route params: ', route.params);

  const GroupRef = firebase.firestore().collection('groups').doc(groupCode);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      async function prepare() {
        try {
          await SplashScreen.preventAutoHideAsync();

          //Accesses Names of Members from firebase and adds them to the array
          await GroupRef.collection('members')
            .get()
            .then((querySnapshot) => {
              if (mounted) {
                //setIsReady(false);
                querySnapshot.forEach((doc) => {
                  let currName = doc.data().name; //gets current name in list
                  //console.log("current name:", currName);

                  let tentCondition = doc.data().inTent; //gets tent status as well
                  //console.log("tentcondition:", tentCondition);

                  let current = {
                    //create new object for the current list item
                    id: currName,
                    name: currName,
                    inTent: tentCondition,
                  };

                  let nameExists, tentStatusChanged; //checks if member is already in list array
                  if (members.length === 0) nameExists = false;
                  else {
                    nameExists = members.some((e) => e.name === currName);
                  }

                  if (mounted && !nameExists) {
                    // if not already in, add to the array
                    members.push(current);
                  }

                  let indexOfUser = members.findIndex(
                    (member) => member.id === currName
                  );
                  tentStatusChanged = !(
                    members[indexOfUser].inTent == tentCondition
                  );
                  // console.log('status1: ', members[indexOfUser].inTent);
                  // console.log('status: ', tentStatusChanged);
                  // console.log('ARRAY: ', members);

                  // checks if tent status changed after refresh and updates list
                  if (nameExists && tentStatusChanged) {
                    members.splice(indexOfUser, 1);
                    members.insert(indexOfUser, current);
                  }

                  // doc.data() is never undefined for query doc snapshots
                });
                console.log('done reading members', members);
              }
            });
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the application to render
          setIsReady(true);
        }
      }
      prepare();

      return () => {
        members = [];
        setIsReady(false);
        mounted = false;
      };
    }, [groupCode])
  );

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  //Render Item for Each List Item of group members
  const Member = ({ name, backgroundColor }) => (
    <TouchableOpacity
        onPress={() => {
          toggleModal();
          setCurrMember(name);
        }}
      >
      <View style={[styles.listItem, backgroundColor, styles.shadowProp]}>
        <Text style={styles.listText}>{name}</Text>
      </View>
    </TouchableOpacity>
    
  );

  //variable for each name box, change color to green if status is inTent
  const renderMember = ({ item }) => {
    const backgroundColor = item.inTent ? '#3eb489' : '#1f509a';
    return <Member name={item.name} backgroundColor={{ backgroundColor }} />;
  };

  if (!isReady) {
    //if firebase reading done, then render
    return null;
  }
  return (
    <View 
      style={styles.container} 
      onLayout={onLayoutRootView}
      //showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Group Name</Text>

      <View style={styles.boxText}>
        <Text style={styles.contentText}>{groupName}</Text>
      </View>

      <Text style={styles.header}>Group Code</Text>
      <View style={styles.boxText}>
        <Text style={styles.contentText}>{groupCode}</Text>
      </View>

      <View>
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
        />
      </View>


      <View>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          //customBackdrop={<View style={{ flex: 1 }} />}
        >
          <View style={styles.popUp}>
            <View
              style={{
                flexDirextion: "row",
                width: "90%",
                alignItems: "flex-end"
              }}
            >
              <TouchableOpacity onPress={toggleModal}>
                <Icon name='close'
                  color={'white'}
                  size={15}
                  style={{ marginTop: 5 }}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.popUpHeader}>{currMember} Information</Text>
            <Text style={styles.popUpText}>Scheduled Hrs: </Text>
          </View>
        </Modal>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2C6D0',
  },
  header: {
    marginBottom: 10,
    marginTop: 4,
    alignSelf: "center",
    //borderWidth: 2,
    color: "#3a3b3c",
    width: "90%",
    fontSize: 22,
    fontWeight: '700',
  },
  contentText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 8
  },
  listItem: {
    backgroundColor: '#1f509a',
    padding: 8,
    marginVertical: 4,
    borderRadius: 7,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  listText: {
    fontSize: 16,
    //fontFamily: "sans-serif",
    fontWeight: '500',
    color: 'white',
  },
  boxText: {
    marginBottom: 10,
    width: '90%',
    backgroundColor: '#FFFAFACC',
    borderRadius: 8,
    alignSelf: 'center',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  popUp: {
    width: "90%",
    height: 100,
    backgroundColor: "#1E3F66",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 15
  },
  popUpHeader: {
    fontFamily: "Arial",
    fontWeight: "600",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
    fontSize: 16
    //borderWidth: 1
  },
  popUpText: {
    backgroundColor: "#2E5984",
    color: "white",
    textAlign: "center",
    width: "90%",
    marginVertical: 8,
    padding: 5,
    borderRadius: 15
  }
});
