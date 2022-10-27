import turistea from '../assets/img/turistea.svg'

const Info = () => {
  return(
    <div className="bg-white w-2/4 px-[10%] py-[7%]">
      <span className="text-colorp text-6xl font-fontp font-black absolute top-6 left-[10%]">
        Turistea
      </span>
      <div className="flex flex-col gap-12">
        <p className="font-fontp text-5xl text-left">Potencia tu experiencia de viaje por nuestra ciudad.</p>
      {  
      //<button className="w-[40%] h-16 bg-colorp text-3xl text-colorb rounded-3xl">Empezar</button>
      }
        <img className="w-full rounded-t-2xl object-cover" src={turistea}></img>
      </div>
    </div>
  );
}

export default Info;
