//pokeAPIを使って React-nativeで表示

import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // ページ管理用
  const [endReached, setEndReached] = useState(false); // 最後まで到達したかどうか

  useEffect(() => {
    const loadPokemon = async () => {
      if (loading || endReached) return; // 読み込み中または最後のページなら何もしない

      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${(page - 1) * 100}`);
        const data = await response.json();
        if (data.results.length < 100) {
          setEndReached(true); // もし100匹未満のデータだったら終了
        }
        setPokemonData((prevData) => [...prevData, ...data.results]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [page]);

  const renderPokemonItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.pokemonName}>{item.name}</Text>
      <Image
        source={{
          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split('/')[6]}.png`,
        }}
        style={styles.pokemonImage}
      />
    </View>
  );

  const loadMore = () => {
    if (!loading && !endReached) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <FlatList
      data={pokemonData}
      renderItem={renderPokemonItem}
      keyExtractor={(item, index) => item.name + index}
      numColumns={2} // 列数は 2 に固定
      onEndReached={loadMore} // スクロールの終わりで次のページを読み込む
      onEndReachedThreshold={0.1} // スクロール終わりから少し手前で読み込み開始
      ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      contentContainerStyle={styles.listContainer} // リストのスタイル
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 0, // リスト全体のパディングを削除
    margin: 0, // リスト全体のマージンを削除
  },
  item: {
    flex: 1, // 各アイテムの幅を均等に分ける
    margin: 1, // アイテム間のスペースを極小に設定
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  pokemonImage: {
    width: '100%', // 画像の横幅を100%に設定して最大化
    height: 180,  // 画像の高さを大きく設定
    resizeMode: 'contain', // 画像が歪まないようにリサイズ
    marginBottom: 5,
  },
});

export default App;
