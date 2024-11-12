import PieChart from "../component/RatePieChart";
import ListResult from "../component/PieChartDescription";
import Navigationbar from "../component/NavigationBar";
import EventCard from "../component/EventCard";

function OrganizationListPage () {

    const data = [
        { evaluation: "great eboard", color: '#e63946', value: 40 }, // 40% in red
        { evaluation: "great food", color: '#f1faee', value: 30 }, // 30% in light blue
        { evaluation: "great speaker", color: '#a8dadc', value: 20 }, // 20% in teal
        { evaluation: "miscallaneous", color: '#457b9d', value: 10 }, // 10% in dark blue
      ]

    let event1 = {
        ImageSrc:"https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg",
        EventTitle: "PMC women in Product Management",
        EventLocation: "Kimmel Center",
        EventTime: "Monday 12:30 PM - 5:00 PM"
    }

    return(
    <div> 
        <Navigationbar />
    <div class="mx-8 px-16 py-16">
       
        <div class="flex items-center space-x-8"/*for the header with logo, club name, and verified badge*/> 
            <img class="rounded-full w-24" src="https://se-images.campuslabs.com/clink/images/4b100d87-58fd-4a2f-8a60-c334a1bf372aa31e4163-a160-4bfb-97a0-96d04cdb5126.jpg?preset=med-sq"></img>
            <h2 class="text-4xl flex-wrap max-w-2xl"> Product Management Club </h2>
            <img class="rounded-full w-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_fEteMd0ltnRfHA5q6lgK1fJSn8LxS7Hefg&s"></img>
        </div>
        <p>4.5/5 rating (20 reviews)</p>
        <div class="grid grid-cols-2 gap-10 py-8">
            <div>
                <h3 class="text-lg font-semibold w-fit">Club information</h3>
                <p class='w-fit'>The Product Management Club will build a community at NYU by connecting students interested in design, business, and engineering with resources, mentorship, and workshops so they can tackle diverse problems faced by businesses and consumers. Our club encourages curiosity and teamwork as we inspire students to build exciting products and explore PM in various industries.</p>
           </div>
            <div>
                <h3 class="text-lg font-semibold w-fit">Contact information</h3>
                <p>pmc@nyu.edu</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-10 py-8">
            <PieChart className="w-fit" data={data}></PieChart>
            <ListResult className="w-fit" data={data} />
        </div>

        <h3 class="text-lg flex-wrap font-semibold max-w-2xl py-5">Upcoming events (view simillar events)</h3>
        <div className="grid grid-cols-4">
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
            <EventCard event = {event1}/>
        </div>
        


    </div>
    </div>

        
    )
}

export default OrganizationListPage;