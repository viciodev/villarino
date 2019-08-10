var DomParser = require("dom-parser");
var parser = new DomParser();
const rp = require("request-promise");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cache = require("memory-cache");

const online = true;

const app = express();

const port = process.env.PORT || 5000;

function buildAndResponse(html, req, res) {
  var dom = parser.parseFromString(html);
  var todo = [
    {
      id: 0,
      displayName: "Parque de Mayo",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 1,
      displayName: "Plaza Rivadavia",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 2,
      displayName: "Hospital Penna",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 3,
      displayName: "Villa Arias",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 4,
      displayName: "Terminal Punta Alta",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 5,
      displayName: "Limbo",
      way: false,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 4,
      displayName: "Terminal Punta Alta",
      way: true,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 3,
      displayName: "Villa Arias",
      way: true,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 2,
      displayName: "Hospital Penna",
      way: true,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 1,
      displayName: "Plaza Rivadavia",
      way: true,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    },
    {
      id: 0,
      displayName: "Parque de Mayo",
      way: true,
      summerTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      winterTime: { weekDay: [], saturday: [], hollidaysSunday: [] },
      normalTime: { weekDay: [], saturday: [], hollidaysSunday: [] }
    }
  ];
  tableParser(dom, "tabla ver", todo, 0);
  tableParser(dom, "tabla ver", todo, 1);
  tableParser(dom, "tabla ver", todo, 2);
  tableParser(dom, "tabla inv", todo, 0);
  tableParser(dom, "tabla inv", todo, 1);
  tableParser(dom, "tabla inv", todo, 2);
  tableParser(dom, "tabla rda", todo, 0);
  tableParser(dom, "tabla rda", todo, 1);
  tableParser(dom, "tabla rda", todo, 2);

  const { timeId, way, seasson, dayOfWeek } = req.params;
  //find the selected time into todo object by id and way, the pair which
  //identify a unique object in the array
  const time = todo.find(
    time => time.id.toString() === timeId && time.way.toString() === way
  );
  //sorting the result from less to more
  const result = time[seasson][dayOfWeek]
    .filter(hour => hour.length > 2)
    .sort();

  if (result.length) {
    res.send({ timetables: result });
  } else {
    res.json({ error: "No hay horarios para mostrar." });
  }
}

function setData(req, res) {
  if (online) {
    rp.get({
      uri: "http://www.elvillarino.com.ar/#horarios"
    })
      .then(html => {
        buildAndResponse(html, req, res);
      })
      .catch(err => console.log(err));
  } else {
    fs.readFile("villarino.html", "utf8", function(err, html) {
      if (!err) {
        buildAndResponse(html, req, res);
      }
    });
  }
}

function tableParser(dom, className, todo, dayOfWeek) {
  //select if it's summer, winnter hollidays or rest of the year (normalTime)
  var table = dom.getElementsByClassName(className)[dayOfWeek].innerHTML;
  //parse the raw HTML to get a dom representation of it
  var domTable = parser.parseFromString(table);
  //select only the rows of the specific table
  var rows = domTable.getElementsByTagName("tr");

  //convert from the number of type of day to name property to access to the
  //object that contains all the data
  let objNameDay;
  switch (dayOfWeek) {
    case 0:
      objNameDay = "weekDay";
      break;
    case 1:
      objNameDay = "saturday";
      break;
    case 2:
      objNameDay = "hollidaysSunday";
      break;
    default:
      break;
  }

  //transform the seasson of the year from the class name used in the HTML
  //to name property used in the "todo" object
  let seasson;
  switch (className) {
    case "tabla ver":
      seasson = "summerTime";
      break;
    case "tabla inv":
      seasson = "winterTime";
      break;
    case "tabla rda":
      seasson = "normalTime";
      break;
    default:
      break;
  }

  //iteration over all rows getting the different values of each column to save it
  //in todo object which represent the whole HTML parsed.
  rows.forEach((row, f) => {
    let iCol = 0;
    if (f > 0) {
      row.getElementsByTagName("td").forEach((hour, c) => {
        if (c <= 10 && iCol <= 10) {
          if (
            seasson === "normalTime" &&
            iCol === 5 &&
            objNameDay !== "saturday" &&
            objNameDay !== "hollidaysSunday"
          ) {
            iCol++;
          }
          todo[iCol][seasson][objNameDay].push(hour.textContent);
          iCol++;
        }
      });
    }
  });
}

// configure cache middleware
let memCache = new cache.Cache();
let cacheMiddleware = duration => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        memCache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

function fetchHolidays(res, clientDate) {
  if (online) {
    rp.get({
      uri: "http://nolaborables.com.ar/api/v2/feriados/2019"
    })
      .then(data => {
        const dataJSON = JSON.parse(data);
        const holidayData = dataJSON.find(
          date => date.dia === clientDate.day && date.mes === clientDate.month
        );

        res.send(holidayData ? holidayData : []);
      })
      .catch(err => console.log(err));
  } else {
    fs.readFile("feriados.json", "utf8", function(err, data) {
      if (!err) {
        const dataJSON = JSON.parse(data);
        const holidayData = dataJSON.find(
          date => date.dia === clientDate.day && date.mes === clientDate.month
        );

        res.send(holidayData ? holidayData : []);
      }
    });
  }
}

app.use(cors());

app.get("/api/holidays/:date", cacheMiddleware(600000), (req, res) => {
  const { date } = req.params;
  const fullDate = new Date(parseInt(date));

  fetchHolidays(res, {
    day: fullDate.getDate(),
    month: fullDate.getMonth() + 1
  });
});

app.get(
  "/api/timetables/:timeId/:way/:seasson/:dayOfWeek",
  cacheMiddleware(600000),
  (req, res) => {
    setData(req, res);
  }
);

app.listen(port, () => console.log(`Listening on port ${port}`));
