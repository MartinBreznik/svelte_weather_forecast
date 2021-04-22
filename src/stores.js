  
import { writable } from 'svelte/store';

function createWeather() {
    const { subscribe, update} = writable({});

    const api_key = '79181f5439884711cf5ada2867e73c8a';
    var retArray = [];

    return {
        subscribe,
        gather: (cc, _z, _m, zip=null, city=null) => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${_z ? zip : city},${cc}&appid=79181f5439884711cf5ada2867e73c8a&units=${_m ? 'metric' : 'imperial'}`)
            .then(res => res.json())
            .then(final => update(() => { 
                console.log(final.list);
                var resArray = final.list;
                
                    const sr = new Date(final.city.sunrise);
                    const ss = new Date(final.city.sunset);
                    
                    resArray.forEach(mapDayData);

                    function mapDayData(item, index) {
                        let obj = {
                            data : true,
                            msg : final.list[0].weather[0].description,
                            weather : final.list[0].weather[0].main,
                            temperature : {
                                current : final.list[0].main.temp,
                                min : final.list[0].main.temp_min,
                                max : final.list[0].main.temp_max
                            },
                            humidity : `${final.list[0].main.humidity}%`,
                            sunrise : `${sr.getHours() + 1}:${sr.getMinutes()}:${sr.getSeconds()}`,
                            sunset : `${ss.getHours() + 1}:${ss.getMinutes()}:${ss.getSeconds()}`,
                            windspeed : `${final.list[0].wind.speed} `,
                            direction : `${final.list[0].wind.deg}\u00B0`,
                            error : false
                        };
                        retArray.push(obj);
                    }
                    console.log(retArray);
                    return retArray 
                }
            )).catch(err => {
                return {
                    error : true
                }
            });
        }
    }
}

export const zipcode = writable(false);
export const metric = writable(0);
export const weather = createWeather({
    data : false,
    msg : '',
    weather : '',
    temperature : {
        current : '',
        min : '',
        max : ''
    },
    humidity : '',
    sunrise : '',
    sunset : '',
    windspeed : '',
    direction : ''
});