const DummyCategory = () => {
    return (
    <div>
        <nav class="flex items-center justify-between flex-wrap bg-violet-800 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
            <img class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" src="https://logos-world.net/wp-content/uploads/2021/09/NYU-Logo.png"></img>
            <span class="font-semibold text-xl tracking-tight">Evently</span>
        </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
        <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
            Docs
        </a>
        </div>
        <div>
        <a href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Cart</a>
        </div>
    </div>
    </nav>

    <div class="flex w-screen">

        <div class="w-1/3 mx-8 pl-8" >
            <ul class="list-disc">
                <li> this will prob be column</li>
                <li> boo sanjay </li>
            </ul>

        </div>

        <div class="w-2/3 flex justify-end mr-8">
        <div class="grid grid-cols-3 gap-x-6 gap-y-6 place-items-start">
            <div class="w-fit h-md shadow-md hover:shadow-2xl border overflow-hidden bg-slate-100 rounded-lg">
                <img class= "object-cover h-48 w-full"src = "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg" alt = "nyu"></img>
                <div class='w-full h-20 px-2'>
                    <h4 class="text-lg">PMC women in Product Management</h4>
                    <p class="text-sm">Kimmel Center</p>
                    <p class="text-sm">Monday 12:30 PM - 5:00 PM</p>
                </div>
            </div>
            <div class="w-fit h-md shadow-md hover:shadow-2xl boarder overflow-hidden bg-slate-100 rounded-lg">
                <img class= "object-cover h-48 w-full"src = "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg" alt = "nyu"></img>
                <div class='w-full h-20 px-2'>
                    <h4 class="text-lg">PMC women in Product Management</h4>
                    <p class="text-sm">Kimmel Center</p>
                    <p class="text-sm">Monday 12:30 PM - 5:00 PM</p>
                </div>
            </div>
            <div class="w-fit h-md shadow-md hover:shadow-2xl boarder overflow-hidden bg-slate-100 rounded-lg">
                <img class= "object-cover h-48 w-full"src = "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg" alt = "nyu"></img>
                <div class='w-full h-20 px-2'>
                    <h4 class="text-lg">PMC women in Product Management</h4>
                    <p class="text-sm">Kimmel Center</p>
                    <p class="text-sm">Monday 12:30 PM - 5:00 PM</p>
                </div>
            </div>
            <div class="w-fit h-md shadow-md hover:shadow-2xl boarder overflow-hidden bg-slate-100 rounded-lg">
                <img class= "object-cover h-48 w-full"src = "https://meet.nyu.edu/wp-content/uploads/2023/03/22-0531_NYU_125-1-scaled.jpg" alt = "nyu"></img>
                <div class='w-full h-20 px-2'>
                    <h4 class="text-lg">PMC women in Product Management</h4>
                    <p class="text-sm">Kimmel Center</p>
                    <p class="text-sm">Monday 12:30 PM - 5:00 PM</p>
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
      )
}


export default DummyCategory;