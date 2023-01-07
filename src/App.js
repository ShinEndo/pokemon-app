import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Footer from "./components/Footer/Footer";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState(""); // 状態変数をセットする。
  const [prevURL, setPrevURL] = useState(""); // 状態変数をセットする。

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []); // ロードされた時に読み込みたいので、「useEffect()」を使用する。1回でいいので、第二引数は[]にする。

  // console.log(nextURL);
  console.log(prevURL);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next); // 次のURLを取得して、セットする。
    setPrevURL(data.previous); // 前のURLを取得して、セットする。
    setLoading(false);
  };
  const handlePrevPage = async () => {
    if (!prevURL) return; // nullの場合のif分岐処理
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next); // 次のURLを取得して、セットする。
    setPrevURL(data.previous); // 前のURLを取得して、セットする。
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <div className="center">
            <div>
              <div className="pokemonBall">
                <div></div>
                <div>
                  <div></div>
                </div>
              </div>
              <h1 class="loading">ロード中・・・</h1>
            </div>
          </div>
        ) : (
          <>
            <div className="pokemonCradContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              {prevURL && <button onClick={handlePrevPage}>前へ</button>}
              {nextURL && <button onClick={handleNextPage}>次へ</button>}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
