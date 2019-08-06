import React, { useEffect, useState, createRef, useCallback } from "react";
import "./TimeTableList.css";
import { CurrentIcon, LoadingSVG } from "./../Icons/Icons";

const TimeTableList = ({ timeTables, reFetch }) => {
  const [current, setCurrent] = useState(null);
  const [intervalSetted, setIntervalSetted] = useState(false);

  const findAndSetCurrent = useCallback(() => {
    const today = new Date();
    const hour =
      today.getHours() <= 9 ? "0" + today.getHours() : today.getHours();
    const mins =
      today.getMinutes() <= 9 ? "0" + today.getMinutes() : today.getMinutes();
    const formattedToday = hour + ":" + mins;
    let stop = false;

    timeTables.forEach((time, i) => {
      if (formattedToday < time && !stop) {
        setCurrent(i);
        stop = true;
      }
    });
  }, [timeTables]);

  const refs = timeTables.reduce((acc, value, i) => {
    acc[i] = createRef();
    return acc;
  }, {});

  const scrollToCurrent = useCallback(
    id => {
      if (refs[id])
        refs[id].current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    },
    [refs]
  );

  useEffect(() => {
    if (timeTables.length && !intervalSetted) {
      findAndSetCurrent();
      setInterval(findAndSetCurrent, 30000);
      setIntervalSetted(true);
    }
  }, [timeTables, intervalSetted, findAndSetCurrent]);

  useEffect(() => {
    if (current) scrollToCurrent(current);
  }, [current, scrollToCurrent]);

  return (
    <div className="list-container">
      {timeTables.length ? (
        timeTables.map((timeTable, i) => (
          <span key={i}>
            {timeTable && (
              <div
                ref={refs[i]}
                className={
                  i === current ? "time-container current" : "time-container"
                }
              >
                {i === current && (
                  <div className="next-to-arrive">Próximo en llegar</div>
                )}
                <div>{timeTable}</div>
              </div>
            )}
          </span>
        ))
      ) : (
        <LoadingSVG />
      )}
      <button
        className="current-btn"
        onClick={() => {
          reFetch();
          // scrollToCurrent(current);
        }}
      >
        <CurrentIcon />
      </button>
    </div>
  );
};

export default TimeTableList;
