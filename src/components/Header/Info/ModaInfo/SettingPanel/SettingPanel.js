import React, { useContext } from "react";

import Context from "./../../../../../context";
import "./SettingPanel.css";
import SettingItem from "./SettingItem/SettingItem";
import { ShareIcon } from "../../../../Icons/Icons";

const SettingPanel = () => {
  const { state, dispatch } = useContext(Context);
  const settingItemList = [
    {
      title: "Activar",
      detail:
        "Este modo configura la aplicación de manera que la interfaz se cambia completamente para ayudar a las personas con visión reducida.",
      action: {
        type: "check",
        payload: val => dispatch({ type: "SET_SPEECH_MODE", payload: val })
      }
    },
    {
      title: "Voz",
      detail:
        "La interfáz será interpretada por una voz indicando los valores elegidos.",
      action: {
        type: "check",
        payload: val =>
          state.speechSetting.active &&
          dispatch({ type: "SET_VOICE", payload: val })
      }
    },
    {
      title: "Velocidad de voz",
      detail: "Ajuste la velocidad con la que la voz se reproduce",
      action: {
        type: "check",
        payload: val =>
          state.speechSetting.active &&
          dispatch({ type: "SET_VELOCITY", payload: val })
      }
    }
  ];

  return (
    <section>
      <hr />
      <h3>Accesibilidad</h3>
      {settingItemList.map((item, i) => (
        <SettingItem
          key={i}
          title={item.title}
          detail={item.detail}
          action={item.action}
        />
      ))}
      <hr />
      <h3>Compartir</h3>
      <SettingItem
        title=""
        detail="Por favor comparte la aplicación con quien quieras."
        action={{ type: "icon", payload: <ShareIcon /> }}
      />
    </section>
  );
};

export default SettingPanel;
