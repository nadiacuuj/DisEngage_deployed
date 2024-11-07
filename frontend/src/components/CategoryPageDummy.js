import CategorySelect from "../component/CategorySelect";
import EventCard from "../component/EventCard";
import Navigationbar from "../component/NavigationBar";

let event1 = {
    ImageSrc:"https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg",
    EventTitle: "PMC women in Product Management",
    EventLocation: "Kimmel Center",
    EventTime: "Monday 12:30 PM - 5:00 PM"
}

let event_rows = []
for (let i =0; i<9; i++ ){
    event_rows.push(<EventCard event = {event1}/>)
}

const DummyCategory = () => {
    return (
    <div>
        <Navigationbar />
    <div class="flex w-screen mt-5">
        <div class="w-1/3 mx-8 pl-8" >
            <CategorySelect/>
        </div>

        <div class="w-2/3 mr-8">
            <div class="grid grid-cols-3 gap-x-6 gap-y-6 place-items-start">
                {event_rows}
            </div>
        </div>
    </div>
    
    </div>
      )
}


export default DummyCategory;