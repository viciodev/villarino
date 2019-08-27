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
      },
      value: state.speechSetting.active
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
      },
      disabled: !state.speechSetting.active,
      value: state.speechSetting.voice
    }
  ];

  return (
    <section>
      <hr />
      <h3>Accesibilidad</h3>
      {settingItemList.map((item, i) => (
        <SettingItem key={i} data={item} />
      ))}
      <hr />
      <h3>General</h3>
      <SettingItem
        data={{
          title: "Sincronización automática",
          detail:
            'Todas las veces que se cierre y abra la aplicación, se sincronizaran los horarios con la hr actual. Si querés ver siempre el "prómixo en llegar" actualizado, activaá esta función.',
          action: {
            type: "check",
            payload: val =>
              dispatch({ type: "SET_AUTO_SYNC", payload: !state.autoSync })
          },
          value: state.autoSync
        }}
      />
      <SettingItem
        data={{
          title: "Compartir",
          detail: "Por favor comparte la aplicación con quien quieras.",
          action: { type: "icon", payload: <ShareIcon /> }
        }}
      />
    </section>
  );
};

export default SettingPanel;

// ,
//     {
//       title: "Velocidad de voz",
//       detail: "Ajuste la velocidad con la que la voz se reproduce",
//       action: {
//         type: "check",
//         payload: val =>
//           state.speechSetting.active &&
//           dispatch({ type: "SET_VELOCITY", payload: val })
//       },
//       disabled: !state.speechSetting.active
//     }
