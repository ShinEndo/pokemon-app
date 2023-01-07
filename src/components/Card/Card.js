import React, { useState } from "react";
import "./Card.css";
import { useEffect } from "react";

export const Card = ({ pokemon }) => {
  const speciesUrl = pokemon.species.url;
  const [name, setName] = useState("");
  const [genus, setGenus] = useState("");
  const [ability, setAbility] = useState([]);
  const [flavorText, setFlavorText] = useState("");
  const getPokemonInfo = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    });
  };
  useEffect(() => {
    const getName = async () => {
      const responseSpecies = await getPokemonInfo(speciesUrl);
      // 名前の取得（日本語）
      const names = responseSpecies.names;
      setName(names.find((v) => v.language.name === "ja").name);
      // 分類の取得（日本語）
      const genera = responseSpecies.genera;
      setGenus(genera.find((v) => v.language.name === "ja").genus);
      // 説明文の取得（日本語）
      const flavorTextEntries = responseSpecies.flavor_text_entries;
      let flavorTextInfo = flavorTextEntries.filter((v) => {
        return v.language.name === "ja" && v.version.name === "sword";
      });
      if (flavorTextInfo.length === 0) {
        // バージョンをYで取得し直す.
        flavorTextInfo = flavorTextEntries.filter((v) => {
          return v.language.name === "ja" && v.version.name === "y";
        });
      }
      if (flavorTextInfo.length === 0) {
        // バージョンをサンで取得し直す.
        flavorTextInfo = flavorTextEntries.filter((v) => {
          return v.language.name === "ja" && v.version.name === "sun";
        });
      }
      setFlavorText(flavorTextInfo[0].flavor_text);
    };
    getName();
  }, [pokemon]);

  useEffect(() => {
    pokemon.abilities.map(async (_ability) => {
      const responseAbilities = await getPokemonInfo(_ability.ability.url);
      const abilitiesNames = responseAbilities.names;
      const abilityName = abilitiesNames.find(
        (v) => v.language.name === "ja"
      ).name;
      setAbility((prev) => [...prev, abilityName]);
    });
  }, []);

  // ３桁の数字に変換する
  const zeroPadding = (num) => {
    return (Array(3).join("0") + num).slice(-3);
  };

  // タイプ情報を日本語に変換する
  const typeCheck = (type) => {
    const typeInfo = { name: "", color: "" };
    switch (type) {
      case "normal":
        typeInfo.name = "ノーマル";
        typeInfo.color = "normal";
        return typeInfo;
      case "fire":
        typeInfo.name = "ほのう";
        typeInfo.color = "fire";
        return typeInfo;
      case "water":
        typeInfo.name = "みず";
        typeInfo.color = "water";
        return typeInfo;
      case "grass":
        typeInfo.name = "くさ";
        typeInfo.color = "grass";
        return typeInfo;
      case "electric":
        typeInfo.name = "でんき";
        typeInfo.color = "electric";
        return typeInfo;
      case "ice":
        typeInfo.name = "こおり";
        typeInfo.color = "ice";
        return typeInfo;
      case "fighting":
        typeInfo.name = "かくとう";
        typeInfo.color = "fighting";
        return typeInfo;
      case "poison":
        typeInfo.name = "どく";
        typeInfo.color = "poison";
        return typeInfo;
      case "ground":
        typeInfo.name = "じめん";
        typeInfo.color = "ground";
        return typeInfo;
      case "flying":
        typeInfo.name = "ひこう";
        typeInfo.color = "flying";
        return typeInfo;
      case "psychic":
        typeInfo.name = "エスパー";
        typeInfo.color = "psychic";
        return typeInfo;
      case "bug":
        typeInfo.name = "むし";
        typeInfo.color = "bug";
        return typeInfo;
      case "rock":
        typeInfo.name = "いわ";
        typeInfo.color = "rock";
        return typeInfo;
      case "ghost":
        typeInfo.name = "ゴースト";
        typeInfo.color = "ghost";
        return typeInfo;
      case "dragon":
        typeInfo.name = "ドラゴン";
        typeInfo.color = "dragon";
        return typeInfo;
      case "dark":
        typeInfo.name = "あく";
        typeInfo.color = "dark";
        return typeInfo;
      case "steel":
        typeInfo.name = "はがね";
        typeInfo.color = "steel";
        return typeInfo;
      case "fairy":
        typeInfo.name = "フェアリー";
        typeInfo.color = "fairy";
        return typeInfo;
      default:
        typeInfo.name = "--";
        typeInfo.color = "";
        return typeInfo;
    }
  };

  return (
    <div className="card">
      <div className="cardImg">
        {/* <img src={pokemon.sprites.front_default} alt="" /> */}
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt=""
        />
      </div>
      <div>
        <div className="cardNum">No.{zeroPadding(pokemon.id)}</div>
        <h2 className="cardName">{name}</h2>
      </div>
      <dl className="cardDl">
        <div>
          <dt>分類：</dt>
          <dd>{genus}</dd>
        </div>
        <div>
          <dt>タイプ：</dt>
          <dd>
            {pokemon.types.map((type) => {
              const typeInfo = typeCheck(type.type.name);
              return (
                <span
                  className={`typeName ${typeInfo.color}`}
                  key={type.type.name}
                >
                  {typeInfo.name}
                </span>
              );
            })}
          </dd>
        </div>
        <div>
          <dt>高さ：</dt>
          <dd>{(pokemon.height / 10).toFixed(1)}m</dd>
        </div>
        <div>
          <dt>重さ：</dt>
          <dd>{(pokemon.weight / 10).toFixed(1)}kg</dd>
        </div>
        <div>
          <dt>特性：</dt>
          <dd>
            {/* {console.log(ability)} */}
            {ability.map((_ability, index) => {
              return (
                <span className="ability" key={`ability-${index}`}>
                  {_ability}
                </span>
              );
            })}
          </dd>
        </div>
      </dl>
      <div className="cardFooter">
        <p>{flavorText}</p>
      </div>
    </div>
  );
};
