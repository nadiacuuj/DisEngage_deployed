import PieChart from "../component/RatePieChart";
import ListResult from "../component/PieChartDescription";
import Navigationbar from "../component/NavigationBar";
import EventCard from "../component/EventCard";
import RatingDistribution from "../component/RatingBarChart";

const data = [
    { evaluation: "great eboard", color: '#e63946', value: 40 }, // 40% in red
    { evaluation: "great food", color: '#f1faee', value: 30 }, // 30% in light blue
    { evaluation: "great speaker", color: '#a8dadc', value: 20 }, // 20% in teal
    { evaluation: "miscallaneous", color: '#457b9d', value: 10 }, // 10% in dark blue
  ]

  const rate_data = [
    { label: "Awesome 5", value: 25},
    { label: "Great 4", value: 4 },
    { label: "Good 3", value: 1 },
    { label: "OK 2", value: 4 },
    { label: "Awful 1", value: 13 }
  ];

let event1 = {
    name: "PMC women in Product Management and a big longer?",
    venue: "Kimmel Center",
    startTime: "2024-11-13T14:30:00.000+00:00",
    descroption: "lol"
};


function OrganizationPage ({organization}) {

    return(
    <div> 
        <Navigationbar />
    <div class="mx-8 px-16 py-16">
       
        <div class="flex items-center space-x-8"/*for the header with logo, club name, and verified badge*/> 
            <img alt="PMC logo" class="rounded-full w-24" src={organization.logo}></img>
            <h2 class="text-4xl flex-wrap max-w-2xl">{organization.title}</h2>
            <img alt="Verfication" class="rounded-full w-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_fEteMd0ltnRfHA5q6lgK1fJSn8LxS7Hefg&s"></img>
        </div>
        <div class="grid grid-cols-2 gap-10 py-8">
            <div>
                <h3 class="text-lg font-semibold w-fit">Club information</h3>
                <p class='w-fit'>{organization.description}</p>
           </div>
            <div>
                <h3 class="text-lg font-semibold w-fit">Contact information</h3>
                <p>{organization.contact}</p>
            </div>
        </div>
        <h3 class="text-lg flex-wrap font-semibold max-w-2xl py-5">Upcoming events (view simillar events)</h3>
        <div className="grid grid-cols-4 gap-x-6">
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
        </div>

        <div className="inline-flex space-x-6 my-8">
            <div className="p-4 bg-white shadow-md rounded-lg w-full h-fit">
                <div className=" w-2xl p-4 ml-8">
                    <h3 className="text-lg font-semibold max-w-2xl pb-2">Club rating</h3>
                    <div className ="inline-flex items-start space-x-4 pb-8">
                        <p className="text-5xl font-bold w-fit">4.5</p>
                        <p className="text-xl text-stone-600">/ 5</p>
                    </div>
                </div>
                <div className=" grid grid-cols-2 items-center">
                    <RatingDistribution data = {rate_data}/>
                    <div class="inline-flex p-8 space-x-9 items-center ">
                        <PieChart className="w-fit" data={data}></PieChart>
                        <ListResult className="w-fit" data={data} />
                    </div>
                </div>
                
            </div>

        </div>
    </div>
    </div>

        
    )
}

export default OrganizationPage;