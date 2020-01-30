import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  ActivityIndicator,
  ListRenderItemInfo,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { ListItem, SearchBar } from "react-native-elements";
import { getRepos } from 'api/index';

interface IGithubRepoItem {
  id: string,
  name: string, 
  description: string, 
  stargazers_count: number, 
  language: string, 
  owner: { login: string, avatar_url: string }
}

interface IComponentState {
  loading: boolean;
  repoItems: IGithubRepoItem[];
}

export interface IApiItemResponse {
  total_count: number,
  incomplete_results: boolean,
  items: IGithubRepoItem[]
}

const Home = () => {

  const [state, setState] = useState<IComponentState>({loading: false, repoItems: []});

  const [query, onChangeQuery] = useState('')

  const getResults = (getData: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    setState({ repoItems: [], loading: true});
    const result = getData.nativeEvent.text;
    getRepos(result)
    .then((response: IApiItemResponse) => {
        setState({repoItems: response.items, loading: false });
    });
    
  }

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  const renderFooter = () => {
    if (state && !state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const keyExtractor = (item: IGithubRepoItem, index: number) => index.toString()

  const renderItem = (element: ListRenderItemInfo<IGithubRepoItem>) => {
    return (
      <ListItem
        leftAvatar={{ source: { uri: element.item.owner.avatar_url } }}
        title={element.item.name}
        subtitle={element.item.description}
        bottomDivider
        containerStyle={{ borderBottomWidth: 0 }}
      />
    )
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <SearchBar 
        onSubmitEditing={getResults}
        placeholder="Search github repositories here..."
        onChangeText={text => onChangeQuery(text)}
        value={query}
        lightTheme round />
        <FlatList
          data={state.repoItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps={'always'}
        />
      </SafeAreaView>
    </>
  );
};

export default Home;