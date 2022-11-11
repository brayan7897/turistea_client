import { useEffect, useState } from "react";
import Card from "./Card";



const ListCards = (props) => {
    
const [cards , guardarArrayCards] = useState([]);
const {payload} = props;
  
  
    useEffect(() => {
      guardarArrayCards(...cards,payload.content.payload.fields.items.listValue.values)
    }, [])
  
  
    if (cards.length === 0) {
      return
    }
    
    console.log(payload);
    console.log(cards)


return(
    <div className="h-80 flex gap-4 w-full overflow-x-auto static">
{

cards.map((card,i)=>(

<Card card = {card.structValue.fields}
key={i}
></Card>

)
)
}

</div>
);


}

export default ListCards;