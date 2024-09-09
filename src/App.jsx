/* eslint-disable react/react-in-jsx-scope */
//App.jsx

import "./App.css";
//import rawData from "./rawData.json";
import { useEffect, useState } from "react";
import CarTable from "./components/CarTable/CarTable";
import UniForm from "./components/UniForm/UniForm";
import FilterForm from "./components/FilterForm/FilterForm";
import axios from "axios";

function App() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    reg: "",
    km: "",
    year: "",
  });
  const [carToChange, setCarToChange] = useState({
    id: 0,
    brand: "",
    model: "",
    reg: "",
    km: "",
    year: "",
  });
  const [carsToShow, setCarsToShow] = useState([]);
  //-----všechny auta z databáze = getCars
  const getCars = () => {
    axios
      .get("./cars-backend/?action=getAll")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCars(response.data);
          setCarsToShow(response.data);
        }
      })
      .catch((error) => {
        console.error("Nastala chybka", error);
        alert(`Nastala chybka: ${error}`);
      });
  };

  useEffect(() => {
    getCars();
  }, []);

  useEffect(() => {
    console.log("carsToShow updated:", carsToShow);
  }, [carsToShow]);

  //-----specificka auta z databáze = filterCars
  const filterCars = (ids) => {
    //[1,2,3]..."1,2,3"
    const param = ids.join();
    console.log(param);
    const url = `./cars-backend/?action=getSpec&ids=${param}`;
    console.log("Sending request to:", url);
    axios
      .get(url)
      .then((response) => {
        console.log("Server response:", response.data);
        if (Array.isArray(response.data)) {
          setCarsToShow(response.data);
          console.log("carsToShow updated with filtered data:", response.data);
        } else {
          console.error("Odpoved serveru neni pole");
        }
      })
      .catch((error) => {
        console.error("Nastala chybka", error);
        alert(`Nastala chybka: ${error}`);
      });
  };

  //-----mazani autaz db: deleteCar
  const deleteCar = (id) => {
    axios
      .delete(`./cars-backend/${id}`)
      .then((response) => {
        console.log(response.data);
        getCars();
        alert("Auto bzlo uspesne smazano");
      })
      .catch((error) => {
        console.error("Nastala chybka", error);
        alert(`Nastala chybka: ${error}`);
      });
  };

  //---------pridani auta do db: insertCar
  const insertCar = (car) => {
    axios
      .post("./cars-backend/", car)
      .then((response) => {
        console.log(response.data);
        getCars();
        alert("Auto uspesne pridano");
      })
      .catch((error) => {
        console.error("Nastala chybka", error);
        alert(`Nastala chybka: ${error}`);
      });
  };
  //---------- editace auta v db: updateCar
  const updateCar = (car) => {
    axios
      .put("./cars-backend/", car)
      .then((response) => {
        console.log(response.data);
        getCars();
        alert("Auto uspesne pridano");
      })
      .catch((error) => {
        console.error("Nastala chybka", error);
        alert(`Nastala chybka: ${error}`);
      });
  };

  const handleNewData = (updatedCar, source) => {
    switch (source) {
      case "add-car-form": {
        setNewCar(updatedCar);
        break;
      }
      case "change-car-form": {
        setCarToChange(updatedCar);
        break;
      }
      default:
        break;
    }
  };

  const fillEmptyInfos = (car) => {
    const filledCar = {
      ...car,
      brand: car.brand.trim() ? car.brand : "empty",
      model: car.model.trim() ? car.model : "empty",
      reg: car.reg.trim() ? car.reg : "empty",
      km: parseInt(car.km) || 0,
      year: parseInt(car.year) || 0,
    };
    return filledCar;
  };

  const confirmCar = (car) => {
    return window.confirm(
      "Opravdu chcete odeslat data?\n" +
        `Značka: ${car.brand}\n` +
        `Model: ${car.model}\n` +
        `Reg.značka: ${car.reg}\n` +
        `Kilometry: ${car.km}\n` +
        `Rok výroby: ${car.year}\n`
    );
  };

  const handleUpdate = (source) => {
    let temp;
    switch (source) {
      case "add-car-form": {
        temp = fillEmptyInfos(newCar);
        if (confirmCar(temp)) {
          insertCar(temp);
          setNewCar({
            brand: "",
            model: "",
            reg: "",
            km: "",
            year: "",
          });
          alert("Data byla úspěšně odeslána");
        } else {
          alert("Odeslání dat bylo zrušeno");
        }
        break;
      }
      case "change-car-form": {
        temp = fillEmptyInfos(carToChange);
        if (confirmCar(temp)) {
          const index = cars.findIndex((car) => car.id === temp.id);
          if (index !== -1) {
            updateCar(temp);
            setCarToChange({
              id: 0,
              brand: "",
              model: "",
              reg: "",
              km: "",
              year: "",
            });
            alert("Aktualizace dat úspěšná");
          } else {
            alert("Auto s daným id nebylo nalezeno");
            setCarToChange({
              id: 0,
              brand: "",
              model: "",
              reg: "",
              km: "",
              year: "",
            });
          }
        } else {
          alert("Aktualizace neproběhla");
        }
        break;
      }
      default:
        break;
    }
  };

  const handleDelete = (idToDel) => {
    deleteCar(idToDel);
  };
  const handleChange = (idToChange) => {
    const temp = cars.find((car) => car.id === idToChange);
    setCarToChange(temp);
  };

  const handleFilterData = (filteredCars) => {
    console.log("handleFilterData called with:", filteredCars);
    const ids = filteredCars.map((car) => car.id);
    filterCars(ids);
  };

  return (
    <div className="container">
      <FilterForm data={cars} handleFilterData={handleFilterData} />
      <CarTable
        data={carsToShow}
        handleDelete={handleDelete}
        handleChange={handleChange}
      />
      <p>Přidání nového auta</p>
      <UniForm
        id="add-car-form"
        data={newCar}
        handleNewData={handleNewData}
        handleUpdate={handleUpdate}
      />
      <p>Úpravy existujícího auta</p>
      <UniForm
        id="change-car-form"
        data={carToChange}
        handleNewData={handleNewData}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default App;
