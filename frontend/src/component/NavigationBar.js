//https://v1.tailwindcss.com/components/navigation#
import {Link} from "react-router-dom";

function Navigationbar(){

    return(
        <nav class="flex items-center justify-between flex-wrap bg-violet-800 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
        <Link to="/landing">
        <img class="fill-current h-12 w-fill mr-2 bg-white"  src="/logo.png"></img>
        <span class="font-semibold text-xl tracking-tight">DisEngage</span>
        </Link>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
        <a href="/OrganizationList" class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
            Organization List
        </a>
        <a href="/categories" class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
            Event page
        </a>
        </div>
        <div>
        <a href="/schedule-review" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-violet-800 hover:bg-white mt-4 lg:mt-0">Cart</a>
        </div>
    </div>
    </nav>
    )
}

export default Navigationbar;



