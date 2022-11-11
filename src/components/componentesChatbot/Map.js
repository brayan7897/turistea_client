import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import  Icon from '../../assets/img/icon.svg';

//import icon from 'leaflet/dist/images/marker-icon.png'
//import iconShadow from 'leaflet/dist/images/marker-icon.png'
import L from "leaflet";

let iconUbicacion = new  L.icon({
    
        iconUrl:Icon,
        
        iconAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: [35, 35],
        className: "leaflet-venue-icon",
      
})

const MapV = (props)=>{

  const {payload} = props;

    

    

    const valores = payload.content.payload.fields.items.listValue.values[0].structValue.fields;
    const lugar = [valores.title.stringValue, valores.text.stringValue];

console.log(valores);

    return(<div className='leaflet-container overflow-auto block border-solid border-2 border-colorm shadow-md '>
        
        <MapContainer center={lugar} zoom={12} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={lugar} icon={iconUbicacion}>
    <Popup>
      Destino: <br /> {valores.buttonText.stringValue}.
    </Popup>
  </Marker>
</MapContainer>
    </div>)
}

export default MapV;