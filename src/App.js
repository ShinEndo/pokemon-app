import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Footer from "./components/Footer/Footer";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [firstContent, setFirstContent] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

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
    //    setFirstContent(false); // 次のページ以降表示しないようにする。
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
              {firstContent && (
                <div className="card myInfo">
                  <p>こんにちは。Shin Endoです。</p>
                  <dl>
                    <div className="flex">
                      <dt>WEB業界：</dt>
                      <dd>約 3年</dd>
                    </div>
                    <div className="flex">
                      <dt>マークアップ：</dt>
                      <dd>約 3年</dd>
                    </div>
                    <div className="flex">
                      <dt>フロントエンド：</dt>
                      <dd>約 2年</dd>
                    </div>
                    <div className="flex">
                      <dt>サーバーサイド：</dt>
                      <dd>
                        約 -年
                        <br />
                        ※勉強中
                      </dd>
                    </div>
                  </dl>
                  <div>
                    <p>W3Cに則ったマークアップを一番の強みとしています。</p>
                    <p>
                      JavaScript、WordPressを使用したHP・LP制作が主な仕事です。SEOへの理解もあります。
                    </p>
                    <p>
                      現在は、Reactを中心に、Nextに踏み込みサーバーサイドも絡めたサイト構築を勉強中です。
                    </p>
                    <p>
                      業務の関係上、PHPも使用するので、最終的にフルスタックエンジニアも視野に見据えています。
                    </p>
                    <p>
                      ポケモンが大好きです。
                      <br />
                      今後は、検索機能なども構築する予定です。
                    </p>
                  </div>
                </div>
              )}
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
