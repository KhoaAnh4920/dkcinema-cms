/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { path } from "../../utils/constant";

const FETCH_TYPES = {
    CITIES: "FETCH_CITIES",
    DISTRICTS: "FETCH_DISTRICTS",
    WARDS: "FETCH_WARDS",
};

async function fetchLocationOptions(fetchType, locationId) {
    let url;
    switch (fetchType) {
        case FETCH_TYPES.CITIES: {
            url = path.CITIES;
            break;
        }
        case FETCH_TYPES.DISTRICTS: {
            url = `${path.DISTRICTS}/${locationId}.json`;
            break;
        }
        case FETCH_TYPES.WARDS: {
            url = `${path.WARDS}/${locationId}.json`;
            break;
        }
        default: {
            return [];
        }
    }
    const locations = (await axios.get(url)).data["data"];
    return locations.map(({ id, name }) => ({ value: id, label: name }));
}

async function fetchInitialData() {
    const { cityId, districtId, wardId } = (await axios.get(path.LOCATION)).data;
    const [cities, districts, wards] = await Promise.all([
        fetchLocationOptions(FETCH_TYPES.CITIES),
        fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityId),
        fetchLocationOptions(FETCH_TYPES.WARDS, districtId),
    ]);
    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find((c) => c.value === cityId),
        selectedDistrict: districts.find((d) => d.value === districtId),
        selectedWard: wards.find((w) => w.value === wardId),
    };
}

async function fetchDataLocationOfUser(cityId, districtId, wardId) {
    // const { cityId, districtId, wardId } = (await axios.get()).data;
    const [cities, districts, wards] = await Promise.all([
        fetchLocationOptions(FETCH_TYPES.CITIES),
        fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityId),
        fetchLocationOptions(FETCH_TYPES.WARDS, districtId),
    ]);
    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find((c) => c.value === cityId),
        selectedDistrict: districts.find((d) => d.value === districtId),
        selectedWard: wards.find((w) => w.value === wardId),
    };
}

function useLocationForm(shouldFetchInitialLocation) {
    const [state, setState] = useState({
        cityOptions: [],
        districtOptions: [],
        wardOptions: [],
        selectedCity: null,
        selectedDistrict: null,
        selectedWard: null,
    });

    const { selectedCity, selectedDistrict } = state;

    useEffect(() => {
        (async function () {
            if (shouldFetchInitialLocation) {
                const initialData = await fetchInitialData();
                setState(initialData);
            } else {
                const options = await fetchLocationOptions(FETCH_TYPES.CITIES)
                setState({ ...state, cityOptions: options })
            }
        })();
    }, []);

    useEffect(() => {
        (async function () {
            if (!selectedCity) return;
            const options = await fetchLocationOptions(FETCH_TYPES.DISTRICTS, selectedCity.value);
            setState({ ...state, districtOptions: options })
        })();
    }, [selectedCity]);

    useEffect(() => {
        (async function () {
            if (!selectedDistrict) return;
            const options = await fetchLocationOptions(FETCH_TYPES.WARDS, selectedDistrict.value);
            setState({ ...state, wardOptions: options })
        })()
    }, [selectedDistrict])

    function onCitySelect(option) {
        setState({
            ...state,
            districtOptions: [],
            wardOptions: [],
            selectedCity: option,
            selectedDistrict: null,
            selectedWard: null,
        });

        //  console.log("Check city: ", state)
    }

    function onDistrictSelect(option) {
        setState({
            ...state,
            wardOptions: [],
            selectedDistrict: option,
            selectedWard: null,
        });
    }

    function onWardSelect(option) {
        setState({ ...state, selectedWard: option });
    }

    function onSubmit(e) {
        e.preventDefault();
        // window.location.reload();
    }

    return { state, onCitySelect, onDistrictSelect, onWardSelect, onSubmit };
}

export default useLocationForm;

const testFunction = async (cityCode, districtCode, wardCode) => {
    const initialData = await fetchDataLocationOfUser(cityCode, districtCode, wardCode);
    return initialData;
}

export {
    testFunction
}
